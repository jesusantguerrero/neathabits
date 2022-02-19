import { AuthState, useAuth } from 'lumiere-utils/useAuth'
import { useSupabase } from 'lumiere-utils/useSupabase'
import config from '../config'
import type { UserModule } from '~/types'

export const install: UserModule = ({ router, isClient, app }) => {
  if (!isClient) return

  const provider = useSupabase(AuthState, config)
  const { isAuthenticated, initAuth } = useAuth(provider)
  initAuth()
  router.beforeEach(async(to, _from, next) => {
    const user = await isAuthenticated()
    if (to.meta.requiresAuth !== false && !user)
      next({ path: '/auth/login' })

    else if (to.meta.requiresAuth === false && user && config.loginRoutes.includes(to.name)) next({ name: config.home })
    else next()
  })
  app.provide('GlobalProvider', provider)
  app.provide('GlobalAuth', AuthState)
}
