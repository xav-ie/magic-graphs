<script setup lang="ts">
  import type { GraphPlaygroundButton } from '@graph/buttons/types';
  import CButton from '@ui/core/button/Button.vue';

  const { btns } = defineProps<{
    btns: GraphPlaygroundButton[];
  }>();

  const showBtn = (cond: (() => boolean) | undefined) => (cond ? cond() : true);
</script>

<template>
  <div
    v-for="btn in btns"
    :key="btn.id"
  >
    <CButton
      v-if="showBtn(btn.cond)"
      @click.stop="btn.action"
      :id="btn.id"
      :color="btn.color()"
      text-color="white"
    >
      <span class="select-none">
        {{ btn.label() }}
      </span>
    </CButton>
  </div>
</template>
