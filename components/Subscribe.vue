<template>
  <div class="w-full bg-gray-200 shadow-md rounded p-8 sm:p-10 my-8">

    <div class="flex items-center flex-col sm:flex-row">
      <div class="w-full md:w-1/2 mb-4 md:mb-0">
        <h5 class="mt-0 text-xl">Like what you've seen here? </h5>
        <p>
          Fire over your email and I'll keep you updated once a month about any new posts. No Spam.
        </p>
      </div>
      <div class="w-full md:w-1/2 md:ml-4">
        <form @submit.prevent="onSubmit" accept-charset="utf-8">
          <label for="email" class="hidden">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            name="email"
            class="email block shadow rounded w-full py-2 px-3 text-gray-600 mb-4 font-sans"
            placeholder="Your email"
            required
            autocomplete="email"
          />
          <div class="hidden" aria-hidden="true">
            <label for="hp">HP</label>
            <input
              id="hp"
              v-model="hp"
              type="text"
              name="hp"
              tabindex="-1"
              autocomplete="off"
            />
          </div>
          <div ref="turnstile" v-once class="mb-4"></div>
          <button
            type="submit"
            class="button w-full bg-pink text-white font-bold py-2 px-4 rounded font-sans tracking-wider"
            :class="canSubmit ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'"
            :disabled="!canSubmit"
          >
            {{ submitting ? 'Sending...' : "Let's Go!" }}
          </button>
          <p
            v-if="message"
            class="mt-4 mb-0 text-base"
            :class="error ? 'text-pink' : 'text-gray-700'"
          >
            {{ message }}
          </p>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      hp: '',
      token: '',
      widgetId: null,
      submitting: false,
      message: '',
      error: false
    }
  },
  computed: {
    siteKey() {
      return process.env.TURNSTILE_SITE_KEY || ''
    },
    canSubmit() {
      return Boolean(this.email && this.token && !this.submitting)
    }
  },
  mounted() {
    this.renderWidget()
  },
  beforeDestroy() {
    this.removeWidget()
  },
  methods: {
    waitForTurnstile() {
      if (window.turnstile) {
        return Promise.resolve()
      }

      return new Promise((resolve, reject) => {
        const started = Date.now()
        const timer = setInterval(() => {
          if (window.turnstile) {
            clearInterval(timer)
            resolve()
          } else if (Date.now() - started > 10000) {
            clearInterval(timer)
            reject(new Error('Turnstile did not load'))
          }
        }, 50)
      })
    },
    async renderWidget() {
      await this.$nextTick()

      if (!this.siteKey || !this.$refs.turnstile || this.widgetId !== null) {
        return
      }

      try {
        await this.waitForTurnstile()
        if (typeof window.turnstile.ready === 'function') {
          await new Promise((resolve) => window.turnstile.ready(resolve))
        }
        if (this.widgetId !== null || !this.$refs.turnstile) {
          return
        }
        this.widgetId = window.turnstile.render(this.$refs.turnstile, {
          sitekey: this.siteKey,
          theme: 'light',
          size: 'flexible',
          callback: (token) => {
            this.token = token
          },
          'expired-callback': () => {
            this.token = ''
          },
          'error-callback': () => {
            this.token = ''
          }
        })
      } catch (err) {
        this.error = true
        this.message = 'The spam check did not load. Refresh the page and try again.'
      }
    },
    removeWidget() {
      if (this.widgetId !== null && window.turnstile) {
        window.turnstile.remove(this.widgetId)
      }
      this.widgetId = null
      this.token = ''
    },
    resetWidget() {
      this.token = ''
      if (this.widgetId !== null && window.turnstile) {
        window.turnstile.reset(this.widgetId)
      }
    },
    async onSubmit() {
      if (!this.canSubmit) {
        return
      }

      this.submitting = true
      this.message = ''
      this.error = false

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            token: this.token,
            hp: this.hp
          })
        })

        const data = await res.json().catch(() => ({}))

        if (!res.ok) {
          this.error = true
          this.message = data.message || 'Subscription failed. Please try again.'
          this.resetWidget()
          return
        }

        this.message = data.message || 'Thanks. Please check your email.'
        this.email = ''
        this.resetWidget()
      } catch (err) {
        this.error = true
        this.message = 'Subscription failed. Please try again.'
        this.resetWidget()
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>
