import type { Graph } from "@graph/types";
import { GRAPH_BUTTON_ID } from "@graph/buttons/types";
import type { GraphPlaygroundButton } from "@graph/buttons/types";
import { useBFSColorizer } from "@product/search-visualizer/useBFSColorizer";
import { getRandomInRange } from "@utils/random";
import colors from "@utils/colors";

/**
 * a one stop shop for the dials you need to control your graph
 *
 * @param graph the graph instance to control
 * @returns a set of buttons that can be added to the graph toolbar
 */
export const useGraphBtns = (graph: Graph) => {

  const reset: GraphPlaygroundButton = {
    label: () => 'Reset',
    action: () => graph.reset(),
    color: () => colors.RED_600,
    id: GRAPH_BUTTON_ID.reset,
  };

  const toggleDraggable: GraphPlaygroundButton = {
    label: () => graph.settings.value.draggable ? 'Draggable' : 'Not Draggable',
    action: () => graph.settings.value.draggable = !graph.settings.value.draggable,
    color: () => graph.settings.value.draggable ? colors.GREEN_600 : colors.ORANGE_600,
    id: GRAPH_BUTTON_ID.draggable,
  };

  const toggleNodeAnchors: GraphPlaygroundButton = {
    label: () => graph.settings.value.nodeAnchors ? 'Anchors' : 'No Anchors',
    action: () => graph.settings.value.nodeAnchors = !graph.settings.value.nodeAnchors,
    color: () => graph.settings.value.nodeAnchors ? colors.GREEN_600 : colors.ORANGE_600,
    id: GRAPH_BUTTON_ID.nodeAnchors,
  };

  const toggleEdgeLabelDisplay: GraphPlaygroundButton = {
    label: () => graph.settings.value.displayEdgeLabels ? 'Edge Labels' : 'No Edge Labels',
    action: () => graph.settings.value.displayEdgeLabels = !graph.settings.value.displayEdgeLabels,
    color: () => graph.settings.value.displayEdgeLabels ? colors.GREEN_600 : colors.ORANGE_600,
    id: GRAPH_BUTTON_ID.edgeLabels,
  };

  const toggleEdgeLabelsEditable: GraphPlaygroundButton = {
    label: () => graph.settings.value.edgeLabelsEditable ? 'Edge Labels Editable' : 'Edge Labels Not Editable',
    action: () => graph.settings.value.edgeLabelsEditable = !graph.settings.value.edgeLabelsEditable,
    color: () => graph.settings.value.edgeLabelsEditable ? colors.GREEN_600 : colors.ORANGE_600,
    id: GRAPH_BUTTON_ID.edgeLabelsEditable,
  };

  const changeStorageKey: GraphPlaygroundButton = {
    label: () => {
      const { persistentStorageKey } = graph.settings.value;
      return `Change Storage Key (${persistentStorageKey})`;
    },
    action: () => {
      const { persistentStorageKey } = graph.settings.value;
      const newStorageKey = persistentStorageKey === 'graph' ? 'graph2' : 'graph';
      graph.settings.value.persistentStorageKey = newStorageKey;
    },
    color: () => colors.PURPLE_600,
    id: GRAPH_BUTTON_ID.storageKey,
  };

  const clearLocalStorage: GraphPlaygroundButton = {
    label: () => 'Clear Local Storage',
    action: () => localStorage.clear(),
    color: () => colors.RED_600,
    id: GRAPH_BUTTON_ID.clearLocalStorage,
  };

  const persistentGraphClone: GraphPlaygroundButton = {
    label: () => 'Clone Search Visualizer Graph',
    action: () => {
      graph.settings.value.persistentStorageKey = 'search-visualizer-graph'
    },
    color: () => colors.AMBER_600,
    id: GRAPH_BUTTON_ID.persistentGraphClone,
  };

  const log: GraphPlaygroundButton = {
    label: () => 'Log',
    action: () => {},
    color: () => colors.BLUE_600,
    id: GRAPH_BUTTON_ID.log,
  };

  const { toggleColorize, isColorized, startNode } = useBFSColorizer(graph);

  const bfsColorize: GraphPlaygroundButton = {
    label: () => {
      const startText = 'Colorize';
      const node = graph.getNode(startNode.value!);
      const stopText = `Stop Colorizing (${node?.label})`;
      return isColorized.value ? stopText : startText;
    },
    color: () => isColorized.value ? colors.GREEN_600 : colors.BLUE_600,
    action: toggleColorize,
    id: "toggle-bfs-colorize",
  };

  const btnObj = {
    reset,
    clearLocalStorage,

    // base
    toggleEdgeLabelDisplay,
    toggleEdgeLabelsEditable,

    // draggable
    toggleDraggable,

    // node anchor
    toggleNodeAnchors,

    // persistent
    changeStorageKey,
    persistentGraphClone,

    // search visualizer - product
    bfsColorize,

    log,
  };

  const btnArr = Object.values(btnObj);

  return {
    ...btnObj,
    btnArr,
  }
};