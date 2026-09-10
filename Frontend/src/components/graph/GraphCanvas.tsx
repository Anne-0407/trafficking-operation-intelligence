import React, { useState, useRef, useEffect, useMemo } from 'react';
import { GraphData, GraphNode, GraphEdge, NodeType } from '../../types';
import { NodeDetailsDrawer } from './NodeDetailsDrawer';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  SlidersHorizontal,
  Layers,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface GraphCanvasProps {
  graphData: GraphData;
  onSelectNode?: (node: GraphNode) => void;
  onSelectEdge?: (edge: GraphEdge) => void;
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graphData,
  onSelectNode,
  onSelectEdge,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // State for Nodes & Positions
  const [nodes, setNodes] = useState<GraphNode[]>(graphData.nodes);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Filters
  const [minConfidence, setMinConfidence] = useState<number>(0.75);
  const [activeTypes, setActiveTypes] = useState<Record<NodeType, boolean>>({
    operation: true,
    advertisement: true,
    phone: true,
    username: true,
    email: true,
    account: true,
    image: true,
    location: true,
    time: true,
  });

  // Pan & Zoom
  const [transform, setTransform] = useState({ x: 50, y: 30, scale: 0.95 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Dragging single node
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize when graphData changes
  useEffect(() => {
    setNodes(graphData.nodes);
  }, [graphData]);

  // Filtered nodes and edges
  const visibleNodes = useMemo(() => {
    return nodes.filter((n) => activeTypes[n.type]);
  }, [nodes, activeTypes]);

  const visibleNodeIds = useMemo(() => {
    return new Set(visibleNodes.map((n) => n.id));
  }, [visibleNodes]);

  const visibleEdges = useMemo(() => {
    return graphData.edges.filter(
      (e) =>
        e.confidenceScore >= minConfidence &&
        visibleNodeIds.has(e.source) &&
        visibleNodeIds.has(e.target)
    );
  }, [graphData.edges, minConfidence, visibleNodeIds]);

  // Connected nodes map for highlighting
  const connectedNodeIds = useMemo(() => {
    const targetId = selectedNode?.id || hoveredNode;
    if (!targetId) return new Set<string>();

    const set = new Set<string>([targetId]);
    visibleEdges.forEach((e) => {
      if (e.source === targetId) set.add(e.target);
      if (e.target === targetId) set.add(e.source);
    });
    return set;
  }, [selectedNode, hoveredNode, visibleEdges]);

  // Type Color Map
  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'operation': return { fill: '#F43F5E', stroke: '#FDA4AF', text: '#FFE4E6' };
      case 'advertisement': return { fill: '#0EA5E9', stroke: '#7DD3FC', text: '#E0F2FE' };
      case 'phone': return { fill: '#10B981', stroke: '#6EE7B7', text: '#D1FAE5' };
      case 'username': return { fill: '#8B5CF6', stroke: '#C4B5FD', text: '#EDE9FE' };
      case 'email': return { fill: '#F97316', stroke: '#FDBA74', text: '#FFEDD5' };
      case 'account': return { fill: '#06B6D4', stroke: '#67E8F9', text: '#CFFAFE' };
      case 'image': return { fill: '#EC4899', stroke: '#F472B6', text: '#FCE7F3' };
      case 'location': return { fill: '#F59E0B', stroke: '#FCD34D', text: '#FEF3C7' };
      case 'time': return { fill: '#64748B', stroke: '#94A3B8', text: '#F1F5F9' };
      default: return { fill: '#64748B', stroke: '#CBD5E1', text: '#F8FAFC' };
    }
  };

  // Node Drag Handler
  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
  };

  // Canvas Mouse Handlers
  const handleMouseDownCanvas = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = (e.clientX - rect.left - transform.x) / transform.scale;
      const mouseY = (e.clientY - rect.top - transform.y) / transform.scale;

      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggedNodeId ? { ...n, x: mouseX, y: mouseY } : n
        )
      );
    } else if (isPanning) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedNodeId(null);
  };

  const handleZoom = (delta: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.4, Math.min(2.0, prev.scale + delta)),
    }));
  };

  const handleReset = () => {
    setTransform({ x: 50, y: 30, scale: 0.95 });
  };

  const toggleType = (type: NodeType) => {
    setActiveTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Helper to find node by id
  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  return (
    <div className="relative w-full h-[680px] bg-slate-100 dark:bg-[#0A0F1D] border border-slate-300 dark:border-slate-800 rounded-xl overflow-hidden flex select-none shadow-2xl transition-colors">
      {/* Graph Area */}
      <div
        ref={containerRef}
        className="flex-1 h-full relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDownCanvas}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Background Tactical Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30"
          style={{
            backgroundImage: isDark
              ? `radial-gradient(rgba(14, 165, 233, 0.25) 1px, transparent 1px)`
              : `radial-gradient(rgba(15, 23, 42, 0.15) 1px, transparent 1px)`,
            backgroundSize: `${28 * transform.scale}px ${28 * transform.scale}px`,
            backgroundPosition: `${transform.x}px ${transform.y}px`,
          }}
        />

        {/* Top Floating Controls: Filters & Threshold */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-2.5 rounded-lg border border-slate-300 dark:border-slate-800 shadow-xl max-w-2xl">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 mr-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Entities:</span>
          </div>

          {(Object.keys(activeTypes) as NodeType[]).map((type) => {
            const colors = getNodeColor(type);
            const isActive = activeTypes[type];
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-2 py-1 rounded text-[11px] font-mono flex items-center gap-1.5 transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 shadow-sm font-semibold'
                    : 'bg-slate-50 dark:bg-slate-950/60 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-900 opacity-60'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.fill }}
                />
                <span className="capitalize">{type}</span>
                {isActive ? (
                  <Eye className="w-2.5 h-2.5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <EyeOff className="w-2.5 h-2.5 text-slate-400 dark:text-slate-600" />
                )}
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-800 mx-1" />

          {/* Threshold Slider */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="text-[11px] font-medium">Edge Cutoff:</span>
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.05"
              value={minConfidence}
              onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
              className="w-20 accent-sky-500 cursor-pointer h-1.5 bg-slate-300 dark:bg-slate-800 rounded-lg"
            />
            <span className="text-sky-600 dark:text-sky-400 font-bold text-[11px]">
              {(minConfidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Bottom Left Zoom/Pan Controls */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-300 dark:border-slate-800 shadow-xl">
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="px-2 text-[10px] font-mono text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-800">
            Scale: {Math.round(transform.scale * 100)}%
          </div>
        </div>

        {/* SVG Graph Canvas */}
        <svg
          className="w-full h-full"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
          }}
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="16"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={isDark ? '#475569' : '#94A3B8'} />
            </marker>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Edges */}
          <g className="edges">
            {visibleEdges.map((edge) => {
              const src = nodeMap.get(edge.source);
              const tgt = nodeMap.get(edge.target);
              if (!src || !tgt || src.x === undefined || src.y === undefined || tgt.x === undefined || tgt.y === undefined) {
                return null;
              }

              const isEdgeHighlighted =
                (selectedNode && (edge.source === selectedNode.id || edge.target === selectedNode.id)) ||
                (hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode));

              const isSelected = selectedEdge?.id === edge.id;

              return (
                <g key={edge.id} className="cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEdge(edge);
                  setSelectedNode(null);
                  onSelectEdge?.(edge);
                }}>
                  {/* Invisible wide stroke for easier clicking */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke="transparent"
                    strokeWidth={16}
                  />

                  {/* Main visible line */}
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={
                      isSelected
                        ? (isDark ? '#38BDF8' : '#0284C7')
                        : isEdgeHighlighted
                        ? (isDark ? '#38BDF8' : '#0284C7')
                        : edge.confidenceScore >= 0.90
                        ? (isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(2, 132, 199, 0.6)')
                        : (isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(148, 163, 184, 0.55)')
                    }
                    strokeWidth={
                      isSelected
                        ? 3.5
                        : isEdgeHighlighted
                        ? 2.5
                        : Math.max(1.2, edge.confidenceScore * 2.2)
                    }
                    strokeDasharray={
                      edge.relationshipType === 'BEHAVIORAL_MATCH' ? '4 3' : undefined
                    }
                    markerEnd="url(#arrow)"
                    className="transition-all duration-200"
                  />

                  {/* Edge Confidence Badge */}
                  {isEdgeHighlighted && (
                    <g
                      transform={`translate(${(src.x + tgt.x) / 2}, ${(src.y + tgt.y) / 2})`}
                    >
                      <rect
                        x="-18"
                        y="-10"
                        width="36"
                        height="18"
                        rx="4"
                        fill={isDark ? '#0F172A' : '#FFFFFF'}
                        stroke={isDark ? '#38BDF8' : '#0284C7'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill={isDark ? '#38BDF8' : '#0284C7'}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {Math.round(edge.confidenceScore * 100)}%
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Render Nodes */}
          <g className="nodes">
            {visibleNodes.map((node) => {
              if (node.x === undefined || node.y === undefined) return null;

              const colors = getNodeColor(node.type);
              const isSelected = selectedNode?.id === node.id;
              const isConnected = connectedNodeIds.has(node.id);
              const isFaded = (selectedNode || hoveredNode) && !isConnected;

              const nodeRadius =
                node.type === 'operation'
                  ? 32
                  : node.type === 'advertisement'
                  ? 14
                  : 18;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`cursor-pointer transition-opacity duration-200 ${
                    isFaded ? 'opacity-25' : 'opacity-100'
                  }`}
                  onMouseDown={(e) => handleMouseDownNode(e, node.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                    setSelectedEdge(null);
                    onSelectNode?.(node);
                  }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  {/* Outer Glow on Selection */}
                  {isSelected && (
                    <circle
                      r={nodeRadius + 8}
                      fill="none"
                      stroke={isDark ? '#38BDF8' : '#0284C7'}
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-spin"
                      style={{ animationDuration: '10s' }}
                    />
                  )}

                  {/* Base Circle */}
                  <circle
                    r={nodeRadius}
                    fill={colors.fill}
                    stroke={isSelected ? '#FFFFFF' : colors.stroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                    filter={isSelected ? 'url(#glow)' : undefined}
                    className="transition-transform duration-150 hover:scale-110"
                  />

                  {/* Inner Indicator / Type Letter */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#FFFFFF"
                    fontSize={node.type === 'operation' ? 14 : 11}
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="pointer-events-none select-none"
                  >
                    {node.type === 'operation'
                      ? 'OP'
                      : node.type === 'phone'
                      ? 'PH'
                      : node.type === 'username'
                      ? 'TG'
                      : node.type === 'image'
                      ? 'IMG'
                      : node.type === 'location'
                      ? 'LOC'
                      : node.type === 'account'
                      ? 'ESC'
                      : 'AD'}
                  </text>

                  {/* Node Label Below */}
                  <g transform={`translate(0, ${nodeRadius + 14})`}>
                    <rect
                      x={-node.label.length * 3.4}
                      y="-9"
                      width={node.label.length * 6.8}
                      height="16"
                      rx="3"
                      fill={isDark ? '#0B1120' : '#FFFFFF'}
                      stroke={isSelected ? (isDark ? '#38BDF8' : '#0284C7') : (isDark ? '#1E293B' : '#CBD5E1')}
                      strokeWidth="1"
                      className="opacity-95 shadow-sm"
                    />
                    <text
                      textAnchor="middle"
                      dy="2"
                      fill={isSelected ? (isDark ? '#38BDF8' : '#0284C7') : (isDark ? '#E2E8F0' : '#0F172A')}
                      fontSize="9.5"
                      fontFamily="monospace"
                      fontWeight={isSelected ? 'bold' : '600'}
                      className="pointer-events-none select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Side Inspector Drawer */}
      {(selectedNode || selectedEdge) && (
        <NodeDetailsDrawer
          node={selectedNode}
          edge={selectedEdge}
          onClose={() => {
            setSelectedNode(null);
            setSelectedEdge(null);
          }}
        />
      )}
    </div>
  );
};
