import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <Script
            src="/datafeeds/udf/dist/bundle.js"
            strategy="beforeInteractive"
          ></Script>
          <Script
            src="https://terminal.jup.ag/main-v2.js"
            strategy="afterInteractive"
          ></Script>
        </Head>
        <body className="hide-scroll">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
