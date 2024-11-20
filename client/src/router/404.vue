<template>
  <div
    class="w-full h-full dark:bg-gray-800 dark:text-white font-bold text-3xl flex justify-center"
  >
    <div class="absolute text-center mt-12 max-w-[600px] flex flex-col items-center justify-center gap-8">
        <div class="bg-gray-900 rounded-full h-60 w-60 flex items-center justify-center">
          <v-icon style="font-size: 150px">
            mdi-rabbit-variant-outline
          </v-icon>
        </div>
      <h1>
        <span class="text-4xl">Poof!</span> <br> Looks like
        <span
          class="bg-gradient-to-tr dark:from-purple-600 dark:to-orange-500 from-purple-500 to-orange-500 text-transparent bg-clip-text"
        >
          Magic Algorithms
        </span>
        pulled a disappearing act. Cast this spell to
        <router-link
          to="/"
          class="text-blue-500 hover:underline"
        >return</router-link>.
      </h1>
    </div>
  </div>
</template>
