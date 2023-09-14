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
        </Head>
        <body className="hide-scroll">
          {/* <div className="bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-lime-600 via-yellow-300 to-red-600"> */}
          <Main />
          <NextScript />
          {/* </div> */}
        </body>
      </Html>
    )
  }
}

export default MyDocument
