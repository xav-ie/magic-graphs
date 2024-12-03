import type { GNode, GEdge } from "@graph/types";
import { useUserEditableGraph } from "@graph/plugins/editable";
import type { GraphEvent } from "@graph/events";

/**
 * extends the useGraph interface to include capabilities for storing and retrieving a graph from local storage.
 *
 * @param canvas
 * @param options
 * @returns the graph interface with additional persistent graph functionality
 */
export const usePersistent = (
  graph: ReturnType<typeof useUserEditableGraph>,
) => {
  const nodeStorage = {
    get: () =>
      JSON.parse(
        localStorage.getItem(
          graph.settings.value.persistentStorageKey + "-nodes"
        ) ?? "[]"
      ),
    set: (nodes: GNode[]) => {
      const nodesToAdd = nodes.filter((node) => {
        const nodeInBlacklist = graph.settings.value.persistentBlacklist.has(node.id)
        return !nodeInBlacklist
      });
      localStorage.setItem(
        graph.settings.value.persistentStorageKey + "-nodes",
        JSON.stringify(nodesToAdd)
      );
    },
  };

  const edgeStorage = {
    get: () =>
      JSON.parse(
        localStorage.getItem(
          graph.settings.value.persistentStorageKey + "-edges"
        ) ?? "[]"
      ),
    set: (edges: GEdge[]) => {
      const edgesToAdd = edges.filter((edge) => {
        const edgeInBlacklist = graph.settings.value.persistentBlacklist.has(edge.id)
        return !edgeInBlacklist
      });
      localStorage.setItem(
        graph.settings.value.persistentStorageKey + "-edges",
        JSON.stringify(edgesToAdd)
      );
    },
  };

  const trackGraphState = async () => {
    // lets all callbacks run before saving to storage
    await new Promise((resolve) => setTimeout(resolve, 10));
    nodeStorage.set(graph.nodes.value);
    edgeStorage.set(graph.edges.value);
  };

  const load = () => {
    graph.nodes.value = nodeStorage.get();
    graph.edges.value = edgeStorage.get();

    // wait for the next microtask to ensure caller of useGraph has a chance to sub to onStructureChange
    queueMicrotask(() => graph.emit("onStructureChange"));
  };

  const trackChangeEvents: GraphEvent[] = [
    "onStructureChange",
    "onNodeDrop",
    "onGroupDrop",
  ];

  const listenForGraphStateEvents = () => {
    trackChangeEvents.forEach((event) =>
      graph.subscribe(event, trackGraphState)
    );
  };

  const stopListeningForGraphStateEvents = () => {
    trackChangeEvents.forEach((event) =>
      graph.unsubscribe(event, trackGraphState)
    );
  };

  const stopListeningForEvents = () => {
    stopListeningForGraphStateEvents();
  };

  graph.subscribe("onSettingsChange", (diff) => {
    stopListeningForEvents();

    // persistent was true, but now it is false
    const persistenceTurnedOff = "persistent" in diff && !diff.persistent;
    if (persistenceTurnedOff) return;

    // persistent was false, but now it is true
    const persistenceTurnedOn = "persistent" in diff && diff.persistent;
    if (persistenceTurnedOn) {
      load();
      listenForGraphStateEvents();

      return;
    }

    // from here on out, persistent was true, but it was not in the diff
    if ("persistentStorageKey" in diff) {
      load();
    }

    listenForGraphStateEvents();
  });

  if (graph.settings.value.persistent) {
    load();
    listenForGraphStateEvents();
  }

  return {
    ...graph,

    /**
     * track the graph state on local storage
     */
    trackGraphState,
  };
};
