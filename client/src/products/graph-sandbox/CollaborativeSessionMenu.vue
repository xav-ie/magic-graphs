<script setup lang="ts">
  import { computed, ref } from "vue";
  import { collabControls, myCollaboratorProfile } from "@graph/collab";
  import { debounce } from "@utils/debounce";
  import Button from "@ui/Button.vue";
  import GraphSandboxProductInfo from "./info";
  import type { Graph } from "@graph/types";
  import { generateId } from "@graph/helpers";
  import colors from "@utils/colors";

  const props = defineProps<{
    graph: Graph;
  }>();

  const {
    connectToRoom,
    isConnected,
    connectedRoomId,
    disconnectFromRoom,
    collaborators,
    collaboratorCount,
    meAsACollaborator,
  } = collabControls;

  const link = computed(() => {
    return `${window.location.origin}?rid=${connectedRoomId.value}`;
  });

  const linkCopied = ref(false);
  const resetLinkCopied = debounce(() => {
    linkCopied.value = false;
  }, 2000);

  const startingRoom = ref(false);

  const copyLink = () => {
    try {
      navigator.clipboard.writeText(link.value);
      linkCopied.value = true;
      resetLinkCopied();
    } catch (e) {
      console.error("Failed to copy link to clipboard", e);
    }
  };

  const startCollaboration = async () => {
    startingRoom.value = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    await connectToRoom({
      roomId: generateId(),
      productId: GraphSandboxProductInfo.productId,
      graph: props.graph,
    });
    startingRoom.value = false;
  };
</script>

<template>
  <v-menu
    :offset="[10, 0]"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ props, isActive }">
      <div v-bind="props">
        <slot :isActive="isActive"></slot>
      </div>
    </template>

    <div class="bg-gray-800 flex flex-col text-white p-3 w-[400px] rounded-lg">
      <h1 class="text-2xl font-bold text-gray-200 mb-3">Collaborate</h1>

      <h2 class="text-xl font-bold text-gray-200 mb-2">My Name</h2>
      <div class="rounded-lg mb-2">
        <input
          v-model="myCollaboratorProfile.name"
          :disabled="isConnected || startingRoom"
          type="text"
          class="bg-gray-700 text-white w-full p-2 rounded-lg outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="The name you want others to see"
        />
      </div>

      <div class="w-full mt-2">
        <Button
          v-if="!isConnected && !startingRoom"
          @click="startCollaboration"
          :disabled="!myCollaboratorProfile.name"
          class="w-full"
        >
          Generate Link
          <v-icon class="ml-2">mdi-link</v-icon>
        </Button>

        <Button
          v-else-if="startingRoom"
          disabled
          class="w-full"
        >
          Preparing Room...
        </Button>

        <div v-else>
          <div
            class="group p-2 bg-gray-900 bg-opacity-50 hover:bg-opacity-100 text-gray-300 rounded-lg cursor-pointer flex justify-between items-center"
            @click="copyLink"
          >
            <span>
              {{ link }}
            </span>
            <v-icon
              v-if="!linkCopied"
              class="text-gray-400 opacity-0 group-hover:opacity-100"
            >
              mdi-content-copy
            </v-icon>
            <v-icon
              v-if="linkCopied"
              class="text-green-400 opacity-0 group-hover:opacity-100"
            >
              mdi-check-underline
            </v-icon>
          </div>
        </div>
      </div>

      <div
        v-if="isConnected"
        class="mt-4 w-full"
      >
        <Button
          @click="disconnectFromRoom"
          :color="colors.RED_600"
          :text-color="colors.WHITE"
          class="w-full"
        >
          Disconnect
        </Button>
      </div>

      <div v-if="isConnected && meAsACollaborator">
        <h2 class="text-xl font-bold text-gray-200 mt-4 mb-2">
          Collaborators ({{ collaboratorCount }})
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <div :class="`text-gray-300 bg-[${meAsACollaborator.color}] font-bold rounded-md px-3 py-1`">
            {{ meAsACollaborator.name }}
          </div>
          <div
            v-for="collaborator in collaborators"
            :key="collaborator.id"
            :class="`text-gray-300 bg-[${collaborator.color}] font-bold rounded-md px-3 py-1`"
          >
            {{ collaborator.name }}
          </div>
        </div>
      </div>
    </div>
  </v-menu>
</template>
