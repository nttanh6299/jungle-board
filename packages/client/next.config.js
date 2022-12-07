const { withSentryConfig } = require('@sentry/nextjs')
const { i18n } = require('./next-i18next.config')

const moduleExports = {
  i18n,
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.tsx?|\.ts?$/,
      use: [options.defaultLoaders.babel],
    })
    return config
  },
  sentry: {
    hideSourceMaps: true,
  },
}

const sentryWebpackPluginOptions = {
  silent: true,
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
