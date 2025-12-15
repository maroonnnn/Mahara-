import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Default to English, will be updated by LanguageContext in _app.js
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Mahara - Freelance Services Marketplace" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

