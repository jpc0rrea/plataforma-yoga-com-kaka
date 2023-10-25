import { createGetInitialProps } from '@mantine/next';
import { ColorSchemeScript } from '@mantine/core';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default class MyDocument extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html className="h-full scroll-smooth bg-gray-50">
        <Head>
          <ColorSchemeScript defaultColorScheme="auto" />
          <meta
            name="description"
            content="turma online de yoga com kaká, aulas ao vivo, para iniciantes"
          />
          <meta
            property="og:description"
            content="turma online de yoga com kaká, aulas ao vivo, para iniciantes"
          />
          <meta property="og:title" content="yoga com kaká" />
          <meta property="title" content="yoga com kaká" />
          <meta property="og:image" content="/preview.jpeg" />
          <meta property="og:image:width" content="625" />
          <meta property="og:image:height" content="632" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          <meta name="title" content="turma de yoga online" />
          <meta name="description" content="turma de yoga online" />
        </Head>
        <body className="h-full">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
