import path from 'path'

import packageJson from '../package.json'

const defaultOptions = {}

export default function authModule(moduleOptions) {
  const options = Object.assign({}, moduleOptions.auth, this.options.auth, defaultOptions)

  this.addPlugin({
    src: path.resolve(__dirname, 'plugin.js'),
    options: {
      authOptions: options,
    },
  })

  const runtime = path.resolve(__dirname, 'runtime')
  this.options.alias['~auth/runtime'] = runtime
  this.options.build.transpile.push(__dirname)
}

export const meta = packageJson
