import type { Graph } from "@graph/types";
import { useGraphTutorial } from "@graph/tutorials/useGraphTutorial";
import { SEQUENCES } from "@graph/tutorials/sequences/sequences";

/**
 * implements useGraphTutorial with the basics tutorial sequence
 * for educating users on basic graph UI interactions
 *
 * @param graph the useGraph instance to apply the tutorial to
 * @returns an object containing controls for the tutorial
 */
export const useBasicsTutorial = (graph: Graph) => useGraphTutorial(graph, SEQUENCES(graph).basics);

/**
 * describes the control interface for the basics tutorial
 */
export type TutorialControls = ReturnType<typeof useBasicsTutorial>;