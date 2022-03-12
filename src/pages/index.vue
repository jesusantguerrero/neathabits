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
    <div class="relative max-w-5xl py-20 mx-auto sm:pt-24 lg:pt-32">
      <h1 class="text-4xl font-extrabold tracking-tight text-center text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
        The tool to track your daily routine and habits like a pro
      </h1>
      <p class="max-w-3xl mx-auto mt-6 text-lg text-center text-slate-600 dark:text-slate-400">
        Based on <span class="font-bold text-primary-400">Atomic habits</span> and <span class="font-bold text-primary-400">Shape Up</span>
      </p>
    </div>
  </div>
</template>

<route lang="yaml">
name: landing
meta:
  name: auth
  requiresAuth: false
</route>
