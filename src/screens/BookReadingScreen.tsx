// import React, { useEffect, useState } from 'react'
// import { Ionicons } from '@expo/vector-icons'
// import { LinearGradient } from 'expo-linear-gradient'
// import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import { API_URL } from 'src/environment'
// import { useNavigation, useRoute } from '@react-navigation/native'
// import { getAccessToken } from 'src/utils/storage'

// const { width, height } = Dimensions.get('window')

// const BookReadingScreen: React.FC = () => {
//   const navigation = useNavigation()
//   const route = useRoute()
//   // Nhận ID chương từ ShowDetailBookScreen thông qua route.params
//   const { chapterId } = route.params
//   console.log(chapterId);

//   const [chapter, setChapter] = useState<any>(null)
//   const [content, setContent] = useState(null)
//   const [loading, setLoading] = useState(true)
  
//   useEffect(() => {
//     // Lấy dữ liệu chương từ API
//     const fetchChapterData = async () => {
//       try {
//         const token = await getAccessToken();
//         const response = await fetch(`${API_URL}/api/chapters/book/${chapterId}`, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         })
//         if (!response.ok) {
//           throw new Error('Network response was not ok')
//         }
//         const data = await response.json()
//         setChapter(data)
//         fetchChapterContent(data.content)  // Lấy nội dung từ URL
//       } catch (error) {
//         console.error('Error fetching chapter data:', error)
//         setLoading(false)
//       }
//     }

//     // Lấy nội dung từ URL
//     const fetchChapterContent = async (url) => {
//       try {
//         const response = await fetch(url)
//         if (!response.ok) {
//           throw new Error('Failed to fetch chapter content')
//         }
//         const contentData = await response.text()
//         setContent(contentData)
//         setLoading(false)
//       } catch (error) {
//         console.error('Error fetching chapter content:', error)
//         setLoading(false)
//       }
//     }

//     fetchChapterData()
//   }, [chapterId])

//   if (loading) {
//     return <Text>Loading...</Text>  // Hiển thị loading khi dữ liệu chưa tải xong
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header với gradient */}
//       <LinearGradient
//         colors={['rgba(245, 130, 32, 0.5)', 'rgba(255, 255, 255, 0.8)']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 0, y: 1 }}
//         style={styles.header}
//       >
//         <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Text style={styles.title}>{chapter?.title || 'Loading...'}</Text>
//       </LinearGradient>

//       {/* Nội dung sách */}
//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <Text style={styles.content}>
//           {content || 'Loading chapter content...'}
//         </Text>
//       </ScrollView>

//       {/* Thanh tiến độ + nút tiếp */}
//       <View style={styles.footer}>
//         <Text style={styles.pageNumber}>155/200</Text>
//         <TouchableOpacity style={styles.nextBtn}>
//           <Text style={styles.nextText}>Tiếp</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   )
// }

// export default BookReadingScreen

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   header: {
//     height: height * 0.15,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative'
//   },
//   backIcon: {
//     position: 'absolute',
//     top: 30,
//     left: 20
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 18,
//     marginTop: 50
//   },
//   contentContainer: {
//     paddingHorizontal: 24,
//     paddingTop: 16,
//     paddingBottom: 100
//   },
//   content: {
//     textAlign: 'justify',
//     fontSize: 14,
//     lineHeight: 22
//   },
//   footer: {
//     height: 60,
//     position: 'relative',
//     justifyContent: 'center'
//   },
//   pageNumber: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     textAlign: 'center',
//     fontSize: 14,
//     color: '#000'
//   },
//   nextBtn: {
//     position: 'absolute',
//     right: 20,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#188ae8',
//     borderRadius: 16
//   },
//   nextText: {
//     color: '#fff',
//     fontWeight: 'bold'
//   }
// })

import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { API_URL } from 'src/environment'
import { useNavigation, useRoute } from '@react-navigation/native'
import { getAccessToken } from 'src/utils/storage'

const { width, height } = Dimensions.get('window')

const BookReadingScreen: React.FC = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { chapterId, bookId } = route.params

  const [chapterList, setChapterList] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [chapter, setChapter] = useState<any>(null)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = await getAccessToken()
        const res = await fetch(`${API_URL}/api/chapters/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()
        setChapterList(data)
        const index = data.findIndex(c => c._id === chapterId)
        setCurrentIndex(index)
      } catch (error) {
        console.error('Error fetching chapter list:', error)
      }
    }
    fetchChapters()
  }, [bookId, chapterId])

  useEffect(() => {
    if (currentIndex >= 0 && chapterList.length > 0) {
      const selectedChapter = chapterList[currentIndex]
      console.log(selectedChapter)
      // setChapter(selectedChapter)
      // fetchChapterContent(selectedChapter.content)
      fetchChapterDetail(selectedChapter._id)
    }
  }, [currentIndex, chapterList])

  const fetchChapterContent = async (url: string) => {
    setLoading(true)
    try {
      const res = await fetch(url)
      const text = await res.text()
      setContent(text)
    } catch (error) {
      console.error('Error fetching content:', error)
    }
    setLoading(false)
  }
  const fetchChapterDetail = async (id: string) => {
    setLoading(true)
    try {
      const token = await getAccessToken()
      const res = await fetch(`${API_URL}/api/chapters/book/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setChapter(data)
      fetchChapterContent(data.content)
    } catch (error) {
      console.error('Error fetching chapter detail:', error)
    }
    setLoading(false)
  }

  const handleNext = () => {
    if (currentIndex < chapterList.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (loading) return <Text style={{ padding: 20 }}>Đang tải nội dung chương...</Text>

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(245, 130, 32, 0.5)', 'rgba(255, 255, 255, 0.8)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{chapter?.title || 'Đang tải...'}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.content}>
          {content || 'Không có nội dung.'}
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          <TouchableOpacity disabled={currentIndex === 0} onPress={handlePrev} style={[styles.navBtn, currentIndex === 0 && { opacity: 0.5 }]}>
            <Text style={styles.nextText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>{`${currentIndex + 1}/${chapterList.length}`}</Text>
          <TouchableOpacity disabled={currentIndex === chapterList.length - 1} onPress={handleNext} style={[styles.navBtn, currentIndex === chapterList.length - 1 && { opacity: 0.5 }]}>
            <Text style={styles.nextText}>{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default BookReadingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: height * 0.15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  backIcon: {
    position: 'absolute',
    top: 30,
    left: 20
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 50
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100
  },
  content: {
    textAlign: 'justify',
    fontSize: 14,
    lineHeight: 22
  },
  footer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pageNumber: {
    marginHorizontal: 20,
    fontSize: 14,
    color: '#000'
  },
  navBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F4874A',
    borderRadius: 16
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold'
  }
})
