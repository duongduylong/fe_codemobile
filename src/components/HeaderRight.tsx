import { DrawerActions, useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native'
import { API_URL } from 'src/environment'
import { font } from 'src/styles'
import { getAccessToken } from 'src/utils/storage'

interface Props {
  onHeaderClick: () => void
}

export function HeaderRight() {
  const [username, setUsername] = useState('...')
  const navigation = useNavigation()

  function onHeaderClick() {
    navigation.dispatch(DrawerActions.openDrawer())
  }

  // Gọi API lấy thông tin người dùng
  useEffect(() => {
    const fetchUserProfile = async () => {
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
          console.log(data)
          setUsername(data.username || 'Người dùng') // fallback nếu API không có name
        } else {
          console.error('Không thể lấy thông tin người dùng')
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error)
      }
    }

    fetchUserProfile()
  }, [])

  return (
    <View style={styles.headerRightContainer}>
      <TouchableOpacity onPress={onHeaderClick}>
        <Text style={styles.username}>{username}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onHeaderClick}>
        <Image source={require('../../assets/anh1.jpg')} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  username: {
    marginRight: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  logoutButton: {
    paddingVertical: 10
  },
  logoutText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold'
  },
  profileText: {
    fontSize: font.size.small
  }
})
