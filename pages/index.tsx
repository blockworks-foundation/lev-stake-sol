import HomePage from '@components/HomePage'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'swap'])),
    },
  }
}

const Index: NextPage = () => {
  return <HomePage />
}

export default Index
