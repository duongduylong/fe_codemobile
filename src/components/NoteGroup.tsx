import { useState } from 'react'
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import Note from 'src/components/Note'
import { API_URL } from 'src/environment'
import { TNote } from 'src/models/note'
import { colors, font } from 'src/styles'

export type TNoteGroupInfo = {
  date: string
  notes: TNote[]
}

interface props {
  groupInfo: TNoteGroupInfo
  onUpdate: (note: TNote) => void
  onDelete: (id: string) => void
  onNotePressed: (note: TNote) => void
  setLoading: (state: boolean) => void
}

export default function NoteGroup({
  groupInfo,
  onUpdate,
  onDelete,
  onNotePressed,
  setLoading
}: props) {
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleStar = async (note: TNote) => {
    setLoading(true)
    const res = await fetch(`${API_URL}/api/notes/${note._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...note, isStarred: !note.isStarred })
    })
    const updated = await res.json()
    setLoading(false)
    onUpdate(updated)
  }

  const deleteNote = async (noteId: string) => {
    setLoading(true)
    await fetch(`${API_URL}/api/notes/${noteId}`, {
      method: 'DELETE'
    })
    setLoading(false)
    onDelete(noteId)
  }

  const onDeletePressed = (noteId: string) => {
    setDeletingId(noteId)
    setIsDeleteModalShow(true)
  }

  const handleCancelPress = () => {
    setDeletingId(null)
    setIsDeleteModalShow(false)
  }

  const handleConfirmPressed = () => {
    deleteNote(deletingId!)
    setDeletingId(null)
    setIsDeleteModalShow(false)
  }

  const toggleExpand = () => {
    setIsExpanded((state) => !state)
  }

  return (
    <View style={styles.noteGroup}>
      <TouchableOpacity onPress={toggleExpand}>
        <Text style={styles.groupTitle}>{groupInfo.date}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.noteContainer}>
          {groupInfo.notes.map((note, index) => (
            <Note
              key={index}
              note={note}
              onStarPressed={() => toggleStar(note)}
              onDeletePressed={() => onDeletePressed(note._id)}
              onBodyPressed={() => onNotePressed(note)}
            />
          ))}
        </View>
      )}
      <Modal
        style={{ position: 'relative' }}
        visible={isDeleteModalShow}
        animationType="slide"
        transparent
        presentationStyle="overFullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bạn có chắc chắn muốn xóa?</Text>
            <TouchableOpacity onPress={handleConfirmPressed} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Đồng ý</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelPress} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  confirmButton: {
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

  confirmButtonText: {
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
  },

  noteGroup: {
    position: 'relative',
    backgroundColor: colors.orange03,
    borderRadius: 8
  },

  groupTitle: {
    fontSize: font.size.small,
    color: 'white',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 4,
    paddingBottom: 4
  },

  noteContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 8,
    backgroundColor: 'white',
  }
})
