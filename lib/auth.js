import schemesProviders from './schemes'

export default function provideAuthPlugin({ context, options }) {
  const { store, axios, redirect, error: nuxtError, $route, $cookies } = context
  const { vuex } = options

  const authStoreModule = createVuexModule({ store, namespace: vuex.namespace })

  const getRouteQuery = provideGetRouteQuery({ $route })

  const getCookie = provideGetCookie({ $cookies })
  const removeCookie = provideRemoveCookie({ $cookies })
  const createCookie = provideCreateCookie({ $cookies })

  const setAccessToken = provideSetAccessToken({
    axios,
    redirect,
    nuxtError,
    options,
    store: authStoreModule,
  })

  const strategies = initializeStrategies({
    strategiesOptions: options.strategies,
    schemesProviders,
    setAccessToken,
    getRouteQuery,
  })

  const loginWith = provideLoginWith({
    strategies,
    createCookie,
  })

  checkAuthenticationState({
    strategies,
    getCookie,
    removeCookie,
  })

  return {
    loginWith,
  }
}
