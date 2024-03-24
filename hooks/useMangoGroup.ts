import { Group } from '@blockworks-foundation/mango-v4'
import mangoStore from '@store/mangoStore'

export default function useMangoGroup(): {
  jlpGroup: Group | undefined
  lstGroup: Group | undefined
} {
  const jlpGroup = mangoStore((s) => s.group.jlp)
  const lstGroup = mangoStore((s) => s.group.lst)

  return { jlpGroup, lstGroup }
}
