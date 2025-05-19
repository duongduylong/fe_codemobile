import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { TNote } from 'src/models/note'
import { Feather } from '@expo/vector-icons'
import { stringUtil } from 'src/utils/string'

interface props {
  note: TNote,
  onStarPressed: (note: TNote) => void,
  onDeletePressed: (noteId: string) => void,
  onBodyPressed: (note: TNote) => void,
}

export default function Note({ note, onStarPressed, onDeletePressed, onBodyPressed }: props) {
  return (
    <TouchableOpacity onPress={() => onBodyPressed(note)} key={note._id} style={styles.noteBox}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.noteText]}>{stringUtil.truncate(note.text, 28)}</Text>
      </View>

      <TouchableOpacity onPress={() => onStarPressed(note)} style={styles.starIcon}>
        <Feather name="star" size={20} color={note.isStarred ? '#FFD700' : 'white'} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDeletePressed(note._id)} style={styles.starIcon}>
        <Feather name="trash-2" size={18} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 10
  },
  noteText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    flexWrap: 'wrap'
  },
  starIcon: {
    marginLeft: 10
  },
})
