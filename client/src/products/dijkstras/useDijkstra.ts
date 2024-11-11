import { getInboundEdges, getOutboundEdges } from "@graph/helpers";
import type { GNode, Graph } from "@graph/types";
import { computed, ref } from "vue";

export type DijkstrasAlgorithm = ReturnType<typeof dijkstras>;
export type DijkstrasTrace = ReturnType<DijkstrasAlgorithm>;
type TraceNodeDistance = { id: string; distance: number };
type TraceExploredNode = { id: string; distance: number };

/**
 * serializable infinity value for node distance
 */
export const INF = 999999;

const dijkstras = (graph: Pick<Graph, 'nodes' | 'edges'>) => (startingNodeId: GNode['id']) => {

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

export const useDijkstra = (graph: Pick<Graph, 'nodes' | 'getNode' | 'edges' | 'subscribe'>) => {
  const trace = ref<DijkstrasTrace>([]);
  const getDijkstrasTrace = dijkstras(graph);

  // TODO - make this be a ref that a user can write to
  // const startingNodeId = ref<GNode['id'] | undefined>();
  const startingNodeId = computed(() => {
    const nodeLabelledA = graph.nodes.value.find((n) => n.label === "A");
    return nodeLabelledA?.id;
  })

  const update = () => {
    if (!startingNodeId.value) return
    const startingNode = graph.getNode(startingNodeId.value);
    if (!startingNode) return
    trace.value = getDijkstrasTrace(startingNode.id);
  }

  graph.subscribe("onStructureChange", update);
  graph.subscribe("onEdgeLabelChange", update);
  graph.subscribe("onGraphReset", update);

  update();

  return { trace };
};
