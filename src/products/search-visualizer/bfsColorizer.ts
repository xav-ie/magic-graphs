
// WARNING - TOTALLY DEPRECATED AT THIS POINT. MUST CONVERT TO USING NEW APIs

import { toRef } from 'vue';
import { nodesEdgesToAdjList } from './graphConverters';
import type { GNode, GEdge } from '@/useGraph/types';
import type { Graph } from '@/useGraph/useGraph';
import { getValue } from '@/useGraph/helpers';

const defaultColorPalette = ['red', 'green', 'blue', 'yellow', 'purple', 'orange'];

type BFSColorizerOptions = {
  startNode: GNode['id'],
  colorPalette: string[],
}

export const bfsNodeColorizer = (
  graph: Graph,
  optionArg: Partial<BFSColorizerOptions> = {}
) => {

  let isColorized = false;

  const defaultOptions: BFSColorizerOptions = {
    startNode: graph.nodes.value[0]?.id ?? 1,
    colorPalette: defaultColorPalette,
  }

  const options = toRef({
    ...defaultOptions,
    ...optionArg
  });

  const preserveGraphOptionsState = {
    nodeBorderColor: graph.options.value.nodeBorderColor,
  }

  // node id -> bfs level
  let bfsLevelRecord: Record<GNode['id'], number> = {};

  const computeBfsLevels = (nodes: GNode[], edges: GEdge[]) => {
    const adjList = nodesEdgesToAdjList(nodes, edges);
    bfsLevelRecord = {};

    if (!adjList[options.value.startNode]) {
      return
    }

    let queue = [options.value.startNode];
    const visited = new Set(queue);

    let currentLevel = 0;

    while (queue.length > 0) {
      const nextQueue = [];

      for (const node of queue) {
        bfsLevelRecord[node] = currentLevel;

        for (const neighbor of adjList[node]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            nextQueue.push(neighbor);
          }
        }
      }

      queue = [];
      queue.push(...nextQueue);
      currentLevel++;
    }
  }

  graph.subscribe('onStructureChange', computeBfsLevels);
  graph.subscribe('onNodeRemoved', (node) => {
    if (options.value.startNode === node.id && graph.nodes.value.length > 0) {
      setStartNode(graph.nodes.value[0].id);
    }
  });

  const colorize = () => {
    graph.options.value.nodeBorderColor = (node) => {
      isColorized = true;
      const level = bfsLevelRecord[node.label];
      // not in bfs tree
      if (level === undefined) {
        return getValue(preserveGraphOptionsState.nodeBorderColor, node);
      }
      const colors = options.value.colorPalette;
      return colors[level % colors.length];
    };
  }

  const decolorize = () => {
    isColorized = false;
    graph.options.value.nodeBorderColor = preserveGraphOptionsState.nodeBorderColor;
  }

  const setStartNode = (nodeId: GNode['id']) => {
    options.value.startNode = nodeId;
    computeBfsLevels(graph.nodes.value, graph.edges.value);
  }

  const setColorPalette = (colorPalette: string[]) => {
    options.value.colorPalette = colorPalette;
  }

  return {
    colorize,
    decolorize,
    toggleColorize: () => isColorized ? decolorize() : colorize(),
    isColorized: () => isColorized,
    setStartNode,
    setColorPalette,
  }
}