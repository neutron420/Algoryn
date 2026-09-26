"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  DSA_TREE_DATA,
  DsaNode,
  searchDsaNodes,
  countTotalNodes,
} from "@/lib/dsa-tree-data";
import {
  computeBalancedTreeLayout,
  LayoutNode,
  LayoutEdge,
  NODE_DIMS,
} from "@/lib/dsa-tree-layout";
import {
  Search,
  Plus,
  Minus,
  Maximize2,
  ChevronDown,
  Network,
  Code2,
  Binary,
  Braces,
  Boxes,
  Hash,
  ArrowLeftRight,
  ArrowDownUp,
  Link2,
  Layers,
  ChevronsUp,
  GitFork,
  Scale,
  Share2,
  Route,
  RotateCw,
  Undo2,
  Zap,
  Table2,
  Calculator,
  Shapes,
  Gamepad2,
  Dices,
  Terminal,
  FolderTree,
  X,
  Compass,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Authentic CS & DSA Node Icons (replacing AI sparkle with genuine engineering icons)
function NodeIcon({ node, className }: { node: DsaNode; className?: string }) {
  if (node.type === "root") {
    return <Network className={cn("size-4 shrink-0 text-white", className)} />;
  }

  // Topic specific icons
  switch (node.id) {
    case "foundations":
      return <Terminal className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "arrays":
      return <Boxes className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "hashing":
      return <Hash className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "two-pointers":
      return <ArrowLeftRight className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "sliding-window":
      return <Maximize2 className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "sorting":
      return <ArrowDownUp className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "binary-search":
      return <Binary className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "linked-list":
      return <Link2 className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "stack":
    case "queue-deque":
      return <Layers className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "heap-priority-queue":
      return <ChevronsUp className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "trees":
    case "binary-search-tree":
    case "advanced-trees":
      return <GitFork className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "balanced-trees":
      return <Scale className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "trie":
      return <Code2 className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "graphs":
    case "advanced-graphs":
      return <Share2 className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "shortest-path":
    case "minimum-spanning-tree":
      return <Route className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "recursion":
      return <RotateCw className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "backtracking":
      return <Undo2 className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "divide-and-conquer":
      return <GitFork className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "greedy":
      return <Zap className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "dynamic-programming":
      return <Table2 className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "bit-manipulation":
    case "bitmasking":
      return <Binary className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "mathematics":
    case "number-theory":
    case "combinatorics":
    case "probability":
      return <Calculator className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "geometry":
      return <Shapes className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "game-theory":
      return <Gamepad2 className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "randomized-algorithms":
      return <Dices className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
    case "range-queries":
    case "advanced-dsa":
      return <Terminal className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
  }

  // Fallbacks by node depth/type
  if (node.type === "topic") {
    return <GitFork className={cn("size-3.5 shrink-0 text-indigo-500 dark:text-indigo-400", className)} />;
  }
  if (node.type === "subtopic") {
    return <FolderTree className={cn("size-3 shrink-0 text-slate-500 dark:text-slate-400", className)} />;
  }
  if (node.type === "pattern") {
    return <Braces className={cn("size-3 shrink-0 text-muted-foreground/80", className)} />;
  }
  return <Code2 className={cn("size-3 shrink-0 text-muted-foreground/70", className)} />;
}

// Initial set of expanded nodes: Minimal (root only) as requested
const INITIAL_EXPANDED = new Set<string>();

export function DsaTreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Canvas Viewport Transform State
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Expansion & Selection State
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(INITIAL_EXPANDED);
  const [selectedNode, setSelectedNode] = useState<DsaNode | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [pendingFocusNodeId, setPendingFocusNodeId] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);

  const totalTaxonomyNodes = useMemo(() => countTotalNodes(DSA_TREE_DATA), []);

  // Search Results
  const searchResults = useMemo(() => {
    return searchDsaNodes(searchQuery, DSA_TREE_DATA).slice(0, 8);
  }, [searchQuery]);

  // =========================================================================
  // TREE LAYOUT COMPUTATION (Balanced Multi-Row Layout)
  // =========================================================================
  const { layoutNodes, layoutEdges, boundingBox } = useMemo(() => {
    return computeBalancedTreeLayout(DSA_TREE_DATA, expandedNodes);
  }, [expandedNodes]);

  // =========================================================================
  // FIT VIEW ENGINE (Dynamic Responsive Viewport Sizing)
  // =========================================================================
  const fitView = useCallback(() => {
    if (!containerRef.current || layoutNodes.length === 0) return;
    const container = containerRef.current.getBoundingClientRect();
    const isMobile = container.width < 640;

    const treeWidth = Math.max(boundingBox.width, 240);
    const treeHeight = Math.max(boundingBox.height, 80);
    const paddingX = isMobile ? 16 : 72;
    const paddingY = isMobile ? 75 : 110; // Clearance for top search bar
    const availableWidth = Math.max(container.width - paddingX * 2, 200);
    const availableHeight = Math.max(container.height - paddingY * 2, 180);

    const scaleX = availableWidth / treeWidth;
    const scaleY = availableHeight / treeHeight;
    const baseScale = Math.min(scaleX, scaleY);

    // On mobile, scale proportionally so nodes never look overly big or bloated
    const targetZoom = isMobile
      ? Math.min(Math.max(baseScale, 0.48), 0.76)
      : Math.min(Math.max(baseScale, 0.38), 1.15);

    const treeCenterX = (boundingBox.minX + boundingBox.maxX) / 2;
    const targetPanX = container.width / 2 - treeCenterX * targetZoom;
    const targetPanY = Math.max((container.height - treeHeight * targetZoom) / 2, isMobile ? 65 : 90);

    setZoom(targetZoom);
    setPan({ x: targetPanX, y: targetPanY });
  }, [boundingBox, layoutNodes.length]);

  const initialMountedRef = useRef(false);

  // Trigger fitView ONCE on initial mount only (never automatically shrink/zoom-out when expanding nodes)
  useEffect(() => {
    if (!initialMountedRef.current && layoutNodes.length > 0) {
      initialMountedRef.current = true;
      fitView();
    }
  }, [fitView, layoutNodes.length]);

  // Search auto-focus on newly computed layout
  useEffect(() => {
    if (!pendingFocusNodeId || !containerRef.current) return;
    const target = layoutNodes.find((n) => n.node.id === pendingFocusNodeId);
    if (target) {
      const rect = containerRef.current.getBoundingClientRect();
      const focusZoom = Math.max(zoom, 0.95);
      setZoom(focusZoom);
      setPan({
        x: rect.width / 2 - target.x * focusZoom,
        y: rect.height / 2 - target.y * focusZoom,
      });
      setPendingFocusNodeId(null);
    }
  }, [layoutNodes, pendingFocusNodeId, zoom]);


  const rafPanRef = useRef<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const targetX = e.clientX - dragStart.x;
    const targetY = e.clientY - dragStart.y;

    if (rafPanRef.current) cancelAnimationFrame(rafPanRef.current);
    rafPanRef.current = requestAnimationFrame(() => {
      setPan({ x: targetX, y: targetY });
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (rafPanRef.current) {
      cancelAnimationFrame(rafPanRef.current);
      rafPanRef.current = null;
    }
  };

  // Mobile Touch Gestures (Pan & Pinch-to-Zoom)
  const touchState = useRef<{
    startX: number;
    startY: number;
    initialPan: { x: number; y: number };
    initialDistance: number | null;
    initialZoom: number;
  }>({
    startX: 0,
    startY: 0,
    initialPan: { x: 0, y: 0 },
    initialDistance: null,
    initialZoom: 1,
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        initialPan: { ...pan },
        initialDistance: null,
        initialZoom: zoom,
      };
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const distance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      touchState.current = {
        startX: midX,
        startY: midY,
        initialPan: { ...pan },
        initialDistance: distance,
        initialZoom: zoom,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchState.current.initialDistance === null) {
      const touch = e.touches[0];
      const dx = touch.clientX - touchState.current.startX;
      const dy = touch.clientY - touchState.current.startY;
      const nextX = touchState.current.initialPan.x + dx;
      const nextY = touchState.current.initialPan.y + dy;

      if (rafPanRef.current) cancelAnimationFrame(rafPanRef.current);
      rafPanRef.current = requestAnimationFrame(() => {
        setPan({ x: nextX, y: nextY });
      });
    } else if (e.touches.length === 2 && touchState.current.initialDistance !== null && containerRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scale = currentDist / touchState.current.initialDistance;
      const newZoom = Math.min(Math.max(touchState.current.initialZoom * scale, 0.25), 2.2);

      const rect = containerRef.current.getBoundingClientRect();
      const midX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const midY = (t1.clientY + t2.clientY) / 2 - rect.top;

      const newPanX = midX - (midX - touchState.current.initialPan.x) * (newZoom / touchState.current.initialZoom);
      const newPanY = midY - (midY - touchState.current.initialPan.y) * (newZoom / touchState.current.initialZoom);

      if (rafPanRef.current) cancelAnimationFrame(rafPanRef.current);
      rafPanRef.current = requestAnimationFrame(() => {
        setZoom(newZoom);
        setPan({ x: newPanX, y: newPanY });
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchState.current.initialDistance = null;
    if (rafPanRef.current) {
      cancelAnimationFrame(rafPanRef.current);
      rafPanRef.current = null;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.25), 2.2);

    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const zoomIn = () => setZoom((z) => Math.min(z * 1.2, 2.2));
  const zoomOut = () => setZoom((z) => Math.max(z * 0.8, 0.25));

  // =========================================================================
  // NODE EXPAND / COLLAPSE
  // =========================================================================
  const toggleNodeExpansion = (nodeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set<string>();
    function traverse(n: DsaNode) {
      if (n.children && n.children.length > 0) {
        all.add(n.id);
        n.children.forEach(traverse);
      }
    }
    traverse(DSA_TREE_DATA);
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
    setTimeout(fitView, 50);
  };

  // Jump to & focus searched node
  const handleSelectSearchResult = (node: DsaNode, ancestors: string[]) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      ancestors.forEach((id) => next.add(id));
      next.add(node.id);
      return next;
    });

    setSelectedNode(node);
    setHighlightedNodeId(node.id);
    setPendingFocusNodeId(node.id);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100dvh-3.5rem)] sm:min-h-0 overflow-hidden bg-[#FAFAFC] dark:bg-[#090D16] select-none">
      {/* ─── 0. PURE CSS HARDWARE-ACCELERATED DOT GRID ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 text-slate-400 dark:text-slate-600"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1.2px, transparent 1.2px)",
          backgroundSize: "28px 28px",
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* ─── 1. TOP FLOATING CONTROL BAR (RESPONSIVE SEARCH + STATS) ─── */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-3 pointer-events-none">
        {/* Search Bar */}
        <div className="relative pointer-events-auto w-full sm:max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search concepts (e.g. Kadane, DP, DFS)..."
              className="w-full pl-8 pr-7 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-foreground placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border/80 bg-background/95 backdrop-blur-md shadow-xl overflow-hidden z-30 max-h-80 overflow-y-auto">
              <div className="p-1.5 space-y-0.5">
                {searchResults.map((res: { node: DsaNode; path: string[]; ancestors: string[] }) => (
                  <button
                    key={res.node.id}
                    type="button"
                    onClick={() => handleSelectSearchResult(res.node, res.ancestors)}
                    className="w-full flex flex-col items-start px-3 py-2 rounded-lg text-left text-xs hover:bg-muted/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <NodeIcon node={res.node} className="text-muted-foreground group-hover:text-primary shrink-0" />
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {res.node.name}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0 ml-auto">
                        {res.node.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground/80 truncate w-full mt-0.5 pl-5">
                      {res.path.join(" → ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions & Counter */}
        <div className="pointer-events-auto flex items-center justify-between sm:justify-start gap-1.5 sm:gap-2 bg-background/90 backdrop-blur-md border border-border/80 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-md text-xs self-start sm:self-auto">
          <div className="flex items-center gap-1.5 font-semibold text-foreground mr-0.5 sm:mr-1">
            <Compass className="size-3.5 text-indigo-500" />
            <span className="hidden sm:inline">DSA Roadmap</span>
          </div>

          <span className="h-3.5 w-px bg-border/60 mx-0.5 sm:mx-1" />

          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">{layoutNodes.length}</span>
            <span className="hidden sm:inline">visible</span>
            <span className="text-muted-foreground/40">/</span>
            <span className="font-mono text-muted-foreground/80">{totalTaxonomyNodes}</span>
          </div>

          <span className="h-3.5 w-px bg-border/60 mx-0.5 sm:mx-1" />

          <button
            type="button"
            onClick={expandAll}
            className="text-[10px] sm:text-[11px] font-medium text-muted-foreground hover:text-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md hover:bg-muted/60 transition-colors cursor-pointer"
            title="Expand All Nodes"
          >
            Expand
          </button>

          <button
            type="button"
            onClick={collapseAll}
            className="text-[10px] sm:text-[11px] font-medium text-muted-foreground hover:text-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md hover:bg-muted/60 transition-colors cursor-pointer"
            title="Collapse to Root"
          >
            Collapse
          </button>

          <button
            type="button"
            onClick={fitView}
            className="text-[10px] sm:text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1"
            title="Center and fit tree to screen"
          >
            <Maximize2 className="size-3" />
            <span>Fit</span>
          </button>
        </div>
      </div>

      {/* ─── 2. MAIN INTERACTIVE SVG & HTML CANVAS ─── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onWheel={handleWheel}
        className={cn(
          "w-full h-full cursor-grab active:cursor-grabbing touch-none",
          isDragging && "cursor-grabbing"
        )}
      >
        <div
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: "0 0",
            willChange: isDragging ? "transform" : "auto",
          }}
          className="relative size-full pointer-events-none"
        >
          {/* SVG Edges Layer (Curved Cubic Bezier Connectors) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          >
            {layoutEdges.map((edge) => {
              if (edge.isTrunk) {
                // Vertical trunk spine
                return (
                  <line
                    key={edge.id}
                    x1={edge.sourceX}
                    y1={edge.sourceY}
                    x2={edge.targetX}
                    y2={edge.targetY}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="text-slate-300 dark:text-slate-700 opacity-60"
                  />
                );
              }

              // Smooth vertical cubic bezier curve
              const midY = (edge.sourceY + edge.targetY) / 2;
              const pathData = `M ${edge.sourceX} ${edge.sourceY} C ${edge.sourceX} ${midY}, ${edge.targetX} ${midY}, ${edge.targetX} ${edge.targetY}`;

              return (
                <path
                  key={edge.id}
                  d={pathData}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-300 dark:text-slate-700 transition-colors duration-150"
                />
              );
            })}
          </svg>

          {/* HTML Nodes Layer */}
          {layoutNodes.map((item) => {
            const isRoot = item.node.type === "root";
            const isTopic = item.node.type === "topic";
            const isSubtopic = item.node.type === "subtopic";
            const isPattern = item.node.type === "pattern";
            const isTechnique = item.node.type === "technique";
            const isSelected = selectedNode?.id === item.node.id;
            const isHighlighted = highlightedNodeId === item.node.id;

            return (
              <div
                key={item.node.id}
                style={{
                  position: "absolute",
                  left: `${item.x - item.width / 2}px`,
                  top: `${item.y - item.height / 2}px`,
                  width: `${item.width}px`,
                  height: `${item.height}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedNode(item.node);
                }}
                className={cn(
                  "pointer-events-auto rounded-xl flex items-center justify-between px-3 transition-[background-color,border-color,box-shadow,color,opacity] duration-150 cursor-pointer shadow-xs group",
                  // Depth-Based Visual Hierarchy (NeetCode Style)
                  isRoot &&
                    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold border-2 border-indigo-400 shadow-md",
                  isTopic &&
                    "bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#312E81] border border-[#C7D2FE] dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-200 dark:border-indigo-800 shadow-2xs font-semibold",
                  isSubtopic &&
                    "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 dark:bg-card/90 dark:hover:bg-muted dark:text-foreground dark:border-border/80 shadow-2xs font-medium",
                  isPattern &&
                    "bg-slate-50 hover:bg-white text-slate-700 border border-slate-200/80 dark:bg-card/70 dark:hover:bg-muted/80 dark:text-foreground/90 dark:border-border/60 shadow-2xs",
                  isTechnique &&
                    "bg-white/90 hover:bg-white text-slate-600 border border-slate-200/60 dark:bg-card/50 dark:hover:bg-muted/60 dark:text-foreground/80 dark:border-border/40 shadow-2xs text-[11px]",
                  // Selected state
                  isSelected &&
                    "ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-background border-indigo-500 dark:border-indigo-400 shadow-md",
                  // Search Highlighted state
                  isHighlighted &&
                    "ring-4 ring-amber-500 ring-offset-2 animate-pulse"
                )}
              >
                {/* Node Title & Icon */}
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <NodeIcon node={item.node} />

                  <span
                    className={cn(
                      "truncate leading-tight",
                      isRoot ? "text-sm text-white font-bold" : isTopic ? "text-xs font-semibold" : "text-xs"
                    )}
                    title={item.node.name}
                  >
                    {item.node.name}
                  </span>
                </div>

                {/* Expansion Toggle Button (Direct children count) */}
                {item.hasChildren && (
                  <button
                    type="button"
                    onClick={(e) => toggleNodeExpansion(item.node.id, e)}
                    className={cn(
                      "size-5 rounded-md flex items-center justify-center shrink-0 ml-1.5 transition-colors cursor-pointer touch-manipulation",
                      isRoot
                        ? "bg-white/20 hover:bg-white/30 text-white"
                        : item.isExpanded
                        ? "bg-indigo-200/80 hover:bg-indigo-300 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                        : "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    )}
                    title={item.isExpanded ? "Collapse children" : `Expand (${item.childrenCount})`}
                  >
                    {item.isExpanded ? (
                      <ChevronDown className="size-3.5" />
                    ) : (
                      <span className="text-[10px] font-mono font-bold leading-none">
                        +{item.childrenCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 3. FLOATING CANVAS ZOOM CONTROLS (HORIZONTAL PILL ON MOBILE, VERTICAL ON DESKTOP) ─── */}
      <div className="absolute bottom-4 left-3 sm:bottom-6 sm:left-5 z-20 flex flex-row sm:flex-col items-center gap-1 sm:gap-1.5 bg-background/95 backdrop-blur-md border border-border/80 p-1 rounded-xl shadow-lg">
        <button
          type="button"
          onClick={zoomIn}
          className="size-7 sm:size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="size-3.5 sm:size-4" />
        </button>

        <button
          type="button"
          onClick={zoomOut}
          className="size-7 sm:size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="size-3.5 sm:size-4" />
        </button>

        <span className="h-4 w-px sm:h-px sm:w-full bg-border/60 mx-0.5 sm:mx-0 sm:my-0.5" />

        <button
          type="button"
          onClick={fitView}
          className="size-7 sm:size-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer"
          title="Fit / Center Visible Tree"
        >
          <Maximize2 className="size-3 sm:size-3.5" />
        </button>
      </div>

      {/* ─── 4. NODE INSPECTION DRAWER (MOBILE BOTTOM SHEET + DESKTOP SLIDE-OVER) ─── */}
      {selectedNode && (
        <>
          {/* Mobile Backdrop */}
          <div
            onClick={() => setSelectedNode(null)}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs sm:hidden animate-in fade-in duration-150"
          />

          <div
            className={cn(
              "z-40 flex flex-col bg-background/95 backdrop-blur-md border border-border/80 shadow-2xl p-4 sm:p-5 overflow-hidden transition-all",
              // Mobile: Full-width Bottom Sheet
              "fixed inset-x-0 bottom-0 max-h-[82vh] rounded-t-2xl border-t border-x-0 sm:border",
              // Desktop: Floating Side Card
              "sm:fixed sm:inset-auto sm:top-20 sm:right-4 sm:bottom-6 sm:w-96 sm:max-h-none sm:rounded-2xl",
              "animate-in slide-in-from-bottom-8 sm:slide-in-from-right-4 duration-200"
            )}
          >
            {/* Mobile Drag Indicator Handle */}
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30 mx-auto mb-2.5 sm:hidden shrink-0" />

            <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    {selectedNode.type}
                  </span>
                  {selectedNode.children && (
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {selectedNode.children.length} subtopics
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <NodeIcon
                    node={selectedNode}
                    className={selectedNode.type === "root" ? "text-indigo-600 dark:text-indigo-400 size-5" : "size-5"}
                  />
                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {selectedNode.name}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNode(null)}
                className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 no-scrollbar text-xs">
              {/* Description */}
              {selectedNode.description && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Concept Overview
                  </span>
                  <p className="text-muted-foreground leading-relaxed text-xs">
                    {selectedNode.description}
                  </p>
                </div>
              )}

              {/* Direct Children preview */}
              {selectedNode.children && selectedNode.children.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Branches &amp; Techniques ({selectedNode.children.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleNodeExpansion(selectedNode.id)}
                      className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                    >
                      {expandedNodes.has(selectedNode.id) ? "Collapse on Canvas" : "Expand on Canvas"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {selectedNode.children.map((child: DsaNode) => (
                      <div
                        key={child.id}
                        onClick={() => {
                          setSelectedNode(child);
                          setExpandedNodes((prev) => new Set([...prev, selectedNode.id]));
                        }}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/40 hover:bg-muted border border-border/50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <NodeIcon node={child} className="size-3.5 shrink-0" />
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                            {child.name}
                          </span>
                        </div>
                        <ArrowRight className="size-3 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions Connection Notice (Reserved for subsequent phase) */}
              <div className="p-3 rounded-xl bg-muted/30 border border-dashed border-border/80 text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 text-foreground font-semibold">
                  <BookOpen className="size-3.5 text-indigo-500" />
                  <span>Curated Questions</span>
                </div>
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                  Coding problems and LeetCode pattern mappings will be connected to this node in the next phase.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
