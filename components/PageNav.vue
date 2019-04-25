<template>
  <div class="flex flex-col md:flex-row justify-center py-4 my-8">
    <div class="md:w-2/5 text-center md:text-right">
      <div class="text-gray-500 text-sm tracking-wider mb-1">
        PREVIOUS
      </div>
      <div v-if="prevPost">
        <a :href="`/${prevPost.title_slug}`" class="text-sm text-blue-400">
          {{ prevPost.title }}
        </a>
      </div>
      <div v-else class="italic text-gray-800">
        You're at the beginning!
      </div>
    </div>
    <div class="flex items-center justify-center my-4 md:my-0 mx-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-2 -2 24 24"
        width="24"
        height="24"
        class="fill-current text-gray-500 align-middle"
      >
        <path d="M2 3v4h12.98l2.853-1.714a.333.333 0 0 0 0-.572L14.98 3H2zm6-2a1 1 0 1 1 2 0h4.98a2 2 0 0 1 1.03.286L18.863 3a2.333 2.333 0 0 1 0 4L16.01 8.714A2 2 0 0 1 14.98 9H10v1h7.995a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H10v1a1 1 0 0 1-2 0v-1H5.015a2 2 0 0 1-1.03-.286L1.132 16a2.333 2.333 0 0 1 0-4l2.853-1.714A2 2 0 0 1 5.015 10H8V9H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h6zm9.995 11H5.015l-2.853 1.714a.333.333 0 0 0 0 .572L5.015 16h12.98v-4z"></path>
      </svg>
    </div>
    <div class="md:w-2/5 text-center md:text-left">
      <div class="text-gray-500 text-sm tracking-wider mb-1">
        NEXT
      </div>
      <div v-if="nextPost">
        <a :href="`/${nextPost.title_slug}`" class="text-sm text-blue-400">
          {{ nextPost.title }}
        </a>
      </div>
      <div v-else class="italic">
        You're at the end!
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['prevPost', 'nextPost']
}
</script>

