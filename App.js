import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { AppProvider, useApp } from './lib/AppContext';
import HomeScreen from './screens/HomeScreen';
import ArticleScreen from './screens/ArticleScreen';
import SearchScreen from './screens/SearchScreen';
import BookmarkScreen from './screens/BookmarkScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  const { lang } = useApp();
  return (
    <Tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:'#e11d27',tabBarInactiveTintColor:'#9ca3af',tabBarStyle:{backgroundColor:'#fff',borderTopColor:'#f3f4f6',paddingBottom:5,height:60},tabBarLabelStyle:{fontSize:11,fontWeight:'600'}}}>
      <Tab.Screen name={lang==='en'?'Home':'首页'} component={HomeScreen} options={{tabBarIcon:()=><Text style={{fontSize:20}}>🏠</Text>}} />
      <Tab.Screen name={lang==='en'?'Search':'搜索'} component={SearchScreen} options={{tabBarIcon:()=><Text style={{fontSize:20}}>🔍</Text>}} />
      <Tab.Screen name={lang==='en'?'Saved':'收藏'} component={BookmarkScreen} options={{tabBarIcon:()=><Text style={{fontSize:20}}>⭐</Text>}} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator>
        <Stack.Screen name="Main" component={HomeTabs} options={{headerShown:false}} />
        <Stack.Screen name="Article" component={ArticleScreen} options={{headerTitle:'',headerBackTitle:'Back',headerTintColor:'#e11d27',headerStyle:{backgroundColor:'#fff'}}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}
