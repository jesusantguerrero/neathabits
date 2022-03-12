<template>
  <AtAuthBox>
    <AtAuthForm
      :is-loading="isLoading"
      :mode="mode"
      btn-class="mb-2 font-bold border-2 rounded-md border-primary-400 bg-gradient-to-br from-tail-400 to-primary"
      @submit="onSubmit"
      @link-pressed="onLinkPressed"
    >
      <template #brand>
        <router-link to="/" class="w-full font-light font-brand">
          {{ config.appName }}
        </router-link>
      </template>
    </AtAuthForm>
  </AtAuthBox>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AtAuthBox, AtAuthForm } from 'atmosphere-ui'
import { useAuthState } from 'lumiere-utils/useAuth'
import { useRouter } from 'vue-router'
import type { ApiError } from '@supabase/supabase-js'
import config from '../../config'
const { provider } = useAuthState()

const props = defineProps<{ mode: string }>()

const isLoading = ref(false)

const { push } = useRouter()
const onSubmit = async(formData: { email: string; password: string }) => {
  if (isLoading.value) return
  isLoading.value = true
  provider[props.mode](formData.email, formData.password).then(() => {
    location.reload()
  }).catch((error: ApiError) => {
    alert(error.message)
  })
    .finally(() => {
      isLoading.value = false
    })
}

const onLinkPressed = () => {
  const route = props.mode === 'login' ? 'register' : 'login'
  push(route)
}
</script>

<route lang="yaml">
name: auth
meta:
  requiresAuth: false
</route>
