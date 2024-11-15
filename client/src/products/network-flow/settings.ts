import type { GraphSettings } from "@graph/settings";

/**
 * settings for Network Flow useGraph instance
 */
export const FLOW_GRAPH_SETTINGS: Partial<GraphSettings> = {
  persistent: true,
  persistentStorageKey: 'network-flow',
  userAddedEdgeLabel: '5',
  userAddedEdgeRuleNoSelfLoops: true,
  userAddedEdgeRuleOneEdgePerPath: true,
  edgeInputToLabel: (input) => {
    const num = Number(input);
    const isValid = !isNaN(num) && num >= 0 && num < 100;
    return isValid ? input : undefined;
  }
};