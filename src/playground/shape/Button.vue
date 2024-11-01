<template>
  <button
    :class="[
      'px-2',
      'py-1',

      'bg-gray-800',
      'text-gray-200',

      'dark:bg-gray-200',
      'dark:text-gray-800',

      'hover:bg-gray-700',
      'dark:hover:bg-gray-300',

      'rounded-md',
      'cursor-pointer',
      'font-bold',
    ]"
  >
    <slot></slot>
  </button>
</template>
