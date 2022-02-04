<script setup lang="ts">
import { AtButton, AtPreFooter, AtSireFooter, AtSiteHeader } from 'atmosphere-ui'

const state = {
  title: 'Neathabits',
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
      url: '/login',
      class: 'bg-white text-primary hover:bg-gray-100 transition',
    },
    {
      name: 'Start for free',
      url: '/register',
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
  </div>
</template>
