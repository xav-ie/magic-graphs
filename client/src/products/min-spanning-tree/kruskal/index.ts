import type { Graph, GEdge } from "@graph/types";
import { clone } from "@utils/clone";
import { ref, computed } from "vue";
import type { Parent, Rank } from "./types";
import type { TutorialStep } from "@graph/tutorials/types";

export const useKruskal = (graph: Graph) => {

  const tutorialSteps: TutorialStep[] = []
  const addTutorialStep = (edgeWeight: string) => {
    tutorialSteps.push({
      hint: `Edge ${edgeWeight} was chosen next because it has the lowest edge weight not connecting connected nodes.`,
      dismiss: 'onInterval'
    })
  }

  const maxSteps = graph.nodes.value.length - 1

  const currentStep = ref(maxSteps);

  graph.subscribe('onStructureChange', () => currentStep.value = maxSteps)

  const find = (parent: Parent, nodeId: string): string => {
    if (parent.get(nodeId) !== nodeId) {
      parent.set(nodeId, find(parent, parent.get(nodeId)!));
    }
    return parent.get(nodeId)!;
  };

  const union = (parent: Parent, rank: Rank, nodeA: string, nodeB: string) => {
    const rootA = find(parent, nodeA);
    const rootB = find(parent, nodeB);

    if (rootA !== rootB) {
      const rankA = rank.get(rootA)!;
      const rankB = rank.get(rootB)!;

      if (rankA < rankB) {
        parent.set(rootA, rootB);
      } else if (rankA > rankB) {
        parent.set(rootB, rootA);
      } else {
        parent.set(rootB, rootA);
        rank.set(rootA, rankA + 1);
      }
    }
  };

  const kruskal = () => {
    const sortedEdges: GEdge[] = Object.values(clone(graph.edges.value)).sort(
      (a, b) => Number(a.label) - Number(b.label)
    );

    const parent = new Map<string, string>();
    const rank = new Map<string, number>();

    graph.nodes.value.forEach((node) => {
      parent.set(node.id, node.id);
      rank.set(node.id, 0);
    });

    const mst: GEdge[] = [];
    for (const edge of sortedEdges) {
      if (mst.length >= currentStep.value) break;
      const sourceRoot = find(parent, edge.from);
      const targetRoot = find(parent, edge.to);

      if (sourceRoot !== targetRoot) {
        addTutorialStep(edge.label)
        mst.push(edge);
        union(parent, rank, sourceRoot, targetRoot);

        if (mst.length === maxSteps) break;
      }
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
    kruskal,
    backwardStep,
    forwardStep,
    setStep,
    canBackwardStep,
    canForwardStep,
    currentStep,
    maxSteps,
  };
};
