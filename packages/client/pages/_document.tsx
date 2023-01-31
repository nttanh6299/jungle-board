import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Play live for free in seconds! Challenge a friend online or find a random opponent with one simple click."
          />
          <meta property="og:url" content="https://jungle-board.vercel.app/" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Jungle board - Play online for FREE with friends" />
          <meta
            property="og:description"
            content="Play live for free in seconds! Challenge a friend online or find a random opponent with one simple click."
          />
          <meta
            property="og:image"
            content="https://res.cloudinary.com/dkktseuwb/image/upload/v1675094734/elephant-op.png"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta property="twitter:domain" content="jungle-board.vercel.app" />
          <meta property="twitter:url" content="https://jungle-board.vercel.app/" />
          <meta name="twitter:title" content="Jungle board - Play online for FREE with friends" />
          <meta
            name="twitter:description"
            content="Play live for free in seconds! Challenge a friend online or find a random opponent with one simple click."
          />
          <meta
            name="twitter:image"
            content="https://res.cloudinary.com/dkktseuwb/image/upload/v1675094734/elephant-op.png"
          />
          <meta name="theme-color" content="#fff" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
