import type { GNode, Graph } from "@graph/types";
import type { NodeDepth } from "@product/search-visualizer/useNodeDepth";
import type { Coordinate } from "@shape/types";
import { roundToNearestN } from "@utils/math";

export const getTreeBinaryPos = (
  graph: Graph,
  root: GNode,
  nodeDepths: NodeDepth,
  treeOffset: { x: number, y: number }
) => {
  const { depth } = nodeDepths;
  const newNodePositions: Map<GNode['id'], Coordinate> = new Map();
  const roundToNearest10 = roundToNearestN(10);

  const treeIndexToPositionArr: Coordinate[] = [root];
  const totalWidth = Math.pow(2, depth) * treeOffset.x;

  for (let i = 1; i <= depth; i++) {
    const y = root.y + i * treeOffset.y;
    const spotsOnThisLevel = Math.pow(2, i);

    const xOffset = totalWidth / spotsOnThisLevel;
    const xOffsetPerNode: number[] = [];

    for (let j = 0; j < spotsOnThisLevel; j++) {
      xOffsetPerNode[j] = (j - spotsOnThisLevel / 2 + 0.5) * xOffset;
    }

    for (let j = 0; j < spotsOnThisLevel; j++) {
      treeIndexToPositionArr.push({
        x: root.x + xOffsetPerNode[j],
        y,
      });
    }
  }

  const { getChildrenOfNode } = graph.helpers;

  const processedNodes: (GNode['id'] | undefined)[] = [];
  let nodesAtDepth: (GNode['id'] | undefined)[] = [root.id];

  for (let i = 0; i <= depth; i++) {
    const nodesAtNextDepth: (GNode['id'] | undefined)[] = [];
    for (const maybeNodeId of nodesAtDepth) {
      processedNodes.push(maybeNodeId);
      if (!maybeNodeId) {
        nodesAtNextDepth.push(undefined);
        nodesAtNextDepth.push(undefined);
        continue
      }
      const children = getChildrenOfNode(maybeNodeId);
      nodesAtNextDepth.push(children[0]?.id);
      nodesAtNextDepth.push(children[1]?.id);
    }
    nodesAtDepth = [...nodesAtNextDepth];
  }

  for (let i = 0; i < processedNodes.length; i++) {
    const maybeNodeId = processedNodes[i];
    if (!maybeNodeId) continue;
    const newPos = treeIndexToPositionArr[i];
    newNodePositions.set(maybeNodeId, {
      x: roundToNearest10(newPos.x),
      y: roundToNearest10(newPos.y),
    });
  }

  return newNodePositions;
}