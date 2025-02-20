import type { GraphSettings } from '@graph/settings';

/**
 * settings for basic search useGraph instance
 */
export const BINARY_TREE_GRAPH_SETTINGS: Partial<GraphSettings> = {
  persistentStorageKey: 'binary-trees',
  interactive: false,
  displayEdgeLabels: false,
};
