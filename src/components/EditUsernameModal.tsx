import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native'
import { Modal } from 'react-native'
import Toast from 'react-native-toast-message'
import { API_URL } from 'src/environment'
import { TUser } from 'src/models/user'
import { colors, font } from 'src/styles'
import { getAccessToken } from 'src/utils/storage'

interface props {
  isShow: boolean
  user: TUser
  onClose: () => void
  onUpdate: (user: TUser) => void
}

export default function EditUsernameModal({ isShow, user, onClose, onUpdate }: props) {
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  const validateUsername = () => {
    if (!inputValue.trim()) {
      setError('Nhập tên')
      return false
    }
    setError('')
    return true
  }

  useEffect(() => {
    setInputValue(user.username || '')
  }, [user.username])

  const onTextInput = (value: string) => {
    setInputValue(value)
  }

  const handleOKPress = async () => {
    const isValidated = validateUsername()
    if (!isValidated) {
      return
    }
    try {
      setIsLoading(true)
      const token = await getAccessToken()
      const res = await fetch(`${API_URL}/api/users/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newUsername: inputValue })
      })
      const data = await res.json()
      console.log(data.message)
      if (res.ok) {
        Toast.show({
          type: 'success',
          text1: data.message
        })
        onUpdate(data.data)
      } else {
        Toast.show({
          type: 'error',
          text1: data.message
        })
      }
      setIsLoading(false)
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Có lỗi xảy ra'
      })
      setIsLoading(false)
    }
  }

  const handleCancelPress = () => {
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
          <Text style={styles.modalTitle}>Cập nhật tên</Text>
          <Text style={styles.inputLabel}>Tên người dùng</Text>
          <TextInput
            placeholder="Nhập tên mới"
            value={inputValue}
            onChangeText={(value) => onTextInput(value)}
            style={styles.input}
          />
          {error && <Text style={styles.errorMessage}>{error}</Text>}
          <TouchableOpacity onPress={handleOKPress} style={styles.okButton}>
            <Text style={styles.okButtonText}>Lưu</Text>
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
  inputLabel: {
    fontSize: font.size.small
  },
  errorMessage: {
    fontSize: font.size.extraSmall,
    color: colors.orange03
  },
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
  input: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.orange03
  },
  okButton: {
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

  okButtonText: {
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
