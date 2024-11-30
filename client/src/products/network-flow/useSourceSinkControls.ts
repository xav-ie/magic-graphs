import { ref } from "vue";
import type { Ref } from "vue";
import type { GNode } from "@graph/types";
import { graph } from "@graph/global";
import { selectFromGraph } from "@graph/select";
import type { SelectControls } from "@graph/select";

export const sourceNode = ref<GNode>();
export const sinkNode = ref<GNode>();

export const cancelSetSourceNode = ref<SelectControls['cancelSelection']>();
export const cancelSetSinkNode = ref<SelectControls['cancelSelection']>();

const nodeSelector = async (
  nodeRef: Ref<GNode | undefined>,
  cancelRef: Ref<SelectControls['cancelSelection'] | undefined>,
) => {
  const { selectedItemPromise, cancelSelection } = selectFromGraph(graph.value, {
    predicate: (item) => {
      const alreadySource = item.id === sourceNode.value?.id
      const alreadySink = item.id === sinkNode.value?.id
      const isAlreadySourceOrSink = alreadySource || alreadySink;
      if (isAlreadySourceOrSink) return false;
      return item.graphType === 'node'
    },
  });

  cancelRef.value = cancelSelection;

  const nodeSchema = await selectedItemPromise;
  if (!nodeSchema) return cancelRef.value = undefined; // cancelled

  const node = graph.value.getNode(nodeSchema.id);
  if (!node) throw new Error('illegitimate schema item returned from selectNode');

  nodeRef.value = node;
  cancelRef.value = undefined;
}

export const setSourceNode = () => nodeSelector(sourceNode, cancelSetSourceNode);
export const setSinkNode = () => nodeSelector(sinkNode, cancelSetSinkNode);