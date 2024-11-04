import { computed } from "vue";
import { isObject } from "@vueuse/core";
import type { Graph } from "@graph/types";
import { resolveEditSettings } from "@graph/compositions/useUserEditableGraph";
import { getRandomInRange } from "@graph/helpers";
import { GRAPH_BUTTON_ID } from "@graph/buttons/types";
import type { GButton } from "@graph/buttons/types";
import { useBFSColorizer } from "@product/search-visualizer/useBFSColorizer";

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
    id: GRAPH_BUTTON_ID.reset,
  };

  const toggleDraggable: GButton = {
    label: () => graph.settings.value.draggable ? 'Draggable' : 'Not Draggable',
    action: () => graph.settings.value.draggable = !graph.settings.value.draggable,
    color: () => graph.settings.value.draggable ? 'green' : 'orange',
    id: GRAPH_BUTTON_ID.draggable,
  };

  const toggleNodeAnchors: GButton = {
    label: () => graph.settings.value.nodeAnchors ? 'Anchors' : 'No Anchors',
    action: () => graph.settings.value.nodeAnchors = !graph.settings.value.nodeAnchors,
    color: () => graph.settings.value.nodeAnchors ? 'green' : 'orange',
    id: GRAPH_BUTTON_ID.nodeAnchors,
  };

  const toggleEdgeLabelDisplay: GButton = {
    label: () => graph.settings.value.displayEdgeLabels ? 'Edge Labels' : 'No Edge Labels',
    action: () => graph.settings.value.displayEdgeLabels = !graph.settings.value.displayEdgeLabels,
    color: () => graph.settings.value.displayEdgeLabels ? 'green' : 'orange',
    id: GRAPH_BUTTON_ID.edgeLabels,
  };

  const toggleEdgeLabelsEditable: GButton = {
    label: () => graph.settings.value.edgeLabelsEditable ? 'Edge Labels Editable' : 'Edge Labels Not Editable',
    action: () => graph.settings.value.edgeLabelsEditable = !graph.settings.value.edgeLabelsEditable,
    color: () => graph.settings.value.edgeLabelsEditable ? 'green' : 'orange',
    id: GRAPH_BUTTON_ID.edgeLabelsEditable,
  };

  const toggleUserEditable: GButton = {
    label: () => graph.settings.value.userEditable ? 'Editable' : 'Not Editable',
    action: () => graph.settings.value.userEditable = !graph.settings.value.userEditable,
    color: () => graph.settings.value.userEditable ? 'green' : 'orange',
    id: GRAPH_BUTTON_ID.userEditable,
  };

  const toggleEdgeType: GButton = {
    cond: () => !!graph.settings.value.userEditable,
    label: () => addedEdgeType.value === 'directed' ? 'Directed' : 'Undirected',
    action: toggleEdgeTypeAction,
    color: () => addedEdgeType.value === 'directed' ? 'blue' : 'purple',
    id: GRAPH_BUTTON_ID.edgeType,
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
    id: GRAPH_BUTTON_ID.edgeWeight,
  };

  const changeNodeSize: GButton = {
    label: () => `Change Node Size (${graph.theme.value.nodeSize})`,
    action: () => graph.theme.value.nodeSize = getRandomInRange(20, 50),
    color: () => 'pink',
    id: GRAPH_BUTTON_ID.nodeSize,
  };

  const changeStorageKey: GButton = {
    label: () => `Change Storage Key (${storageKey.value})`,
    action: () => graph.settings.value.persistent = {
      storageKey: storageKey.value === 'graph' ? 'graph2' : 'graph',
    },
    color: () => 'blue',
    id: GRAPH_BUTTON_ID.storageKey,
  };

  const clearLocalStorage: GButton = {
    label: () => 'Clear Local Storage',
    action: () => localStorage.clear(),
    color: () => 'red',
    id: GRAPH_BUTTON_ID.clearLocalStorage,
  };

  const persistentGraphClone: GButton = {
    label: () => 'Clone Search Visualizer Graph',
    action: () => graph.settings.value.persistent = {
      storageKey: "search-visualizer-graph"
    },
    color: () => 'amber',
    id: GRAPH_BUTTON_ID.persistentGraphClone,
  };

  const toggleTestRoom: GButton = {
    label: () => {
      const isInRoom = graph.collaborativeRoomId.value === 'test';
      const peopleInRoom = graph.collaboratorCount.value + 1; // +1 for self
      const inRoomText = `Leave Test Room (${peopleInRoom} In Room)`;
      const notInRoomText = 'Join Test Room';
      return isInRoom ? inRoomText : notInRoomText;
    },
    action: () => {
      const isInRoom = graph.collaborativeRoomId.value === 'test';
      const names = ['Dila', 'Shannon', 'Bella', 'Joy']
      if (isInRoom) {
        graph.leaveCollaborativeRoom();
      } else {
        graph.meAsACollaborator.value.name = names[Math.floor(Math.random() * names.length)];
        graph.joinCollaborativeRoom('test');
      }
    },
    color: () => graph.collaborativeRoomId.value === 'test' ? 'red' : 'green',
    id: GRAPH_BUTTON_ID.testRoom,
  };

  const log: GButton = {
    label: () => 'Log',
    action: () => {
      console.log(JSON.stringify(graph.collaborators.value, null, 2));
      console.log(JSON.stringify(graph.collaboratorCount.value, null, 2));
      console.log(JSON.stringify(graph.meAsACollaborator.value, null, 2));
    },
    color: () => 'blue',
    id: GRAPH_BUTTON_ID.log,
  };

  const { toggleColorize, isColorized } = useBFSColorizer(graph);

  const bfsColorize: GButton = {
    label: () => (isColorized.value ? "Stop Colorizing" : "Colorize"),
    color: () => (isColorized.value ? "red" : "pink"),
    action: toggleColorize,
    id: "toggle-bfs-colorize",
  };

  const btnObj = {
    reset,
    clearLocalStorage,

    // base
    changeNodeSize,
    toggleEdgeLabelDisplay,
    toggleEdgeLabelsEditable,

    // draggable
    toggleDraggable,

    // node anchor
    toggleNodeAnchors,

    // user editable
    toggleUserEditable,
    toggleEdgeType,
    changeEdgeWeight,

    // persistent
    changeStorageKey,
    persistentGraphClone,

    // collaborative
    toggleTestRoom,

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