import { useQuery } from '@tanstack/react-query'

const fetchSolPnls = async (mangoAccounts: string[]) => {
  const accToSolPnl: { [key: string]: number } = {}
  const responses = await Promise.all(
    mangoAccounts.map((x) =>
      fetch(
        `https://api.mngo.cloud/data/boost/stats/pnl-sol?mango-account=${x}`,
      ),
    ),
  )
  const jsons = await Promise.all(responses.map((x) => x.json()))
  for (const index in jsons) {
    accToSolPnl[mangoAccounts[index]] = jsons[index].pnl_sol
  }
  return {
    accToSolPnl,
  }
}

const useSolPnl = (mangoAccounts: string[] | undefined) => {
  const res = useQuery(
    ['sol-pnl', ...mangoAccounts!],
    () => fetchSolPnls(mangoAccounts!),
    {
      cacheTime: 1000 * 60 * 10,
      staleTime: 1000 * 60 * 10,
      retry: 3,
      enabled: !!mangoAccounts,
      refetchOnWindowFocus: false,
    },
  )

  return res
}

export default useSolPnl
