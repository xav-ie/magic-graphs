import type { TutorialSequence } from "../types";
import { BASICS_STEPS } from "./basics";

/**
 * pre-defined sequence for basic graph editing.
 * re-arrange the steps to change the order of the tutorial
 */
const BASICS_SEQUENCE: TutorialSequence = [
  BASICS_STEPS.greeting,
  BASICS_STEPS.createNode,
  BASICS_STEPS.moveNode,
  BASICS_STEPS.createEdge,
  BASICS_STEPS.createUndirectedEdge,
  BASICS_STEPS.createSelfDirectedEdge,
  BASICS_STEPS.editEdgeWeight,
  BASICS_STEPS.removeElement,
  BASICS_STEPS.goodbye
]

/**
 * contains pre-defined sequences for common use cases
 */
export const SEQUENCES: Record<string, TutorialSequence> = {
  basics: BASICS_SEQUENCE
}