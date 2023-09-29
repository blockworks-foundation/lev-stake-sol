import { Disclosure } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const FAQS = [
  { question: 'How does Boost! work?', answer: 'Answer' },
  { question: 'How does unboosting work?', answer: 'Answer' },
  { question: 'What are the risks?', answer: 'Answer' },
  { question: 'Where does the yield come from?', answer: 'Answer' },
  {
    question: 'Why is the max leverage different between tokens?',
    answer: 'Answer',
  },
  { question: 'Will there be more tokens added?', answer: 'Answer' },
  { question: 'Why is my Ledger not working with Boost!?', answer: 'Answer' },
  { question: 'Is the contract audited?', answer: 'Answer' },
  { question: 'Who made Boost!?', answer: 'Answer' },
]

const FaqsPage = () => {
  return (
    <div className="rounded-2xl border-2 border-th-fgd-1 bg-th-bkg-1 p-6">
      <h1 className="mb-1">FAQs</h1>
      <p className="mb-4">Need more info? Reach out to us on ...</p>
      <div className="space-y-2">
        {FAQS.map((faq) => {
          const { question, answer } = faq
          return (
            <Disclosure key={question}>
              {({ open }) => (
                <div>
                  <Disclosure.Button
                    className={`w-full rounded-xl border-2 border-th-bkg-3 px-4 py-3 text-left focus:outline-none ${
                      open ? 'rounded-b-none border-b-0' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{question}</p>
                      <ChevronDownIcon
                        className={`${
                          open ? 'rotate-180' : 'rotate-360'
                        } h-6 w-6 flex-shrink-0 text-th-fgd-1`}
                      />
                    </div>
                  </Disclosure.Button>
                  <Disclosure.Panel className="space-y-2 rounded-xl rounded-t-none border-2 border-t-0 border-th-bkg-3 px-4 pb-3">
                    <p>{answer}</p>
                  </Disclosure.Panel>
                </div>
              )}
            </Disclosure>
          )
        })}
      </div>
    </div>
  )
}

export default FaqsPage
