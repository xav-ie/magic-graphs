<script setup lang="ts">
  import { ref } from "vue";
  import { graph } from "@graph/global";
  import GButton from "@ui/graph/button/GButton.vue";
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
    <GButton
      v-if="!settingSourceNode"
      @click="selectSrc"
    >
      Switch Source
    </GButton>

    <GButton
      v-else
      @click="cancel"
      :color="colors.RED_500"
      :text-color="colors.WHITE"
    >
      Cancel
    </GButton>

    <GButton
      v-if="!settingSinkNode"
      @click="selectSink"
    >
      Switch Sink
    </GButton>

    <GButton
      v-else
      @click="cancel"
      :color="colors.RED_500"
      :text-color="colors.WHITE"
    >
      Cancel
    </GButton>
  </div>
</template>
