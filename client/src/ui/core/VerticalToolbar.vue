<template>
  <div class="flex flex-col">
    <div class="p-2 bg-gray-800 rounded-xl">
      <NodeEdgeColorInput
        :graph="props.graph"
        :colorMap="colorMap"
      />
    </div>
  </div>
</template>
