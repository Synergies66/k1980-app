import { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, SafeAreaView,
} from 'react-native';
import { supabase, CAT_COLORS } from '../lib/supabase';
import ArticleCard from '../components/ArticleCard';

export function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const { data } = await supabase
      .from('news_articles')
      .select('id, title, summary, category, source_name, tags, created_at, view_count')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(30);
    setResults(data || []);
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>K1980</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="搜索资讯..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            returnKeyType="search"
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.searchBtn} onPress={search}>
            <Text style={styles.searchBtnTxt}>搜索</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e11d27" style={{ marginTop: 40 }} />
      ) : searched && results.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTxt}>没有找到相关资讯</Text>
          <Text style={styles.emptyHint}>换个关键词试试</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <ArticleCard article={item} onPress={() => navigation.navigate('Article', { id: item.id })} />
          )}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
        />
      )}

      {!searched && (
        <View style={styles.hint}>
          <Text style={styles.hintTitle}>热门搜索</Text>
          {['移民政策', '新西兰签证', '澳洲房价', '美联储', 'AI科技', '华人创业'].map(kw => (
            <TouchableOpacity key={kw} style={styles.kwBtn} onPress={() => { setQuery(kw); }}>
              <Text style={styles.kwTxt}>🔍 {kw}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}

export function BookmarkScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>K1980</Text>
        <Text style={styles.pageTitle}>我的收藏</Text>
      </View>
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>⭐</Text>
        <Text style={styles.emptyTxt}>还没有收藏文章</Text>
        <Text style={styles.emptyHint}>阅读文章时点击收藏按钮保存</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    backgroundColor: '#fff', paddingHorizontal: 16,
    paddingTop: 12, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  logo: { fontSize: 22, fontWeight: '900', color: '#e11d27', marginBottom: 8 },
  pageTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  searchRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1, height: 40, backgroundColor: '#f3f4f6',
    borderRadius: 10, paddingHorizontal: 12,
    fontSize: 14, color: '#111',
  },
  searchBtn: {
    backgroundColor: '#e11d27', borderRadius: 10,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  searchBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  emptyTxt: { fontSize: 16, color: '#374151', fontWeight: '600' },
  emptyHint: { fontSize: 13, color: '#9ca3af' },
  hint: { padding: 20 },
  hintTitle: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 },
  kwBtn: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  kwTxt: { fontSize: 14, color: '#374151' },
});

export default SearchScreen = SearchScreen;
