<script setup lang="ts">
  import type { Graph } from "@graph/types";
  import Toolbar from "./Toolbar.vue";
  import ToolbarButton from "./ToolbarButton.vue";
  import ToolbarButtonDivider from "./ToolbarButtonDivider.vue";
  import ToolbarButtonGroup from "./ToolbarButtonGroup.vue";
  import { useGraphTutorial } from "@graph/tutorials/useGraphTutorial";
  import ToolbarHint from "./ToolbarHint.vue";
  import type { AnnotationControls } from "@playground/annotation/useGraphAnnotation";
  import { toRefs } from "vue";

  const props = defineProps<{
    graph: Graph;
    annotationControls: AnnotationControls;
  }>();

  const { isActive } = toRefs(props.annotationControls);

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
  };

  const toggleAnnotation = () => {
    const { activate, deactivate } = props.annotationControls;
    isActive.value ? deactivate() : activate();
  };
</script>

<template>
  <Toolbar>
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
        @click="graph.settings.value.isGraphDirected = true"
        :active="graph.settings.value.isGraphDirected"
      >
        mdi-arrow-right-thin
      </ToolbarButton>

      <ToolbarButtonDivider />

      <ToolbarButton
        @click="graph.settings.value.isGraphDirected = false"
        :active="!graph.settings.value.isGraphDirected"
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
        :disabled="graph.focusedItemIds.value.size === 0 || isActive"
      >
        mdi-eraser
      </ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton>mdi-account-group</ToolbarButton>
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton
        @click="toggleAnnotation"
        :active="isActive"
      >
        mdi-pencil
      </ToolbarButton>
    </ToolbarButtonGroup>
  </Toolbar>

  <ToolbarHint :tutorial="tutorial" />
</template>
