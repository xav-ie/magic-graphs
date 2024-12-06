<script setup lang="ts">
  import { graph } from "@graph/global";
  import { useGraphTutorial } from "@graph/tutorials/useGraphTutorial";
<<<<<<< HEAD
  import Toolbar from "./toolbar/Toolbar.vue";
  import ToolbarButton from "./toolbar/ToolbarButton.vue";
  import ToolbarButtonDivider from "./toolbar/ToolbarButtonDivider.vue";
  import ToolbarButtonGroup from "./toolbar/ToolbarButtonGroup.vue";
  import GraphInfoMenu from "./GraphInfoMenu/GraphInfoMenu.vue";
=======
  import GToolbar from "@ui/graph/toolbar/GToolbarBase.vue";
  import GToolbarButton from "@ui/graph/toolbar/GToolbarButton.vue";
  import GToolbarDivider from "@ui/graph/toolbar/GToolbarDivider.vue";
  import ToolbarButtonGroup from "@ui/core/toolbar/ToolbarButtonGroup.vue";
  import GraphInfoMenu from "./GraphInfoMenu.vue";
>>>>>>> graph-components
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
  <GToolbar :hint="hint">
    <ToolbarButtonGroup>
      <GToolbarButton
        @click="graph.settings.value.displayEdgeLabels = true"
        :active="graph.settings.value.displayEdgeLabels"
        icon="label_outline"
      />

      <GToolbarDivider />

      <GToolbarButton
        @click="graph.settings.value.displayEdgeLabels = false"
        :active="!graph.settings.value.displayEdgeLabels"
        icon="label_off_outline"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <GToolbarButton
        @click="graph.settings.value.isGraphDirected = true"
        :active="graph.settings.value.isGraphDirected"
        icon="arrow_right_alt"
      />

      <GToolbarDivider />

      <GToolbarButton
        @click="graph.settings.value.isGraphDirected = false"
        :active="!graph.settings.value.isGraphDirected"
        icon="remove"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <GToolbarButton
        @click="graph.undo()"
        :disabled="!graph.canUndo.value"
        icon="undo"
      />

      <GToolbarDivider />

      <GToolbarButton
        @click="graph.redo()"
        :disabled="!graph.canRedo.value"
        icon="redo"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <GToolbarButton
        @click="toggleAnnotation"
        :active="graph.annotationActive.value"
        icon="edit"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <GraphInfoMenu v-slot="{ toggle, isOpen }">
        <GToolbarButton
          @click="toggle"
          :active="isOpen"
          icon="info_outline"
        />
      </GraphInfoMenu>
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <CollaborativeSessionMenu v-slot="{ toggle, isOpen }">
        <GToolbarButton
          @click="toggle"
          :active="isOpen"
          icon="group"
        />
      </CollaborativeSessionMenu>
    </ToolbarButtonGroup>
  </GToolbar>
</template>
