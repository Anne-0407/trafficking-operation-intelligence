import React, { useState, useEffect } from 'react';
import { 
  MOCK_OPERATIONS, 
  MOCK_GRAPH_DATA, 
  MOCK_TIMELINE_PHASES, 
  MOCK_TIMELINE_EVENTS, 
  MOCK_RELATIONSHIP_EVIDENCE_ITEMS,
  MOCK_DRIFT_SIMULATION_STEPS,
  MOCK_METRIC_COMPARISONS,
  MOCK_BENCHMARK_DATASETS
} from './data';
import { Operation, RelationshipEvidenceItem } from './types';
import { Shell } from './components/layout/Shell';
import { ActivePage } from './components/layout/Sidebar';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import { CommandCenterPage } from './pages/CommandCenterPage';
import { OperationOverviewPage } from './pages/OperationOverviewPage';
import { OperationGraphPage } from './pages/OperationGraphPage';
import { TimelinePage } from './pages/TimelinePage';
import { RelationshipEvidencePage } from './pages/RelationshipEvidencePage';
import { ChangeAwareTestPage } from './pages/ChangeAwareTestPage';
import { EvaluationPage } from './pages/EvaluationPage';

const VALID_PAGES: ActivePage[] = [
  'command-center',
  'overview',
  'graph',
  'timeline',
  'evidence',
  'change-aware',
  'evaluation'
];

const getInitialPage = (): ActivePage => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace(/^#\/?/, '') as ActivePage;
    if (VALID_PAGES.includes(hash)) return hash;
    const saved = localStorage.getItem('toi_active_page') as ActivePage;
    if (VALID_PAGES.includes(saved)) return saved;
  }
  return 'command-center';
};

export const App: React.FC = () => {
  const [operations, setOperations] = useState<Operation[]>(MOCK_OPERATIONS);
  const [selectedOperation, setSelectedOperation] = useState<Operation>(() => {
    if (typeof window !== 'undefined') {
      const savedOpId = localStorage.getItem('toi_selected_op_id');
      if (savedOpId) {
        const found = MOCK_OPERATIONS.find(op => op.id === savedOpId);
        if (found) return found;
      }
    }
    return MOCK_OPERATIONS[0]; // OP-031
  });
  const [activePage, setActivePage] = useState<ActivePage>(getInitialPage);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [evidenceItems, setEvidenceItems] = useState<RelationshipEvidenceItem[]>(MOCK_RELATIONSHIP_EVIDENCE_ITEMS);

  // Sync route with window hash and localStorage
  const handleNavigate = (page: ActivePage) => {
    setActivePage(page);
    if (typeof window !== 'undefined') {
      window.location.hash = `#/${page}`;
      localStorage.setItem('toi_active_page', page);
    }
  };

  const handleSelectOperation = (op: Operation) => {
    setSelectedOperation(op);
    if (typeof window !== 'undefined') {
      localStorage.setItem('toi_selected_op_id', op.id);
    }
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '') as ActivePage;
      if (VALID_PAGES.includes(hash)) {
        setActivePage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Ensure initial hash matches active page
    if (!window.location.hash) {
      window.location.hash = `#/${activePage}`;
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activePage]);

  // Handle Human Investigator review status update
  const handleUpdateEvidenceStatus = (
    itemId: string,
    newStatus: 'ACCEPTED' | 'REJECTED' | 'ESCALATED',
    notes: string
  ) => {
    const newLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      investigatorId: 'INV-77042 (Analyst)',
      action: newStatus,
      notes: notes,
    };

    setEvidenceItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              reviewStatus: newStatus,
              auditTrail: [newLogEntry, ...item.auditTrail],
              lastUpdated: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const pendingReviewCount = evidenceItems.filter((i) => i.reviewStatus === 'PENDING').length;

  return (
    <ThemeProvider>
      <Shell
        operations={operations}
        selectedOperation={selectedOperation}
        onSelectOperation={handleSelectOperation}
        activePage={activePage}
        onNavigate={handleNavigate}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        pendingReviewCount={pendingReviewCount}
      >
        {activePage === 'command-center' && (
          <CommandCenterPage
            operations={operations}
            onSelectOperation={handleSelectOperation}
            onNavigateToOverview={() => handleNavigate('overview')}
            onNavigateToGraph={() => handleNavigate('graph')}
            searchQuery={searchQuery}
          />
        )}

        {activePage === 'overview' && (
          <OperationOverviewPage
            operation={selectedOperation}
            onNavigateToGraph={() => handleNavigate('graph')}
            onNavigateToTimeline={() => handleNavigate('timeline')}
            onNavigateToEvidence={() => handleNavigate('evidence')}
            onNavigateToChangeAware={() => handleNavigate('change-aware')}
            searchQuery={searchQuery}
          />
        )}

        {activePage === 'graph' && (
          <OperationGraphPage
            operation={selectedOperation}
            graphData={MOCK_GRAPH_DATA}
          />
        )}

        {activePage === 'timeline' && (
          <TimelinePage
            operation={selectedOperation}
            phases={MOCK_TIMELINE_PHASES}
            events={MOCK_TIMELINE_EVENTS}
          />
        )}

        {activePage === 'evidence' && (
          <RelationshipEvidencePage
            operation={selectedOperation}
            evidenceItems={evidenceItems}
            onUpdateEvidenceStatus={handleUpdateEvidenceStatus}
          />
        )}

        {activePage === 'change-aware' && (
          <ChangeAwareTestPage
            steps={MOCK_DRIFT_SIMULATION_STEPS}
            comparisons={MOCK_METRIC_COMPARISONS}
          />
        )}

        {activePage === 'evaluation' && (
          <EvaluationPage
            benchmarks={MOCK_BENCHMARK_DATASETS}
            comparisons={MOCK_METRIC_COMPARISONS}
          />
        )}
      </Shell>
    </ThemeProvider>
  );
};

export default App;
