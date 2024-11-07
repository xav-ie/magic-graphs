import { describe, test, expect } from "vitest";
import { useBaseGraph } from "..";
import { ref } from "vue";

describe("base graph - addNode", () => {
  const graph = useBaseGraph(ref());

  test("adds nodes with label defaults", () => {
    graph.nodes.value = [];
    graph.addNode({ x: 0, y: 0 });
    graph.addNode({ x: 1, y: 1 });
    graph.addNode({ x: 2, y: 2 });
    expect(graph.nodes.value).toMatchObject([
      { x: 0, y: 0, label: "1" },
      { x: 1, y: 1, label: "2" },
      { x: 2, y: 2, label: "3" },
    ]);
  })
})