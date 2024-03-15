import { ModalProps } from '../../types/modal'
import Modal from '../shared/Modal'
import EditLeverageForm from '@components/EditLeverageForm'

interface DepositWithdrawModalProps {
  action: 'deposit' | 'withdraw'
  token?: string | undefined
} 
type ModalCombinedProps = DepositWithdrawModalProps & ModalProps

const EditLeverageModal = ({
  isOpen,
  onClose,
  token,
}: ModalCombinedProps) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div >
            <>
              <div className="pb-2">
                <EditLeverageForm onSuccess={onClose} token={token} />
              </div>
            </>
        </div>
      </Modal>
    </>
  )
}

export default EditLeverageModal
