<script setup lang="ts">
import { AtSiteHeader } from 'atmosphere-ui'
import config from '~/config'

const state = {
  title: config.appName,
  links: [{
    name: 'Home',
    url: '/#home',
  }, {
    name: 'About',
    url: '#about',
  }],
  actions: [
    {
      name: 'Login',
      url: '/auth/login',
      class: 'bg-white text-primary hover:bg-gray-100 transition',
    },
    {
      name: 'Start for free',
      url: '/auth/register',
      class: 'bg-primary text-white hover:bg-primary-700 transition',
    },
  ],
}
</script>

<template>
  <div class="w-full bg-slate-800 backdrop-blur-md">
    <at-site-header
      :title="state.title"
      :links="state.links"
      :actions="state.actions"
    />
    <div class="relative max-w-5xl mx-auto py-20 sm:pt-24 lg:pt-32">
      <h1 class="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center dark:text-white">
        The tool to track your daily routine and habits like a pro
      </h1>
      <p class="mt-6 text-lg text-slate-600 text-center max-w-3xl mx-auto dark:text-slate-400">
        Based on <span class="text-primary-400 font-bold">Atomic habits</span> and <span class="text-primary-400 font-bold">Shape Up</span>
      </p>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  name: auth
  requiresAuth: false
</route>
