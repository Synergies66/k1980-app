import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const REGIONS = [
  { key: 'global', label: '全球', labelEn: 'Global', flag: '🌐' },
  { key: 'nz', label: '新西兰', labelEn: 'New Zealand', flag: '🇳🇿' },
  { key: 'au', label: '澳大利亚', labelEn: 'Australia', flag: '🇦🇺' },
  { key: 'ca', label: '加拿大', labelEn: 'Canada', flag: '🇨🇦' },
  { key: 'uk', label: '英国', labelEn: 'UK', flag: '🇬🇧' },
  { key: 'sg', label: '新加坡', labelEn: 'Singapore', flag: '🇸🇬' },
  { key: 'us', label: '美国', labelEn: 'USA', flag: '🇺🇸' },
  { key: 'jp', label: '日本', labelEn: 'Japan', flag: '🇯🇵' },
  { key: 'my', label: '马来西亚', labelEn: 'Malaysia', flag: '🇲🇾' },
];

export const REGION_TAGS = {
  nz: ['新西兰','奥克兰','NZ'],
  au: ['澳洲','澳大利亚','悉尼','墨尔本'],
  ca: ['加拿大','温哥华','多伦多'],
  uk: ['英国','伦敦','UK'],
  sg: ['新加坡'],
  us: ['美国','纽约','硅谷'],
  jp: ['日本','东京'],
  my: ['马来西亚','吉隆坡'],
};

export const CAT_LABELS_EN = {
  '全部': 'All',
  '时事': 'News',
  '移民': 'Immigration',
  '教育': 'Education',
  '财经': 'Finance',
  '科技': 'Tech',
  '生活': 'Life',
};

export function AppProvider({ children }) {
  const [lang, setLang] = useState('zh');
  const [region, setRegion] = useState('global');
  const t = (zh, en) => lang === 'en' ? (en || zh) : zh;
  return (
    <AppContext.Provider value={{ lang, setLang, region, setRegion, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
