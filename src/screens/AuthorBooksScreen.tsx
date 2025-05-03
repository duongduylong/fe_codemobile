import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from 'src/environment';
import Icon from 'react-native-vector-icons/MaterialIcons'


const ITEMS_PER_PAGE = 3;

const AuthorBooksScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { authorId, authorName, authorImage } = route.params as { authorId: string; authorName: string; authorImage: string };

  const [books, setBooks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/books/${authorId}/listbook`);
      const data = await response.json();
      // console.log('Data books:', data);

      if (Array.isArray(data)) {
        setBooks(data);
        setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
      } else {
        console.error('Dữ liệu không hợp lệ:', data);
      }
    } catch (error) {
      console.error('Error fetching author books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const maxPagesToShow = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    const pages = [];
    if (currentPage > 1) {
      pages.push(
        <TouchableOpacity key="prev" onPress={() => handlePageChange(currentPage - 1)}>
          <Text style={styles.footerText}>{'<'}</Text>
        </TouchableOpacity>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity key={i} onPress={() => handlePageChange(i)}>
          <Text style={[styles.footerText, i === currentPage && styles.currentPage]}>{i}</Text>
        </TouchableOpacity>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <TouchableOpacity key="next" onPress={() => handlePageChange(currentPage + 1)}>
          <Text style={styles.footerText}>{'>'}</Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  const handleNavigateBookDetail = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const renderItem = ({ item }: { item: any }) => {
    if (!item) return null; // Check to return null if the item is not valid

    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleNavigateBookDetail(item._id)}>
        <Image source={{ uri: item.coverImage }} style={styles.bookImage} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          {/* <Text style={styles.bookDescription} numberOfLines={2}>{item.description}</Text> */}
          <Text style={styles.rating}>Đánh giá: {item.rating ?? 'Chưa có'}</Text>
          <Text style={styles.chapter}>Số chương: {item.totalChapters ?? 0}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = books.slice(startIndex, endIndex);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: authorImage }} style={styles.authorImage} />
        <Text style={styles.authorName}>{authorName}</Text>
      </View>
      <FlatList
            data={currentData}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 16 }}
            style={{ marginTop: 10 }}
          />
      <View style={styles.footer}>
        {renderPagination()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: '#E29E77',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 10,
    padding: 10,
    zIndex: 1
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
  },
  authorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  authorName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 8,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
    marginBottom: 4,
  },
  chapter: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 18,
    marginHorizontal: 8,
    color: '#007bff',
  },
  currentPage: {
    fontWeight: 'bold',
    color: '#000',
    fontSize: 18,
  },
});


export default AuthorBooksScreen;
