<script setup lang="ts">
import GraphPlayground from '@playground/graph/GraphPlayground.vue';
import ShapePlayground from '@playground/shape/ShapePlayground.vue';
import SearchVisualizer from '@product/search-visualizer/Main.vue'

</script>

<template>
  <div class="w-[100vw] h-[100vh] relative">
    <!-- <GraphPlayground /> -->
    <ShapePlayground />
    <!-- <SearchVisualizer /> -->
  </div>
</template>

<style>
/* hide the bars that show up when you scroll */
*::-webkit-scrollbar {
  display: none;
}

* {
  user-select: none;
}

html, body {
  overscroll-behavior-x: none;
}

/* class for exclusive use by useGraphTutorial, should be move out to css file at some point */
.element-highlight {
  animation: highlight 1s infinite;
}

@keyframes highlight {
  0% {
    background-color: #f6ad55;
    scale: 1;
    transform: translate(0, 0);
    box-shadow: none;
  }
  50% {
    background-color: #ed8936;
    scale: 1.3;
    box-shadow:  0px 0px 50px 15px #ed893650;
  }
  100% {
    background-color: #f6ad55;
    scale: 1;
    transform: translate(0, 0);
    box-shadow: none;
  }
}
</style>