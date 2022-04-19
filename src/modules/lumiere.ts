import { AuthState, useAuth } from 'lumiere-utils/useAuth'
import { useSupabase } from 'lumiere-utils/useSupabase'
import config from '../config'
import type { UserModule } from '~/types'

export const install: UserModule = ({ router, isClient, app }) => {
  if (!isClient)
    return

  const provider = useSupabase(AuthState, config)
  const { isAuthenticated, initAuth } = useAuth(provider)
  initAuth()
  router.beforeEach(async(to: { meta: { requiresAuth: boolean }; name: string }, _from: any, next: (arg0: { path?: string; name?: string } | undefined) => void) => {
    const user = await isAuthenticated()
    if (to.meta.requiresAuth !== false && !user)
      return next({ path: '/auth/login' })

    else if (to.meta.requiresAuth === false && user && config.loginRoutes.includes(to.name))
      return next({ name: config.home })
    else return next()
  })
  app.provide('GlobalProvider', provider)
  app.provide('GlobalAuth', AuthState)
}
