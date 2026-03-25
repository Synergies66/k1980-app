import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  TouchableOpacity, Share, SafeAreaView,
} from 'react-native';
import { fetchArticleDetail, CAT_COLORS } from '../lib/supabase';

function renderMarkdown(text) {
  if (!text) return [];
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('# ')) return <Text key={i} style={styles.h1}>{line.slice(2)}</Text>;
    if (line.startsWith('## ')) return <Text key={i} style={styles.h2}>{line.slice(3)}</Text>;
    if (line.startsWith('### ')) return <Text key={i} style={styles.h3}>{line.slice(4)}</Text>;
    if (line.startsWith('- ') || line.startsWith('* ')) return (
      <View key={i} style={styles.bullet}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletTxt}>{line.slice(2)}</Text>
      </View>
    );
    if (line.startsWith('**') && line.endsWith('**')) return (
      <Text key={i} style={styles.bold}>{line.slice(2, -2)}</Text>
    );
    if (line === '' || line === '---') return <View key={i} style={styles.divider} />;
    return <Text key={i} style={styles.body}>{line}</Text>;
  });
}

export default function ArticleScreen({ route, navigation }) {
  const { id } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticleDetail(id).then(data => {
      setArticle(data);
      setLoading(false);
    });
  }, [id]);

  const onShare = async () => {
    await Share.share({
      message: `${article.title}\n\n${article.summary}\n\n来自 K1980 · www.k1980.app`,
    });
  };

  if (loading) return <ActivityIndicator size="large" color="#e11d27" style={{ marginTop: 80 }} />;
  if (!article) return <Text style={{ margin: 20 }}>文章不存在</Text>;

  const catColor = CAT_COLORS[article.category] || '#6b7280';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 分类标签 */}
        <View style={[styles.catTag, { backgroundColor: catColor + '20' }]}>
          <Text style={[styles.catTxt, { color: catColor }]}>{article.category}</Text>
        </View>

        {/* 标题 */}
        <Text style={styles.title}>{article.title}</Text>

        {/* 元信息 */}
        <View style={styles.meta}>
          <Text style={styles.source}>{article.source_name}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>
            {new Date(article.created_at).toLocaleDateString('zh-CN')}
          </Text>
          <TouchableOpacity onPress={onShare} style={styles.shareBtn}>
            <Text style={styles.shareTxt}>分享</Text>
          </TouchableOpacity>
        </View>

        {/* 摘要 */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTxt}>{article.summary}</Text>
        </View>

        {/* 正文 */}
        <View style={styles.content}>
          {renderMarkdown(article.content)}
        </View>

        {/* 标签 */}
        {article.tags?.length > 0 && (
          <View style={styles.tags}>
            {article.tags.map(t => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagTxt}>{t}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>K1980 · 全球资讯，为你精选 · www.k1980.app</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20, paddingBottom: 60 },
  catTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 10 },
  catTxt: { fontSize: 12, fontWeight: '700' },
  title: { fontSize: 22, fontWeight: '900', color: '#111', lineHeight: 30, marginBottom: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  source: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  dot: { color: '#d1d5db' },
  time: { fontSize: 12, color: '#9ca3af', flex: 1 },
  shareBtn: { backgroundColor: '#f3f4f6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  shareTxt: { fontSize: 12, color: '#374151', fontWeight: '600' },
  summaryBox: { backgroundColor: '#f9fafb', borderRadius: 8, padding: 14, marginBottom: 20, borderLeftWidth: 3, borderLeftColor: '#e11d27' },
  summaryTxt: { fontSize: 14, color: '#374151', lineHeight: 22 },
  content: { gap: 4 },
  h1: { fontSize: 20, fontWeight: '800', color: '#111', marginTop: 16, marginBottom: 8, lineHeight: 28 },
  h2: { fontSize: 17, fontWeight: '700', color: '#1f2937', marginTop: 14, marginBottom: 6, lineHeight: 24 },
  h3: { fontSize: 15, fontWeight: '700', color: '#374151', marginTop: 12, marginBottom: 4 },
  body: { fontSize: 15, color: '#374151', lineHeight: 26, marginBottom: 2 },
  bold: { fontSize: 15, fontWeight: '700', color: '#111', lineHeight: 26 },
  bullet: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  bulletDot: { fontSize: 15, color: '#e11d27', marginTop: 2 },
  bulletTxt: { fontSize: 15, color: '#374151', lineHeight: 24, flex: 1 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 12 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 24, marginBottom: 16 },
  tag: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  tagTxt: { fontSize: 12, color: '#6b7280' },
  footer: { textAlign: 'center', fontSize: 11, color: '#d1d5db', marginTop: 20 },
});
