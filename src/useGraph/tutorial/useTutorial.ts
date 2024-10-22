import { useGraphTutorial } from "./useGraphTutorial";
import { SEQUENCES } from "./sequences/sequences";
import type { Graph } from "../useGraph";

/**
 * implements useGraphTutorial with the basics tutorial sequence
 * for educating users on basic graph UI interactions
 *
 * @param graph the useGraph instance to apply the tutorial to
 * @returns // TODO make it return controls for the tutorial
 */
export const useBasicsTutorial = (graph: Graph) => useGraphTutorial(graph, SEQUENCES.basics);