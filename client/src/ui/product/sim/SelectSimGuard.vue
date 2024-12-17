<script setup lang="ts">
  import { computed } from "vue";
  import type { SimulationDeclaration } from "src/types";
  import CButton from "@ui/core/button/Button.vue";
  import CPopoverTooltip from "@ui/core/PopoverTooltip.vue";
  import colors from "@utils/colors";
  import GWell from "@ui/graph/GWell.vue";

  const props = defineProps<{
    simulation: SimulationDeclaration;
  }>();

  const reason = computed(() => props.simulation.canRun?.check());
</script>

<template>
  <div
    v-if="reason"
    class="absolute bg-black w-full h-full z-10 rounded-md bg-opacity-50 grid place-items-center"
  >
    <CPopoverTooltip>
      <CButton
        :color="colors.GRAY_900"
        :text-color="colors.RED_500"
        class="font-bold text-lg rounded-lg px-2 py-1"
      >
        {{ reason.title }}
      </CButton>
      <template #content>
        <GWell
          tertiary
          class="max-w-72 rounded-lg p-2"
        >
          <span
            v-html="reason.description"
            class="font-bold"
          ></span>
        </GWell>
      </template>
    </CPopoverTooltip>
  </div>
</template>
