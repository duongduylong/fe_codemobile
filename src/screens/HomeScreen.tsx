import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Keyboard,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { API_URL } from 'src/environment';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [books, setBooks] = useState([]);
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const bannerRef = useRef(null); // Sử dụng ref cho ScrollView
  const navigation = useNavigation();

  const banners = [
    'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-thump.jpg',
    'https://nads.1cdn.vn/2024/11/22/74da3f39-759b-4f08-8850-4c8f2937e81a-1_mangeshdes.png',
    'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
    'https://img.pikbest.com/origin/09/41/85/916pIkbEsTzRC.jpg!w700wp',
    'https://images2.thanhnien.vn/528068263637045248/2024/1/25/e093e9cfc9027d6a142358d24d2ee350-65a11ac2af785880-17061562929701875684912.jpg'
  ];

  useEffect(() => {
    // Gọi API để lấy danh sách tác giả
    fetch(`${API_URL}/api/authors/recommended`)
      .then(response => response.json())
      .then(data => setAuthors(data))
      .catch(error => console.error('Error fetching authors:', error));
  }, []);

  useEffect(() => {
    // Gọi API để lấy danh sách sách
    fetch(`${API_URL}/api/books`)
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  useEffect(() => {
    // Gọi API để lấy danh sách sách xu hướng
    fetch(`${API_URL}/api/books/top/rated`)
      .then(response => response.json())
      .then(data => setTrendingBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  const handleNavigateBookDetail = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const saveSearchHistory = (term: string) => {
    if (term && !searchHistory.includes(term)) {
      const updatedHistory = [term, ...searchHistory].slice(0, 5);
      setSearchHistory(updatedHistory);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      saveSearchHistory(searchTerm); // Lưu từ khóa vào lịch sử
      navigation.navigate('SearchResults', { searchTerm });
      setSearchTerm('');
      Keyboard.dismiss();  // Đóng bàn phím sau khi tìm kiếm
    }
  };

  const handleSelectHistory = (term: string) => {
    setSearchTerm(term);
    setIsFocused(false);  // Ẩn gợi ý khi chọn từ khóa trong lịch sử
    navigation.navigate('SearchResults', { searchTerm: term });
    setSearchTerm('');
    Keyboard.dismiss();  // Đóng bàn phím sau khi tìm kiếm
  };

  const handleDismissKeyboard = () => {
    setIsFocused(false);
    Keyboard.dismiss();
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(false);
    }, [])
  );

  useEffect(() => {
    // Auto-scroll mỗi 3 giây
    const interval = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % banners.length;
        if (bannerRef.current) {
          // Scroll tới vị trí của banner tiếp theo
          bannerRef.current.scrollTo({ x: nextIndex * width, animated: true });
        }
        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(interval); // Cleanup khi component unmount
  }, []);

  return (
    <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
      <View style={{ flex: 1 }}>
        <FlatList
          data={[1]} // Thêm dữ liệu giả để làm nền tảng
          renderItem={() => (
            <View style={{ padding: 16 }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Tìm kiếm</Text>
              </View>

              {/* SearchBar */}
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm theo Tiêu đề, Tác giả, Thể loại"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  returnKeyType="search"
                  onFocus={() => setIsFocused(true)}
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity onPress={handleSearch}>
                  <Ionicons name="search" size={24} color="#888" style={styles.searchIcon} />
                </TouchableOpacity>
              </View>

              {/* Hiển thị lịch sử tìm kiếm khi ô tìm kiếm được focus */}
              {isFocused && searchHistory.length > 0 && (
                <View style={styles.historyContainer}>
                  <FlatList
                    data={searchHistory}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleSelectHistory(item)}>
                        <Text style={styles.historyItem}>{item}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                  />
                </View>
              )}

              {/* Banner */}
              <ScrollView
                ref={bannerRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const contentOffsetX = e.nativeEvent.contentOffset.x;
                  const currentIndex = Math.floor(contentOffsetX / width);
                  setCurrentBannerIndex(currentIndex); // Cập nhật index khi vuốt
                }}
              >
                {banners.map((banner, index) => (
                  <Image
                    key={index}
                    source={{ uri: banner }}
                    style={{ width, height: 120, borderRadius: 8, marginBottom: 16 }}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {/* Suggested Authors */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Đề xuất tác giả</Text>
                <FlatList
                  horizontal
                  data={authors}
                  keyExtractor={(item, idx) => idx.toString()}
                  renderItem={({ item, idx }) => (
                    <TouchableOpacity
                      key={idx}
                      style={{ alignItems: 'center', marginRight: 16 }}
                      onPress={() => navigation.navigate('AuthorBooks', { authorId: item._id, authorName: item.name, authorImage: item.image })}
                    >
                      <Image source={{ uri: item.image }} style={{ width: 60, height: 60, borderRadius: 30 }} />
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* New Books */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Sách mới</Text>
                <FlatList
                  horizontal
                  data={books}
                  keyExtractor={(item, idx) => idx.toString()}
                  renderItem={({ item, idx }) => (
                    <TouchableOpacity key={idx} onPress={() => handleNavigateBookDetail(item._id)}>
                      <View style={{ marginRight: 16 }}>
                        <Image
                          source={{ uri: item.coverImage }}
                          style={{ width: 100, height: 150, borderRadius: 8 }}
                        />
                        <Text style={{ width: 100 }}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Reading Trends */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Xu hướng đọc</Text>
                <FlatList
                  horizontal
                  data={trendingBooks}
                  keyExtractor={(item, idx) => idx.toString()}
                  renderItem={({ item, idx }) => (
                    <TouchableOpacity key={idx} onPress={() => handleNavigateBookDetail(item._id)}>
                      <View style={{ marginRight: 16 }}>
                        <Image
                          source={{ uri: item.coverImage }}
                          style={{ width: 100, height: 150, borderRadius: 8 }}
                        />
                        <Text style={{ width: 100 }}>{item.title}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          )}
          keyExtractor={() => '1'}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
    height: 45,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingLeft: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 40,
  },
  searchIcon: {
    marginLeft: 10,
  },
  historyContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    borderRadius: 8,
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  historyItem: {
    padding: 10,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
