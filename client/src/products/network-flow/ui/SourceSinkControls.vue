<script setup lang="ts">
  import { ref } from "vue";
  import { graph } from "@graph/global";
  import Button from "@ui/Button.vue";
  import colors from "@utils/colors";
  import state from "../state";

  const settingSourceNode = ref(false);
  const settingSinkNode = ref(false);

  const selectSrc = async () => {
    settingSourceNode.value = true;
    await state.setNode(graph.value, state.sourceNode);
    settingSourceNode.value = false;
  };

  const selectSink = async () => {
    settingSinkNode.value = true;
    await state.setNode(graph.value, state.sinkNode);
    settingSinkNode.value = false;
  };

  const cancel = () => state.cancelNodeSelection.value?.();
</script>

<template>
  <div class="flex gap-3">
    <Button
      v-if="!settingSourceNode"
      @click="selectSrc"
    >
      Switch Source
    </Button>

    <Button
      v-else
      @click="cancel"
      :color="colors.RED_500"
      :text-color="colors.WHITE"
    >
      Cancel
    </Button>

    <Button
      v-if="!settingSinkNode"
      @click="selectSink"
    >
      Switch Sink
    </Button>

    <Button
      v-else
      @click="cancel"
      :color="colors.RED_500"
      :text-color="colors.WHITE"
    >
      Cancel
    </Button>
  </div>
</template>
