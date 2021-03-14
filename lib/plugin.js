import provideAuthPlugin from '~auth/runtime'

export default function authPlugin(context, inject) {
  const options = <%= JSON.stringify(options.authOptions, null, 2) %>

  const auth = provideAuthPlugin({ context, options })

  inject('auth', auth);
  context.auth = auth;
}
