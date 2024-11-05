<script setup lang="ts">
import { ref } from "vue";
import type { Graph } from "@graph/types";
import colors from "@colors";
import TextInput from "@playground/ui/InputText.vue";
import ColorInput from "@playground/ui/InputColor.vue";
import Button from "@playground/ui/Button.vue";

defineProps<{
  graph: Graph;
}>()

const roomId = ref("graph-playground");

</script>

<template>
  <TextInput
    v-model="graph.meAsACollaborator.value.name"
    :disabled="graph.inCollaborativeRoom.value"
    placeholder="Your Name"
  />

  <ColorInput
    v-model="graph.meAsACollaborator.value.color"
    :disabled="graph.inCollaborativeRoom.value"
  />

  <TextInput
    v-model="roomId"
    :disabled="graph.inCollaborativeRoom.value"
    placeholder="Collaborative Room ID"
  />

  <Button
    v-if="!graph.inCollaborativeRoom.value"
    @click="graph.joinCollaborativeRoom(roomId)"
    class="bg-blue-500 text-white"
  >
    Join Room
  </Button>

  <Button
    v-else
    @click="graph.leaveCollaborativeRoom()"
    :color="colors.RED_500"
    :textColor="colors.WHITE"
  >
    Leave Room
  </Button>
</template>
