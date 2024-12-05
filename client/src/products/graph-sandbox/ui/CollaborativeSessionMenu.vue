<script setup lang="ts">
  import { computed, ref } from "vue";
  import { useRouter } from "vue-router";
  import { graph } from "@graph/global";
  import { collabControls, myCollaboratorProfile } from "@graph/collab";
  import { debounce } from "@utils/debounce";
  import colors from "@utils/colors";
  import { productIdToProduct, useProductRouting } from "@utils/product";
  import { darkenHex } from "@utils/colors";
  import { generateId } from "@utils/id";
  import GraphSandboxProductInfo from "../info";
  import CPopover from "@ui/core/Popover.vue";
  import CPopoverTooltip from "@ui/core/PopoverTooltip.vue";
  import CButton from "@ui/core/Button.vue";
  import CIcon from "@ui/core/Icon.vue";

  const router = useRouter();
  const { navigate } = useProductRouting();

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

    await connectToRoom({
      roomId: generateId(),
      productId: GraphSandboxProductInfo.productId,
      graph: graph.value,
    });

    router.push({ query: { rid: connectedRoomId.value } });
    startingRoom.value = false;
  };

  const stopCollaboration = () => {
    disconnectFromRoom();
    router.push({ query: { rid: undefined } });
  };
</script>

<template>
  <CPopover>
    <template #activator="props">
      <slot v-bind="props"></slot>
    </template>
    <div class="bg-gray-800 flex flex-col text-white p-3 w-[400px] rounded-lg">
      <h1 class="text-2xl font-bold text-gray-200 mb-3">Collaborate</h1>

      <h2 class="text-xl font-bold text-gray-200 mb-2">My Name</h2>
      <div class="rounded-lg mb-2">
        <input
          v-model="myCollaboratorProfile.name"
          :disabled="isConnected || startingRoom"
          type="text"
          id="collab-name"
          class="bg-gray-700 text-white w-full p-2 rounded-lg outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="The name you want others to see"
        />
      </div>

      <div class="w-full mt-2">
        <CButton
          v-if="!isConnected && !startingRoom"
          @click="startCollaboration"
          :disabled="!myCollaboratorProfile.name"
          class="w-full"
        >
          Generate Link
          <CIcon
            icon="link"
            class="ml-2"
          />
        </CButton>

        <CButton
          v-else-if="startingRoom"
          disabled
          class="w-full"
        >
          Preparing Room...
        </CButton>

        <div v-else>
          <div
            @click="copyLink"
            class="group p-2 bg-gray-900 bg-opacity-50 hover:bg-opacity-100 text-gray-300 rounded-lg cursor-pointer flex justify-between items-center"
          >
            <span>
              {{ link }}
            </span>
            <CIcon
              v-if="!linkCopied"
              icon="content_copy"
              class="text-gray-400 opacity-0 group-hover:opacity-100"
            />
            <CIcon
              v-if="linkCopied"
              icon="check_underline"
              class="text-green-400 opacity-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </div>

      <div
        v-if="isConnected"
        class="mt-4 w-full"
      >
        <CButton
          @click="stopCollaboration"
          :color="colors.RED_600"
          class="w-full"
        >
          Disconnect
        </CButton>
      </div>

      <div v-if="isConnected && meAsACollaborator">
        <h2 class="text-xl font-bold text-gray-200 mt-4 mb-2">
          Collaborators ({{ collaboratorCount }})
        </h2>
        <div class="flex flex-wrap items-center gap-2">
          <div
            v-tooltip.bottom="{
              value: `You are in ${
                productIdToProduct[meAsACollaborator.productId].name
              }`,
              pt: {
                text: 'bg-magic'
              },
            }"
            :style="{ backgroundColor: meAsACollaborator.color }"
            class="text-gray-300 font-bold rounded-md px-3 py-1"
          >
            {{ meAsACollaborator.name }} (You)
          </div>
          <button
            v-for="collaborator in collaborators"
            v-tooltip="
              `${collaborator.name} is in ${
                productIdToProduct[collaborator.productId].name
              }`
            "
            @click="navigate(productIdToProduct[collaborator.productId])"
            :key="collaborator.id"
            :style="{ backgroundColor: collaborator.color }"
            class="text-gray-300 font-bold rounded-md px-3 py-1"
          >
            {{ collaborator.name }}
          </button>
        </div>
      </div>
    </div>
  </CPopover>
</template>
