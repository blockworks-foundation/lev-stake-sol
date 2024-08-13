import { ModalProps } from '../../types/modal'
import Modal from '../shared/Modal'
import { useTranslation } from 'next-i18next'
import Button from '@components/shared/Button'
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import Checkbox from '@components/forms/Checkbox'
import { ZigZagRepeatLine } from '@components/Stake'

const TermsOfUseModal = ({ isOpen, onClose }: ModalProps) => {
  const { t } = useTranslation('common')
  const [acceptTerms, setAcceptTerms] = useState(false)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      disableOutsideClose
      hideClose
      panelClassNames="md:max-w-xl bg-th-bkg-1"
    >
      <div className="mb-6">
        <div className="flex flex-col items-center pb-4">
          <h2 className="mt-2 text-xl">Accept terms</h2>
        </div>
        <ZigZagRepeatLine />
        <ul className="space-y-3 py-4">
          <li className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-th-success" />
            <span className="leading-tight">
              Easily add leverage to increase your yield.
            </span>
          </li>
          <li className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-th-success" />
            <span className="leading-tight">
              No lockup. Remove your assets when you want.
            </span>
          </li>
          <li className="flex items-center">
            <CheckCircleIcon className="mr-2 h-5 w-5 shrink-0 text-th-success" />
            <span className="leading-tight">
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
        <ZigZagRepeatLine />
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
            Risks,
          </a>
          <a
            className="mx-1"
            href="/terms-of-use"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('terms-of-use')}
          </a>
          and
          <a
            className="mx-1"
            href="/privacy-policy"
            rel="noopener noreferrer"
            target="_blank"
          >
            Privacy Policy
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
