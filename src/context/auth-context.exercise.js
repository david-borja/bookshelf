// 🐨 create and export a React context variable for the AuthContext
// 💰 using React.createContext
/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from 'react'
import * as auth from 'auth-provider'
import { FullPageSpinner } from 'components/lib'
import { client } from 'utils/api-client'
import { useAsync } from 'utils/hooks'
import { FullPageErrorFallback } from 'components/lib'
// 🐨 import the AuthContext you created in ./context/auth-context
// import { AuthContext } from 'context/auth-context.exercise'

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

async function getUser() {
  let user = null

  const token = await auth.getToken()
  if (token) {
    const data = await client('me', { token })
    user = data.user
  }

  return user
}

function AuthProvider(props) {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    run(getUser())
  }, [run])

  const login = form => auth.login(form).then(user => setData(user))
  const register = form => auth.register(form).then(user => setData(user))
  const logout = () => {
    auth.logout()
    setData(null)
  }

  if (isLoading || isIdle) {
    return <FullPageSpinner />
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    const value = { user, login, register, logout }
    return (
      <AuthContext.Provider value={value} {...props} />
    )
    // 🐨 wrap all of this in the AuthContext.Provider and set the `value` to props
  }
}
function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  const {user: {token}} = useAuth()
  return React.useCallback((endpoint, config) => client(endpoint, {...config, token}), [token])
}

export {useAuth, AuthProvider, useClient}