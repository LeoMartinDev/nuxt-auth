import _ from 'lodash-es'

export const initializeStrategies = ({
  strategiesOptions,
  schemesProviders,
  setAccessToken,
  getRouteQuery,
}) => {
  return _.compact(
    _.mapValues(strategiesOptions, (options) => {
      const schemeProvider = _.get(schemesProviders, options?.scheme)

      if (!schemeProvider) return

      return schemeProvider({ options, setAccessToken, getRouteQuery })
    })
  )
}

export const provideSetAccessToken = ({
  axios,
  store,
  redirect,
  nuxtError,
  options,
}) => ({ accessToken }) => {
  axios.setHeader('Authorization', accessToken)
  store.commit('setIsAuthenticated', { isAuthenticated: true })

  axios.onError((error) => {
    const loginRoute = _.get(options, 'routes.login', 'login')
    const statusCode = _.get(error, 'response.status')

    if (!statusCode) return error

    if (statusCode !== 401) {
      if (process.client) return error

      return nuxtError({
        statusCode: error.response.status,
        message: error.message,
      })
    }

    store.commit('setIsAuthenticated', { isAuthenticated: false })

    return redirect(loginRoute)
  })
}

export const checkAuthenticationState = ({ getCookie, removeCookie, strategies }) => {
  const authCookie = getCookie('auth')

  if (!authCookie) return

  const { strategyName, isAuthenticating } = authCookie

  removeCookie('auth')

  if (!isAuthenticating) return

  const strategy = _.get(strategies, strategyName)

  // TODO handle strategy does not exist error

  strategy.callback()
}

export const createVuexModule = ({ namespace, store }) => {
  const vuexModule = {
    namespaced: true,
    state: () => ({
      isAuthenticated: false,
    }),
    mutations: {
      setIsAuthenticated(state, { isAuthenticated }) {
        state.isAuthenticated = isAuthenticated
      },
    },
  }

  store.registerModule(namespace, vuexModule)

  return store.state[namespace]
}

export const provideGetRouteQuery = ({ $route }) => () => {
  return $route.query
}

export const provideCreateCookie = ({ $cookies }) => ({ name, value, options }) => {
  $cookies.set(name, value, options)
}

export const provideGetCookie = ({ $cookies }) => ({ name }) => {
  $cookies.get(name)
}

export const provideRemoveCookie = ({ $cookies }) => ({ name }) => {
  $cookies.remove(name)
}

export const provideLoginWith = ({ strategies, createCookie }) => (strategyName) => {
  const strategy = _.get(strategies, strategyName)

  if (!strategy) {
    throw new Error(`strategy "${strategyName}" does not exist!`)
  }

  createCookie('auth', {
    strategyName,
    isAuthenticating: true,
  }) // TODO cookie expiry

  return strategy.login()
}