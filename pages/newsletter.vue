<template>
  <section class="mb-8">
    <div class="page-content page text-center md:text-left">
      <subscribe/>
    </div>
  </section>
</template>

<script>
import Subscribe from '~/components/Subscribe.vue'

export default {
  components: {
    Subscribe
  },
  head() {
    return {
      title: "Newsletter - Will Browning"
    }
  }
}
</script>
