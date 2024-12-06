<script setup lang="ts">
  import { graph } from "@graph/global";
  import { useGraphTutorial } from "@graph/tutorials/useGraphTutorial";
  import Toolbar from "./toolbar/Toolbar.vue";
  import ToolbarButton from "./toolbar/ToolbarButton.vue";
  import ToolbarButtonDivider from "./toolbar/ToolbarButtonDivider.vue";
  import ToolbarButtonGroup from "./toolbar/ToolbarButtonGroup.vue";
  import GraphInfoMenu from "./GraphInfoMenu/GraphInfoMenu.vue";
  import CollaborativeSessionMenu from "./CollaborativeSessionMenu.vue";

  const hint = useGraphTutorial(graph.value, [
    {
      dismiss: "onNodeAdded",
      hint: "Double click on the canvas to add a node.",
    },
    {
      dismiss: "onEdgeAdded",
      hint: "Hover node to show anchors, drag between them to add an edge.",
    },
  ]);

  hint.start();

  const toggleAnnotation = () => {
    const {
      activateAnnotation: activate,
      deactivateAnnotation: deactivate,
      annotationActive: isActive,
    } = graph.value;

    isActive.value ? deactivate() : activate();
  };
</script>

<template>
  <Toolbar :hint="hint">
    <ToolbarButtonGroup>
      <ToolbarButton
        @click="graph.settings.value.displayEdgeLabels = true"
        :active="graph.settings.value.displayEdgeLabels"
        icon="label_outline"
      />

      <ToolbarButtonDivider />

      <ToolbarButton
        @click="graph.settings.value.displayEdgeLabels = false"
        :active="!graph.settings.value.displayEdgeLabels"
        icon="label_off_outline"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton
        @click="graph.settings.value.isGraphDirected = true"
        :active="graph.settings.value.isGraphDirected"
        icon="arrow_right_alt"
      />

      <ToolbarButtonDivider />

      <ToolbarButton
        @click="graph.settings.value.isGraphDirected = false"
        :active="!graph.settings.value.isGraphDirected"
        icon="remove"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton
        @click="graph.undo()"
        :disabled="!graph.canUndo.value"
        icon="undo"
      />

      <ToolbarButtonDivider />

      <ToolbarButton
        @click="graph.redo()"
        :disabled="!graph.canRedo.value"
        icon="redo"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <ToolbarButton
        @click="toggleAnnotation"
        :active="graph.annotationActive.value"
        icon="edit"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <GraphInfoMenu v-slot="{ toggle, isOpen }">
        <ToolbarButton
          @click="toggle"
          :active="isOpen"
          icon="info_outline"
        />
      </GraphInfoMenu>
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <CollaborativeSessionMenu v-slot="{ toggle, isOpen }">
        <ToolbarButton
          @click="toggle"
          :active="isOpen"
          icon="group"
        />
      </CollaborativeSessionMenu>
    </ToolbarButtonGroup>
  </Toolbar>
</template>
