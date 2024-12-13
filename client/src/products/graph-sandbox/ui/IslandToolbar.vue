<script setup lang="ts">
  import { computed } from "vue";
  import { graph } from "@graph/global";
  import { useGraphTutorial } from "@graph/tutorials/useGraphTutorial";
  import GToolbar from "@ui/graph/toolbar/GToolbarBase.vue";
  import GToolbarButton from "@ui/graph/toolbar/GToolbarButton.vue";
  import GToolbarDivider from "@ui/graph/toolbar/GToolbarDivider.vue";
  import ToolbarButtonGroup from "@ui/core/toolbar/ToolbarButtonGroup.vue";
  import GraphInfoMenu from "./GraphInfoMenu/GraphInfoMenu.vue";
  import CollaborativeSessionMenu from "./CollaborativeSessionMenu.vue";
  import TreeShapeMenu from "./TreeShapeMenu.vue";

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
    graph.value.canvasFocused.value = true;
  };

  const undo = () => graph.value.shortcutActions.undo.value();
  const redo = () => graph.value.shortcutActions.redo.value();

  const canUndo = computed(() => {
    const { annotationActive, canUndo, canUndoAnnotation, settings } =
      graph.value;
    if (annotationActive.value) return canUndoAnnotation.value;
    if (!settings.value.interactive) return false;
    return canUndo.value;
  });

  const canRedo = computed(() => {
    const { annotationActive, canRedo, canRedoAnnotation, settings } =
      graph.value;
    if (annotationActive.value) return canRedoAnnotation.value;
    if (!settings.value.interactive) return false;
    return canRedo.value;
  });
</script>

<template>
  <GToolbar :hint="hint">
    <ToolbarButtonGroup class="gap-0">
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

    <ToolbarButtonGroup class="gap-0">
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

    <ToolbarButtonGroup class="gap-0">
      <GToolbarButton
        @click="undo"
        :disabled="!canUndo"
        icon="undo"
      />

      <GToolbarDivider />

      <GToolbarButton
        @click="redo"
        :disabled="!canRedo"
        icon="redo"
      />
    </ToolbarButtonGroup>

    <ToolbarButtonGroup>
      <GToolbarButton
        @click="toggleAnnotation"
        :active="graph.annotationActive.value"
        icon="edit"
      />

      <GraphInfoMenu v-slot="{ toggle, isOpen }">
        <GToolbarButton
          @click="toggle"
          :active="isOpen"
          icon="info_outline"
        />
      </GraphInfoMenu>

      <CollaborativeSessionMenu v-slot="{ toggle, isOpen }">
        <GToolbarButton
          @click="toggle"
          :active="isOpen"
          icon="group"
        />
      </CollaborativeSessionMenu>

      <TreeShapeMenu v-slot="{ toggle, isOpen }">
        <GToolbarButton
          @click="toggle"
          :active="isOpen"
          :icon="isOpen ? 'forest' : 'forest_outline'"
        />
      </TreeShapeMenu>
    </ToolbarButtonGroup>
  </GToolbar>
</template>
