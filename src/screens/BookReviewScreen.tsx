import { FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Dimensions } from 'react-native'
import { API_URL } from 'src/environment'

const { width, height } = Dimensions.get('window')


export default function BookReviewScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const { bookId } = route.params

  const [reviews, setReviews] = useState([])
  const [book, setBook] = useState([])
  useFocusEffect(
    React.useCallback(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`${API_URL}/api/reviews/${bookId}`)
          const data = await response.json()
          setReviews(data.reviews || [])

          const bookResponse = await fetch(`${API_URL}/api/books/${bookId}`)
          const bookData = await bookResponse.json()
          setBook(bookData)
        } catch (error) {
          console.error('Lỗi khi lấy review:', error)
        }
      }

      fetchReviews()
    }, [bookId])
  )
  if (!book) {
      return <Text>Đang tải...</Text>
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
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
          <TouchableOpacity
            style={styles.readButton}
            onPress={() => navigation.navigate('BookDetail',{bookId})}
          >
            <Text style={styles.readButtonText}>Đọc sách</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.reviewHeader}>
          <Text style={styles.title}>Độc giả đánh giá</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingNumber}>{book.rating}</Text>
            <StarRating rating={5} />
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.subText}>{reviews.length} đánh giá</Text>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate('Feedback',{bookId})}
            >
              <FontAwesome name="commenting-o" size={16} color="#333" />
              <Text style={styles.reviewButtonText}> Đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          {reviews.map((item: any) => (
            <View key={item._id} style={styles.reviewCard}>
              <View style={styles.reviewHeaderRow}>
                <Image
                  source={require('../../assets/anh1.jpg')}
                  style={styles.avatar}
                />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>{item.userId?.username || 'Ẩn danh'}</Text>
                  <StarRating rating={item.rating} />
                </View>
                <Text style={styles.reviewDate}>
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <Text style={styles.reviewText}>{item.comment}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <FontAwesome key={i} name={i < rating ? 'star' : 'star-o'} size={16} color="#FFD700" />
      ))}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 0
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
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
    opacity: 0.9
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 1
  },
  header: {
    alignItems: 'center',
    marginBottom: 20
  },
  bookImage: {
    width: 180,
    height: 260,
    marginTop: 30,
    marginBottom: 15
  },
  readButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 10
  },
  readButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  reviewHeader: {
    marginBottom: 5,
    marginTop: 10,
    paddingHorizontal: 20,
    width: '100%'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 6
  },
  subText: {
    color: '#777',
    marginBottom: 10
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: 10
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewButtonText: {
    color: '#333',
    fontWeight: '500'
  },
  reviewCard: {
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    width: width * 0.92,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 6
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10
  },
  reviewInfo: {
    flex: 1
  },
  reviewerName: {
    fontWeight: 'bold'
  },
  reviewDate: {
    fontSize: 12,
    color: '#888'
  },
  reviewText: {
    color: '#333',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6
  }
})
