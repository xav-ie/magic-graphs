import type { Graph, SchemaItem } from "./types";

export const selectNode = (graph: Graph) => {
  return selectFromGraph(graph, item => item.graphType === 'node');
};

export const selectFromGraph = (graph: Graph, predicate: (item: SchemaItem) => boolean) => {

  let resolver: (value: SchemaItem | PromiseLike<SchemaItem>) => void;
  let rejecter: (reason?: any) => void;

  const promise = new Promise<SchemaItem>((res, rej) => {
    resolver = res;
    rejecter = rej;
  });

  const onClick = (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    const item = graph.getSchemaItemsByCoordinates(offsetX, offsetY).pop();
    if (item && predicate(item)) resolve(item);
  }

  graph.subscribe('onClick', onClick);

  const initialUserEditable = graph.settings.value.userEditable;
  const initialFocusable = graph.settings.value.focusable;

  graph.settings.value.userEditable = false;
  graph.settings.value.focusable = false;

  const cleanup = () => {
    graph.unsubscribe('onClick', onClick);
    graph.settings.value.userEditable = initialUserEditable;
    graph.settings.value.focusable = initialFocusable;
  }

  const resolve = (item: SchemaItem) => {
    cleanup();
    resolver(item);
  }

  const cancel = () => {
    cleanup();
    rejecter('cancelled');
  }

  return {
    promise,
    cancel
  };
};