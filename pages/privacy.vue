<template>
  <section class="my-8">
    <div class="page-content page text-center md:text-left">
      <p>
        This page simply explains what information I collect and what is done with that information. This page applies only to willbrowning.me and subdomains.
      </p>
      <h3>
        Site Visitors
      </h3>
      <p>
        I use a self-hosted installation of <a href="https://matomo.org/" target="_blank" rel="noopener noreferrer nofollow">Matomo</a> for basic analytics with IP addresses anonymised to 2 bytes. Matomo collects non-personally identifying information like browser type, device, country, referring site, date and time of each visitor request.
      </p>
      <h3>
        Opting Out Of Analytics
      </h3>
      <p>
        You can choose to opt-out using the form below. I honor the "Do Not Track" setting in your browser, so if you have this enabled you will not be tracked on this site.
      </p>
      <p>
        <iframe
        style="border: 1px solid #000; height: 120px; width: 100%;"
        src="https://analytics.willbrowning.me/index.php?module=CoreAdminHome&action=optOut&language=en&backgroundColor=&fontColor=&fontSize=&fontFamily="
        ></iframe>
      </p>
      <p>
        You can also simply block analytics.willbrowning.me if you wish.
      </p>
      <h3>
        Protection of Personally-Identifying Information
      </h3>
      <p>
        I will never misuse, sell or give away any potentially personally-identifying information to any third parties.
      </p>
      <p>
        I only receive information you knowingly provide such as your email address and name when leaving a comment on the blog.
      </p>
      <p>
        For blog comments I am using a self-hosted installation of <a href="https://commento.io/" target="_blank" rel="noopener noreferrer nofollow">Commento</a> a fast, privacy-focused commenting platform.
      </p>
      <p>
        If you choose to login with Twitter, GitHub or GitLab to leave a comment on this blog I may receive personal information such as your name and email address.
      </p>
      <p>
        You can choose to leave an anonymous comment if you'd prefer not to provide this information.
      </p>
      <h3>
        Cookies
      </h3>
      <p>
        This site <b>will not</b> set any cookies unless you choose to login and leave a comment.
      </p>
      <p>
        You can simply choose to leave an anonymous comment if you do not want any cookies to be set.
      </p>
      <h3>
        Contact
      </h3>
      <p>
        I may change this page every so often, however changes will likely only be small.
      </p>
      <p>
        If you have any questions about this page you can simply get in touch on <a target="_blank" rel="nofollow noopener noreferrer" href="https://twitter.com/willbrowningme">Twitter</a>.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  head() {
    return {
      title: 'Privacy - Will Browning'
    }
  }
}
</script>
