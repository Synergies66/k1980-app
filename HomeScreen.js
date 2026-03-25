import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, ActivityIndicator, ScrollView, SafeAreaView,
} from 'react-native';
import { fetchArticles, CATEGORIES, CAT_COLORS } from '../lib/supabase';
import ArticleCard from '../components/ArticleCard';

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const load = useCallback(async (reset = false) => {
    const p = reset ? 1 : page;
    try {
      const data = await fetchArticles({ category, page: p, sort });
      if (reset) {
        setArticles(data);
        setPage(2);
      } else {
        setArticles(prev => [...prev, ...data]);
        setPage(p + 1);
      }
      setHasMore(data.length === 20);
    } catch (e) {
      console.error(e);
    }
  }, [category, sort, page]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchArticles({ category, page: 1, sort }).then(data => {
      setArticles(data);
      setPage(2);
      setHasMore(data.length === 20);
      setLoading(false);
    });
  }, [category, sort]);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchArticles({ category, page: 1, sort });
    setArticles(data);
    setPage(2);
    setHasMore(data.length === 20);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    await load(false);
    setLoadingMore(false);
  };

  const cats = ['all', ...CATEGORIES];

  return (
    <SafeAreaView style={styles.safe}>
      {/* 顶部 Logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>K1980</Text>
        <Text style={styles.slogan}>全球资讯，为你精选</Text>
        <View style={styles.sortRow}>
          <TouchableOpacity
            style={[styles.sortBtn, sort === 'latest' && styles.sortActive]}
            onPress={() => setSort('latest')}
          >
            <Text style={[styles.sortTxt, sort === 'latest' && styles.sortActiveTxt]}>最新</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortBtn, sort === 'hot' && styles.sortActive]}
            onPress={() => setSort('hot')}
          >
            <Text style={[styles.sortTxt, sort === 'hot' && styles.sortActiveTxt]}>最热</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 分类导航 */}
      <View style={styles.catWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {cats.map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.catBtn, category === c && styles.catActive]}
              onPress={() => setCategory(c)}
            >
              <Text style={[styles.catTxt, category === c && styles.catActiveTxt]}>
                {c === 'all' ? '全部' : c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 文章列表 */}
      {loading ? (
        <ActivityIndicator size="large" color="#e11d27" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={item => String(item.id)}
          renderItem={({ item, index }) => (
            <ArticleCard
              article={item}
              isTop={index === 0 && category === 'all'}
              onPress={() => navigation.navigate('Article', { id: item.id })}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e11d27" />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <ActivityIndicator color="#e11d27" style={{ padding: 16 }} /> : null}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: { fontSize: 24, fontWeight: '900', color: '#e11d27', letterSpacing: -0.5 },
  slogan: { fontSize: 11, color: '#9ca3af', flex: 1 },
  sortRow: { flexDirection: 'row', gap: 4 },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f3f4f6' },
  sortActive: { backgroundColor: '#e11d27' },
  sortTxt: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  sortActiveTxt: { color: '#fff' },
  catWrap: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  catRow: { paddingHorizontal: 12, paddingVertical: 8, gap: 6 },
  catBtn: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, backgroundColor: '#f3f4f6',
  },
  catActive: { backgroundColor: '#e11d27' },
  catTxt: { fontSize: 13, color: '#374151', fontWeight: '600' },
  catActiveTxt: { color: '#fff' },
});
