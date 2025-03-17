import type { GEdge, GNode } from '@graph/types';

/**
 * @description
 * GraphTemplate is a type that represents a template for a graph.
 * It contains the following properties:
 * - id: the name for the template
 * - isUserAdded: whether this is a default template or a user-added template
 * - thumbnail: string that can be used to display a thumbnail of the graph
 * - title: text displayed along with the template in the UI
 * - description: text displayed along with the template in the UI
 * - graphState: the state of the graph
 */
export type GraphTemplate = {
  id: string;
  isUserAdded?: boolean;
  thumbnail?: string;
  title: string;
  description: string;
  graphState: {
    nodes: GNode[];
    edges: GEdge[];
  };
};
