import type { GEdge, GNode } from "@graph/types";

export type GraphTemplate = {
  id: string
  productId?: string
  thumbnail?: string // might need to be Image or something
  title: string
  description: string
  graphState: {
    nodes: GNode[]
    edges: GEdge[]
  }
};

