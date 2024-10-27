
/**
 * describes the path a search algorithm takes through the search space.
 * The 0th element of the trace is the start node, the last element the last node explored.
 */
export type Trace = (number | string | symbol)[]