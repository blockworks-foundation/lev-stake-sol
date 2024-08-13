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
  return (
    <div className="mx-4 max-w-3xl py-10 md:mx-auto">
      <FaqsPage />
    </div>
  )
}

export default Faqs
