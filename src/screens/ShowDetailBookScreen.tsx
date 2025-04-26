import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
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

const ShowDetailBookScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()

  // Lấy bookId từ tham số điều hướng
  const { bookId } = route.params

  // Khai báo state để lưu trữ thông tin sách và trạng thái yêu thích
  const [book, setBook] = useState<any>(null)
  const [chapters, setChapters] = useState<any[]>([])
  const [isFavorited, setIsFavorited] = useState(false)

  // Fetch thông tin sách khi component mount
  // useEffect(() => {
  //   const fetchBookDetails = async () => {
  //     try {
  //       const response = await fetch(`${API_URL}/api/books/${bookId}`)
  //       const data = await response.json()
  //       setBook(data) // Giả sử API trả về thông tin sách dưới dạng JSON

  //       const chaptersResponse = await fetch(`${API_URL}/api/chapters/${bookId}`)
  //       const chaptersData = await chaptersResponse.json()
  //       setChapters(chaptersData) // Lưu danh sách chương
  //     } catch (error) {
  //       console.error('Error fetching book details:', error)
  //     }
  //   }

  //   fetchBookDetails()
  // }, [bookId])
  useFocusEffect(
    React.useCallback(() => {
      const fetchBookDetails = async () => {
        try {
          const response = await fetch(`${API_URL}/api/books/${bookId}`)
          const data = await response.json()
          setBook(data) // Giả sử API trả về thông tin sách dưới dạng JSON

          const chaptersResponse = await fetch(`${API_URL}/api/chapters/${bookId}`)
          const chaptersData = await chaptersResponse.json()
          setChapters(chaptersData) // Lưu danh sách chương
        } catch (error) {
          console.error('Error fetching book details:', error)
        }
      }

      fetchBookDetails()
    }, [bookId]) // Thêm bookId vào dependency array
  )

  // Hàm thay đổi trạng thái khi nhấn vào tim
  const handleFavoritePress = () => {
    setIsFavorited((prev) => !prev)
  }

  // Kiểm tra nếu chưa có dữ liệu sách thì hiển thị loading
  if (!book) {
    return <Text>Đang tải...</Text>
  }

  const handleChapterPress = (chapterId: string,bookId:string) => {
    navigation.navigate('BookReading', { chapterId,bookId}) 
  }
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.innerContainer}>
        {/* Book Cover Section with Gradient */}
        <LinearGradient colors={['#F68545', '#C4C4C4']} style={styles.coverContainer}>
          {/* Nút back ở góc trên bên trái */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Ảnh bìa sách */}
          <Image
            source={{ uri: book.coverImage }} // Dùng dữ liệu từ API
            style={styles.bookImage}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* Book Title and Author */}
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author.name}</Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => navigation.navigate('Preview',{bookId})}
          >
            <Text style={styles.previewButtonText}>Giới thiệu</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.readButton}
            onPress={() => navigation.navigate('BookReading')}
          >
            <Text style={styles.readButtonText}>Đọc sách</Text>
          </TouchableOpacity> */}
        </View>

        {/* Rating Section */}
        <View style={styles.ratingContainer}>
          <View style={styles.ratingLeft}>
            <Icon name="star" size={20} color="#f4b400" />
            <Text style={styles.ratingText}>{book.rating}/5</Text>
            <Text style={styles.reviewCountText}>({book.views})</Text>
          </View>
          <TouchableOpacity
            style={styles.reviewsButton}
            onPress={() => navigation.navigate('Review',{bookId})}
          >
            <Text style={styles.reviewsButtonText}>Xem tất cả đánh giá</Text>
          </TouchableOpacity>
          {/* <View style={styles.iconContainer}>
            <TouchableOpacity onPress={handleFavoritePress}>
              <Icon
                name={isFavorited ? 'favorite' : 'favorite-border'}
                size={20}
                color={isFavorited ? 'red' : '#888'}
              />
            </TouchableOpacity>
            <Icon name="file-download" size={20} color="#888" style={styles.downloadIcon} />
          </View> */}
        </View>

        {/* Description */}
        {/* <Text style={styles.description}>
          {book.description}
        </Text> */}

        {/* Book Info and Reviews Button */}
        {/* <View style={styles.infoAndReviewsContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>Thông tin sách</Text>
            <Text style={styles.infoText}>Số chương: {book.totalChapters}</Text>
            <Text style={styles.infoText}>Ngày xuất bản: {"23/04/2023"}</Text>
            <Text style={styles.infoText}>Nhà xuất bản: {"Dương Duy Long"}</Text>
          </View>
          <TouchableOpacity
            style={styles.reviewsButton}
            onPress={() => navigation.navigate('Review')}
          >
            <Text style={styles.reviewsButtonText}>Xem tất cả đánh giá</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.chaptersContainer}>
          <Text style={styles.chaptersTitle}>Danh sách các chương</Text>
          <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.scrollViewContent}>
            {chapters.map((chapter) => (
              <TouchableOpacity
                key={chapter._id}
                onPress={() => handleChapterPress(chapter._id,bookId)}
                style={styles.chapterButton}
              >
                <Text style={styles.chapterButtonText}>Chương {chapter.chapterNumber}: {chapter.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Chapters List */}
        {/* <View style={styles.chaptersContainer}>
          <Text style={styles.chaptersTitle}>Danh sách các chương</Text>
          {chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter._id}
              onPress={() => handleChapterPress(chapter._id)}
              style={styles.chapterButton}
            >
              <Text style={styles.chapterButtonText}>Chương {chapter.chapterNumber}: {chapter.title}</Text>
            </TouchableOpacity>
          ))}
        </View> */}
        

      </View>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 10,
    padding: 10,
    zIndex: 1
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20
  },
  coverContainer: {
    width: '100%',
    height: height * 0.45,
    justifyContent: 'center',
    alignItems: 'center'
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
    marginTop: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 20
  },
  previewButton: {
    backgroundColor: '#e8e8e8',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  previewButtonText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600'
  },
  readButton: {
    backgroundColor: '#188ae8',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  readButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600'
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: '90%'
  },
  ratingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937'
  },
  reviewCountText: {
    fontSize: 14,
    color: '#4b5563'
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 10
  },
  downloadIcon: {
    marginLeft: 10
  },
  description: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    fontStyle: 'italic',
    lineHeight: 20
  },
  infoAndReviewsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '90%',
    marginTop: 25
  },
  infoContainer: {
    flex: 1
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    opacity: 0.9
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
    opacity: 0.9
  },
  reviewsButton: {
    backgroundColor: '#e8e8e8',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start'
  },
  reviewsButtonText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  socialContainer: {
    position: 'absolute',
    top: height * 0.35,
    right: 20,
    flexDirection: 'row',
    gap: 10
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  socialIconInner: {
    width: 20,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10
  },
  chaptersContainer: {
    marginTop: 30,
    width: '90%'
  },
  chaptersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    opacity: 0.9
  },
  chapterButton: {
    backgroundColor: '#e8e8e8',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 2
  },
  chapterButtonText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600'
  },
  scrollViewContainer: {
    maxHeight: 200,  // Giới hạn chiều cao của danh sách chương nếu quá nhiều
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 20,  // Thêm khoảng cách dưới cùng nếu cần
  },
})

export default ShowDetailBookScreen
