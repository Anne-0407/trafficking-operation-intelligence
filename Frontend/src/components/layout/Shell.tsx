import React from 'react';
import { ClassificationBanner } from './ClassificationBanner';
import { Header } from './Header';
import { Sidebar, ActivePage } from './Sidebar';
import { Operation } from '../../types';

export interface ShellProps {
  children: React.ReactNode;
  operations: Operation[];
  selectedOperation: Operation;
  onSelectOperation: (op: Operation) => void;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  pendingReviewCount: number;
}

export const Shell: React.FC<ShellProps> = ({
  children,
  operations,
  selectedOperation,
  onSelectOperation,
  activePage,
  onNavigate,
  searchQuery,
  onSearchChange,
  pendingReviewCount,
}) => {
  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 dark:bg-[#080C14] text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors">
      {/* Top Banner */}
      <ClassificationBanner />

      {/* Main Header */}
      <Header
        operations={operations}
        selectedOperation={selectedOperation}
        onSelectOperation={onSelectOperation}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        pendingReviewCount={pendingReviewCount}
      />

      {/* Body: Sidebar + Main Dynamic Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          currentOperation={selectedOperation}
        />

        <main className="flex-1 overflow-y-auto bg-slate-100/60 dark:bg-[#080C14] p-6 transition-colors">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
