import { isObject } from "@vueuse/core";
import type { Graph } from "./useGraph/useGraph";
import { computed } from "vue";

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
    const editSettings = graph.settings.value.userEditable;
    if (isObject(editSettings)) {
      const { addedEdgeType } = editSettings;
      editSettings.addedEdgeType = addedEdgeType === 'directed' ? 'undirected' : 'directed';
    } else {
      graph.settings.value.userEditable = {
        addedEdgeType: 'undirected'
      }
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
    if (isObject(userEditSettings.value)) {
      return userEditSettings.value.addedEdgeType;
    } else {
      return 'directed';
    }
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

  const changeNodeSize: GButton = {
    label: () => 'Change Node Size' + ` (${graph.theme.value.nodeSize})`,
    action: () => graph.theme.value.nodeSize = Math.floor(Math.random() * (50 - 10 + 1)) + 10,
    color: () => 'pink',
  };

  const changeStorageKey: GButton = {
    label: () => 'Change Storage Key ' + ` (${storageKey.value})`,
    action: () => {
      // @ts-expect-error
      persistSettings.value.storageKey = storageKey.value === 'graph' ? 'graph2' : 'graph';
    },
    color: () => 'blue',
  };

  return {
    reset,
    toggleDraggable,
    toggleNodeAnchors,
    toggleEdgeLabelDisplay,
    toggleUserEditable,
    toggleEdgeType,
    changeNodeSize,
    changeStorageKey
  }
};