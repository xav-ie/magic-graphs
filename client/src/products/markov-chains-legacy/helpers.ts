import type { AdjacencyList } from '@graph/useAdjacencyList';

export type AdjacencyMap = Map<number, number[]>;

export const adjListToAdjMap = (adjList: AdjacencyList) => {
  const adjMap = new Map<number, number[]>();
  for (const [node, neighbors] of Object.entries(adjList)) {
    // @ts-ignore this implementation must be revisited
    adjMap.set(Number(node), neighbors);
  }
  return adjMap;
}

// maps each node from the graph to the component it belongs to
export const getNodeToConnectedComponentMap = (connectedComponents: number[][]) => {
  const nodeToComponentMap = new Map<number, number>();
  connectedComponents.forEach((component, componentIndex) => {
    component.forEach((node) => {
      nodeToComponentMap.set(node, componentIndex);
    })
  })
  return nodeToComponentMap;
}

// maps the components index in connectedComponents to the components' indices it can reach and are adjacent to it
export const getComponentAdjMap = (connectedComponents: number[][], graphAdjMap: AdjacencyMap) => {
  const nodeToComponentMap = getNodeToConnectedComponentMap(connectedComponents);

  const componentAdjMap = new Map<number, number[]>();

  connectedComponents.forEach((component, componentIndex) => {
    const componentChildren = component.map((node) => graphAdjMap.get(node) ?? []).flat().filter((node) => {
      return nodeToComponentMap.get(node) !== componentIndex;
    })
    const componentChildrenToStrong = componentChildren.map((node) => nodeToComponentMap.get(node) ?? -1);
    const componentChildrenSet = new Set(componentChildrenToStrong);
    componentAdjMap.set(componentIndex, [...componentChildrenSet]);
  })

  return componentAdjMap;
}

// returns both the recurrent and transient classes in a markov chain
export const getRecurrentTransientClasses = (
  connectedComponents: number[][],
  componentAdjMap: ReturnType<typeof getComponentAdjMap>
) => {

  const recurrentClasses: number[][] = [];
  const transientClasses: number[][] = [];

  for (const [component, reachableComponents] of componentAdjMap) {
    if (reachableComponents.length === 0) {
      recurrentClasses.push(connectedComponents[component])
    } else {
      transientClasses.push(connectedComponents[component])
    }
  }

  return {
    recurrentClasses,
    transientClasses
  };
}