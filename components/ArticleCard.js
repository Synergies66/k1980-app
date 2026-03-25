import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CAT_COLORS } from '../lib/supabase';

function timeAgo(dateStr, lang) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (lang==='en') {
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs/24)}d ago`;
  }
  if (mins < 60) return `${mins}分钟前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}小时前`;
  return `${Math.floor(hrs/24)}天前`;
}

export default function ArticleCard({ article, isTop, lang='zh', onPress }) {
  const catColor = CAT_COLORS[article.category] || '#6b7280';
  const title = lang==='en' ? (article.title_en||article.title) : article.title;
  const summary = lang==='en' ? (article.summary_en||article.summary) : article.summary;
  const time = timeAgo(article.created_at, lang);
  const topLabel = lang==='en' ? 'TOP STORY' : '今日头条';
  const readMore = lang==='en' ? 'Read more →' : '阅读全文 →';
  const read = lang==='en' ? 'Read →' : '阅读 →';

  if (isTop) {
    return (
      <TouchableOpacity style={styles.topCard} onPress={onPress} activeOpacity={0.85}>
        <View style={styles.topBadge}><Text style={styles.topBadgeTxt}>{topLabel}</Text></View>
        <View style={styles.topMeta}>
          <View style={[styles.catTag,{backgroundColor:catColor+'20'}]}>
            <Text style={[styles.catTxt,{color:catColor}]}>{article.category}</Text>
          </View>
          <Text style={styles.sourceTxt}>{article.source_name}</Text>
          <Text style={styles.timeTxt}>{time}</Text>
        </View>
        <Text style={styles.topTitle}>{title}</Text>
        <Text style={styles.topSummary} numberOfLines={3}>{summary}</Text>
        {article.tags?.length>0&&<View style={styles.tags}>{article.tags.slice(0,3).map(t=><View key={t} style={styles.tag}><Text style={styles.tagTxt}>{t}</Text></View>)}</View>}
        <Text style={[styles.readMore,{color:catColor}]}>{readMore}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.meta}>
        <View style={[styles.catTag,{backgroundColor:catColor+'20'}]}>
          <Text style={[styles.catTxt,{color:catColor}]}>{article.category}</Text>
        </View>
        <Text style={styles.sourceTxt}>{article.source_name}</Text>
        <Text style={styles.timeTxt}>{time}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.summary} numberOfLines={2}>{summary}</Text>
      {article.tags?.length>0&&(
        <View style={styles.tags}>
          {article.tags.slice(0,3).map(t=><View key={t} style={styles.tag}><Text style={styles.tagTxt}>{t}</Text></View>)}
          <Text style={[styles.readMoreSmall,{color:catColor}]}>{read}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  topCard:{margin:12,padding:16,backgroundColor:'#fff',borderRadius:12,borderLeftWidth:4,borderLeftColor:'#e11d27',shadowColor:'#000',shadowOffset:{width:0,height:2},shadowOpacity:0.06,shadowRadius:8,elevation:3},
  topBadge:{position:'absolute',top:12,right:12,backgroundColor:'#e11d27',borderRadius:4,paddingHorizontal:8,paddingVertical:2},
  topBadgeTxt:{color:'#fff',fontSize:10,fontWeight:'700'},
  topMeta:{flexDirection:'row',alignItems:'center',gap:6,marginBottom:8},
  topTitle:{fontSize:20,fontWeight:'800',color:'#111',lineHeight:28,marginBottom:8},
  topSummary:{fontSize:14,color:'#4b5563',lineHeight:20,marginBottom:10},
  readMore:{fontSize:13,fontWeight:'700',marginTop:4},
  card:{marginHorizontal:12,marginBottom:8,padding:14,backgroundColor:'#fff',borderRadius:10,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.04,shadowRadius:4,elevation:2},
  meta:{flexDirection:'row',alignItems:'center',gap:6,marginBottom:6},
  catTag:{paddingHorizontal:7,paddingVertical:2,borderRadius:4},
  catTxt:{fontSize:11,fontWeight:'700'},
  sourceTxt:{fontSize:11,color:'#9ca3af',flex:1},
  timeTxt:{fontSize:11,color:'#9ca3af'},
  title:{fontSize:15,fontWeight:'700',color:'#111',lineHeight:22,marginBottom:4},
  summary:{fontSize:13,color:'#6b7280',lineHeight:18,marginBottom:8},
  tags:{flexDirection:'row',flexWrap:'wrap',gap:4,alignItems:'center'},
  tag:{backgroundColor:'#f3f4f6',paddingHorizontal:8,paddingVertical:2,borderRadius:4},
  tagTxt:{fontSize:11,color:'#6b7280'},
  readMoreSmall:{fontSize:12,fontWeight:'600',marginLeft:'auto'},
});
