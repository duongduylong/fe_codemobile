import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAccessToken } from 'src/utils/storage';
import { API_URL } from 'src/environment';

const ITEMS_PER_PAGE = 5;

const RankingView = () => {
  const [selectedTab, setSelectedTab] = useState<'month' | 'day' | 'week'>('month');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); 
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBooksData = async (tab: 'month' | 'day' | 'week') => {
      console.log("Đã vào được hàm fetchBooksData");
  
      setLoading(true);
      const token = await getAccessToken();
      try {
        const response = await fetch(`${API_URL}/api/books/top/abc?period=${tab}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Gửi token trong header
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.error('Lỗi khi lấy dữ liệu BXH:', response.statusText);  // In thông báo lỗi
          throw new Error('Lỗi khi lấy dữ liệu BXH');
        }
    
        const jsons = await response.json();
        console.log('Dữ liệu nhận được từ API:', jsons); // Kiểm tra dữ liệu nhận được từ API
        
        // Kiểm tra nếu dữ liệu hợp lệ
        if (jsons && Array.isArray(jsons)) {
          setTotalPages(Math.ceil(jsons.length / ITEMS_PER_PAGE));
          const start = (currentPage - 1) * ITEMS_PER_PAGE;
          setData(jsons.slice(start, start + ITEMS_PER_PAGE));
        } else {
          console.error('Dữ liệu không hợp lệ:', jsons);
        }
      } catch (error) {
        console.error('Error fetching books data:', error);
      } finally {
        setLoading(false);
      }
    };
  // Cập nhật `totalPages` khi dữ liệu (data) thay đổi
  useEffect(() => {
    fetchBooksData(selectedTab);
  }, [selectedTab, currentPage]);

  // Hàm để thay đổi tab
  const handleTabChange = (tab: 'month' | 'day' | 'week') => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  // Hàm phân trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Hiển thị phân trang
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
        <TouchableOpacity key="previous" onPress={() => handlePageChange(currentPage - 1)}>
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

  const navigation = useNavigation();

  const handleNavigateHome = () => {
    navigation.navigate('Trang chủ'); // Đảm bảo "Home" đúng tên route của màn hình chính
  };
  const handleNavigateBookDetail = (bookId: string) => {
    navigation.navigate('BookDetail', { bookId });
  };

  const renderItem = ({ item }: { item: any }) => {
    const book = item;
    if (!book) return null;
    // <View style={styles.itemContainer}>
    //   <TouchableOpacity onPress={handleNavigateHome}>
    //     <Image source={item.image} style={styles.image} />
    //   </TouchableOpacity>
    //   <View style={styles.itemDetails}>
    //     <Text style={styles.title}>{item.title}</Text>
    //     <Text style={styles.author}>Tác giả:{item.author}</Text>
    //     <Text style={styles.rating}>Đánh giá: {item.rating}</Text>
    //     <Text style={styles.price}>Lượt xem: {item.price}</Text>
    //   </View>
    // </View>
    return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleNavigateBookDetail(book._id)}
          >
            <View style={styles.itemContainer}>
              <Image source={{ uri: book.coverImage }} style={styles.image} />
              <View style={styles.itemDetails}>
                <Text style={styles.title}>{book.title || 'Không có tiêu đề'}</Text>
                <Text style={styles.author}>Tác giả: {book.author.name || 'Không rõ'}</Text>
                <Text style={styles.rating}>Đánh giá: {book.rating ?? 'Chưa có'}</Text>
                <Text style={styles.price}>Số chương: {book.totalChapters ?? 0}</Text>
              </View>
            </View>
          </TouchableOpacity>
    );
    
  };

  return (
    <View style={styles.container}>
      <View style={styles.breadcrumb}>
        <TouchableOpacity onPress={() => navigation.navigate('Trang chủ')}>
          <Text style={styles.breadcrumbLink}>Trang chủ</Text>
        </TouchableOpacity>
        <Text style={styles.breadcrumbArrow}> → </Text>
        <TouchableOpacity disabled>
          <Text style={styles.breadcrumbCurrent}>Bảng xếp hạng</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => handleTabChange('month')} style={styles.tabButton}>
          <Text style={selectedTab === 'month' ? styles.activeTab : styles.inactiveTab}>Top tháng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('week')} style={styles.tabButton}>
          <Text style={selectedTab === 'week' ? styles.activeTab : styles.inactiveTab}>Top tuần</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('day')} style={styles.tabButton}>
          <Text style={selectedTab === 'day' ? styles.activeTab : styles.inactiveTab}>Top ngày</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        style={styles.flatList}
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
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 18,
    color: '#007bff',
  },
  breadcrumb: {
    fontSize: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  breadcrumbLink: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginLeft: 10,
  },
  breadcrumbArrow: {
    fontSize: 15,
    marginHorizontal: 5,
    color: '#888',
  },
  breadcrumbCurrent: {
    fontSize: 15,
    color: '#007bff',
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  },
  tabButton: {
    padding: 10,
  },
  activeTab: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: 'bold',
  },
  inactiveTab: {
    fontSize: 18,
    color: '#888',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    marginHorizontal: 10,
    width: 'auto',
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  itemDetails: {
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#f39c12',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#666',
  },
  flatList: {
    paddingHorizontal: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  footerText: {
    fontSize: 18,
    color: '#007bff',
    marginHorizontal: 10,
  },
});

export default RankingView;
