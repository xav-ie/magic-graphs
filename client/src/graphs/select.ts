import type { Graph, SchemaItem } from "./types";

const selectFromGraph = (graph: Graph, predicate: (item: SchemaItem) => boolean) => {

  const captureNodeFn = (res: (value: GNode | PromiseLike<GNode>) => void) => (event: MouseEvent) => {
    const { offsetX, offsetY } = event;
    const node = graph.getNodeByCoordinates(offsetX, offsetY);
    if (node) res(node);
  }

  const captureNode = async () => {
    graph.settings.value.userEditable = false;
    graph.settings.value.focusable = false;
    let captureFn;
    const node = await new Promise<GNode>((res) => {
      captureFn = captureNodeFn(res);
      graph.subscribe('onClick', captureFn);
    });
    if (captureFn) graph.unsubscribe('onClick', captureFn);
    graph.settings.value.userEditable = true;
    graph.settings.value.focusable = true;
    return node;
  }

  const makingSource = ref(false);
  const makeSource = async () => {
    makingSource.value = true;
    const node = await captureNode();
    graph.nodes.value.forEach(node => {
      if (node.label === SOURCE_LABEL) node.label = newNodeLabel();
    });
    node.label = SOURCE_LABEL;
    graph.trackGraphState();
    makingSource.value = false;
  }

};