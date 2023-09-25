import FaqsPage from '@components/faqs/FaqsPage'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

const Faqs: NextPage = () => {
  return <FaqsPage />
}

export default Faqs
