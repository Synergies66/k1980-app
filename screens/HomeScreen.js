import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, ScrollView, SafeAreaView, Modal, Pressable } from 'react-native';
import { fetchArticles, CATEGORIES } from '../lib/supabase';
import { useApp, REGIONS, REGION_TAGS, CAT_LABELS_EN } from '../lib/AppContext';
import ArticleCard from '../components/ArticleCard';

export default function HomeScreen({ navigation }) {
  const { lang, setLang, region, setRegion, t } = useApp();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showRegion, setShowRegion] = useState(false);

  const currentRegion = REGIONS.find(r => r.key === region);

  const filterByRegion = (data) => {
    if (region === 'global') return data;
    const tags = REGION_TAGS[region] || [];
    return data.filter(a =>
      tags.some(tag =>
        a.title?.includes(tag) || a.summary?.includes(tag) || a.tags?.some(t => t.includes(tag))
      )
    );
  };

  useEffect(() => {
    setLoading(true);
    fetchArticles({ category, page: 1, limit: 50 }).then(data => {
      setArticles(filterByRegion(data));
      setPage(2);
      setHasMore(data.length === 50);
      setLoading(false);
    });
  }, [category, region]);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await fetchArticles({ category, page: 1, limit: 50 });
    setArticles(filterByRegion(data));
    setPage(2);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const data = await fetchArticles({ category, page, limit: 50 });
    setArticles(prev => [...prev, ...filterByRegion(data)]);
    setPage(p => p + 1);
    setHasMore(data.length === 50);
    setLoadingMore(false);
  };

  const cats = ['all', ...CATEGORIES];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>K1980</Text>
        <TouchableOpacity style={styles.langBtn} onPress={() => setLang(lang==='zh'?'en':'zh')}>
          <Text style={styles.langTxt}>{lang==='zh'?'EN':'中'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.regionBtn} onPress={() => setShowRegion(true)}>
          <Text style={styles.regionTxt}>{currentRegion?.flag} {lang==='en' ? currentRegion?.labelEn : currentRegion?.label} ▾</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.catWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
          {cats.map(c=>(
            <TouchableOpacity key={c} style={[styles.catBtn, category===c&&styles.catActive]} onPress={()=>setCategory(c)}>
              <Text style={[styles.catTxt, category===c&&styles.catActiveTxt]}>
                {lang==='en' ? (CAT_LABELS_EN[c==='all'?'全部':c] || c) : (c==='all'?'全部':c)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e11d27" style={{marginTop:40}} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={item=>String(item.id)}
          renderItem={({item,index})=>(
            <ArticleCard
              article={item}
              isTop={index===0&&category==='all'}
              lang={lang}
              onPress={()=>navigation.navigate('Article',{id:item.id,lang})}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e11d27" />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore?<ActivityIndicator color="#e11d27" style={{padding:16}}/>:null}
          contentContainerStyle={{paddingBottom:20}}
          ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTxt}>{t('暂无相关资讯','No articles found')}</Text></View>}
        />
      )}

      <Modal visible={showRegion} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={()=>setShowRegion(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{t('选择地区','Select Region')}</Text>
            {REGIONS.map(r=>(
              <TouchableOpacity key={r.key} style={styles.regionItem} onPress={()=>{setRegion(r.key);setShowRegion(false);}}>
                <Text style={styles.regionItemTxt}>{r.flag} {lang==='en'?r.labelEn:r.label}</Text>
                {region===r.key&&<Text style={{color:'#e11d27',fontSize:16}}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#f9fafb'},
  header:{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#f3f4f6',flexDirection:'row',alignItems:'center',paddingHorizontal:14,paddingVertical:10,gap:8},
  logo:{fontSize:24,fontWeight:'900',color:'#e11d27',letterSpacing:-0.5},
  langBtn:{backgroundColor:'#1a56db',paddingHorizontal:12,paddingVertical:6,borderRadius:12},
  langTxt:{fontSize:13,color:'#fff',fontWeight:'700'},
  regionBtn:{flex:1,backgroundColor:'#f3f4f6',paddingHorizontal:12,paddingVertical:6,borderRadius:16},
  regionTxt:{fontSize:13,color:'#374151',fontWeight:'600',textAlign:'center'},
  catWrap:{backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  catRow:{paddingHorizontal:12,paddingVertical:8,gap:6},
  catBtn:{paddingHorizontal:14,paddingVertical:6,borderRadius:20,backgroundColor:'#f3f4f6'},
  catActive:{backgroundColor:'#e11d27'},
  catTxt:{fontSize:13,color:'#374151',fontWeight:'600'},
  catActiveTxt:{color:'#fff'},
  empty:{padding:40,alignItems:'center'},
  emptyTxt:{color:'#9ca3af',fontSize:14},
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'flex-end'},
  sheet:{backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,padding:20,paddingBottom:40},
  sheetTitle:{fontSize:16,fontWeight:'700',color:'#111',marginBottom:16,textAlign:'center'},
  regionItem:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  regionItemTxt:{fontSize:15,color:'#374151'},
});
