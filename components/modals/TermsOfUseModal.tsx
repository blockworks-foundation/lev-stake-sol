import { ModalProps } from '../../types/modal'
import Modal from '../shared/Modal'
import { useTranslation } from 'next-i18next'
import Button from '@components/shared/Button'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import Checkbox from '@components/forms/Checkbox'
import BoostLogo from '@components/BoostLogo'

const TermsOfUseModal = ({ isOpen, onClose }: ModalProps) => {
  const { t } = useTranslation('common')
  const [acceptTerms, setAcceptTerms] = useState(false)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      disableOutsideClose
      hideClose
      panelClassNames="md:max-w-2xl bg-gradient-to-br from-th-bkg-2 to-th-bkg-1"
    >
      <div className="mb-6">
        <div className="mb-4 border-b border-th-bkg-3 pb-4">
          <div className="group mb-2 flex items-center justify-center">
            <BoostLogo className="h-auto w-12 shrink-0 cursor-pointer group-hover:animate-shake" />
            <span className="text-shadow ml-2 hidden text-[32px] font-black text-th-bkg-1 md:block">
              Boost!
            </span>
            <div className="ml-2.5 hidden rounded border border-th-fgd-1 bg-th-active px-1.5 py-1 md:block">
              <span className="block font-mono text-xxs font-black leading-none text-th-fgd-1">
                v2
              </span>
            </div>
          </div>
          <p className="text-center text-lg">
            Earn boosted yield on your JLP and liquid staking tokens.
          </p>
        </div>
        <ul className="space-y-2 border-b border-th-bkg-3 pb-4">
          <li className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5 text-th-success" />
            <span>Easily add leverage to boost your yield.</span>
          </li>
          <li className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5 text-th-success" />
            <span>No lockup. Remove your assets when you want.</span>
          </li>
          <li className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5 text-th-success" />
            <span>
              Powered by{' '}
              <a
                href="https://app.mango.markets"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mango v4&apos;s
              </a>{' '}
              open source and extensively audited contracts.
            </span>
          </li>
        </ul>
      </div>
      <Checkbox
        checked={acceptTerms}
        onChange={(e) => setAcceptTerms(e.target.checked)}
      >
        <p className="flex flex-wrap text-base">
          I accept the
          <a
            className="mx-1"
            href="/risks"
            target="_blank"
            rel="noopener noreferrer"
          >
            Risks
          </a>
          and
          <a
            className="mx-1"
            href="https://docs.mango.markets/legal/terms-of-use"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('terms-of-use')}
          </a>
        </p>
      </Checkbox>
      <Button
        className="mt-6 w-full"
        disabled={!acceptTerms}
        onClick={onClose}
        size="large"
      >
        {t('agree-and-continue')}
      </Button>
    </Modal>
  )
}

export default TermsOfUseModal
