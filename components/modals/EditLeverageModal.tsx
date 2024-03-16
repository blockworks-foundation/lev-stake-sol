import { ModalProps } from '../../types/modal'
import Modal from '../shared/Modal'
import EditLeverageForm from '@components/EditLeverageForm'

interface EditLeverageModalProps {
  token?: string | undefined
} 
type ModalCombinedProps = EditLeverageModalProps & ModalProps

const EditLeverageModal = ({
  isOpen,
  onClose,
  token,
}: ModalCombinedProps) => {
  return (
    <>
      <Modal disableOutsideClose={true} isOpen={isOpen} onClose={onClose}>
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
