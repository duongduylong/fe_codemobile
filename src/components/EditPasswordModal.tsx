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
import { colors, font } from 'src/styles'
import { getAccessToken } from 'src/utils/storage'
import { validator } from 'src/utils/validate'

interface props {
  isShow: boolean
  onClose: () => void
}

export default function EditPasswordModal({ isShow, onClose }: props) {
  const [isLoading, setIsLoading] = useState(false)
  const [passwordInputValue, setPasswordInputValue] = useState('')
  const [passwordOldInputValue, setPasswordOldInputValue] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordOldError, setPasswordOldError] = useState('')

  const validatePassword = () => {
    const validatePasswordRes = validator.validatePassword(passwordInputValue)
    if (!validatePasswordRes.isValid) {
      setPasswordError(validatePasswordRes.message)
      return false
    }

    setPasswordError('')
    return true
  }

  const onPasswordInput = (value: string) => {
    if (passwordError) {
      setPasswordError('')
    }
    setPasswordInputValue(value)
  }

  const onPasswordOldInput = (value: string) => {
    if (passwordOldError) {
      setPasswordOldError('')
    }
    setPasswordOldInputValue(value)
  }

  const handleOKPress = async () => {
    const isValidated = validatePassword()
    if (!isValidated) {
      return
    }

    try {
      setIsLoading(true)
      const token = await getAccessToken()
      const res = await fetch(`${API_URL}/api/users/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordOldInputValue,
          newPassword: passwordInputValue
        })
      })
      const data = await res.json()
      console.log(data)
      if (res.ok) {
        Toast.show({
          type: 'success',
          text1: data.message
        })
      } else {
        Toast.show({
          type: 'error',
          text1: data.message
        })
        if (data.fieldKey === 'old_password') setPasswordOldError(data.message)
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
    setPasswordOldError('')
    setPasswordError('')
    setPasswordOldInputValue('')
    setPasswordInputValue('')
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
          <Text style={styles.modalTitle}>Cập nhật mật khẩu</Text>

          <Text style={styles.inputLabel}>Mật khẩu cũ</Text>
          <TextInput
            secureTextEntry={true}
            placeholder="Nhập mật khẩu cũ"
            value={passwordOldInputValue}
            onChangeText={(value) => onPasswordOldInput(value)}
            style={styles.input}
          />
          {passwordOldError && <Text style={styles.errorMessage}>{passwordOldError}</Text>}

          <Text style={styles.inputLabel}>Mật khẩu mới</Text>
          <TextInput
            secureTextEntry={true}
            placeholder="Nhập mật khẩu mới"
            value={passwordInputValue}
            onChangeText={(value) => onPasswordInput(value)}
            style={styles.input}
          />
          {passwordError && <Text style={styles.errorMessage}>{passwordError}</Text>}

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
