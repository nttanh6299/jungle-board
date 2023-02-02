/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const moduleExports = {
  i18n,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.tsx?|\.ts?$/,
      use: [options.defaultLoaders.babel],
    })
    return config
  },
}

module.exports = moduleExports
