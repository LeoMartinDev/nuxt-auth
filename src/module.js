import path from 'path'

const defaultOptions = {}

export default function authModule(moduleOptions) {
  const options = Object.assign({}, moduleOptions.auth, defaultOptions)

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
