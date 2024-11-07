import { describe, test, expect } from "vitest";
import { useBaseGraph } from "..";
import { ref } from "vue";

describe("base graph - moveNode", () => {
  const graph = useBaseGraph(ref());

  test("move node", () => {
    graph.nodes.value = []
    const { id: node1Id } = graph.addNode({ x: 0, y: 0 });
    const { id: node2Id } = graph.addNode({ x: 1, y: 1 });

    graph.moveNode(node1Id, 2, 2);
    graph.moveNode(node2Id, 3, 3);

    expect(graph.nodes.value).toMatchObject([
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ]);
  })

  test("move node with invalid id", () => {
    graph.nodes.value = []
    const node = graph.addNode({ x: 1, y: 1 });

    graph.moveNode("invalid-id", 2, 2);

    expect(node.x).toEqual(1);
    expect(node.y).toEqual(1);
    expect(graph.nodes.value).toMatchObject([node]);
  })
})