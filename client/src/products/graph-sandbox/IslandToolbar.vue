<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import ToolbarButton from "./ToolbarButton.vue";
  import ToolbarButtonDivider from "./ToolbarButtonDivider.vue";
  import ToolbarButtonGroup from "./ToolbarButtonGroup.vue";
  import { useGraphTutorial } from "@graph/tutorials/useGraphTutorial";
  import { computed } from "vue";
  import ToolbarHint from "./ToolbarHint.vue";

  const props = defineProps<{
    graph: Graph;
  }>();

  const tutorial = useGraphTutorial(props.graph, [
    {
      dismiss: "onNodeAdded",
      hint: "Double click on the canvas to add a node.",
    },
    {
      dismiss: "onEdgeAdded",
      hint: "Hover node to show anchors, drag between them to add an edge.",
    },
  ]);

  tutorial.start();

  const eraseItems = () => {
    props.graph.bulkRemoveNode([...props.graph.focusedItemIds.value]);
    props.graph.bulkRemoveEdge([...props.graph.focusedItemIds.value]);
  }
</script>

<template>
  <div class="flex items-center gap-2 bg-gray-800 py-1 px-1 rounded-lg">
    <ToolbarButtonGroup>
      <ToolbarButton
        @click="graph.settings.value.displayEdgeLabels = true"
        :active="graph.settings.value.displayEdgeLabels"
      >
        mdi-label-outline
      </ToolbarButton>

      <ToolbarButtonDivider />

      <ToolbarButton
        @click="graph.settings.value.displayEdgeLabels = false"
        :active="!graph.settings.value.displayEdgeLabels"
      >
        mdi-label-off-outline
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton
        @click="graph.settings.value.userAddedEdgeType = 'directed'"
        :active="graph.settings.value.userAddedEdgeType === 'directed'"
      >
        mdi-arrow-right-thin
      </ToolbarButton>

      <ToolbarButtonDivider />

      <ToolbarButton
        @click="graph.settings.value.userAddedEdgeType = 'undirected'"
        :active="graph.settings.value.userAddedEdgeType === 'undirected'"
      >
        mdi-minus
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton
        @click="graph.undo()"
        :disabled="!graph.canUndo.value"
      >
        mdi-undo
      </ToolbarButton>

      <ToolbarButtonDivider />

      <ToolbarButton
        @click="graph.redo()"
        :disabled="!graph.canRedo.value"
      >
        mdi-redo
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton
        @click="eraseItems"
        :disabled="graph.focusedItemIds.value.size === 0"
      >
        mdi-eraser
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton>mdi-account-group</ToolbarButton>
    </ToolbarButtonGroup>
  </div>

  <ToolbarHint :tutorial="tutorial" />

</template>
