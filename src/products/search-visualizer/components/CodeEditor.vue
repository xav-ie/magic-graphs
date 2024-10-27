<script setup lang="ts">
  import { computed } from "vue";
  import { Codemirror } from "vue-codemirror";
  import { javascript } from "@codemirror/lang-javascript";
  import { oneDark } from "@codemirror/theme-one-dark";
  import readOnlyRangesExtension from "codemirror-readonly-ranges";
  import type { EditorState } from "@codemirror/state";
import { CODE_MIRROR_DARK_BACKGROUND } from "../colors";

  const code = defineModel<string>();

  const getReadOnlyRanges = (targetState: EditorState) => [
    {
      from: undefined,
      to: targetState.doc.line(1).to,
    },
    {
      from: targetState.doc.line(targetState.doc.lines - 1).to,
      to: undefined,
    },
  ];

  const extensions = computed(() => [
    javascript(), // adds javascript syntax highlighting
    oneDark, // adds dark theme
    readOnlyRangesExtension(getReadOnlyRanges), // makes certain lines read-only
  ]);
</script>

<template>
  <div class="relative w-full h-full">
    <codemirror
      v-model="code"
      :tabSize="2"
      :extensions="extensions"
    />

    <!-- background matte -->
    <div :class="[
      'absolute',
      'top-0',
      'w-full',
      'h-full',
      '-z-10',
      `bg-[${CODE_MIRROR_DARK_BACKGROUND}]`,
    ]"></div>
  </div>
</template>
