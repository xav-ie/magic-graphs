<script setup lang="ts">
import { ref, computed } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import readOnlyRangesExtension from 'codemirror-readonly-ranges';
import type { EditorState } from '@codemirror/state';

const code = defineModel<string>()

const getReadOnlyRanges = (targetState: EditorState) => ([
  {
    from: undefined,
    to: targetState.doc.line(1).to
  },
  {
    from: targetState.doc.line(targetState.doc.lines - 1).to,
    to: undefined
  }
])

const extensions = computed(() => [
  javascript(), // adds javascript syntax highlighting
  oneDark, // adds dark theme
  readOnlyRangesExtension(getReadOnlyRanges), // makes certain lines read-only
]);
</script>

<template>
  <codemirror
    v-model="code"
    :tabSize="2"
    :extensions="extensions"
    :style="{
      background: 'gray',
      height: '320px',
      paddingLeft: '10px',
    }"
    class="text-lg"
  />
</template>
