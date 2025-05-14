import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Modal,
  Button
} from 'react-native'
import { getAccessToken } from 'src/utils/storage'
import { API_URL } from 'src/environment'
import App from 'src/App'
export default function NoteApp() {
  const [notes, setNotes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState('')

  const fetchNotes = async () => {
    const token = await getAccessToken()
    const res = await fetch(`${API_URL}/api/notes`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()

    // Đảm bảo dữ liệu trả về có thuộc tính 'notes' và là mảng
    if (data.notes && Array.isArray(data.notes)) {
      setNotes(data.notes) // Cập nhật danh sách ghi chú
      console.log(data.notes)
    } else {
      console.error('Dữ liệu trả về không chứa ghi chú hoặc không phải mảng.')
    }
  }

  const addNote = async () => {
    console.log('Adding note:', newNoteContent) // Kiểm tra giá trị nội dung ghi chú
    if (!newNoteContent) return // Kiểm tra nếu không có nội dung ghi chú

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
      setNotes([...notes, data.note]) // Giả sử response chứa ghi chú mới
      setNewNoteContent('') // Xóa nội dung ghi chú sau khi lưu
      setShowModal(false) // Đóng modal
    } else {
      console.error('Failed to add note:', data) // Hiển thị lỗi nếu thêm không thành công
    }
  }

  const toggleStar = async (note) => {
    const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...note, isStarred: !note.isStarred })
    })
    const updated = await res.json()
    setNotes(notes.map((n) => (n._id === note._id ? updated : n)))
  }

  const toggleCheck = async (note) => {
    const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...note, isChecked: !note.isChecked })
    })
    const updated = await res.json()
    setNotes(notes.map((n) => (n._id === note._id ? updated : n)))
  }

  const deleteNote = async (noteId) => {
    await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: 'DELETE'
    })
    setNotes(notes.filter((n) => n._id !== noteId))
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <LinearGradient colors={['#85b9fd', '#ffffff']} style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Ghi chú của Tôi</Text>

        <ScrollView contentContainerStyle={styles.noteList}>
          {notes.map((note) => (
            <View key={note._id} style={styles.noteBox}>
              <TouchableOpacity onPress={() => toggleCheck(note)} style={styles.noteCircle}>
                {note.isChecked && <Feather name="check" size={14} color="white" />}
              </TouchableOpacity>

              <View style={{ width: 200 }}>
                <Text style={[styles.noteText, note.isChecked && styles.checkedText]}>
                  {note.text}
                </Text>
              </View>

              <TouchableOpacity onPress={() => toggleStar(note)} style={styles.starIcon}>
                <Feather name="star" size={20} color={note.isStarred ? '#FFD700' : 'white'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteNote(note._id)} style={styles.starIcon}>
                <Feather name="trash-2" size={18} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.addButton} onPress={() => setShowModal(true)}>
          <Feather name="plus" size={24} color="white" />
        </TouchableOpacity>

        <Modal visible={showModal} animationType="slide" transparent>
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
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  noteList: {
    gap: 12
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 10
  },
  noteCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noteText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    flexWrap: 'wrap'
  },
  checkedText: {
    textDecorationLine: 'line-through',
    color: '#ccc'
  },
  starIcon: {
    marginLeft: 10
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 30
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
  }
})
