<script setup lang="ts">
  import { computed, ref } from 'vue';
  import GButton from '@ui/graph/button/GButton.vue';
  import CIcon from '@ui/core/Icon.vue';
  import GDialog from '@ui/core/GDialog.vue';
  import GWell from '@ui/graph/GWell.vue';
  import { nonNullGraph as graph } from '@graph/global';

  const showDialog = ref(false);

  const { platformBindings } = graph.value.shortcut;

  const bindings = computed(() => {
    const result: Record<string, string> = {};
    const bindingNames = Object.entries(platformBindings);
    for (const [name, bindingInfo] of bindingNames) {
      result[name] = bindingInfo.binding;
    }
    return result;
  });

  const keyToNameMap: Record<string, string> = {
    meta: 'Command',
    ctrl: 'Control',
  };

  const keyToIconMap: Record<string, string> = {
    rightArrow: 'arrow-right',
    leftArrow: 'arrow-left',
  };

  const keybindings = computed<Record<string, string>>(() => {
    return {
      ...bindings.value,
      Fullscreen: 'f',
      'Pause/Play Simulation': 'space',
      'Simulation Step Forward': 'rightArrow',
      'Simulation Step Backward': 'leftArrow',
    };
  });

  const keyBindingNames = computed(() => Object.keys(keybindings.value));

  const convertKeyStringToKeys = (keyString: string) => {
    return keyString
      .split('+')
      .map((key) => keyToNameMap[key.trim()] ?? key.trim())
      .filter((key) => key !== '');
  };

  const redirect = (route: string) => {
    window.open(route, '_blank');
  };

  const GH_REPO_LINK = 'https://github.com/Yonava/magic-graphs';
</script>

<template>
  <GButton
    @click="showDialog = !showDialog"
    class="aspect-square w-[45px]"
  >
    <CIcon icon="help"></CIcon>
  </GButton>

  <GDialog
    v-model:visible="showDialog"
    header="Help"
  >
    <GWell class="mb-6">
      <GButton
        @click="redirect(`${GH_REPO_LINK}/issues/new?template=Blank%20issue`)"
        class="flex justify-center mb-1"
        secondary
      >
        <CIcon icon="bug"></CIcon>
        Find an Issue?
      </GButton>
      <GButton
        @click="redirect(GH_REPO_LINK)"
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
        v-for="command in keyBindingNames"
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
              'text-xs',
            ]"
          >
            <CIcon
              v-if="keyToIconMap[keyBinding]"
              :icon="keyToIconMap[keyBinding]"
              class="text-xs"
            />

            <p v-else>
              {{ keyBinding.toUpperCase() }}
            </p>
          </GWell>
        </div>
      </div>
    </GWell>
  </GDialog>
</template>
