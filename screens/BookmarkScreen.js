import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function BookmarkScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>K1980</Text>
        <Text style={styles.pageTitle}>我的收藏</Text>
      </View>
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>⭐</Text>
        <Text style={styles.emptyTxt}>还没有收藏文章</Text>
        <Text style={styles.emptyHint}>阅读文章时点击收藏保存</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#f9fafb'},
  header:{backgroundColor:'#fff',paddingHorizontal:16,paddingTop:12,paddingBottom:12,borderBottomWidth:1,borderBottomColor:'#f3f4f6'},
  logo:{fontSize:22,fontWeight:'900',color:'#e11d27',marginBottom:4},
  pageTitle:{fontSize:18,fontWeight:'700',color:'#111'},
  empty:{flex:1,alignItems:'center',justifyContent:'center',gap:8},
  emptyIcon:{fontSize:48,marginBottom:8},
  emptyTxt:{fontSize:16,color:'#374151',fontWeight:'600'},
  emptyHint:{fontSize:13,color:'#9ca3af'},
});
