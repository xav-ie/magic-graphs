<script setup lang="ts">
  import Button from "@ui/Button.vue";
  import colors from "@utils/colors";
  import {
    setSourceNode,
    setSinkNode,
    cancelSetSourceNode,
    cancelSetSinkNode,
  } from "./useSourceSinkControls";
</script>

<template>
  <div class="flex gap-3">
    <Button
      v-if="!cancelSetSourceNode"
      @click="setSourceNode"
    >
      Switch Source
    </Button>

    <Button
      v-else
      @click="cancelSetSourceNode"
      :color="colors.RED_500"
      :text-color="colors.WHITE"
    >
      Cancel
    </Button>

    <Button
      v-if="!cancelSetSinkNode"
      @click="setSinkNode"
    >
      Switch Sink
    </Button>

    <Button
      v-else
      @click="cancelSetSinkNode"
      :color="colors.RED_500"
      :text-color="colors.WHITE"
    >
      Cancel
    </Button>
  </div>
</template>
