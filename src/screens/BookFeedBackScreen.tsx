import { useNavigation, useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import React, {useEffect, useState } from 'react'
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { API_URL } from 'src/environment'
import { getAccessToken } from 'src/utils/storage'

const { width } = Dimensions.get('window')

const BookFeedBackScreen = () => {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const navigation = useNavigation()
  const route = useRoute()
  const { bookId } = route.params
  const [book, setBook] = useState<any>(null)

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/books/${bookId}`)
        const data = await response.json()
        setBook(data) 
      } catch (error) {
        console.error('Error fetching book details:', error)
      }
    }

    fetchBookDetails()
  }, [bookId])

  if (!book) {
      return <Text>Đang tải...</Text>
  }
  const handleSubmit = async () => {
    try {
      const token = await getAccessToken()

      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy access token.')
        return
      }

      const response = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comment,
          bookId
        })
      })

      if (response.ok) {
        Alert.alert('Thành công', 'Cảm ơn bạn đã đánh giá!')
        navigation.goBack()
      } else {
        const errorData = await response.json()
        console.error('Lỗi:', errorData)
        Alert.alert('Lỗi', errorData.message || 'Gửi đánh giá thất bại.')
      }
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error)
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi gửi đánh giá.')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <LinearGradient
          colors={['rgba(246,133,69,0.35)', 'rgba(196,196,196,0.7)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.title}>Đánh giá và nhận xét</Text>

            {/* Book Info */}
            <View style={styles.bookInfo}>
              <Image
                source={{ uri:book.coverImage}}
                style={styles.bookImage}
              />
              <View>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookAuthor}>{book.author.name}</Text>
              </View>
            </View>

            {/* Star Rating */}
            <View style={styles.starContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                  <Icon
                    name={i <= rating ? 'star' : 'star-border'}
                    size={36}
                    color="#f9b409"
                    style={styles.star}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment Box */}
            <Text style={styles.label}>Nhận xét</Text>
            <TextInput
              style={styles.input}
              placeholder="Hãy nhận xét và đóng góp ý kiến nhé"
              placeholderTextColor="#666"
              multiline
              numberOfLines={5}
              value={comment}
              onChangeText={setComment}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 40
  },
  backButton: {
    marginBottom: 20
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 50
  },
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  bookImage: {
    width: 60,
    height: 80,
    resizeMode: 'cover',
    marginRight: 16,
    borderRadius: 4
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  bookAuthor: {
    fontSize: 14,
    color: '#777'
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  star: {
    marginHorizontal: 4
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    height: 180,
    textAlignVertical: 'top',
    backgroundColor: '#f5f5f5',
    marginBottom: 24
  },
  button: {
    backgroundColor: '#188ae8',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16
  }
})

export default BookFeedBackScreen
