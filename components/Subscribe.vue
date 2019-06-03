<template>
  <div id="mc_embed_signup" class="w-full bg-gray-200 shadow-md rounded p-8 sm:p-10 my-8">

    <div class="flex items-center flex-col sm:flex-row">
      <div class="w-full md:w-1/2 mb-4 md:mb-0">
        <h5 class="mt-0 text-xl">Like what you've seen here? </h5>
        <p>
          Fire over your email and I'll keep you updated once a month about any new posts. No Spam.
        </p>
      </div>
      <div class="w-full md:w-1/2 md:ml-4">
        <form action="https://sendy.willbrowning.me/subscribe" method="POST" accept-charset="utf-8">
          <label for="email" class="hidden">Email</label>
          <input type="email" name="email" id="email" class="email block shadow rounded w-full py-2 px-3 text-gray-600 mb-4 font-sans" placeholder="Your email" required/>
          <div class="hidden">
            <label for="hp">HP</label>
            <input type="text" name="hp" id="hp"/>
          </div>
          <input type="hidden" name="list" value="G4t7tNFm3f6qoxz4mHaywQ"/>
          <input type="hidden" name="subform" value="yes"/>
          <input type="submit" name="submit" id="submit" value="Let's Go!" class="button w-full bg-pink text-white font-bold py-2 px-4 rounded cursor-pointer font-sans tracking-wider"/>
        </form>
      </div>
    </div>

  </div>
</template>