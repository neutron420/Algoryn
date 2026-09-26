import { DsaNode, DsaNodeType } from "@/lib/dsa-tree-data";

export interface LayoutNode {
  node: DsaNode;
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  isExpanded: boolean;
  hasChildren: boolean;
  childrenCount: number;
  rowIndex: number;
  parentLayoutNode?: LayoutNode;
}

export interface LayoutEdge {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isTrunk?: boolean;
}

export interface TreeBoundingBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
}

// Depth-based node dimensions
export const NODE_DIMS: Record<DsaNodeType, { width: number; height: number }> = {
  root: { width: 240, height: 56 },
  topic: { width: 196, height: 48 },
  subtopic: { width: 176, height: 42 },
  pattern: { width: 168, height: 38 },
  technique: { width: 156, height: 36 },
};

export const HORIZONTAL_GAP = 24;
export const VERTICAL_GAP = 72;
export const ROW_VERTICAL_GAP = 54;

// Max children per row for balanced layout
export const MAX_CHILDREN_PER_ROW: Record<DsaNodeType, number> = {
  root: 6,
  topic: 4,
  subtopic: 3,
  pattern: 3,
  technique: 2,
};

interface SubtreeMetrics {
  width: number;
  height: number;
  rows: Array<{
    children: DsaNode[];
    width: number;
    height: number;
  }>;
}

/**
 * Computes metrics (width, height, rows) for a node and its subtree with memoization.
 */
function computeNodeMetrics(
  node: DsaNode,
  expandedNodes: Set<string>,
  metricsCache: Map<string, SubtreeMetrics>
): SubtreeMetrics {
  const cached = metricsCache.get(node.id);
  if (cached) return cached;

  const isExpanded = expandedNodes.has(node.id);
  const dims = NODE_DIMS[node.type] || NODE_DIMS.topic;

  if (!isExpanded || !node.children || node.children.length === 0) {
    const res: SubtreeMetrics = {
      width: dims.width + HORIZONTAL_GAP,
      height: dims.height,
      rows: [],
    };
    metricsCache.set(node.id, res);
    return res;
  }

  const maxPerRow = MAX_CHILDREN_PER_ROW[node.type] || 4;
  const children = node.children;
  const rows: Array<{ children: DsaNode[]; width: number; height: number }> = [];

  for (let i = 0; i < children.length; i += maxPerRow) {
    const rowChildren = children.slice(i, i + maxPerRow);
    let rowWidth = 0;
    let maxChildSubtreeHeight = 0;

    for (const child of rowChildren) {
      const childMetrics = computeNodeMetrics(child, expandedNodes, metricsCache);
      rowWidth += childMetrics.width;
      maxChildSubtreeHeight = Math.max(maxChildSubtreeHeight, childMetrics.height);
    }

    rows.push({
      children: rowChildren,
      width: rowWidth,
      height: maxChildSubtreeHeight,
    });
  }

  const maxRowWidth = Math.max(
    dims.width + HORIZONTAL_GAP,
    ...rows.map((r) => r.width)
  );

  let totalHeight = dims.height + VERTICAL_GAP;
  for (let r = 0; r < rows.length; r++) {
    totalHeight += rows[r].height + (r > 0 ? ROW_VERTICAL_GAP : 0);
  }

  const result: SubtreeMetrics = {
    width: maxRowWidth,
    height: totalHeight,
    rows,
  };
  metricsCache.set(node.id, result);
  return result;
}

/**
 * Main Layout Generator: positions nodes symmetrically with multi-row distribution.
 */
export function computeBalancedTreeLayout(
  root: DsaNode,
  expandedNodes: Set<string>
): {
  layoutNodes: LayoutNode[];
  layoutEdges: LayoutEdge[];
  boundingBox: TreeBoundingBox;
} {
  const layoutNodes: LayoutNode[] = [];
  const layoutEdges: LayoutEdge[] = [];
  const metricsCache = new Map<string, SubtreeMetrics>();

  function layoutRecursive(
    node: DsaNode,
    centerX: number,
    topY: number,
    depth: number,
    parentNode?: LayoutNode,
    rowIndex: number = 0
  ): LayoutNode {
    const isExpanded = expandedNodes.has(node.id);
    const dims = NODE_DIMS[node.type] || NODE_DIMS.topic;
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const childrenCount = node.children ? node.children.length : 0;

    const currentLayoutNode: LayoutNode = {
      node,
      x: centerX,
      y: topY + dims.height / 2,
      width: dims.width,
      height: dims.height,
      depth,
      isExpanded,
      hasChildren,
      childrenCount,
      rowIndex,
      parentLayoutNode: parentNode,
    };

    layoutNodes.push(currentLayoutNode);

    // If parent exists, create connector edge
    if (parentNode) {
      layoutEdges.push({
        id: `${parentNode.node.id}->${node.id}`,
        sourceX: parentNode.x,
        sourceY: parentNode.y + parentNode.height / 2,
        targetX: centerX,
        targetY: topY,
      });
    }

    // If expanded, position children across balanced rows
    if (isExpanded && node.children && node.children.length > 0) {
      const metrics = computeNodeMetrics(node, expandedNodes, metricsCache);
      let currentRowTopY = topY + dims.height + VERTICAL_GAP;

      // If parent has multiple rows of children, also add a subtle trunk spine
      if (metrics.rows.length > 1) {
        const lastRowY = currentRowTopY + (metrics.rows.length - 1) * (ROW_VERTICAL_GAP + 48);
        layoutEdges.push({
          id: `trunk-${node.id}`,
          sourceX: centerX,
          sourceY: topY + dims.height / 2,
          targetX: centerX,
          targetY: lastRowY,
          isTrunk: true,
        });
      }

      for (let r = 0; r < metrics.rows.length; r++) {
        const row = metrics.rows[r];
        let currentChildLeftX = centerX - row.width / 2;

        for (const child of row.children) {
          const childMetrics = computeNodeMetrics(child, expandedNodes, metricsCache);
          const childCenterX = currentChildLeftX + childMetrics.width / 2;

          layoutRecursive(
            child,
            childCenterX,
            currentRowTopY,
            depth + 1,
            currentLayoutNode,
            r
          );

          currentChildLeftX += childMetrics.width;
        }

        currentRowTopY += row.height + ROW_VERTICAL_GAP;
      }
    }

    return currentLayoutNode;
  }

  // Execute from root
  layoutRecursive(root, 0, 0, 0);

  // Compute bounding box
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const n of layoutNodes) {
    if (n.x - n.width / 2 < minX) minX = n.x - n.width / 2;
    if (n.x + n.width / 2 > maxX) maxX = n.x + n.width / 2;
    if (n.y - n.height / 2 < minY) minY = n.y - n.height / 2;
    if (n.y + n.height / 2 > maxY) maxY = n.y + n.height / 2;
  }

  if (layoutNodes.length === 0) {
    minX = -100;
    maxX = 100;
    minY = 0;
    maxY = 100;
  }

  return {
    layoutNodes,
    layoutEdges,
    boundingBox: {
      minX,
      maxX,
      minY,
      maxY,
      width: Math.max(maxX - minX, 100),
      height: Math.max(maxY - minY, 100),
    },
  };
}
