import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Button,
  ActivityIndicator
} from 'react-native'
import { getAccessToken } from 'src/utils/storage'
import { API_URL } from 'src/environment'
import { TNote } from 'src/models/note'
import NoteDetailModal from 'src/components/NoteDetailModal'
import NoteGroup from 'src/components/NoteGroup'
import Toast from 'react-native-toast-message'
import { colors } from 'src/styles'
export default function NoteApp() {
  const [notes, setNotes] = useState<TNote[]>([])
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailModalInfo, setDetailModalInfo] = useState<TNote | null>(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotes = async () => {
    const token = await getAccessToken()
    setIsLoading(true)
    const res = await fetch(`${API_URL}/api/notes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()

    // Đảm bảo dữ liệu trả về có thuộc tính 'notes' và là mảng
    if (data.notes && Array.isArray(data.notes)) {
      setIsLoading(false)
      setNotes(data.notes) // Cập nhật danh sách ghi chú
    } else {
      console.error('Dữ liệu trả về không chứa ghi chú hoặc không phải mảng.')
    }
  }

  const groupByDay = useCallback(<T extends { createdAt: string }>(items: T[]) => {
    const grouped = items.reduce<Record<string, T[]>>((acc, item) => {
      const date = new Date(item.createdAt)
      const key = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`

      if (!acc[key]) acc[key] = []
      acc[key].push(item)

      return acc
    }, {})

    return Object.entries(grouped).map(([date, notes]) => ({ date, notes }))
  }, [])

  const groupedItems = useMemo(() => groupByDay(notes), [notes, groupByDay])

  console.log(groupedItems)

  const addNote = async () => {
    if (!newNoteContent) return // Kiểm tra nếu không có nội dung ghi chú

    setIsLoading(true)
    const token = await getAccessToken()
    const note = { text: newNoteContent } // Cấu trúc body của ghi chú mới

    const res = await fetch(`${API_URL}/api/notes/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(note)
    })

    const data = await res.json()
    console.log('Response data:', data) // Kiểm tra phản hồi từ API

    if (res.ok) {
      // Thêm ghi chú vào danh sách
      setNotes([data.note, ...notes]) // Giả sử response chứa ghi chú mới
      setNewNoteContent('') // Xóa nội dung ghi chú sau khi lưu
      setShowModal(false) // Đóng modal
      setIsLoading(false)
      Toast.show({
        type: 'success',
        text1: 'Thêm ghi chú thành công'
      })
    } else {
      console.error('Failed to add note:', data) // Hiển thị lỗi nếu thêm không thành công
    }
  }

  const handleNoteUpdate = (updatedNote: TNote) => {
    setNotes((notes) =>
      notes.map((note) => {
        return note._id === updatedNote._id ? updatedNote : note
      })
    )
  }

  const handleNoteDelete = (deletedNoteId: string) => {
    setNotes((notes) => notes.filter((note) => note._id !== deletedNoteId))
  }

  const handleNotePressed = (note: TNote) => {
    setDetailModalInfo(note)
    setShowDetailModal(true)
  }

  const closeDetailModal = () => {
    setDetailModalInfo(null)
    setShowDetailModal(false)
  }

  const handleUpdateNote = (updatedNote: TNote) => {
    setDetailModalInfo(updatedNote)
    setNotes((state) => state.map((note) => (note._id === updatedNote._id ? updatedNote : note)))
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color={colors.orange01} />
        </View>
      )}
      <ScrollView contentContainerStyle={styles.noteList}>
        {groupedItems.map((group, index) => (
          <NoteGroup
            key={index}
            groupInfo={group}
            onUpdate={handleNoteUpdate}
            onDelete={handleNoteDelete}
            onNotePressed={handleNotePressed}
            setLoading={setIsLoading}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
        <Feather name="plus" size={36} color="white" />
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent style={{ position: 'relative' }}>
        {isLoading && (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color={colors.orange01} />
          </View>
        )}
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Nhập nội dung ghi chú"
              value={newNoteContent}
              onChangeText={setNewNoteContent}
              style={styles.input}
              multiline
            />
            <Button title="Lưu" onPress={addNote} />
            <View style={{ height: 8 }} />
            <Button title="Hủy" color="gray" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
      <NoteDetailModal
        note={detailModalInfo}
        onClose={closeDetailModal}
        isShow={showDetailModal}
        onUpdate={handleUpdateNote}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  noteList: {
    gap: 4,
    paddingBottom: 96,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#007AFF',
    borderRadius: 9999,
    height: 54,
    width: 54,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
    padding: 20,
    borderRadius: 10
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    minHeight: 80,
    textAlignVertical: 'top'
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
