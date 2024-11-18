<template>
  <div
    class="w-full h-full dark:bg-gray-800 dark:text-white font-bold text-3xl flex justify-center"
  >
    <div class="absolute text-center mt-12 max-w-[550px]">
      <v-icon class="my-8" style="font-size: 150px">mdi-rabbit-variant-outline</v-icon>
      <h1>
        Poof! Looks like
        <span
          class="bg-gradient-to-tr dark:from-purple-600 dark:to-orange-500 from-purple-500 to-orange-500 text-transparent bg-clip-text"
        >
          Magic Algorithms
        </span>
        pulled a disappearing act. Cast this spell to
        <router-link
          to="/"
          class="text-blue-500 hover:underline"
        >
          return
        </router-link>
      </h1>
    </div>
  </div>
</template>
