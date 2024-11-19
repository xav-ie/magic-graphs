<script setup lang="ts"></script>

<template>
  <div :class="'flex items-center relative ' + $attrs.class">
    <slot></slot>
  </div>
</template>
