<script setup lang="ts">
import { LumiereProvider } from 'lumiere-utils'
import { useSupabase } from 'lumiere-utils/useSupabase'
import { useHead } from '@vueuse/head'
import config from './config'
import 'atmosphere-ui/style.css'
useHead({

  title: config.appName,
  meta: [
    { name: 'description', content: 'The habit tracker you need' },
  ],
})
</script>

<template>
  <LumiereProvider :provider="useSupabase" :config="config">
    <router-view />
  </LumiereProvider>
</template>
