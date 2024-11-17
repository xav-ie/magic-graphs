import type { Graph, SchemaItem } from "./types";

export const selectNode = (graph: Graph) => {
  return selectFromGraph(graph, item => item.graphType === 'node');
};

export const selectFromGraph = (graph: Graph, predicate: (item: SchemaItem) => boolean) => {

  let resolver: (value: SchemaItem | PromiseLike<SchemaItem> | undefined) => void;

  const promise = new Promise<SchemaItem | undefined>((res) => resolver = res);

  const onClick = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    const item = graph.getSchemaItemsByCoordinates(offsetX, offsetY).pop();
    if (item && predicate(item)) resolve(item);
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
  }

  /**
   * cleans up the selection process
   */
  const cleanup = () => {
    graph.unsubscribe('onClick', onClick);
    graph.settings.value.userEditable = initialUserEditable;
    graph.settings.value.focusable = initialFocusable;
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
  const cancel = () => {
    cleanup();
    resolver(undefined);
  }

  init();

  return {
    /**
     * resolves to the selected item or undefined if the
     * selection was cancelled by calling the cancel handler
     */
    promise,
    cancel
  };
};

export type SelectControls = ReturnType<typeof selectFromGraph>;