import type { Graph } from "@graph/types";
import type { GraphSettings } from "@graph/settings";

type BoolSettingsKeys = {
  [K in keyof GraphSettings]: GraphSettings[K] extends boolean ? K : never;
}[keyof GraphSettings];

export const usePluginHoldController = (graph: Graph) => {
  /**
   * maps the setting to the number of holds currently active
   */
  const holdCountMap: Map<BoolSettingsKeys, number> = new Map();
  /**
   * couples together the hold id with a setting. ensures idepotency
   * when invoking hold on a particular setting
   */
  const holdIdSet: Set<`${string}-${BoolSettingsKeys}`> = new Set();

  const usePluginHold = (holdId: string) => {
    const hold = (setting: BoolSettingsKeys) => {
      const holdAlreadyActive = holdIdSet.has(`${holdId}-${setting}`);
      if (holdAlreadyActive) return;

      const currentHolds = holdCountMap.get(setting) ?? 0;
      if (currentHolds === 0) graph.settings.value[setting] = false;

      holdCountMap.set(setting, currentHolds + 1);
      holdIdSet.add(`${holdId}-${setting}`);
    }

    const release = (setting: BoolSettingsKeys) => {
      const currentHolds = holdCountMap.get(setting) ?? 0;
      if (currentHolds === 0) return;
      if (currentHolds === 1) graph.settings.value[setting] = true;

      holdCountMap.set(setting, currentHolds - 1);
      holdIdSet.delete(`${holdId}-${setting}`);
    }

    return { 
      hold,
      release,
    }
  }

  return usePluginHold;
}