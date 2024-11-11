import { getInboundEdges, getOutboundEdges } from "@graph/helpers";
import type { Graph } from "@graph/types";
import { ref } from "vue";

export type DijkstrasTrace = ReturnType<typeof dijkstras>;

const dijkstras = (graph: Pick<Graph, 'nodes' | 'edges'>) => {

  type NodeDistance = { id: string; distance: number };

  const distanceArr = graph.nodes.value.map(
    (n) =>
    ({
      id: n.id,
      distance: 1000,
    } satisfies NodeDistance)
  );

  const sourceId = graph.nodes.value.find(n => n.label === "A")?.id;
  if (!sourceId) throw new Error("Bro wth, there's no sourceId");

  // assign distance 0 to source
  distanceArr.filter((n) => n.id === sourceId)[0].distance = 0;

  let priorityQueue = [...distanceArr];
  type ExploredNode = { id: string; distance: number };
  const exploredNodes: ExploredNode[] = [{ id: sourceId, distance: 0 }];
  const nodeParentMap = new Map<string, string>();

  // initialize trace with first source without any nodes explored
  const trace = [
    {
      source: { id: sourceId, distance: 0 },
      exploredNodes: JSON.parse(
        JSON.stringify(exploredNodes)
      ) as ExploredNode[],
      distances: JSON.parse(JSON.stringify(distanceArr)) as NodeDistance[],
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
      sourceNode.id !== sourceId
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
      ) as ExploredNode[],
      distances: JSON.parse(JSON.stringify(distanceArr)) as NodeDistance[],
      nodeParentMap: new Map(nodeParentMap),
    });
  }

  // push an empty source to give the impression that there are no more nodes to check
  trace.push({
    source: { id: "", distance: 0 },
    exploredNodes: JSON.parse(
      JSON.stringify(exploredNodes)
    ) as ExploredNode[],
    distances: JSON.parse(JSON.stringify(distanceArr)) as NodeDistance[],
    nodeParentMap: new Map(nodeParentMap),
  });

  return trace;
};

export const useDijkstraTrace = (graph: Pick<Graph, 'nodes' | 'edges' | 'subscribe'>) => {
  const trace = ref(dijkstras(graph));

  const refreshTrace = () => {
    trace.value = dijkstras(graph);
  }

  graph.subscribe("onStructureChange", refreshTrace);
  graph.subscribe("onEdgeLabelChange", refreshTrace);
  graph.subscribe("onGraphReset", refreshTrace);

  return { trace, dijkstras };
};
