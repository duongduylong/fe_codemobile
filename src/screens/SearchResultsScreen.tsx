// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { API_URL } from 'src/environment';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const ITEMS_PER_PAGE = 3;

// const SearchResultsScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { searchTerm } = route.params as { searchTerm: string };

//   const [books, setBooks] = useState<any[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);

//   const fetchBooks = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/books/search?q=${searchTerm}`);
//       const data = await response.json();
      
//       if (Array.isArray(data)) {
//         setBooks(data);
//       } else {
//         console.error('Dữ liệu không hợp lệ:', data);
//       }
//     } catch (error) {
//       console.error('Error fetching books:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBooks();
//   }, [searchTerm]);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const renderPagination = () => {
//     const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
//     const maxPagesToShow = 3;
//     let startPage = Math.max(1, currentPage - 1);
//     let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

//     if (endPage === totalPages) {
//       startPage = Math.max(1, totalPages - maxPagesToShow + 1);
//     }

//     const pages = [];
//     if (currentPage > 1) {
//       pages.push(
//         <TouchableOpacity key="prev" onPress={() => handlePageChange(currentPage - 1)}>
//           <Text style={styles.footerText}>{'<'}</Text>
//         </TouchableOpacity>
//       );
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <TouchableOpacity key={i} onPress={() => handlePageChange(i)}>
//           <Text style={[styles.footerText, i === currentPage && styles.currentPage]}>{i}</Text>
//         </TouchableOpacity>
//       );
//     }

//     if (currentPage < totalPages) {
//       pages.push(
//         <TouchableOpacity key="next" onPress={() => handlePageChange(currentPage + 1)}>
//           <Text style={styles.footerText}>{'>'}</Text>
//         </TouchableOpacity>
//       );
//     }

//     return pages;
//   };

//   const handleNavigateBookDetail = (bookId: string) => {
//     navigation.navigate('BookDetail', { bookId });
//   };

//   const renderItem = ({ item }: { item: any }) => {
//     return (
//       <TouchableOpacity style={styles.itemContainer} onPress={() => handleNavigateBookDetail(item._id)}>
//         <Image source={{ uri: item.coverImage }} style={styles.bookImage} />
//         <View style={{ flex: 1, marginLeft: 12 }}>
//           <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
//           <Text style={styles.rating}>Đánh giá: {item.rating ?? 'Chưa có'}</Text>
//           <Text style={styles.chapter}>Số chương: {item.totalChapters ?? 0}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const currentData = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   return (
//     <View style={styles.container}>
//       {/* <Text style={styles.headerText}>Kết quả tìm kiếm cho: {searchTerm}</Text> */}
//       {loading ? (
//         <ActivityIndicator size="large" color="#E29E77" />
//       ) : (
//         <FlatList
//           data={currentData}
//           renderItem={renderItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={{ paddingBottom: 16 }}
//         />
//       )}
//       <View style={styles.footer}>
//         {renderPagination()}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f7f7f7',
//     paddingHorizontal: 10,
//   },
//   headerText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginVertical: 20,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     marginVertical: 8,
//     padding: 10,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//   },
//   bookImage: {
//     width: 80,
//     height: 120,
//     borderRadius: 8,
//     backgroundColor: '#eee',
//   },
//   bookTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   rating: {
//     fontSize: 14,
//     color: '#f39c12',
//     marginBottom: 4,
//   },
//   chapter: {
//     fontSize: 14,
//     color: '#666',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     backgroundColor: '#fff',
//   },
//   footerText: {
//     fontSize: 18,
//     marginHorizontal: 8,
//     color: '#007bff',
//   },
//   currentPage: {
//     fontWeight: 'bold',
//     color: '#000',
//     fontSize: 18,
//   },
// });

// export default SearchResultsScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from 'src/environment';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ITEMS_PER_PAGE = 3;

const SearchResultsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { searchTerm } = route.params as { searchTerm: string };

  const [books, setBooks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/books/search?q=${searchTerm}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setBooks(data);
      } else {
        console.error('Dữ liệu không hợp lệ:', data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
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
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={() => handleNavigateBookDetail(item._id)}>
        <Image source={{ uri: item.coverImage }} style={styles.bookImage} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.rating}>Đánh giá: {item.rating ?? 'Chưa có'}</Text>
          <Text style={styles.chapter}>Số chương: {item.totalChapters ?? 0}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = books.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumb}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.breadcrumbLink}>Trang chủ</Text>
              </TouchableOpacity>
              <Text style={styles.breadcrumbArrow}> → </Text>
              <TouchableOpacity disabled>
                <Text style={styles.breadcrumbCurrent}>Tìm kiếm</Text>
              </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Kết quả tìm kiếm cho: {searchTerm}</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#E29E77" style={styles.loader} />
      ) : (
        <>
          {books.length === 0 ? (
            <View style={styles.noDataContainer}>
                <Text style={styles.noResultsText}>Không tìm thấy kết quả nào.</Text>
            </View>
          ) : (
            <FlatList
              data={currentData}
              renderItem={renderItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          )}
        </>
      )}

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
    paddingHorizontal: 10,
  },
  breadcrumb: {
    fontSize:15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop:10
  },
  breadcrumbLink: {
    fontSize:15,
    color: '#333',
    fontWeight: '500',
    marginLeft:0,
  },
  breadcrumbArrow: {
    fontSize:15,
    marginHorizontal: 5,
    color: '#888',
  },
  breadcrumbCurrent: {
    fontSize:15,
    color: '#007bff',
    fontWeight: '500',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  loader: {
    marginTop: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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

export default SearchResultsScreen;
