import type { Graph } from "@/useGraph/useGraph";
import type { TutorialStep } from "../types";
import { GRAPH_BUTTON_ID } from "@/useGraph/button/types";
import { TUTORIAL_USETHEME_ID } from '../types';
import { useTheme } from "@/useGraph/theme/useTheme";
import { PURPLE_700, RED_700 } from "@/utils/colors";

/**
 * pre-defined tutorial steps for basic graph editing
 */
export const BASICS_STEPS: (graph: Graph) => Record<string, TutorialStep> = (graph: Graph) => ({
  greeting: {
    hint: 'Welcome to the graph editor tutorial',
    dismiss: 'onClick',
  },
  goodbye: {
    hint: 'Have fun editing graphs!',
    dismiss: 'onTimeout',
    after: 3000
  },
  createNode: {
    hint: 'Double click anywhere to add a node',
    dismiss: 'onNodeAdded',
  },
  moveNode: {
    hint: 'Drag a node to move it',
    dismiss: 'onNodeDrop'
  },
  createEdge: {
    hint: 'Create an edge by dragging an anchor onto another node',
    dismiss: 'onEdgeAdded'
  },
  createUndirectedEdge: {
    hint: 'Now create an undirected edge by toggling the edge type',
    highlightElement: GRAPH_BUTTON_ID.edgeType,
    dismiss: {
      event: 'onEdgeAdded',
      predicate: (edge) => edge.type === 'undirected'
    }
  },
  createSelfDirectedEdge: {
    hint: 'You can even create self directed edges! Make sure you are in "directed" mode and drag an anchor inwards',
    highlightElement: GRAPH_BUTTON_ID.edgeType,
    dismiss: {
      event: 'onEdgeAdded',
      predicate: (edge) => edge.to === edge.from
    }
  },
  editEdgeWeight: {
    hint: 'Edit the edge weight by clicking on it and typing a number',
    dismiss: 'onEdgeWeightChange'
  },
  removeElement: getRemoveNodeOrEdgeStep(graph),
});

const getRemoveNodeOrEdgeStep = (graph: Graph): TutorialStep => {
  let stepPassed = false;
  const completeStep = () => stepPassed = true;
  const { setTheme, removeAllThemes } = useTheme(graph, TUTORIAL_USETHEME_ID);
  return {
    hint: 'Remove an edge or node by clicking on it and hitting backspace/delete',
    dismiss: {
      event: 'onInterval',
      predicate: () => stepPassed
    },
    onInit: () => {
      stepPassed = false;
      setTheme('nodeAnchorColor', (node) => node.label === '1' ? PURPLE_700 : RED_700);
      graph.subscribe('onEdgeRemoved', completeStep);
      graph.subscribe('onNodeRemoved', completeStep);
    },
    onDismiss: () => {
      removeAllThemes();
      graph.unsubscribe('onEdgeRemoved', completeStep);
      graph.unsubscribe('onNodeRemoved', completeStep);
    },
  }
};