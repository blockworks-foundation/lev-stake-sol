import DashboardPage from '@components/DashboardPage'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'swap'])),
    },
  }
}

const Dashboard: NextPage = () => {
  return <DashboardPage />
}

export default Dashboard
