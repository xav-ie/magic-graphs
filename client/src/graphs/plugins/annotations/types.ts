import type { Scribble } from "@shape/scribble";

/**
 * a scribble that is on the graph as an annotation
 */
export type Annotation = Scribble & { id: string }