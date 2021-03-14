import axios from 'axios'

function buildOauthUri({
  authorizeUri,
  clientId,
  scope,
  redirectUri,
  responseType,
}) {
  const oauthUri = new URL(authorizeUri)

  oauthUri.searchParams.append('client_id', clientId)
  oauthUri.searchParams.append('scope', scope)
  oauthUri.searchParams.append('redirect_uri', redirectUri)
  oauthUri.searchParams.append('response_type', responseType)

  return oauthUri
}

export default function provideOauthStrategy({
  oauthOptions,
  setAccessToken,
  getRouteQuery,
}) {
  function login() {
    const { authorizeUri, clientId, scope, redirectUri } = oauthOptions

    const oauthUri = buildOauthUri({
      authorizeUri,
      clientId,
      scope,
      redirectUri,
      responseType: 'code',
    })

    window.location.replace(oauthUri)
  }

  async function callback() {
    const { accessTokenUri } = oauthOptions

    // GET CODE
    const { code } = getRouteQuery()

    if (!code) return

    const { accessToken } = await axios.post(accessTokenUri, {
      code,
    })

    setAccessToken({ accessToken })
  }

  return {
    login,
    callback,
  }
}
