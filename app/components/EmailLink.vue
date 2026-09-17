<template>
  <span>
    <button
      v-if="!email"
      type="button"
      class="reveal-email text-blue-400"
      @click="reveal"
    >
      {{ label }}
    </button>
    <a
      v-else
      ref="link"
      :href="'mailto:' + email"
    >{{ email }}</a>
  </span>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'click here'
    }
  },
  data() {
    return {
      email: ''
    }
  },
  methods: {
    reveal() {
      this.email = atob('aGVsbG8uMHZ6Y3VAYWRkeS5pbw==')
      this.$nextTick(() => {
        if (this.$refs.link) {
          this.$refs.link.focus()
        }
      })
    }
  }
}
</script>

<style scoped>
.reveal-email {
  background: none;
  border: 0;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
}
</style>
