import type { GraphSettings } from "@graph/settings";

export const FLOW_GRAPH_SETTINGS: Partial<GraphSettings> = {
  persistent: true,
  persistentStorageKey: 'network-flow',
  userEditableAddedEdgeLabel: '5',
  edgeInputToLabel: (input) => {
    const num = Number(input);
    const isValid = !isNaN(num) && num >= 0 && num < 100;
    return isValid ? input : undefined;
  }
};