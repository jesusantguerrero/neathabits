<script  lang="ts" setup>
import { useAuthState } from 'lumiere-utils/useAuth'
import { useRouter } from 'vue-router'
import AppHeader from '~/components/organisms/AppHeader.vue'
import config from '~/config'

const { push } = useRouter()
const { user, provider: { logout } } = useAuthState()
const goToHome = () => {
  push({ name: 'landing' })
}

const signOut = () => {
  logout(goToHome)
}
</script>

<template>
  <AppHeader :title="config.appName" :user="user" @logout="signOut" />
  <main class="px-10 mt-10">
    <slot />
  </main>
</template>
