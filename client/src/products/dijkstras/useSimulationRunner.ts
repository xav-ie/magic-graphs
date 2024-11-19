import { ref } from "vue";
import type { GNode, Graph } from "@graph/types";
import { selectNode } from "@graph/select";
import { useTextTip } from "@ui/useTextTip";
import { useDijkstraSimulation } from "./useSimulation";

export const useSimulationRunner = (graph: Graph) => {
  const startingNode = ref<GNode>();
  const running = ref(false);
  const simControls = useDijkstraSimulation(graph, startingNode);
  const { showText, hideText } = useTextTip("select the starting node");

  /**
   * handler we get back from selectNode
   */
  let cancelNodeSelectionHandler = () => {};

  const start = async () => {
    if (running.value) return;
    running.value = true;

    showText();

    const { selectedItemPromise, cancelSelection } = selectNode(graph);
    cancelNodeSelectionHandler = cancelSelection;
    const nodeSchema = await selectedItemPromise;
    if (!nodeSchema) return;

    const node = graph.getNode(nodeSchema.id);
    if (!node) throw new Error("illegitimate node selected from selectNode");

    startingNode.value = node;
    simControls.start();

    hideText();
  };

  const stop = () => {
    if (!running.value) return;
    running.value = false;

    cancelNodeSelectionHandler();
    simControls.stop();
    hideText();
  };

  return {
    /**
     * Start the simulation
     */
    start,
    /**
     * Stop the simulation
     */
    stop,
    /**
     * Whether the simulation is currently running or in start up
     * ie user is selecting the starting node
     */
    running,
    /**
     * Controls for the simulation returned by useDijkstraSimulation
     */
    simControls,
  };
}