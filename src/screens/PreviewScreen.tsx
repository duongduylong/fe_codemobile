import { useNavigation, useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { API_URL } from 'src/environment'

const { width, height } = Dimensions.get('window')

const PreviewScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { bookId } = route.params
  console.log(bookId);
  const [book, setBook] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/${bookId}`)
        const data = await response.json()
        setBook(data) 

        const chaptersResponse = await fetch(`${API_URL}/api/chapters/${bookId}`)
        const chaptersData = await chaptersResponse.json()
        setChapters(chaptersData) // Lưu danh sách chương
      } catch (error) {
        console.error('Error fetching book details:', error)
      }
    }

    fetchBookDetails()
  }, [bookId])

  if (!book) {
      return <Text>Đang tải...</Text>
  }


  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Gradient & Image */}
        <LinearGradient colors={['#F68545', '#C4C4C4']} style={styles.coverContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 18, marginLeft: 10 }}>Giới thiệu</Text>
          </TouchableOpacity>
          <Image
            source={{ uri: book.coverImage }}
            style={styles.bookImage}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* Tiêu đề và tác giả */}
        <Text style={styles.title}>{book.title}t</Text>
        <Text style={styles.author}>{book.author.name}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Mô tả sách */}
        <Text style={styles.description}>
          {book.description}
        </Text>

        {/* Nút Đọc sách */}
        <TouchableOpacity
          style={styles.readButton}
          onPress={() => navigation.navigate('BookDetail',{bookId})}
        >
          <Text style={styles.readButtonText}>Đọc sách</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 40
  },
  coverContainer: {
    width: '100%',
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 6,
    padding: 10,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  bookImage: {
    width: width * 0.5,
    height: '80%',
    borderRadius: 8,
    marginTop: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginTop: 20
  },
  author: {
    fontSize: 16,
    color: '#4b5563',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 10
  },
  divider: {
    height: 2,
    width: 50,
    backgroundColor: '#000',
    marginVertical: 20
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    color: '#374151',
    marginHorizontal: 25,
    textAlign: 'justify'
  },
  readButton: {
    backgroundColor: '#188ae8',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  readButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

export default PreviewScreen
