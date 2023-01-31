/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')
const { i18n } = require('./next-i18next.config')
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

const moduleExports = withPWA({
  i18n,
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
})

const sentryWebpackPluginOptions = {
  silent: true,
}

module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions)
