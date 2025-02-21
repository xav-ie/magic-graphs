<script setup lang="ts">
  import { computed, ref } from 'vue';
  import GButton from '@ui/graph/button/GButton.vue';
  import CIcon from '@ui/core/Icon.vue';
  import GDialog from '@ui/core/GDialog.vue';
  import GWell from '@ui/graph/GWell.vue';
  import { nonNullGraph as graph } from '@graph/global';

  const showDialog = ref(false);

  const { nameToBindingKeys } = graph.value.shortcut;

  const keybindings = computed<Record<string, string>>(() => {
    return {
      ...nameToBindingKeys.value,
      Fullscreen: 'F',
      'Pause/Play Simulation': 'Space',
      'Simulation Step Forward': 'ArrowRight',
      'Simulation Step Backward': 'ArrowLeft',
    };
  });

  // TODO: add categories

  const convertKeyStringToKeys = (keyString: string) => {
    const keys = keyString
      .split('+')
      .map((key) => key.trim())
      .filter((key) => key !== '');
    return keys;
  };

  const redirect = (route: string) => {
    window.open(route, '_blank');
  };
</script>

<template>
  <GButton
    @click="showDialog = !showDialog"
    class="aspect-square"
  >
    <CIcon icon="help"></CIcon>
  </GButton>

  <GDialog
    v-model:visible="showDialog"
    header="Help"
  >
    <GWell class="mb-6">
      <GButton
        @click="
          redirect(
            'https://github.com/Yonava/magic-graphs/issues/new?template=Blank%20issue',
          )
        "
        class="flex justify-center mb-1"
        secondary
      >
        <CIcon icon="bug"></CIcon>
        Find an Issue?
      </GButton>
      <GButton
        @click="redirect('https://github.com/Yonava/magic-graphs')"
        secondary
        class="flex justify-center"
      >
        <CIcon icon="star-outline"></CIcon>
        Like the project? Give it a star!
      </GButton>
    </GWell>
    <h1 class="font-bold text-md">Commands</h1>
    <GWell class="flex-col w-[500px]">
      <div
        v-for="command in Object.keys(keybindings)"
        :key="command"
        class="flex justify-between py-1 items-center"
      >
        {{ command }}
        <div class="flex py-1">
          <GWell
            v-for="keyBinding in convertKeyStringToKeys(keybindings[command])"
            :key="keyBinding"
            :class="[
              'border-[1px]',
              'rounded-md',
              'px-2',
              'mx-[1px]',
              'text-[10px]',
            ]"
          >
            {{ keyBinding }}
          </GWell>
        </div>
      </div>
    </GWell>
  </GDialog>
</template>
