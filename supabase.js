import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wioqkcrtkesntqnuzfkd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpb3FrY3J0a2VzbnRxbnV6ZmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNjE5MTEsImV4cCI6MjA4OTYzNzkxMX0.V7RNM0XkkZt2k02v_ssZkChZBjat7emP4RrMtfsS0hY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const CATEGORIES = ['时事', '移民', '教育', '财经', '科技', '商业', '生活'];

export const CAT_COLORS = {
  '时事': '#1a56db',
  '移民': '#16a34a',
  '教育': '#0891b2',
  '财经': '#c2410c',
  '科技': '#7c3aed',
  '商业': '#be185d',
  '生活': '#0d9488',
};

export async function fetchArticles({ category = null, page = 1, sort = 'latest', limit = 20 }) {
  const offset = (page - 1) * limit;
  const order = sort === 'hot' ? 'view_count' : 'created_at';

  let query = supabase
    .from('news_articles')
    .select('id, title, summary, category, source_name, tags, created_at, view_count, is_jingwei')
    .eq('is_published', true)
    .order(order, { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function fetchArticleDetail(id) {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
