import type { Graph } from "@graph/types";
import { getRandomInRange } from "@graph/helpers";
import { GRAPH_BUTTON_ID } from "@graph/buttons/types";
import type { GButton } from "@graph/buttons/types";
import { useBFSColorizer } from "@product/search-visualizer/useBFSColorizer";
import { getRandomElement } from "@utils/array";
import { COLLAB_COLORS, COLLAB_NAMES } from "@graph/compositions/useCollaborativeGraph/types";
import { capitalize } from "@utils/string";

/**
 * a one stop shop for the dials you need to control your graph
 *
 * @param graph the graph instance to control
 * @returns a set of buttons that can be added to the graph toolbar
 */
export const useGraphBtns = (graph: Graph) => {

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
    label: () => capitalize(graph.settings.value.userAddedEdgeType),
    action: () => {
      const addedEdgeType = graph.settings.value.userAddedEdgeType;
      if (addedEdgeType === 'directed') {
        graph.settings.value.userAddedEdgeType = 'undirected';
      } else {
        graph.settings.value.userAddedEdgeType = 'directed';
      }
    },
    color: () => {
      const { userAddedEdgeType } = graph.settings.value;
      return userAddedEdgeType === 'directed' ? 'blue' : 'purple';
    },
    id: GRAPH_BUTTON_ID.edgeType,
  };

  const changeEdgeWeight: GButton = {
    cond: () => !!graph.settings.value.userEditable,
    label: () => {
      const { userAddedEdgeLabel } = graph.settings.value;
      return `Change Added Edge Weight (${userAddedEdgeLabel})`;
    },
    action: () => {
      graph.settings.value.userAddedEdgeLabel = getRandomInRange(1, 10).toString();
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
    label: () => {
      const { persistentStorageKey } = graph.settings.value;
      return `Change Storage Key (${persistentStorageKey})`;
    },
    action: () => {
      const { persistentStorageKey } = graph.settings.value;
      const newStorageKey = persistentStorageKey === 'graph' ? 'graph2' : 'graph';
      graph.settings.value.persistentStorageKey = newStorageKey;
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
    action: () => {
      graph.settings.value.persistentStorageKey = 'search-visualizer-graph'
    },
    color: () => 'amber',
    id: GRAPH_BUTTON_ID.persistentGraphClone,
  };

  const toggleTestRoom: GButton = {
    label: () => {
      const {
        collaborativeRoomId: room,
        collaboratorCount: peopleInRoom,
        inCollaborativeRoom: inRoom
      } = graph
      const inRoomText = `Leave ${room.value} Room (${peopleInRoom.value + 1} In Room)`;
      const notInRoomText = 'Join Test Room';
      return inRoom.value ? inRoomText : notInRoomText;
    },
    action: () => {
      const name = getRandomElement(COLLAB_NAMES);
      const color = getRandomElement(COLLAB_COLORS);
      graph.meAsACollaborator.value.name = name;
      graph.meAsACollaborator.value.color = color;
      const {
        joinCollaborativeRoom: joinRoom,
        leaveCollaborativeRoom: leaveRoom,
        inCollaborativeRoom: inRoom
      } = graph;
      inRoom.value ? leaveRoom() : joinRoom('Test');
    },
    color: () => graph.inCollaborativeRoom.value ? 'red' : 'green',
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

  const { toggleColorize, isColorized, startNode } = useBFSColorizer(graph);

  const bfsColorize: GButton = {
    label: () => {
      const startText = 'Colorize';
      const node = graph.getNode(startNode.value!);
      const stopText = `Stop Colorizing (${node?.label})`;
      return isColorized.value ? stopText : startText;
    },
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