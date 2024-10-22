import { isObject } from "@vueuse/core";
import type { Graph } from "./useGraph/useGraph";
import { computed } from "vue";
import { resolveEditSettings } from "./useGraph/useUserEditableGraph";
import { getRandomInRange } from "./useGraph/helpers";

/**
 * @describes a button that can be added to the graph toolbar
 */
export type GButton = {
  cond?: () => boolean,
  label: () => string,
  action: () => void,
  color: () => string,
}

/**
 * a one stop shop for the dials you need to control your graph
 *
 * @param graph the graph instance to control
 * @returns a set of buttons that can be added to the graph toolbar
 */
export const useGraphBtns = (graph: Graph) => {

  const toggleEdgeTypeAction = () => {
    const editSettings = resolveEditSettings(graph.settings.value.userEditable);
    if (!editSettings) return;
    graph.settings.value.userEditable = {
      ...editSettings,
      addedEdgeType: editSettings.addedEdgeType === 'directed' ? 'undirected' : 'directed',
    }
  }

  const settings = computed(() => graph.settings.value);
  const userEditSettings = computed(() => settings.value.userEditable);
  const persistSettings = computed(() => settings.value.persistent);

  const storageKey = computed(() => {
    if (isObject(persistSettings.value)) {
      return persistSettings.value.storageKey;
    } else {
      return 'graph';
    }
  });

  const addedEdgeType = computed(() => {
    const editSettings = resolveEditSettings(userEditSettings.value);
    if (!editSettings) return null;
    return editSettings.addedEdgeType;
  });

  const reset: GButton = {
    label: () => 'Reset',
    action: () => graph.reset(),
    color: () => 'red',
  };

  const toggleDraggable: GButton = {
    label: () => graph.settings.value.draggable ? 'Draggable' : 'Not Draggable',
    action: () => graph.settings.value.draggable = !graph.settings.value.draggable,
    color: () => graph.settings.value.draggable ? 'green' : 'orange',
  };

  const toggleNodeAnchors: GButton = {
    label: () => graph.settings.value.nodeAnchors ? 'Anchors' : 'No Anchors',
    action: () => graph.settings.value.nodeAnchors = !graph.settings.value.nodeAnchors,
    color: () => graph.settings.value.nodeAnchors ? 'green' : 'orange',
  };

  const toggleEdgeLabelDisplay: GButton = {
    label: () => graph.settings.value.displayEdgeLabels ? 'Edge Labels' : 'No Edge Labels',
    action: () => graph.settings.value.displayEdgeLabels = !graph.settings.value.displayEdgeLabels,
    color: () => graph.settings.value.displayEdgeLabels ? 'green' : 'orange',
  };

  const toggleEdgeLabelsEditable: GButton = {
    label: () => graph.settings.value.edgeLabelsEditable ? 'Edge Labels Editable' : 'Edge Labels Not Editable',
    action: () => graph.settings.value.edgeLabelsEditable = !graph.settings.value.edgeLabelsEditable,
    color: () => graph.settings.value.edgeLabelsEditable ? 'green' : 'orange',
  };

  const toggleUserEditable: GButton = {
    label: () => graph.settings.value.userEditable ? 'Editable' : 'Not Editable',
    action: () => graph.settings.value.userEditable = !graph.settings.value.userEditable,
    color: () => graph.settings.value.userEditable ? 'green' : 'orange',
  };

  const toggleEdgeType: GButton = {
    cond: () => !!graph.settings.value.userEditable,
    label: () => addedEdgeType.value === 'directed' ? 'Directed' : 'Undirected',
    action: toggleEdgeTypeAction,
    color: () => addedEdgeType.value === 'directed' ? 'blue' : 'purple',
  };

  const changeEdgeWeight: GButton = {
    cond: () => !!graph.settings.value.userEditable,
    label: () => {
      const editSettings = resolveEditSettings(userEditSettings.value);
      if (!editSettings) return '';
      return `Change Added Edge Weight (${editSettings.addedEdgeWeight})`;
    },
    action: () => {
      const editSettings = resolveEditSettings(userEditSettings.value);
      if (!editSettings) return;
      graph.settings.value.userEditable = {
        ...editSettings,
        addedEdgeWeight: getRandomInRange(1, 10),
      }
    },
    color: () => 'green',
  };

  const changeNodeSize: GButton = {
    label: () => `Change Node Size (${graph.theme.value.nodeSize})`,
    action: () => graph.theme.value.nodeSize = getRandomInRange(20, 50),
    color: () => 'pink',
  };

  const changeStorageKey: GButton = {
    label: () => `Change Storage Key (${storageKey.value})`,
    action: () => {
      // @ts-expect-error
      persistSettings.value.storageKey = storageKey.value === 'graph' ? 'graph2' : 'graph';
    },
    color: () => 'blue',
  };

  const clearLocalStorage: GButton = {
    label: () => 'Clear Local Storage',
    action: () => localStorage.clear(),
    color: () => 'red',
  };

  return {
    // base theme
    changeNodeSize,

    // base settings
    toggleEdgeLabelDisplay,
    toggleEdgeLabelsEditable,

    // base event
    reset,

    // draggable settings
    toggleDraggable,

    // node anchor settings
    toggleNodeAnchors,

    // user editable settings
    toggleUserEditable,
    toggleEdgeType,
    changeEdgeWeight,

    // persistent settings
    changeStorageKey,

    // misc
    clearLocalStorage,
  }
};