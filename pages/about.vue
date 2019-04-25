<template>
  <section class="my-8">
    <div class="page-content page text-center md:text-left">
      <p>
        Hi I'm Will Browning, a self-taught web developer from the UK. I blog about Laravel, Vue and Tailwind amongst other things.
      </p>
      <p>
        This site uses the <a href="https://jamstack.org/" target="_blank" rel="noopener noreferrer nofollow">JAMstack</a> architecture and is open source. You can find the source code on GitHub <a href="https://github.com/willbrowningme/willbrowning" target="_blank" rel="noopener noreferrer nofollow">here</a>.
      </p>
      <p>
        The site is built with <a href="https://nuxtjs.org/" target="_blank" rel="noopener noreferrer nofollow">Nuxt.js</a> and has <a href="https://getcockpit.com/" target="_blank" rel="noopener noreferrer nofollow">Cockpit</a> as a headless CMS. I use <a href="https://matomo.org/" target="_blank" rel="noopener noreferrer nofollow">Matomo</a> for basic analytics with IP addresses anonymised.
      </p>
      <p>
        For blog comments I'm using a self-hosted instance of <a href="https://commento.io/" target="_blank" rel="noopener noreferrer nofollow">Commento</a>, a fast, privacy-focused commenting platform.
      </p>
      <p>
        This site <b>will not</b> set any cookies unless you choose to login and leave a comment.
      </p>
      <p>
        If you like the posts here you can sign up for my <a href="/newsletter">Newsletter</a> to get notified when I add new ones or follow me on <a target="_blank" rel="nofollow noopener noreferrer" href="https://twitter.com/willbrowningme">Twitter</a>.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: 'About - Will Browning'
    }
  }
}
</script>
