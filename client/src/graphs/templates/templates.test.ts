import { describe, it, expect } from "vitest";
import {
  getAverageCoordinatesOfGraphNodes,
  centerNodesOnOriginCoordinates,
} from "./helpers";

describe("getAverageCoordinatesOfGraphNodes", () => {
  it("should return the average coordinates for a list of nodes", () => {
    const nodes = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
      { x: 50, y: 60 },
    ];

    const result = getAverageCoordinatesOfGraphNodes(nodes);
    expect(result).toEqual({ x: 30, y: 40 });
  });

  it("should handle a single node correctly", () => {
    const nodes = [{ x: 15, y: 25 }];

    const result = getAverageCoordinatesOfGraphNodes(nodes);
    expect(result).toEqual({ x: 15, y: 25 });
  });

  it("should return { x: 0, y: 0 } for an empty node list", () => {
    const nodes: { x: number; y: number }[] = [];

    const result = getAverageCoordinatesOfGraphNodes(nodes);
    expect(result).toEqual({ x: 0, y: 0 });
  });
});

describe("centerNodesOnOriginCoordinates", () => {
  it("should center nodes around the target origin (0, 0)", () => {
    const nodes = [
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 30, y: 30 },
    ];

    const targetOrigin = { x: 0, y: 0 };
    const result = centerNodesOnOriginCoordinates(nodes, targetOrigin);

    expect(result).toEqual([
      { x: -10, y: -10 },
      { x: 0, y: 0 },
      { x: 10, y: 10 },
    ]);
  });

  it("should center nodes around a positive target origin (30, 20)", () => {
    const nodes = [
      { x: 0, y: 20 },
      { x: 30, y: 40 },
      { x: 30, y: 0 },
    ];

    const targetOrigin = { x: 30, y: 20 };
    const result = centerNodesOnOriginCoordinates(nodes, targetOrigin);

    expect(result).toEqual([
      { x: 10, y: 20 },
      { x: 40, y: 40 },
      { x: 40, y: 0 },
    ]);
  });

  it("should handle a single node", () => {
    const nodes = [{ x: 5, y: 5 }];
    const targetOrigin = { x: 0, y: 0 };

    const result = centerNodesOnOriginCoordinates(nodes, targetOrigin);

    expect(result).toEqual([{ x: 0, y: 0 }]);
  });

  it("should not mutate the original node array", () => {
    const nodes = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ];

    const targetOrigin = { x: 0, y: 0 };
    const originalNodes = JSON.parse(JSON.stringify(nodes));

    centerNodesOnOriginCoordinates(nodes, targetOrigin);

    expect(nodes).toEqual(originalNodes);
  });
});
