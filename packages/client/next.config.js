const { withSentryConfig } = require('@sentry/nextjs')

const sentryModuleExports = {
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
}

const defaultModuleExports = {
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
}

module.exports =
  process.env.NODE_ENV === 'production'
    ? withSentryConfig(sentryModuleExports, defaultModuleExports)
    : defaultModuleExports
