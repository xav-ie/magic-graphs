<script setup lang="ts">
  import type { GButton } from "./types";

  const { btns } = defineProps<{
    btns: GButton[];
  }>();

  const showBtn = (cond: (() => boolean) | undefined) => (cond ? cond() : true);
</script>

<template>
  <div v-for="btn in btns">
    <button
      v-if="showBtn(btn.cond)"
      @click.stop="btn.action"
      :class="`bg-${btn.color()}-600 text-white px-3 py-1 rounded-lg font-bold`"
      :id="btn.id"
    >
      <span class="select-none">
        {{ btn.label() }}
      </span>
    </button>
  </div>
</template>
