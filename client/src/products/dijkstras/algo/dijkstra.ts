import type { GNode, Graph } from "@graph/types";
import { getInboundEdges, getOutboundEdges } from "@graph/helpers";

export type DijkstrasTrace = ReturnType<typeof dijkstras>;
type TraceNodeDistance = { id: string; distance: number };
type TraceExploredNode = { id: string; distance: number };

/**
 * serializable infinity value for node distance
 */
export const INF = 999999;

export const dijkstras = (graph: Graph, startingNodeId: GNode['id']) => {
  const distanceArr = graph.nodes.value.map(
    (n) =>
    ({
      id: n.id,
      distance: INF,
    } satisfies TraceNodeDistance)
  );

  // assign distance 0 to source
  distanceArr.filter((n) => n.id === startingNodeId)[0].distance = 0;

  let priorityQueue = [...distanceArr];
  const exploredNodes: TraceExploredNode[] = [{ id: startingNodeId, distance: 0 }];
  const nodeParentMap = new Map<string, string>();

  // initialize trace with first source without any nodes explored
  const trace = [
    {
      source: { id: startingNodeId, distance: 0 },
      exploredNodes: JSON.parse(
        JSON.stringify(exploredNodes)
      ) as TraceExploredNode[],
      distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
      nodeParentMap: new Map(nodeParentMap),
    },
  ];

  // iterate through priority queue
  while (priorityQueue.length !== 0) {
    // grab node with least-distance
    const sourceNode = priorityQueue.reduce(
      (acc, cur) => (cur.distance < acc.distance ? cur : acc),
      { id: "", distance: Infinity }
    );

    // remove that node
    priorityQueue = priorityQueue.filter((e) => e.id !== sourceNode.id);

    // don't iterate through nodes with no ingoing edges
    if (
      getInboundEdges(sourceNode.id, graph).length === 0 &&
      sourceNode.id !== startingNodeId
    )
      continue;

    // iterate through source's neighbors
    getOutboundEdges(sourceNode.id, graph).forEach((edge) => {
      // updates distance of neighbor if new distance is less than old
      const newDistanceIsLess =
        distanceArr.filter((e) => e.id === edge.from)[0].distance +
        Number(edge.label) <
        distanceArr.filter((e) => e.id === edge.to)[0].distance;
      if (newDistanceIsLess) {
        const newDistance =
          distanceArr.filter((e) => e.id === edge.from)[0].distance +
          Number(edge.label);
        distanceArr.filter((e) => e.id === edge.to)[0].distance = newDistance;

        // idk if this should be outside if or not
        const neighborAlreadyExplored = exploredNodes
          .map((n) => n.id)
          .includes(edge.to);
        if (!neighborAlreadyExplored)
          exploredNodes.push({ id: edge.to, distance: newDistance });

        nodeParentMap.set(edge.to, sourceNode.id);
      }
    });
    trace.push({
      source: sourceNode,
      exploredNodes: JSON.parse(
        JSON.stringify(exploredNodes)
      ) as TraceExploredNode[],
      distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
      nodeParentMap: new Map(nodeParentMap),
    });
  }

  // push an empty source to give the impression that there are no more nodes to check
  trace.push({
    source: { id: "", distance: 0 },
    exploredNodes: JSON.parse(
      JSON.stringify(exploredNodes)
    ) as TraceExploredNode[],
    distances: JSON.parse(JSON.stringify(distanceArr)) as TraceNodeDistance[],
    nodeParentMap: new Map(nodeParentMap),
  });

  return trace;
};