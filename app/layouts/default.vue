<template>
  <div class="flex flex-row justify-center">
    <div class="relative overflow-hidden content flex flex-col p-4 md:p-8">
      <PageHeader />
      <MainNav />
      <slot />
      <PageFooter />
    </div>
  </div>
</template>
