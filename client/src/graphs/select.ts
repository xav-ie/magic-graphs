import type { GraphMouseEvent } from "./compositions/useBaseGraph/types";
import type { Graph, SchemaItem } from "./types";

/**
 * selects schema items only of graph type 'node'
 *
 * @param graph the graph to select from
 * @returns a promise that resolves to the selected node or
 * undefined if the selection was cancelled
 */
export const selectNode = (graph: Graph) => {
  const { selectedItemPromise, cancelSelection } = selectFromGraph(graph, {
    predicate: item => item.graphType === 'node',
  });

  return {
    selectedItemPromise: async () => {
      const selectedItem = await selectedItemPromise;
      return selectedItem ? graph.getNode(selectedItem.id) : undefined;
    },
    cancelSelection,
  }
}

/**
 * selects schema items only of graph type 'edge'
 *
 * @param graph the graph to select from
 * @returns a promise that resolves to the selected edge or
 * undefined if the selection was cancelled
 */
export const selectEdge = (graph: Graph) => {
  const { selectedItemPromise, cancelSelection } = selectFromGraph(graph, {
    predicate: item => item.graphType === 'edge',
  });

  return {
    selectedItemPromise: async () => {
      const selectedItem = await selectedItemPromise;
      return selectedItem ? graph.getEdge(selectedItem.id) : undefined;
    },
    cancelSelection,
  }
}

export type SelectFromGraphOptions = {
  /**
   * only items that satisfy this predicate will be selectable.
   * if left undefined, all items in the graph will be selectable
   * @default () => true
   */
  predicate: (item: SchemaItem) => boolean;
};

/**
 * default predicate for `selectFromGraph`
 */
const DEFAULT_PREDICATE = () => true;

/**
 * waits for the user to click on an item in the graph and resolves to the selected item
 * or undefined if the cancel handler is invoked
 *
 * @param graph the graph to select from
 * @param options options for the selection process
 * @returns a promise that resolves to the selected item or undefined if the selection was cancelled
 * @example const { selectedItemPromise, cancelSelection } = selectFromGraph(graph);
 * const selectedItem = await selectedItemPromise;
 * if (!selectedItem) return; // selection was cancelled
 * // selection resolved. do something with the selected item
 */
export const selectFromGraph = (graph: Graph, {
  predicate = DEFAULT_PREDICATE,
}: Partial<SelectFromGraphOptions> = {}) => {
  let resolver: (value: SchemaItem | PromiseLike<SchemaItem> | undefined) => void;

  const selectedItemPromise = new Promise<SchemaItem | undefined>((res) => resolver = res);

  const onClick = ({ items }: GraphMouseEvent) => {
    const topItem = items.at(-1);
    if (!topItem || !predicate(topItem)) return;
    resolve(topItem);
  }

  const initialUserEditable = graph.settings.value.userEditable;
  const initialFocusable = graph.settings.value.focusable;

  /**
   * initializes the selection process
   */
  const init = () => {
    graph.subscribe('onClick', onClick);
    graph.settings.value.userEditable = false;
    graph.settings.value.focusable = false;
    const cursorPredicate = predicate === DEFAULT_PREDICATE ? ((item: SchemaItem) => !!item) : predicate;
    graph.activateCursorSelectMode(cursorPredicate);
  }

  /**
   * cleans up the selection process
   */
  const cleanup = () => {
    graph.unsubscribe('onClick', onClick);
    graph.settings.value.userEditable = initialUserEditable;
    graph.settings.value.focusable = initialFocusable;
    graph.deactivateCursorSelectMode();
  }

  /**
   * resolves the selection process and returns the selected item from the promise
   */
  const resolve = (item: SchemaItem) => {
    cleanup();
    resolver(item);
  }

  /**
   * cancels the selection process and returns undefined from the promise (public)
   */
  const cancelSelection = () => {
    cleanup();
    resolver(undefined);
  }

  init();

  return {
    /**
     * resolves to the selected item or undefined if the
     * selection was cancelled by calling the cancel handler
     */
    selectedItemPromise,
    cancelSelection,
  };
};

export type SelectControls = ReturnType<typeof selectFromGraph>;