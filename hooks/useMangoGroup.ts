import { Group } from '@blockworks-foundation/mango-v4'
import mangoStore from '@store/mangoStore'

export default function useMangoGroup(): {
  jlpGroup: Group | undefined
  lstGroup: Group | undefined
} {
  const jlpGroup = mangoStore((s) => s.group.jlpGroup)
  const lstGroup = mangoStore((s) => s.group.lstGroup)

  return { jlpGroup, lstGroup }
}
