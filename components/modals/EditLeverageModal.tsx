import { ModalProps } from '../../types/modal'
import Modal from '../shared/Modal'
import EditLeverageForm from '@components/EditLeverageForm'

interface EditLeverageModalProps {
  token?: string | undefined
}
type ModalCombinedProps = EditLeverageModalProps & ModalProps

const EditLeverageModal = ({ isOpen, onClose, token }: ModalCombinedProps) => {
  return (
    <>
      <Modal disableOutsideClose isOpen={isOpen} onClose={onClose}>
        <EditLeverageForm onSuccess={onClose} token={token ? token : 'null'} />
      </Modal>
    </>
  )
}

export default EditLeverageModal
