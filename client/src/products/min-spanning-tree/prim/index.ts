import type { TutorialStep } from "@graph/tutorials/types";
import type { Graph, GEdge } from "@graph/types";
import { clone } from "@utils/clone";
import { ref, computed } from "vue";
export const usePrims = (graph: Graph) => {

  const tutorialSteps: TutorialStep[] = []
  const addTutorialStep = (edgeWeight: string) => {
    tutorialSteps.push({
      hint: `Edge ${edgeWeight} was chosen next because it has the lowest connected edge weight.`,
      dismiss: 'onInterval'
    })
  }

  const maxSteps = graph.nodes.value.length - 1

  const currentStep = ref(maxSteps);

  graph.subscribe('onStructureChange', () => currentStep.value = maxSteps)


  const getMinEdge = (edges: GEdge[], inMST: Set<string>): GEdge | null => {
    let minEdge: GEdge | null = null;

    for (const edge of edges) {
      if (
        (inMST.has(edge.from) && !inMST.has(edge.to)) ||
        (inMST.has(edge.to) && !inMST.has(edge.from))
      ) {
        if (!minEdge || Number(edge.label) < Number(minEdge.label)) {
          minEdge = edge;
        }
      }
    }

    if (minEdge) addTutorialStep(minEdge.label)
    return minEdge;
  };

  const prims = () => {
    if (graph.nodes.value.length === 0) return [];

    const mst: GEdge[] = [];
    const inMST = new Set<string>();

    const startNode = graph.nodes.value[0].id;
    inMST.add(startNode);

    const allEdges: GEdge[] = Object.values(clone(graph.edges.value));

    while (
      mst.length < maxSteps &&
      mst.length < currentStep.value
    ) {
      const minEdge = getMinEdge(allEdges, inMST);

      if (!minEdge) {
        break;
      }

      mst.push(minEdge);
      inMST.add(minEdge.from);
      inMST.add(minEdge.to);
    }

    return mst;
  };

  const canBackwardStep = computed(() => {
    return currentStep.value > 1;
  });

  const canForwardStep = computed(() => {
    return currentStep.value < maxSteps;
  });

  const forwardStep = () => {
    if (canForwardStep.value) currentStep.value++;
  };

  const backwardStep = () => {
    if (canBackwardStep.value) currentStep.value--;
  };

  const setStep = (newStep: number) => {
    if (newStep > maxSteps || newStep < 1) throw new Error('step out of range')
    currentStep.value = newStep
  }

  return {
    prims,
    backwardStep,
    forwardStep,
    setStep,
    canBackwardStep,
    canForwardStep,
    currentStep,
    maxSteps
  };
};
