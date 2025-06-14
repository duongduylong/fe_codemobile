import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import EditPasswordModal from 'src/components/EditPasswordModal'
import EditUsernameModal from 'src/components/EditUsernameModal'
import { API_URL } from 'src/environment'
import { TUser } from 'src/models/user'
import { colors, font } from 'src/styles'
import { getAccessToken } from 'src/utils/storage'

interface Props {
  onLogout: () => void
}

export default function ProfileScreen({ onLogout }: Props) {
  const [user, setUser] = useState<TUser | null>(null)
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()
  const [isEditUsernameModalShow, setIsEditUsernameModalShow] = useState(false)
  const [isEditPasswordModalShow, setIsEditPasswordModalShow] = useState(false)

  function onNotes() {
    navigation.navigate('Ghi chú của tôi')
  }

  function handleUpdateUsernamePress() {
    setIsEditUsernameModalShow(true)
  }

  function handleOnUpdateUsername(updatedUser: TUser) {
    setUser(updatedUser)
  }

  function handleUpdatePasswordPress() {
    setIsEditPasswordModalShow(true)
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('here!')
      setLoading(true)

      try {
        const token = await getAccessToken()
        if (!token) return

        const response = await fetch(`${API_URL}/api/users/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setUser({
            username: data.username,
            email: data.email,
            readHistory: data.readHistory,
            favoriteGenres: data.favoriteGenres
          })
        } else {
          console.error('Không thể lấy thông tin người dùng')
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  return loading ? (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color={colors.orange01} />
    </View>
  ) : user ? (
    <ScrollView contentContainerStyle={styles.container}>
      <EditUsernameModal
        user={user}
        onClose={() => setIsEditUsernameModalShow(false)}
        onUpdate={handleOnUpdateUsername}
        isShow={isEditUsernameModalShow}
      />
      <EditPasswordModal
        onClose={() => setIsEditPasswordModalShow(false)}
        isShow={isEditPasswordModalShow}
      />
      <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Tên người dùng:</Text>
        <View style={styles.infoLine}>
          <Text style={styles.value}>{user?.username}</Text>
          <TouchableOpacity onPress={handleUpdateUsernamePress}>
            <Text style={styles.clickableText}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleUpdatePasswordPress}>
          <Text style={styles.clickableText}>Cập nhật mật khẩu</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Lịch sử</Text>
      <View style={styles.infoBox}>
        <Text style={styles.value}>
          Số sách đã đọc: {user!.readHistory.filter((item) => item.status === 'finished').length}
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onNotes}>
          <Text style={styles.buttonText}>Ghi chú</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.buttonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  ) : (
    <View style={styles.noData}>
      <Text style={styles.noDataText}>Không tìm thấy thông tin...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  clickableText: {
    color: colors.orange02,
    fontWeight: 600,
    textAlign: 'right'
  },
  infoLine: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  noData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noDataText: {
    fontSize: font.size.normal
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    padding: 20
  },
  sectionTitle: {
    fontSize: font.size.normal,
    fontWeight: '600',
    marginTop: 20
  },
  infoBox: {
    backgroundColor: '#fef7f2',
    padding: 15,
    borderRadius: 8,
    marginTop: 10
  },
  label: {
    fontWeight: '600',
    color: '#333',
    fontSize: font.size.small
  },
  value: {
    fontSize: font.size.small,
    color: '#333',
    marginBottom: 5
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 4,
    marginTop: 30
  },
  button: {
    flex: 1,
    backgroundColor: colors.orange01,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: colors.orange02,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600'
  }
})
