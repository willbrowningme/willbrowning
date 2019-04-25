<template>
  <div class="flex flex-row justify-center">
    <div class="relative overflow-hidden content flex flex-col p-4 md:p-8">
      <page-header/>
      <main-nav/>
      <nuxt/>
      <page-footer/>
    </div>
  </div>
</template>

<script>
import PageHeader from '~/components/PageHeader.vue'
import MainNav from '~/components/MainNav.vue'
import PageFooter from '~/components/PageFooter.vue'

export default {
  components: {
    PageHeader,
    MainNav,
    PageFooter
  }
}
</script>