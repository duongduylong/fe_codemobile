import { Modal, TouchableWithoutFeedback, View, Text, StyleSheet } from 'react-native'
import { TNote } from 'src/models/note'

interface props {
  note: TNote | null
  onClose: () => void
  isShow: boolean
}

export default function NoteDetailModal({ note, onClose, isShow }: props) {
  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <Modal visible={isShow} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>{note?.text}</Text>
          </View>
        </View>
      </Modal>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10
  }
})
