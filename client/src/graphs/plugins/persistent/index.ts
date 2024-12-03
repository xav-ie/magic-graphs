import type { GNode, GEdge } from "@graph/types";
import type { GraphEvent } from "@graph/events";
import type { BaseGraph } from "@graph/base";

export const usePersistent = (graph: BaseGraph) => {
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

  const load = () => graph.load({
    nodes: nodeStorage.get(),
    edges: edgeStorage.get(),
  });

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

  graph.subscribe("onSettingsChange", (diff) => {
    stopListeningForGraphStateEvents();

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
    // ensure caller has a chance to sub to onStructureChange
    queueMicrotask(load);
    listenForGraphStateEvents();
  }

  return {
    /**
     * track the graph state on local storage
     */
    trackGraphState,
  };
};

export type GraphPersistentControls = ReturnType<typeof usePersistent>;
