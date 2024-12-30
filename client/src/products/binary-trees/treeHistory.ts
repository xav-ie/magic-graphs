import { ref } from "vue";
import type { Graph } from "@graph/types";
import type { AVLTree } from "./tree/avl";

type GraphState = {
  nodes: Graph["nodes"]["value"];
  edges: Graph["edges"]["value"];
};

export const useTreeHistory = (graph: Graph, tree: AVLTree) => {
  const undoStack = ref<GraphState[]>([]);
  const redoStack = ref<GraphState[]>([]);

  const redo = () => {
	if (redoStack.value.length === 0) return;
	const state = redoStack.value.pop();
	if (!state) return;
	undoStack.value.push(state);
	graph.load(state);
  }

  const undo = () => {
	console.log(undoStack.value);
	if (undoStack.value.length === 0) return;
	const state = undoStack.value.pop();
	if (!state) return;
	redoStack.value.push(state);
	console.log(state);
	graph.load(state);
  }

  return {
	undo,
	redo,

	undoStack,
	redoStack,
  };
};
