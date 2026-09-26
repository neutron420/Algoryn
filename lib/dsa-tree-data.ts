export type DsaNodeType = "root" | "topic" | "subtopic" | "pattern" | "technique";

export interface DsaNode {
  id: string;
  name: string;
  type: DsaNodeType;
  parentId?: string | null;
  description?: string;
  tags?: string[];
  children?: DsaNode[];
}

export const DSA_TREE_DATA: DsaNode = {
  id: "dsa-root",
  name: "DSA Master Roadmap",
  type: "root",
  parentId: null,
  description: "Comprehensive Data Structures & Algorithms visual knowledge hierarchy and roadmap.",
  children: [
    // --------------------------------------------------
    // A. FOUNDATIONS
    // --------------------------------------------------
    {
      id: "foundations",
      name: "Foundations",
      type: "topic",
      parentId: "dsa-root",
      description: "Fundamental concepts of computational logic, complexity analysis, and mathematical reasoning.",
      children: [
        { id: "problem-solving", name: "Problem Solving", type: "subtopic", parentId: "foundations", description: "First principles of breaking down engineering challenges." },
        { id: "time-complexity", name: "Time Complexity", type: "subtopic", parentId: "foundations", description: "Measuring runtime asymptotic scaling." },
        { id: "space-complexity", name: "Space Complexity", type: "subtopic", parentId: "foundations", description: "Auxiliary and stack memory accounting." },
        { id: "big-o", name: "Big-O Notation", type: "subtopic", parentId: "foundations", description: "Upper, lower, and tight bound asymptotic limits (O, Ω, Θ)." },
        { id: "recursion-foundation", name: "Recursion Basics", type: "subtopic", parentId: "foundations", description: "Call stack mechanics and base condition termination." },
        { id: "iteration", name: "Iteration", type: "subtopic", parentId: "foundations", description: "State transitions across deterministic loops." },
        { id: "invariants", name: "Loop Invariants", type: "subtopic", parentId: "foundations", description: "Proving algorithmic correctness across state mutations." },
        { id: "math-basics", name: "Mathematical Basics", type: "subtopic", parentId: "foundations", description: "Logarithms, series summation, parity, and discrete basics." },
      ],
    },

    // --------------------------------------------------
    // B. ARRAYS
    // --------------------------------------------------
    {
      id: "arrays",
      name: "Arrays",
      type: "topic",
      parentId: "dsa-root",
      description: "Contiguous memory blocks, indexing patterns, windowing, and 2D matrix manipulation.",
      children: [
        { id: "array-traversal", name: "Array Traversal", type: "subtopic", parentId: "arrays" },
        { id: "in-place-operations", name: "In-place Operations", type: "subtopic", parentId: "arrays" },
        { id: "array-reversal", name: "Reversal", type: "subtopic", parentId: "arrays" },
        { id: "array-rotation", name: "Rotation", type: "subtopic", parentId: "arrays" },
        { id: "array-partitioning", name: "Partitioning", type: "subtopic", parentId: "arrays" },
        {
          id: "prefix-sum",
          name: "Prefix Sum",
          type: "subtopic",
          parentId: "arrays",
          children: [
            { id: "prefix-1d", name: "1D Prefix Sum", type: "technique", parentId: "prefix-sum" },
            { id: "prefix-range-sum", name: "Range Sum", type: "technique", parentId: "prefix-sum" },
            { id: "prefix-hashmap", name: "Prefix Sum + HashMap", type: "technique", parentId: "prefix-sum" },
            { id: "prefix-xor", name: "Prefix XOR", type: "technique", parentId: "prefix-sum" },
            { id: "prefix-2d", name: "2D Prefix Sum", type: "technique", parentId: "prefix-sum" },
          ],
        },
        {
          id: "difference-array",
          name: "Difference Array",
          type: "subtopic",
          parentId: "arrays",
          children: [
            { id: "diff-range-updates", name: "Range Updates", type: "technique", parentId: "difference-array" },
            { id: "diff-2d", name: "2D Difference Array", type: "technique", parentId: "difference-array" },
          ],
        },
        { id: "kadanes-algorithm", name: "Kadane's Algorithm", type: "subtopic", parentId: "arrays", description: "Maximum contiguous subarray in linear time." },
        { id: "cyclic-sort", name: "Cyclic Sort", type: "subtopic", parentId: "arrays", description: "O(n) placement when values are in range 1 to N." },
        { id: "index-placement", name: "Index Placement", type: "subtopic", parentId: "arrays" },
        {
          id: "intervals",
          name: "Intervals",
          type: "subtopic",
          parentId: "arrays",
          children: [
            { id: "merge-intervals", name: "Merge Intervals", type: "technique", parentId: "intervals" },
            { id: "insert-interval", name: "Insert Interval", type: "technique", parentId: "intervals" },
            { id: "overlapping-intervals", name: "Overlapping Intervals", type: "technique", parentId: "intervals" },
            { id: "meeting-rooms", name: "Meeting Rooms", type: "technique", parentId: "intervals" },
            { id: "sweep-line-intervals", name: "Sweep Line", type: "technique", parentId: "intervals" },
          ],
        },
        {
          id: "matrix",
          name: "Matrix",
          type: "subtopic",
          parentId: "arrays",
          children: [
            { id: "matrix-traversal", name: "Matrix Traversal", type: "technique", parentId: "matrix" },
            { id: "spiral-matrix", name: "Spiral Matrix", type: "technique", parentId: "matrix" },
            { id: "rotate-matrix", name: "Rotate Matrix", type: "technique", parentId: "matrix" },
            { id: "transpose-matrix", name: "Transpose", type: "technique", parentId: "matrix" },
            { id: "grid-simulation", name: "Grid Simulation", type: "technique", parentId: "matrix" },
            { id: "flood-fill", name: "Flood Fill", type: "technique", parentId: "matrix" },
          ],
        },
      ],
    },

    // --------------------------------------------------
    // C. HASHING
    // --------------------------------------------------
    {
      id: "hashing",
      name: "Hashing",
      type: "topic",
      parentId: "dsa-root",
      description: "Hash tables, sets, collision handling, frequency maps, and constant-time lookups.",
      children: [
        { id: "hashset", name: "HashSet", type: "subtopic", parentId: "hashing" },
        { id: "hashmap", name: "HashMap", type: "subtopic", parentId: "hashing" },
        { id: "frequency-counting", name: "Frequency Counting", type: "subtopic", parentId: "hashing" },
        { id: "duplicate-detection", name: "Duplicate Detection", type: "subtopic", parentId: "hashing" },
        { id: "complement-lookup", name: "Complement Lookup", type: "subtopic", parentId: "hashing" },
        { id: "index-mapping", name: "Index Mapping", type: "subtopic", parentId: "hashing" },
        { id: "grouping-hash", name: "Grouping", type: "subtopic", parentId: "hashing" },
        { id: "hashmap-prefix-sum", name: "HashMap + Prefix Sum", type: "subtopic", parentId: "hashing" },
        { id: "hashmap-sliding-window", name: "HashMap + Sliding Window", type: "subtopic", parentId: "hashing" },
        { id: "custom-hashing", name: "Custom Hashing", type: "subtopic", parentId: "hashing" },
      ],
    },

    // --------------------------------------------------
    // D. TWO POINTERS
    // --------------------------------------------------
    {
      id: "two-pointers",
      name: "Two Pointers",
      type: "topic",
      parentId: "dsa-root",
      description: "Coordinated pointer indexing from boundaries or shared offsets in linear time.",
      children: [
        {
          id: "opposite-direction",
          name: "Opposite Direction",
          type: "subtopic",
          parentId: "two-pointers",
          children: [
            { id: "pair-search", name: "Pair Search", type: "technique", parentId: "opposite-direction" },
            { id: "palindrome-pointer", name: "Palindrome", type: "technique", parentId: "opposite-direction" },
            { id: "container-problems", name: "Container Problems", type: "technique", parentId: "opposite-direction" },
          ],
        },
        {
          id: "same-direction",
          name: "Same Direction",
          type: "subtopic",
          parentId: "two-pointers",
          children: [
            { id: "in-place-filtering", name: "In-place Filtering", type: "technique", parentId: "same-direction" },
            { id: "remove-duplicates-tp", name: "Remove Duplicates", type: "technique", parentId: "same-direction" },
            { id: "move-elements", name: "Move Elements", type: "technique", parentId: "same-direction" },
          ],
        },
        {
          id: "fast-slow-pointers",
          name: "Fast and Slow",
          type: "subtopic",
          parentId: "two-pointers",
          children: [
            { id: "cycle-detection-fs", name: "Cycle Detection", type: "technique", parentId: "fast-slow-pointers" },
            { id: "middle-element-fs", name: "Middle Element", type: "technique", parentId: "fast-slow-pointers" },
            { id: "runner-technique", name: "Runner Technique", type: "technique", parentId: "fast-slow-pointers" },
          ],
        },
        {
          id: "sorting-two-pointers",
          name: "Sorting + Two Pointers",
          type: "subtopic",
          parentId: "two-pointers",
          children: [
            { id: "2sum-sorted", name: "2Sum", type: "technique", parentId: "sorting-two-pointers" },
            { id: "3sum-technique", name: "3Sum", type: "technique", parentId: "sorting-two-pointers" },
            { id: "4sum-technique", name: "4Sum", type: "technique", parentId: "sorting-two-pointers" },
          ],
        },
        {
          id: "partitioning-two-pointers",
          name: "Partitioning",
          type: "subtopic",
          parentId: "two-pointers",
          children: [
            { id: "dutch-national-flag", name: "Dutch National Flag", type: "technique", parentId: "partitioning-two-pointers" },
            { id: "partition-pivot", name: "Partition Around Pivot", type: "technique", parentId: "partitioning-two-pointers" },
          ],
        },
      ],
    },

    // --------------------------------------------------
    // E. SLIDING WINDOW
    // --------------------------------------------------
    {
      id: "sliding-window",
      name: "Sliding Window",
      type: "topic",
      parentId: "dsa-root",
      description: "Subarray and substring search optimization by dynamic window boundary maintenance.",
      children: [
        { id: "fixed-window", name: "Fixed Window", type: "subtopic", parentId: "sliding-window" },
        { id: "variable-window", name: "Variable Window", type: "subtopic", parentId: "sliding-window" },
        { id: "longest-valid-window", name: "Longest Valid Window", type: "subtopic", parentId: "sliding-window" },
        { id: "shortest-valid-window", name: "Shortest Valid Window", type: "subtopic", parentId: "sliding-window" },
        { id: "frequency-window", name: "Frequency Window", type: "subtopic", parentId: "sliding-window" },
        { id: "at-most-k", name: "At Most K", type: "subtopic", parentId: "sliding-window" },
        { id: "exactly-k", name: "Exactly K", type: "subtopic", parentId: "sliding-window" },
        { id: "sw-hashmap", name: "Sliding Window + HashMap", type: "subtopic", parentId: "sliding-window" },
        { id: "sw-set", name: "Sliding Window + Set", type: "subtopic", parentId: "sliding-window" },
        { id: "sw-deque", name: "Sliding Window + Deque", type: "subtopic", parentId: "sliding-window" },
      ],
    },

    // --------------------------------------------------
    // F. SORTING
    // --------------------------------------------------
    {
      id: "sorting",
      name: "Sorting",
      type: "topic",
      parentId: "dsa-root",
      description: "Comparison-based and non-comparison ordering algorithms, stability, and complexities.",
      children: [
        { id: "bubble-sort", name: "Bubble Sort", type: "subtopic", parentId: "sorting" },
        { id: "selection-sort", name: "Selection Sort", type: "subtopic", parentId: "sorting" },
        { id: "insertion-sort", name: "Insertion Sort", type: "subtopic", parentId: "sorting" },
        { id: "merge-sort", name: "Merge Sort", type: "subtopic", parentId: "sorting" },
        { id: "quick-sort", name: "Quick Sort", type: "subtopic", parentId: "sorting" },
        { id: "heap-sort", name: "Heap Sort", type: "subtopic", parentId: "sorting" },
        { id: "counting-sort", name: "Counting Sort", type: "subtopic", parentId: "sorting" },
        { id: "radix-sort", name: "Radix Sort", type: "subtopic", parentId: "sorting" },
        { id: "bucket-sort", name: "Bucket Sort", type: "subtopic", parentId: "sorting" },
        { id: "stable-unstable-sort", name: "Stable vs Unstable Sorting", type: "subtopic", parentId: "sorting" },
        { id: "in-place-sort", name: "In-place Sorting", type: "subtopic", parentId: "sorting" },
        { id: "custom-comparator", name: "Custom Comparator", type: "subtopic", parentId: "sorting" },
      ],
    },

    // --------------------------------------------------
    // G. BINARY SEARCH / SEARCHING
    // --------------------------------------------------
    {
      id: "binary-search",
      name: "Binary Search",
      type: "topic",
      parentId: "dsa-root",
      description: "Logarithmic elimination of search spaces across monotonic domains and answer spaces.",
      children: [
        { id: "basic-binary-search", name: "Basic Binary Search", type: "subtopic", parentId: "binary-search" },
        { id: "first-occurrence", name: "First Occurrence", type: "subtopic", parentId: "binary-search" },
        { id: "last-occurrence", name: "Last Occurrence", type: "subtopic", parentId: "binary-search" },
        { id: "lower-bound", name: "Lower Bound", type: "subtopic", parentId: "binary-search" },
        { id: "upper-bound", name: "Upper Bound", type: "subtopic", parentId: "binary-search" },
        { id: "search-rotated-array", name: "Search in Rotated Array", type: "subtopic", parentId: "binary-search" },
        { id: "peak-finding", name: "Peak Finding", type: "subtopic", parentId: "binary-search" },
        {
          id: "bs-on-answer",
          name: "Binary Search on Answer",
          type: "subtopic",
          parentId: "binary-search",
          children: [
            { id: "min-feasible-answer", name: "Minimum Feasible Answer", type: "technique", parentId: "bs-on-answer" },
            { id: "max-feasible-answer", name: "Maximum Feasible Answer", type: "technique", parentId: "bs-on-answer" },
            { id: "capacity-problems", name: "Capacity Problems", type: "technique", parentId: "bs-on-answer" },
            { id: "allocation-problems", name: "Allocation Problems", type: "technique", parentId: "bs-on-answer" },
          ],
        },
        { id: "ternary-search", name: "Ternary Search", type: "subtopic", parentId: "binary-search" },
      ],
    },

    // --------------------------------------------------
    // H. LINKED LIST
    // --------------------------------------------------
    {
      id: "linked-list",
      name: "Linked List",
      type: "topic",
      parentId: "dsa-root",
      description: "Non-contiguous dynamic node pointers, traversal cycles, reversals, and cache buffers.",
      children: [
        { id: "singly-linked-list", name: "Singly Linked List", type: "subtopic", parentId: "linked-list" },
        { id: "doubly-linked-list", name: "Doubly Linked List", type: "subtopic", parentId: "linked-list" },
        { id: "circular-linked-list", name: "Circular Linked List", type: "subtopic", parentId: "linked-list" },
        { id: "reverse-linked-list", name: "Reverse Linked List", type: "subtopic", parentId: "linked-list" },
        { id: "reverse-in-groups", name: "Reverse in Groups", type: "subtopic", parentId: "linked-list" },
        { id: "fast-slow-ll", name: "Fast and Slow Pointer", type: "subtopic", parentId: "linked-list" },
        { id: "cycle-detection-ll", name: "Cycle Detection", type: "subtopic", parentId: "linked-list" },
        { id: "cycle-entry-ll", name: "Cycle Entry", type: "subtopic", parentId: "linked-list" },
        { id: "middle-of-linked-list", name: "Middle of Linked List", type: "subtopic", parentId: "linked-list" },
        { id: "merge-linked-lists", name: "Merge Linked Lists", type: "subtopic", parentId: "linked-list" },
        { id: "sort-linked-list", name: "Sort Linked List", type: "subtopic", parentId: "linked-list" },
        { id: "reorder-list", name: "Reorder List", type: "subtopic", parentId: "linked-list" },
        { id: "palindrome-linked-list", name: "Palindrome Linked List", type: "subtopic", parentId: "linked-list" },
        { id: "intersection-ll", name: "Intersection", type: "subtopic", parentId: "linked-list" },
        { id: "random-pointer-ll", name: "Random Pointer", type: "subtopic", parentId: "linked-list" },
        { id: "lru-cache-ll", name: "LRU Cache", type: "subtopic", parentId: "linked-list" },
      ],
    },

    // --------------------------------------------------
    // I. STACK
    // --------------------------------------------------
    {
      id: "stack",
      name: "Stack",
      type: "topic",
      parentId: "dsa-root",
      description: "Last-In-First-Out data structures, expression parsing, and monotonic order invariant evaluation.",
      children: [
        { id: "basic-stack", name: "Basic Stack", type: "subtopic", parentId: "stack" },
        { id: "parentheses-stack", name: "Parentheses", type: "subtopic", parentId: "stack" },
        {
          id: "expression-evaluation",
          name: "Expression Evaluation",
          type: "subtopic",
          parentId: "stack",
          children: [
            { id: "infix-eval", name: "Infix", type: "technique", parentId: "expression-evaluation" },
            { id: "prefix-eval", name: "Prefix", type: "technique", parentId: "expression-evaluation" },
            { id: "postfix-eval", name: "Postfix", type: "technique", parentId: "expression-evaluation" },
          ],
        },
        { id: "stack-string", name: "Stack + String", type: "subtopic", parentId: "stack" },
        { id: "stack-simulation", name: "Stack Simulation", type: "subtopic", parentId: "stack" },
        {
          id: "monotonic-stack",
          name: "Monotonic Stack",
          type: "subtopic",
          parentId: "stack",
          children: [
            { id: "next-greater-element", name: "Next Greater Element", type: "technique", parentId: "monotonic-stack" },
            { id: "next-smaller-element", name: "Next Smaller Element", type: "technique", parentId: "monotonic-stack" },
            { id: "previous-greater-element", name: "Previous Greater Element", type: "technique", parentId: "monotonic-stack" },
            { id: "previous-smaller-element", name: "Previous Smaller Element", type: "technique", parentId: "monotonic-stack" },
            { id: "stock-span", name: "Stock Span", type: "technique", parentId: "monotonic-stack" },
            { id: "daily-temperatures", name: "Daily Temperatures", type: "technique", parentId: "monotonic-stack" },
            { id: "largest-rectangle-stack", name: "Largest Rectangle", type: "technique", parentId: "monotonic-stack" },
          ],
        },
      ],
    },

    // --------------------------------------------------
    // J. QUEUE / DEQUE
    // --------------------------------------------------
    {
      id: "queue-deque",
      name: "Queue / Deque",
      type: "topic",
      parentId: "dsa-root",
      description: "First-In-First-Out, double-ended queues, circular buffers, and sliding window maximum queries.",
      children: [
        { id: "basic-queue", name: "Queue", type: "subtopic", parentId: "queue-deque" },
        { id: "circular-queue", name: "Circular Queue", type: "subtopic", parentId: "queue-deque" },
        { id: "deque-basic", name: "Deque", type: "subtopic", parentId: "queue-deque" },
        { id: "bfs-queue", name: "BFS Queue", type: "subtopic", parentId: "queue-deque" },
        { id: "level-order-queue", name: "Level Order Processing", type: "subtopic", parentId: "queue-deque" },
        {
          id: "monotonic-deque",
          name: "Monotonic Deque",
          type: "subtopic",
          parentId: "queue-deque",
          children: [
            { id: "sw-maximum-deque", name: "Sliding Window Maximum", type: "technique", parentId: "monotonic-deque" },
            { id: "sw-minimum-deque", name: "Sliding Window Minimum", type: "technique", parentId: "monotonic-deque" },
          ],
        },
      ],
    },

    // --------------------------------------------------
    // K. HEAP / PRIORITY QUEUE
    // --------------------------------------------------
    {
      id: "heap-priority-queue",
      name: "Heap / Priority Queue",
      type: "topic",
      parentId: "dsa-root",
      description: "Complete binary trees with heap-order property, dynamic extremal value extraction in O(log N).",
      children: [
        { id: "min-heap", name: "Min Heap", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "max-heap", name: "Max Heap", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "heapify-op", name: "Heapify", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "build-heap-op", name: "Build Heap", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "top-k-elements", name: "Top K", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "kth-largest-heap", name: "Kth Largest", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "kth-smallest-heap", name: "Kth Smallest", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "k-way-merge", name: "K-way Merge", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "two-heaps-pattern", name: "Two Heaps", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "median-maintenance", name: "Median Maintenance", type: "subtopic", parentId: "heap-priority-queue" },
        { id: "heap-greedy-pattern", name: "Heap + Greedy", type: "subtopic", parentId: "heap-priority-queue" },
      ],
    },

    // --------------------------------------------------
    // L. TREES
    // --------------------------------------------------
    {
      id: "trees",
      name: "Trees",
      type: "topic",
      parentId: "dsa-root",
      description: "Hierarchical acyclic connected structures, traversals, LCA, views, and recursive decomposition.",
      children: [
        { id: "binary-tree-basic", name: "Binary Tree", type: "subtopic", parentId: "trees" },
        {
          id: "tree-traversals",
          name: "Traversals",
          type: "subtopic",
          parentId: "trees",
          children: [
            { id: "preorder-traversal", name: "Preorder", type: "technique", parentId: "tree-traversals" },
            { id: "inorder-traversal", name: "Inorder", type: "technique", parentId: "tree-traversals" },
            { id: "postorder-traversal", name: "Postorder", type: "technique", parentId: "tree-traversals" },
            { id: "level-order-traversal", name: "Level Order", type: "technique", parentId: "tree-traversals" },
            { id: "zigzag-traversal", name: "Zigzag Traversal", type: "technique", parentId: "tree-traversals" },
            { id: "morris-traversal", name: "Morris Traversal", type: "technique", parentId: "tree-traversals" },
          ],
        },
        { id: "tree-dfs", name: "DFS", type: "subtopic", parentId: "trees" },
        { id: "tree-bfs", name: "BFS", type: "subtopic", parentId: "trees" },
        { id: "tree-height-depth", name: "Height / Depth", type: "subtopic", parentId: "trees" },
        { id: "tree-diameter", name: "Diameter", type: "subtopic", parentId: "trees" },
        { id: "balanced-tree-check", name: "Balanced Tree", type: "subtopic", parentId: "trees" },
        { id: "path-sum-tree", name: "Path Sum", type: "subtopic", parentId: "trees" },
        { id: "root-to-leaf", name: "Root-to-Leaf Problems", type: "subtopic", parentId: "trees" },
        { id: "lca-binary-tree", name: "Lowest Common Ancestor", type: "subtopic", parentId: "trees" },
        {
          id: "tree-views",
          name: "Tree Views",
          type: "subtopic",
          parentId: "trees",
          children: [
            { id: "left-view-tree", name: "Left View", type: "technique", parentId: "tree-views" },
            { id: "right-view-tree", name: "Right View", type: "technique", parentId: "tree-views" },
            { id: "top-view-tree", name: "Top View", type: "technique", parentId: "tree-views" },
            { id: "bottom-view-tree", name: "Bottom View", type: "technique", parentId: "tree-views" },
          ],
        },
        { id: "serialize-deserialize-tree", name: "Serialize / Deserialize", type: "subtopic", parentId: "trees" },
        { id: "tree-construction", name: "Tree Construction", type: "subtopic", parentId: "trees" },
        { id: "flatten-binary-tree", name: "Flatten Binary Tree", type: "subtopic", parentId: "trees" },
        { id: "tree-dp", name: "Tree DP", type: "subtopic", parentId: "trees" },
      ],
    },

    // --------------------------------------------------
    // M. BINARY SEARCH TREE
    // --------------------------------------------------
    {
      id: "binary-search-tree",
      name: "Binary Search Tree",
      type: "topic",
      parentId: "dsa-root",
      description: "Ordered binary trees ensuring left < node < right, enabling logarithmic queries.",
      children: [
        { id: "bst-search", name: "Search", type: "subtopic", parentId: "binary-search-tree" },
        { id: "bst-insert", name: "Insert", type: "subtopic", parentId: "binary-search-tree" },
        { id: "bst-delete", name: "Delete", type: "subtopic", parentId: "binary-search-tree" },
        { id: "bst-min-max", name: "Minimum / Maximum", type: "subtopic", parentId: "binary-search-tree" },
        { id: "bst-successor", name: "Successor", type: "subtopic", parentId: "binary-search-tree" },
        { id: "bst-predecessor", name: "Predecessor", type: "subtopic", parentId: "binary-search-tree" },
        { id: "validate-bst", name: "Validate BST", type: "subtopic", parentId: "binary-search-tree" },
        { id: "kth-smallest-bst", name: "Kth Smallest", type: "subtopic", parentId: "binary-search-tree" },
        { id: "kth-largest-bst", name: "Kth Largest", type: "subtopic", parentId: "binary-search-tree" },
        { id: "lca-in-bst", name: "LCA in BST", type: "subtopic", parentId: "binary-search-tree" },
        { id: "bst-iterator", name: "BST Iterator", type: "subtopic", parentId: "binary-search-tree" },
        { id: "sorted-array-to-bst", name: "Sorted Array to BST", type: "subtopic", parentId: "binary-search-tree" },
      ],
    },

    // --------------------------------------------------
    // N. BALANCED TREES
    // --------------------------------------------------
    {
      id: "balanced-trees",
      name: "Balanced Trees",
      type: "topic",
      parentId: "dsa-root",
      description: "Self-balancing search tree invariants maintaining O(log N) worst-case height.",
      children: [
        {
          id: "avl-tree",
          name: "AVL Tree",
          type: "subtopic",
          parentId: "balanced-trees",
          children: [
            { id: "avl-balance-factor", name: "Balance Factor", type: "technique", parentId: "avl-tree" },
            { id: "avl-ll-rotation", name: "LL Rotation", type: "technique", parentId: "avl-tree" },
            { id: "avl-rr-rotation", name: "RR Rotation", type: "technique", parentId: "avl-tree" },
            { id: "avl-lr-rotation", name: "LR Rotation", type: "technique", parentId: "avl-tree" },
            { id: "avl-rl-rotation", name: "RL Rotation", type: "technique", parentId: "avl-tree" },
          ],
        },
        {
          id: "red-black-tree",
          name: "Red-Black Tree",
          type: "subtopic",
          parentId: "balanced-trees",
          children: [
            { id: "rb-properties", name: "Properties", type: "technique", parentId: "red-black-tree" },
            { id: "rb-rotations", name: "Rotations", type: "technique", parentId: "red-black-tree" },
            { id: "rb-recoloring", name: "Recoloring", type: "technique", parentId: "red-black-tree" },
            { id: "rb-insertion-fix", name: "Insertion Fix", type: "technique", parentId: "red-black-tree" },
            { id: "rb-deletion-fix", name: "Deletion Fix", type: "technique", parentId: "red-black-tree" },
          ],
        },
        { id: "b-tree", name: "B-Tree", type: "subtopic", parentId: "balanced-trees" },
        { id: "b-plus-tree", name: "B+ Tree", type: "subtopic", parentId: "balanced-trees" },
        { id: "2-3-tree", name: "2-3 Tree", type: "subtopic", parentId: "balanced-trees" },
        { id: "2-3-4-tree", name: "2-3-4 Tree", type: "subtopic", parentId: "balanced-trees" },
        { id: "splay-tree", name: "Splay Tree", type: "subtopic", parentId: "balanced-trees" },
      ],
    },

    // --------------------------------------------------
    // O. ADVANCED TREE DATA STRUCTURES
    // --------------------------------------------------
    {
      id: "advanced-trees",
      name: "Advanced Trees",
      type: "topic",
      parentId: "dsa-root",
      description: "Interval decomposition, range updates, and tree compression structures.",
      children: [
        {
          id: "segment-tree",
          name: "Segment Tree",
          type: "subtopic",
          parentId: "advanced-trees",
          children: [
            { id: "seg-range-sum", name: "Range Sum", type: "technique", parentId: "segment-tree" },
            { id: "seg-range-min", name: "Range Minimum", type: "technique", parentId: "segment-tree" },
            { id: "seg-range-max", name: "Range Maximum", type: "technique", parentId: "segment-tree" },
            { id: "seg-point-update", name: "Point Update", type: "technique", parentId: "segment-tree" },
            { id: "seg-range-update", name: "Range Update", type: "technique", parentId: "segment-tree" },
          ],
        },
        { id: "lazy-propagation", name: "Lazy Propagation", type: "subtopic", parentId: "advanced-trees" },
        { id: "fenwick-tree-bit", name: "Fenwick Tree / BIT", type: "subtopic", parentId: "advanced-trees" },
        { id: "sparse-table", name: "Sparse Table", type: "subtopic", parentId: "advanced-trees" },
        { id: "treap-struct", name: "Treap", type: "subtopic", parentId: "advanced-trees" },
        { id: "cartesian-tree", name: "Cartesian Tree", type: "subtopic", parentId: "advanced-trees" },
        { id: "interval-tree", name: "Interval Tree", type: "subtopic", parentId: "advanced-trees" },
        { id: "order-statistic-tree", name: "Order Statistic Tree", type: "subtopic", parentId: "advanced-trees" },
        { id: "heavy-light-decomposition", name: "Heavy-Light Decomposition", type: "subtopic", parentId: "advanced-trees" },
        { id: "centroid-decomposition", name: "Centroid Decomposition", type: "subtopic", parentId: "advanced-trees" },
      ],
    },

    // --------------------------------------------------
    // P. TRIE
    // --------------------------------------------------
    {
      id: "trie",
      name: "Trie",
      type: "topic",
      parentId: "dsa-root",
      description: "Prefix trees for efficient string search, autocomplete, and bitwise XOR queries.",
      children: [
        { id: "trie-insert", name: "Insert", type: "subtopic", parentId: "trie" },
        { id: "trie-search", name: "Search", type: "subtopic", parentId: "trie" },
        { id: "trie-prefix-search", name: "Prefix Search", type: "subtopic", parentId: "trie" },
        { id: "trie-autocomplete", name: "Autocomplete", type: "subtopic", parentId: "trie" },
        { id: "word-dictionary-trie", name: "Word Dictionary", type: "subtopic", parentId: "trie" },
        { id: "word-search-trie", name: "Word Search", type: "subtopic", parentId: "trie" },
        { id: "binary-trie", name: "Binary Trie", type: "subtopic", parentId: "trie" },
        { id: "trie-xor", name: "Trie + XOR", type: "subtopic", parentId: "trie" },
      ],
    },

    // --------------------------------------------------
    // Q. GRAPHS
    // --------------------------------------------------
    {
      id: "graphs",
      name: "Graphs",
      type: "topic",
      parentId: "dsa-root",
      description: "Vertices, edges, representations, traversal algorithms, topological ordering, and connectivity.",
      children: [
        {
          id: "graph-representation",
          name: "Graph Representation",
          type: "subtopic",
          parentId: "graphs",
          children: [
            { id: "adj-matrix", name: "Adjacency Matrix", type: "technique", parentId: "graph-representation" },
            { id: "adj-list", name: "Adjacency List", type: "technique", parentId: "graph-representation" },
            { id: "edge-list", name: "Edge List", type: "technique", parentId: "graph-representation" },
          ],
        },
        { id: "directed-graph", name: "Directed Graph", type: "subtopic", parentId: "graphs" },
        { id: "undirected-graph", name: "Undirected Graph", type: "subtopic", parentId: "graphs" },
        { id: "weighted-graph", name: "Weighted Graph", type: "subtopic", parentId: "graphs" },
        { id: "unweighted-graph", name: "Unweighted Graph", type: "subtopic", parentId: "graphs" },
        { id: "graph-dfs", name: "DFS", type: "subtopic", parentId: "graphs" },
        { id: "graph-bfs", name: "BFS", type: "subtopic", parentId: "graphs" },
        { id: "connected-components", name: "Connected Components", type: "subtopic", parentId: "graphs" },
        {
          id: "cycle-detection-graph",
          name: "Cycle Detection",
          type: "subtopic",
          parentId: "graphs",
          children: [
            { id: "cycle-directed", name: "Directed", type: "technique", parentId: "cycle-detection-graph" },
            { id: "cycle-undirected", name: "Undirected", type: "technique", parentId: "cycle-detection-graph" },
          ],
        },
        { id: "bipartite-graph", name: "Bipartite Graph", type: "subtopic", parentId: "graphs" },
        { id: "graph-coloring", name: "Graph Coloring", type: "subtopic", parentId: "graphs" },
        {
          id: "topological-sort",
          name: "Topological Sort",
          type: "subtopic",
          parentId: "graphs",
          children: [
            { id: "topo-dfs", name: "DFS", type: "technique", parentId: "topological-sort" },
            { id: "topo-kahns", name: "Kahn's Algorithm", type: "technique", parentId: "topological-sort" },
          ],
        },
        { id: "union-find-dsu", name: "Union Find / DSU", type: "subtopic", parentId: "graphs" },
      ],
    },

    // --------------------------------------------------
    // R. SHORTEST PATH
    // --------------------------------------------------
    {
      id: "shortest-path",
      name: "Shortest Path",
      type: "topic",
      parentId: "dsa-root",
      description: "Path optimization across unweighted, non-negative, and negative-weight graph topologies.",
      children: [
        { id: "bfs-shortest-path", name: "BFS Shortest Path", type: "subtopic", parentId: "shortest-path" },
        { id: "0-1-bfs", name: "0-1 BFS", type: "subtopic", parentId: "shortest-path" },
        { id: "dijkstra-alg", name: "Dijkstra", type: "subtopic", parentId: "shortest-path" },
        { id: "bellman-ford", name: "Bellman-Ford", type: "subtopic", parentId: "shortest-path" },
        { id: "floyd-warshall", name: "Floyd-Warshall", type: "subtopic", parentId: "shortest-path" },
        { id: "dag-shortest-path", name: "DAG Shortest Path", type: "subtopic", parentId: "shortest-path" },
        { id: "a-star-search", name: "A* Search", type: "subtopic", parentId: "shortest-path" },
      ],
    },

    // --------------------------------------------------
    // S. MINIMUM SPANNING TREE
    // --------------------------------------------------
    {
      id: "minimum-spanning-tree",
      name: "Minimum Spanning Tree",
      type: "topic",
      parentId: "dsa-root",
      description: "Connecting all graph vertices with minimal total edge weight without cycles.",
      children: [
        {
          id: "kruskal-alg",
          name: "Kruskal",
          type: "subtopic",
          parentId: "minimum-spanning-tree",
          children: [
            { id: "kruskal-dsu", name: "DSU", type: "technique", parentId: "kruskal-alg" },
          ],
        },
        { id: "prim-alg", name: "Prim", type: "subtopic", parentId: "minimum-spanning-tree" },
      ],
    },

    // --------------------------------------------------
    // T. ADVANCED GRAPH ALGORITHMS
    // --------------------------------------------------
    {
      id: "advanced-graphs",
      name: "Advanced Graphs",
      type: "topic",
      parentId: "dsa-root",
      description: "Biconnectivity, articulation vertices, network flows, Eulerian tours, and matching.",
      children: [
        {
          id: "scc-graphs",
          name: "Strongly Connected Components",
          type: "subtopic",
          parentId: "advanced-graphs",
          children: [
            { id: "kosaraju-alg", name: "Kosaraju", type: "technique", parentId: "scc-graphs" },
            { id: "tarjan-alg", name: "Tarjan", type: "technique", parentId: "scc-graphs" },
          ],
        },
        { id: "bridges-graph", name: "Bridges", type: "subtopic", parentId: "advanced-graphs" },
        { id: "articulation-points", name: "Articulation Points", type: "subtopic", parentId: "advanced-graphs" },
        { id: "eulerian-path", name: "Eulerian Path", type: "subtopic", parentId: "advanced-graphs" },
        { id: "eulerian-circuit", name: "Eulerian Circuit", type: "subtopic", parentId: "advanced-graphs" },
        { id: "hamiltonian-path", name: "Hamiltonian Path", type: "subtopic", parentId: "advanced-graphs" },
        { id: "hamiltonian-cycle", name: "Hamiltonian Cycle", type: "subtopic", parentId: "advanced-graphs" },
        {
          id: "network-flow",
          name: "Network Flow",
          type: "subtopic",
          parentId: "advanced-graphs",
          children: [
            { id: "max-flow", name: "Max Flow", type: "technique", parentId: "network-flow" },
            { id: "min-cut", name: "Min Cut", type: "technique", parentId: "network-flow" },
            { id: "ford-fulkerson", name: "Ford-Fulkerson", type: "technique", parentId: "network-flow" },
            { id: "dinic-alg", name: "Dinic", type: "technique", parentId: "network-flow" },
          ],
        },
        { id: "bipartite-matching", name: "Bipartite Matching", type: "subtopic", parentId: "advanced-graphs" },
        { id: "hopcroft-karp", name: "Hopcroft-Karp", type: "subtopic", parentId: "advanced-graphs" },
        { id: "advanced-graph-decomposition", name: "Advanced Graph Decomposition", type: "subtopic", parentId: "advanced-graphs" },
      ],
    },

    // --------------------------------------------------
    // U. RECURSION
    // --------------------------------------------------
    {
      id: "recursion",
      name: "Recursion",
      type: "topic",
      parentId: "dsa-root",
      description: "Self-referential state definitions, recursive call frames, and tree branches.",
      children: [
        { id: "basic-recursion", name: "Basic Recursion", type: "subtopic", parentId: "recursion" },
        { id: "recursive-traversal", name: "Recursive Traversal", type: "subtopic", parentId: "recursion" },
        { id: "tree-recursion", name: "Tree Recursion", type: "subtopic", parentId: "recursion" },
        { id: "divide-conquer-rec", name: "Divide and Conquer", type: "subtopic", parentId: "recursion" },
        { id: "recursive-state", name: "Recursive State", type: "subtopic", parentId: "recursion" },
      ],
    },

    // --------------------------------------------------
    // V. BACKTRACKING
    // --------------------------------------------------
    {
      id: "backtracking",
      name: "Backtracking",
      type: "topic",
      parentId: "dsa-root",
      description: "Systematic depth-first combinatorial search with state undoing upon constraint failure.",
      children: [
        { id: "bt-subsets", name: "Subsets", type: "subtopic", parentId: "backtracking" },
        { id: "bt-subsequences", name: "Subsequences", type: "subtopic", parentId: "backtracking" },
        { id: "bt-permutations", name: "Permutations", type: "subtopic", parentId: "backtracking" },
        { id: "bt-combinations", name: "Combinations", type: "subtopic", parentId: "backtracking" },
        { id: "combination-sum", name: "Combination Sum", type: "subtopic", parentId: "backtracking" },
        { id: "bt-partitioning", name: "Partitioning", type: "subtopic", parentId: "backtracking" },
        { id: "palindrome-partition", name: "Palindrome Partition", type: "subtopic", parentId: "backtracking" },
        { id: "n-queens", name: "N-Queens", type: "subtopic", parentId: "backtracking" },
        { id: "sudoku-solver", name: "Sudoku", type: "subtopic", parentId: "backtracking" },
        { id: "word-search-bt", name: "Word Search", type: "subtopic", parentId: "backtracking" },
        { id: "constraint-satisfaction", name: "Constraint Satisfaction", type: "subtopic", parentId: "backtracking" },
      ],
    },

    // --------------------------------------------------
    // W. DIVIDE AND CONQUER
    // --------------------------------------------------
    {
      id: "divide-and-conquer",
      name: "Divide and Conquer",
      type: "topic",
      parentId: "dsa-root",
      description: "Subproblem splitting, independent recursive resolution, and linear recombination.",
      children: [
        { id: "dc-binary-search", name: "Binary Search", type: "subtopic", parentId: "divide-and-conquer" },
        { id: "dc-merge-sort", name: "Merge Sort", type: "subtopic", parentId: "divide-and-conquer" },
        { id: "dc-quick-sort", name: "Quick Sort", type: "subtopic", parentId: "divide-and-conquer" },
        { id: "inversion-count", name: "Inversion Count", type: "subtopic", parentId: "divide-and-conquer" },
        { id: "fast-exponentiation", name: "Fast Exponentiation", type: "subtopic", parentId: "divide-and-conquer" },
        { id: "dc-optimization", name: "Divide and Conquer Optimization", type: "subtopic", parentId: "divide-and-conquer" },
      ],
    },

    // --------------------------------------------------
    // X. GREEDY
    // --------------------------------------------------
    {
      id: "greedy",
      name: "Greedy",
      type: "topic",
      parentId: "dsa-root",
      description: "Locally optimal decision making producing provable globally optimal outcomes.",
      children: [
        { id: "activity-selection", name: "Activity Selection", type: "subtopic", parentId: "greedy" },
        { id: "interval-scheduling", name: "Interval Scheduling", type: "subtopic", parentId: "greedy" },
        { id: "fractional-knapsack", name: "Fractional Knapsack", type: "subtopic", parentId: "greedy" },
        { id: "job-sequencing", name: "Job Sequencing", type: "subtopic", parentId: "greedy" },
        { id: "jump-game", name: "Jump Game", type: "subtopic", parentId: "greedy" },
        { id: "gas-station", name: "Gas Station", type: "subtopic", parentId: "greedy" },
        { id: "huffman-coding", name: "Huffman Coding", type: "subtopic", parentId: "greedy" },
        { id: "meeting-rooms-greedy", name: "Meeting Rooms", type: "subtopic", parentId: "greedy" },
        { id: "sorting-greedy", name: "Sorting + Greedy", type: "subtopic", parentId: "greedy" },
        { id: "heap-greedy", name: "Heap + Greedy", type: "subtopic", parentId: "greedy" },
      ],
    },

    // --------------------------------------------------
    // Y. DYNAMIC PROGRAMMING
    // --------------------------------------------------
    {
      id: "dynamic-programming",
      name: "Dynamic Programming",
      type: "topic",
      parentId: "dsa-root",
      description: "Optimal substructure and overlapping subproblems solved via memoization and tabulation.",
      children: [
        {
          id: "dp-fundamentals",
          name: "DP Fundamentals",
          type: "subtopic",
          parentId: "dynamic-programming",
          children: [
            { id: "dp-state", name: "State", type: "technique", parentId: "dp-fundamentals" },
            { id: "dp-transition", name: "Transition", type: "technique", parentId: "dp-fundamentals" },
            { id: "dp-base-case", name: "Base Case", type: "technique", parentId: "dp-fundamentals" },
            { id: "dp-memoization", name: "Memoization", type: "technique", parentId: "dp-fundamentals" },
            { id: "dp-tabulation", name: "Tabulation", type: "technique", parentId: "dp-fundamentals" },
            { id: "dp-space-opt", name: "Space Optimization", type: "technique", parentId: "dp-fundamentals" },
          ],
        },
        { id: "1d-dp", name: "1D DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "2d-dp", name: "2D DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "grid-dp", name: "Grid DP", type: "subtopic", parentId: "dynamic-programming" },
        {
          id: "knapsack-dp",
          name: "Knapsack",
          type: "subtopic",
          parentId: "dynamic-programming",
          children: [
            { id: "0-1-knapsack", name: "0/1 Knapsack", type: "technique", parentId: "knapsack-dp" },
            { id: "unbounded-knapsack", name: "Unbounded Knapsack", type: "technique", parentId: "knapsack-dp" },
            { id: "subset-sum-dp", name: "Subset Sum", type: "technique", parentId: "knapsack-dp" },
            { id: "partition-dp", name: "Partition", type: "technique", parentId: "knapsack-dp" },
            { id: "coin-change-dp", name: "Coin Change", type: "technique", parentId: "knapsack-dp" },
          ],
        },
        { id: "lis-dp", name: "LIS (Longest Increasing Subsequence)", type: "subtopic", parentId: "dynamic-programming" },
        { id: "lcs-dp", name: "LCS (Longest Common Subsequence)", type: "subtopic", parentId: "dynamic-programming" },
        { id: "string-dp", name: "String DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "edit-distance-dp", name: "Edit Distance", type: "subtopic", parentId: "dynamic-programming" },
        { id: "palindrome-dp", name: "Palindrome DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "word-break-dp", name: "Word Break", type: "subtopic", parentId: "dynamic-programming" },
        { id: "interval-dp", name: "Interval DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "tree-dp-section", name: "Tree DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "graph-dp-section", name: "Graph DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "bitmask-dp-section", name: "Bitmask DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "digit-dp", name: "Digit DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "state-machine-dp", name: "State Machine DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "probability-dp-section", name: "Probability DP", type: "subtopic", parentId: "dynamic-programming" },
        { id: "dp-optimization-general", name: "DP Optimization", type: "subtopic", parentId: "dynamic-programming" },
      ],
    },

    // --------------------------------------------------
    // Z. BIT MANIPULATION
    // --------------------------------------------------
    {
      id: "bit-manipulation",
      name: "Bit Manipulation",
      type: "topic",
      parentId: "dsa-root",
      description: "Binary operations, register arithmetic, bit masks, and low-level parity logic.",
      children: [
        { id: "bit-and", name: "AND", type: "subtopic", parentId: "bit-manipulation" },
        { id: "bit-or", name: "OR", type: "subtopic", parentId: "bit-manipulation" },
        { id: "bit-xor", name: "XOR", type: "subtopic", parentId: "bit-manipulation" },
        { id: "bit-not", name: "NOT", type: "subtopic", parentId: "bit-manipulation" },
        { id: "bit-left-shift", name: "Left Shift", type: "subtopic", parentId: "bit-manipulation" },
        { id: "bit-right-shift", name: "Right Shift", type: "subtopic", parentId: "bit-manipulation" },
        { id: "check-bit", name: "Check Bit", type: "subtopic", parentId: "bit-manipulation" },
        { id: "set-bit", name: "Set Bit", type: "subtopic", parentId: "bit-manipulation" },
        { id: "clear-bit", name: "Clear Bit", type: "subtopic", parentId: "bit-manipulation" },
        { id: "toggle-bit", name: "Toggle Bit", type: "subtopic", parentId: "bit-manipulation" },
        { id: "count-set-bits", name: "Count Set Bits", type: "subtopic", parentId: "bit-manipulation" },
        { id: "power-of-two", name: "Power of Two", type: "subtopic", parentId: "bit-manipulation" },
        { id: "xor-patterns", name: "XOR Patterns", type: "subtopic", parentId: "bit-manipulation" },
        { id: "bitmasking-sub", name: "Bitmasking", type: "subtopic", parentId: "bit-manipulation" },
        { id: "bitwise-trie", name: "Bitwise Trie", type: "subtopic", parentId: "bit-manipulation" },
      ],
    },

    // --------------------------------------------------
    // AA. STRING ALGORITHMS
    // --------------------------------------------------
    {
      id: "string-algorithms",
      name: "String Algorithms",
      type: "topic",
      parentId: "dsa-root",
      description: "Linear pattern matching, rolling polynomial hashing, suffix automatas, and palindromes.",
      children: [
        { id: "kmp-algorithm", name: "KMP", type: "subtopic", parentId: "string-algorithms" },
        { id: "z-algorithm", name: "Z Algorithm", type: "subtopic", parentId: "string-algorithms" },
        { id: "rabin-karp", name: "Rabin-Karp", type: "subtopic", parentId: "string-algorithms" },
        { id: "rolling-hash", name: "Rolling Hash", type: "subtopic", parentId: "string-algorithms" },
        { id: "manachers-algorithm", name: "Manacher's Algorithm", type: "subtopic", parentId: "string-algorithms" },
        { id: "aho-corasick", name: "Aho-Corasick", type: "subtopic", parentId: "string-algorithms" },
        { id: "suffix-array", name: "Suffix Array", type: "subtopic", parentId: "string-algorithms" },
        { id: "suffix-tree", name: "Suffix Tree", type: "subtopic", parentId: "string-algorithms" },
        { id: "suffix-automaton", name: "Suffix Automaton", type: "subtopic", parentId: "string-algorithms" },
        { id: "lcp-array", name: "LCP", type: "subtopic", parentId: "string-algorithms" },
      ],
    },

    // --------------------------------------------------
    // AB. MATHEMATICS
    // --------------------------------------------------
    {
      id: "mathematics",
      name: "Mathematics",
      type: "topic",
      parentId: "dsa-root",
      description: "Arithmetic principles, recurrence relations, fast matrix exponentiation, and discrete logic.",
      children: [
        { id: "math-gcd", name: "GCD", type: "subtopic", parentId: "mathematics" },
        { id: "math-lcm", name: "LCM", type: "subtopic", parentId: "mathematics" },
        { id: "modular-arithmetic", name: "Modular Arithmetic", type: "subtopic", parentId: "mathematics" },
        { id: "fast-power", name: "Fast Power", type: "subtopic", parentId: "mathematics" },
        { id: "matrix-exponentiation", name: "Matrix Exponentiation", type: "subtopic", parentId: "mathematics" },
        { id: "combinatorial-mathematics", name: "Combinatorial Mathematics", type: "subtopic", parentId: "mathematics" },
        { id: "recurrence-relations", name: "Recurrence Relations", type: "subtopic", parentId: "mathematics" },
        { id: "mathematical-simulation", name: "Mathematical Simulation", type: "subtopic", parentId: "mathematics" },
      ],
    },

    // --------------------------------------------------
    // AC. NUMBER THEORY
    // --------------------------------------------------
    {
      id: "number-theory",
      name: "Number Theory",
      type: "topic",
      parentId: "dsa-root",
      description: "Primes, modular inverses, totient functions, sieves, and Diophantine equations.",
      children: [
        { id: "prime-numbers", name: "Prime Numbers", type: "subtopic", parentId: "number-theory" },
        { id: "prime-factorization", name: "Prime Factorization", type: "subtopic", parentId: "number-theory" },
        { id: "sieve-eratosthenes", name: "Sieve of Eratosthenes", type: "subtopic", parentId: "number-theory" },
        { id: "segmented-sieve", name: "Segmented Sieve", type: "subtopic", parentId: "number-theory" },
        { id: "divisors-count", name: "Divisors", type: "subtopic", parentId: "number-theory" },
        { id: "extended-euclidean", name: "Extended Euclidean Algorithm", type: "subtopic", parentId: "number-theory" },
        { id: "modular-inverse", name: "Modular Inverse", type: "subtopic", parentId: "number-theory" },
        { id: "euler-totient", name: "Euler Totient", type: "subtopic", parentId: "number-theory" },
        { id: "fermats-little-theorem", name: "Fermat's Little Theorem", type: "subtopic", parentId: "number-theory" },
        { id: "chinese-remainder-theorem", name: "Chinese Remainder Theorem", type: "subtopic", parentId: "number-theory" },
        { id: "mobius-function", name: "Möbius Function", type: "subtopic", parentId: "number-theory" },
        { id: "diophantine-equations", name: "Diophantine Equations", type: "subtopic", parentId: "number-theory" },
      ],
    },

    // --------------------------------------------------
    // AD. COMBINATORICS
    // --------------------------------------------------
    {
      id: "combinatorics",
      name: "Combinatorics",
      type: "topic",
      parentId: "dsa-root",
      description: "Permutations, partitions, Catalan numbers, generating functions, and counting rules.",
      children: [
        {
          id: "counting-principles",
          name: "Counting Principles",
          type: "subtopic",
          parentId: "combinatorics",
          children: [
            { id: "addition-rule", name: "Addition Rule", type: "technique", parentId: "counting-principles" },
            { id: "multiplication-rule", name: "Multiplication Rule", type: "technique", parentId: "counting-principles" },
            { id: "complement-counting", name: "Complement Counting", type: "technique", parentId: "counting-principles" },
          ],
        },
        { id: "comb-permutations", name: "Permutations", type: "subtopic", parentId: "combinatorics" },
        { id: "comb-combinations", name: "Combinations", type: "subtopic", parentId: "combinatorics" },
        { id: "binomial-coefficients", name: "Binomial Coefficients", type: "subtopic", parentId: "combinatorics" },
        { id: "pascal-triangle", name: "Pascal Triangle", type: "subtopic", parentId: "combinatorics" },
        { id: "multiset-combinations", name: "Multiset Combinations", type: "subtopic", parentId: "combinatorics" },
        { id: "stars-and-bars", name: "Stars and Bars", type: "subtopic", parentId: "combinatorics" },
        { id: "inclusion-exclusion", name: "Inclusion-Exclusion", type: "subtopic", parentId: "combinatorics" },
        { id: "pigeonhole-principle", name: "Pigeonhole Principle", type: "subtopic", parentId: "combinatorics" },
        { id: "catalan-numbers", name: "Catalan Numbers", type: "subtopic", parentId: "combinatorics" },
        { id: "derangements-comb", name: "Derangements", type: "subtopic", parentId: "combinatorics" },
        { id: "bell-numbers", name: "Bell Numbers", type: "subtopic", parentId: "combinatorics" },
        { id: "stirling-numbers", name: "Stirling Numbers", type: "subtopic", parentId: "combinatorics" },
        { id: "integer-partitions", name: "Integer Partitions", type: "subtopic", parentId: "combinatorics" },
        { id: "comb-recurrence", name: "Recurrence Relations", type: "subtopic", parentId: "combinatorics" },
        { id: "generating-functions", name: "Generating Functions", type: "subtopic", parentId: "combinatorics" },
        { id: "combinatorics-dp", name: "Combinatorics + DP", type: "subtopic", parentId: "combinatorics" },
      ],
    },

    // --------------------------------------------------
    // AE. PROBABILITY
    // --------------------------------------------------
    {
      id: "probability",
      name: "Probability",
      type: "topic",
      parentId: "dsa-root",
      description: "Conditional probability, expected values, linearity of expectation, and randomized analysis.",
      children: [
        { id: "basic-probability", name: "Basic Probability", type: "subtopic", parentId: "probability" },
        { id: "conditional-probability", name: "Conditional Probability", type: "subtopic", parentId: "probability" },
        { id: "expected-value", name: "Expected Value", type: "subtopic", parentId: "probability" },
        { id: "linearity-of-expectation", name: "Linearity of Expectation", type: "subtopic", parentId: "probability" },
        { id: "random-variables", name: "Random Variables", type: "subtopic", parentId: "probability" },
        { id: "combinatorial-probability", name: "Combinatorial Probability", type: "subtopic", parentId: "probability" },
        { id: "probability-dp", name: "Probability DP", type: "subtopic", parentId: "probability" },
      ],
    },

    // --------------------------------------------------
    // AF. GEOMETRY
    // --------------------------------------------------
    {
      id: "geometry",
      name: "Geometry",
      type: "topic",
      parentId: "dsa-root",
      description: "Planar geometry, vectors, orientation tests, convex hull, and sweep line intersections.",
      children: [
        { id: "geom-points", name: "Points", type: "subtopic", parentId: "geometry" },
        { id: "geom-lines", name: "Lines", type: "subtopic", parentId: "geometry" },
        { id: "geom-distance", name: "Distance", type: "subtopic", parentId: "geometry" },
        { id: "geom-slope", name: "Slope", type: "subtopic", parentId: "geometry" },
        { id: "geom-dot-product", name: "Dot Product", type: "subtopic", parentId: "geometry" },
        { id: "geom-cross-product", name: "Cross Product", type: "subtopic", parentId: "geometry" },
        { id: "geom-orientation", name: "Orientation", type: "subtopic", parentId: "geometry" },
        { id: "line-intersection", name: "Line Intersection", type: "subtopic", parentId: "geometry" },
        { id: "segment-intersection", name: "Segment Intersection", type: "subtopic", parentId: "geometry" },
        { id: "polygon-geometry", name: "Polygon", type: "subtopic", parentId: "geometry" },
        { id: "polygon-area", name: "Area", type: "subtopic", parentId: "geometry" },
        { id: "convex-hull", name: "Convex Hull", type: "subtopic", parentId: "geometry" },
        { id: "sweep-line-geom", name: "Sweep Line", type: "subtopic", parentId: "geometry" },
      ],
    },

    // --------------------------------------------------
    // AG. BITMASKING
    // --------------------------------------------------
    {
      id: "bitmasking",
      name: "Bitmasking",
      type: "topic",
      parentId: "dsa-root",
      description: "Submask enumeration, traveling salesperson, state compression, and exponential space reduction.",
      children: [
        { id: "set-representation-bm", name: "Set Representation", type: "subtopic", parentId: "bitmasking" },
        { id: "add-element-bm", name: "Add Element", type: "subtopic", parentId: "bitmasking" },
        { id: "remove-element-bm", name: "Remove Element", type: "subtopic", parentId: "bitmasking" },
        { id: "toggle-element-bm", name: "Toggle Element", type: "subtopic", parentId: "bitmasking" },
        { id: "check-element-bm", name: "Check Element", type: "subtopic", parentId: "bitmasking" },
        { id: "enumerate-subsets", name: "Enumerate Subsets", type: "subtopic", parentId: "bitmasking" },
        { id: "enumerate-submasks", name: "Enumerate Submasks", type: "subtopic", parentId: "bitmasking" },
        { id: "subset-dp", name: "Subset DP", type: "subtopic", parentId: "bitmasking" },
        { id: "tsp-bitmask", name: "TSP", type: "subtopic", parentId: "bitmasking" },
        { id: "bitmask-backtracking", name: "Bitmask + Backtracking", type: "subtopic", parentId: "bitmasking" },
      ],
    },

    // --------------------------------------------------
    // AH. GAME THEORY
    // --------------------------------------------------
    {
      id: "game-theory",
      name: "Game Theory",
      type: "topic",
      parentId: "dsa-root",
      description: "Impartial games, winning/losing states, Sprague-Grundy theorem, and minimax pruning.",
      children: [
        { id: "winning-losing-states", name: "Winning / Losing States", type: "subtopic", parentId: "game-theory" },
        { id: "nim-game", name: "Nim", type: "subtopic", parentId: "game-theory" },
        { id: "grundy-numbers", name: "Grundy Numbers", type: "subtopic", parentId: "game-theory" },
        { id: "sprague-grundy", name: "Sprague-Grundy", type: "subtopic", parentId: "game-theory" },
        { id: "minimax-alg", name: "Minimax", type: "subtopic", parentId: "game-theory" },
        { id: "alpha-beta-pruning", name: "Alpha-Beta Pruning", type: "subtopic", parentId: "game-theory" },
        { id: "game-dp", name: "Game DP", type: "subtopic", parentId: "game-theory" },
      ],
    },

    // --------------------------------------------------
    // AI. RANDOMIZED ALGORITHMS
    // --------------------------------------------------
    {
      id: "randomized-algorithms",
      name: "Randomized Algorithms",
      type: "topic",
      parentId: "dsa-root",
      description: "Monte Carlo and Las Vegas paradigms, randomized pivots, and reservoir sampling.",
      children: [
        { id: "randomized-quicksort", name: "Randomized QuickSort", type: "subtopic", parentId: "randomized-algorithms" },
        { id: "randomized-selection", name: "Randomized Selection", type: "subtopic", parentId: "randomized-algorithms" },
        { id: "reservoir-sampling", name: "Reservoir Sampling", type: "subtopic", parentId: "randomized-algorithms" },
        { id: "randomized-hashing", name: "Randomized Hashing", type: "subtopic", parentId: "randomized-algorithms" },
        { id: "monte-carlo-las-vegas", name: "Monte Carlo / Las Vegas", type: "subtopic", parentId: "randomized-algorithms" },
      ],
    },

    // --------------------------------------------------
    // AJ. RANGE QUERY / OFFLINE TECHNIQUES
    // --------------------------------------------------
    {
      id: "range-queries",
      name: "Range Queries",
      type: "topic",
      parentId: "dsa-root",
      description: "Sqrt decomposition, Mo's offline query algorithm, wavelet trees, and coordinate compression.",
      children: [
        { id: "rq-prefix-sum", name: "Prefix Sum", type: "subtopic", parentId: "range-queries" },
        { id: "rq-diff-array", name: "Difference Array", type: "subtopic", parentId: "range-queries" },
        { id: "rq-fenwick", name: "Fenwick Tree", type: "subtopic", parentId: "range-queries" },
        { id: "rq-segment-tree", name: "Segment Tree", type: "subtopic", parentId: "range-queries" },
        { id: "rq-lazy-seg-tree", name: "Lazy Segment Tree", type: "subtopic", parentId: "range-queries" },
        { id: "rq-sparse-table", name: "Sparse Table", type: "subtopic", parentId: "range-queries" },
        { id: "sqrt-decomposition", name: "Sqrt Decomposition", type: "subtopic", parentId: "range-queries" },
        { id: "mos-algorithm", name: "Mo's Algorithm", type: "subtopic", parentId: "range-queries" },
        { id: "wavelet-tree-sub", name: "Wavelet Tree", type: "subtopic", parentId: "range-queries" },
        { id: "coordinate-compression", name: "Coordinate Compression", type: "subtopic", parentId: "range-queries" },
        { id: "offline-queries", name: "Offline Queries", type: "subtopic", parentId: "range-queries" },
      ],
    },

    // --------------------------------------------------
    // AK. ADVANCED / SPECIALIZED
    // --------------------------------------------------
    {
      id: "advanced-dsa",
      name: "Advanced DSA",
      type: "topic",
      parentId: "dsa-root",
      description: "Persistent data structures, Link-Cut trees, FFT, NTT, and specialized dynamic programming geometry.",
      children: [
        { id: "persistent-segment-tree", name: "Persistent Segment Tree", type: "subtopic", parentId: "advanced-dsa" },
        { id: "persistent-trie", name: "Persistent Trie", type: "subtopic", parentId: "advanced-dsa" },
        { id: "wavelet-tree-adv", name: "Wavelet Tree", type: "subtopic", parentId: "advanced-dsa" },
        { id: "link-cut-tree", name: "Link-Cut Tree", type: "subtopic", parentId: "advanced-dsa" },
        { id: "convex-hull-trick", name: "Convex Hull Trick", type: "subtopic", parentId: "advanced-dsa" },
        { id: "li-chao-tree", name: "Li Chao Tree", type: "subtopic", parentId: "advanced-dsa" },
        { id: "fft-algorithm", name: "FFT", type: "subtopic", parentId: "advanced-dsa" },
        { id: "ntt-algorithm", name: "NTT", type: "subtopic", parentId: "advanced-dsa" },
        { id: "adv-dp-optimization", name: "Advanced DP Optimization", type: "subtopic", parentId: "advanced-dsa" },
        { id: "sos-dp", name: "SOS DP", type: "subtopic", parentId: "advanced-dsa" },
        { id: "profile-dp", name: "Profile DP", type: "subtopic", parentId: "advanced-dsa" },
      ],
    },
  ],
};

// =========================================================================
// HELPER UTILITIES FOR TAXONOMY TRAVERSAL AND SEARCH
// =========================================================================

export function flattenDsaTree(node: DsaNode = DSA_TREE_DATA, path: string[] = []): Array<{ node: DsaNode; path: string[]; depth: number }> {
  const currentPath = [...path, node.name];
  const result: Array<{ node: DsaNode; path: string[]; depth: number }> = [{ node, path: currentPath, depth: path.length }];
  if (node.children && node.children.length > 0) {
    for (const child of node.children) {
      result.push(...flattenDsaTree(child, currentPath));
    }
  }
  return result;
}

export function findNodeById(id: string, node: DsaNode = DSA_TREE_DATA): DsaNode | null {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeById(id, child);
      if (found) return found;
    }
  }
  return null;
}

export function getAncestorIds(targetId: string, node: DsaNode = DSA_TREE_DATA, currentAncestors: string[] = []): string[] | null {
  if (node.id === targetId) {
    return currentAncestors;
  }
  if (node.children) {
    for (const child of node.children) {
      const result = getAncestorIds(targetId, child, [...currentAncestors, node.id]);
      if (result) return result;
    }
  }
  return null;
}

export function searchDsaNodes(query: string, node: DsaNode = DSA_TREE_DATA): Array<{ node: DsaNode; path: string[]; ancestors: string[] }> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const results: Array<{ node: DsaNode; path: string[]; ancestors: string[] }> = [];
  const flat = flattenDsaTree(node);

  for (const item of flat) {
    if (item.node.id === "dsa-root") continue;
    const nameMatch = item.node.name.toLowerCase().includes(cleanQuery);
    const descMatch = item.node.description?.toLowerCase().includes(cleanQuery);
    if (nameMatch || descMatch) {
      const ancestors = getAncestorIds(item.node.id, node) || [];
      results.push({ node: item.node, path: item.path, ancestors });
    }
  }

  return results;
}

export function countTotalNodes(node: DsaNode = DSA_TREE_DATA): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countTotalNodes(child);
    }
  }
  return count;
}
