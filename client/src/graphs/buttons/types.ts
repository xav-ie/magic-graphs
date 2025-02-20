/**
 * the ids for the buttons that can be added to the graph toolbar
 */
export const GRAPH_BUTTON_ID = {
  reset: 'reset',
  draggable: 'draggable',
  nodeAnchors: 'node-anchors',
  edgeLabels: 'edge-labels',
  edgeLabelsEditable: 'edge-labels-editable',
  edgeWeight: 'edge-weight',
  nodeSize: 'node-size',
  storageKey: 'storage-key',
  clearLocalStorage: 'clear-local-storage',
  persistentGraphClone: 'persistent-graph-clone',
  log: 'log',
  bfsColorize: 'toggle-bfs-colorize',
} as const;

type GraphButtonIdMap = typeof GRAPH_BUTTON_ID;
type GraphButtonId = GraphButtonIdMap[keyof GraphButtonIdMap];

/**
 * @describes a button that can be added to the graph toolbar
 */
export type GraphPlaygroundButton = {
  cond?: () => boolean;
  label: () => string;
  action: () => void;
  color: () => string;
  id: GraphButtonId;
};
