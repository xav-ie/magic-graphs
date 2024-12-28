<script setup lang="ts">
  import { ref } from "vue";
  import GWell from "@ui/graph/GWell.vue";
  import GButton from "@ui/graph/button/GButton.vue";
  import type { TreeControls } from "../useTree";

  const props = defineProps<{
    tree: TreeControls;
  }>();

  const key = ref(1);

  const removeKey = ref(1);

  const addNode = () => {
    console.log("addNode", key.value);
    props.tree.insertNode(key.value++);
  };

  const removeNode = () => {
    console.log("removeNode", removeKey.value);
    props.tree.removeNode(removeKey.value);
  };
</script>

<template>
  <div class="flex flex-col gap-3">
    <GWell
      secondary
      class="rounded-lg flex gap-2 p-2"
    >
      <GButton
        @click="addNode"
        tertiary
      >
        Add Node ({{ key }})
        <input
          @click.stop
          v-model.number="key"
          class="w-12 bg-transparent"
        />
      </GButton>

      <GButton
        @click="removeNode"
        tertiary
      >
        Remove Node ({{ removeKey }})
        <input
          @click.stop
          v-model.number="removeKey"
          class="w-12 bg-transparent"
        />
      </GButton>
    </GWell>
  </div>
</template>
