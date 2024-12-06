<script setup lang="ts">
  import type { GraphPlaygroundButton } from "@graph/buttons/types";
  import CButton from "@ui/core/Button.vue";

  const { btns } = defineProps<{
    btns: GraphPlaygroundButton[];
  }>();

  const showBtn = (cond: (() => boolean) | undefined) => (cond ? cond() : true);
</script>

<template>
  <div v-for="btn in btns">
    <CButton
      v-if="showBtn(btn.cond)"
      @click.stop="btn.action"
      :color="btn.color()"
      text-color="white"
      :id="btn.id"
    >
      <span class="select-none">
        {{ btn.label() }}
      </span>
    </CButton>
  </div>
</template>
