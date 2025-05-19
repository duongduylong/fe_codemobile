import { useEffect, useState } from 'react'
import { ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import { Modal, View, Text, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import { API_URL } from 'src/environment'
import { TNote } from 'src/models/note'
import { colors, font } from 'src/styles'
import { dateUtil } from 'src/utils/date'

interface props {
  note: TNote | null
  onClose: () => void
  onUpdate: (note: TNote) => void
  isShow: boolean
}

export default function NoteDetailModal({ note, onClose, onUpdate, isShow }: props) {
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setInputValue(note?.text || '')
  }, [note?.text])

  console.log(isEditing)

  const onEditPressed = async () => {
    if (isEditing) {
      // Call api to edit note
      if (!note) {
        return
      }

      setIsLoading(true)
      const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...note, text: inputValue })
      })
      if (res.ok) {
        setIsEditing(false)
        Toast.show({
          type: 'success',
          text1: 'Chỉnh sửa ghi chú thành công'
        })

        const updated = await res.json()
        setInputValue(updated.text)
        onUpdate(updated)
      } else {
        Toast.show({
          type: 'error',
          text1: 'Có lỗi xảy ra'
        })

        setInputValue(note.text)
      }

      setIsLoading(false)
      return
    }
    setIsEditing((state) => !state)
  }

  const onTextInput = (value: string) => {
    setInputValue(value)
  }

  const handleCancelPress = () => {
    setIsEditing(false)
    onClose()
  }

  return (
    <Modal
      style={{ position: 'relative' }}
      visible={isShow}
      animationType="slide"
      transparent
      presentationStyle="overFullScreen"
    >
      {isLoading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={colors.orange01} />
        </View>
      )}
      <View style={styles.modalContainer}>
        <Toast />
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Chi tiết ghi chú</Text>
          {!isEditing ? (
            <ScrollView style={styles.modalTextContent}>
              <Text>{note?.text}</Text>
            </ScrollView>
          ) : (
            <TextInput
              placeholder="Nhập nội dung ghi chú"
              value={inputValue}
              onChangeText={(value) => onTextInput(value)}
              style={styles.input}
              multiline
            />
          )}
          <Text>{`Thời gian tạo: ${dateUtil.formatDate(note?.createdAt)}`}</Text>
          <TouchableOpacity onPress={onEditPressed} style={styles.editButton}>
            <Text style={styles.editButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelPress} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: font.size.large,
    textAlign: 'center',
    marginBottom: 8
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    paddingLeft: 20,
    paddingTop: 8,
    paddingRight: 20,
    paddingBottom: 20,
    borderRadius: 10,
    maxHeight: 320
  },
  modalTextContent: {
    height: 240,
    borderWidth: 1,
    borderColor: '#00000000'
  },
  input: {
    height: 240,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.orange03
  },
  editButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange03,
    marginTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 8
  },
  cancelButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray01,
    marginTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 8
  },

  editButtonText: {
    color: 'white',
    fontSize: font.size.small
  },

  cancelButtonText: {
    color: 'black',
    fontSize: font.size.small
  },

  spinnerContainer: {
    display: 'flex',
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040'
  }
})
