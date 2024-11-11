import type { Graph } from "@graph/types";
import { ref, computed } from "vue";
import { useKruskal } from "./kruskal";
import { usePrims } from "./prim";
import { useColorizeGraph } from "./useColorizeGraph";

export const useState = (graph: Graph) => {
  const {
    kruskal,
    forwardStep: kForwardStep,
    backwardStep: kBackwardStep,
    setStep: kSetStep,
    canBackwardStep: kCanBackwardStep,
    canForwardStep: kCanForwardStep,
    currentStep: kCurrentStep,
    maxSteps: kMaxSteps,
  } = useKruskal(graph);

  const {
    prims,
    forwardStep: pForwardStep,
    backwardStep: pBackwardStep,
    setStep: pSetStep,
    canBackwardStep: pCanBackwardStep,
    canForwardStep: pCanForwardStep,
    currentStep: pCurrentStep,
    maxSteps: pMaxSteps,
  } = usePrims(graph);

  type Algorithm = "kruskal" | "prim" | undefined;

  const currentAlgorithm = ref<Algorithm>(undefined);

  const algorithms = [
    { label: "Kruskal", value: "kruskal" },
    { label: "Prim", value: "prim" },
    { label: "None", value: undefined },
  ] as const;

  const colorizeGraph = () => {
    switch (currentAlgorithm.value) {
      case "kruskal":
        return useColorizeGraph(graph, kruskal());
      case "prim":
        return useColorizeGraph(graph, prims());
      default:
        return useColorizeGraph(graph, []);
    }
  };

  const updateAlgorithm = (newAlgorithm: Algorithm) => {
    currentAlgorithm.value = newAlgorithm;
    colorizeGraph();
  };

  const stepBackwards = () => {
    currentAlgorithm.value === "kruskal" ? kBackwardStep() : pBackwardStep();
    colorizeGraph();
  };

  const stepForwards = () => {
    currentAlgorithm.value === "kruskal" ? kForwardStep() : pForwardStep();
    colorizeGraph();
  };

  const setStep = (newStep: number) => {
    currentAlgorithm.value === "kruskal"
      ? kSetStep(newStep)
      : pSetStep(newStep);
  };

  const computedCanForwardStep = computed(() => {
    return currentAlgorithm.value === "kruskal"
      ? kCanForwardStep.value
      : pCanForwardStep.value;
  });
  const computedCanBackwardStep = computed(() => {
    return currentAlgorithm.value === "kruskal"
      ? kCanBackwardStep.value
      : pCanBackwardStep.value;
  });
  const computedMaxSteps = computed(() => {
    return currentAlgorithm.value === "kruskal"
      ? kMaxSteps
      : pMaxSteps;
  });
  const computedCurrentStep = computed(() => {
    return currentAlgorithm.value === "kruskal"
      ? kCurrentStep.value
      : pCurrentStep.value;
  });

  const handleStepKeys = (e: KeyboardEvent) => {
    if (e.key === "[" && computedCanBackwardStep.value) {
      stepBackwards();
      runningSimulation.value = false
    } else if (e.key === "]" && computedCanForwardStep.value) {
      stepForwards();
      runningSimulation.value = false
    }
  };

  const showSimulation = ref(false);
  const runningSimulation = ref(false);

  const runSimulation = () => {
    if (runningSimulation.value) return (runningSimulation.value = false);
    runningSimulation.value = true;
    graph.settings.value.userEditable = false

    const runStep = () => {
      if (computedCanForwardStep.value && runningSimulation.value) {
        stepForwards();
        setTimeout(runStep, 1000);
      } else {
        runningSimulation.value = false;
        graph.settings.value.userEditable = true

      }
    };

    runStep();
  };

  const computedCurrentAlgorithmName = computed(() => {
    return algorithms[
      algorithms.findIndex((a) => currentAlgorithm.value === a.value)
    ].label;
  });

  return {
    colorizeGraph,
    handleStepKeys,
    updateAlgorithm,
    runSimulation,
    setStep,
    stepBackwards,
    stepForwards,
    showSimulation,
    runningSimulation,
    currentAlgorithm,
    computedCanBackwardStep,
    computedCanForwardStep,
    algorithms,
    computedCurrentAlgorithmName,
    computedMaxSteps,
    computedCurrentStep,
  };
};
