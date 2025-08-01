-- スレッド検索RPC（修正版）
DROP FUNCTION IF EXISTS search_threads;
CREATE OR REPLACE FUNCTION search_threads(
  p_keyword TEXT DEFAULT NULL,
  p_category_id UUID DEFAULT NULL,
  p_sub_category_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(100),
  content TEXT,
  category_id UUID,
  sub_category_id UUID,
  image_urls TEXT[],
  response_count INTEGER,
  last_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  category_name VARCHAR(255),
  sub_category_name VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.title,
    t.content,
    t.category_id,
    t.sub_category_id,
    t.image_urls,
    t.response_count,
    t.last_response_at,
    t.created_at,
    t.updated_at,
    c.name AS category_name,
    sc.name AS sub_category_name
  FROM threads t
  LEFT JOIN categories c ON t.category_id = c.id
  LEFT JOIN categories sc ON t.sub_category_id = sc.id
  WHERE 
    (p_keyword IS NULL OR (
      t.title ILIKE '%' || p_keyword || '%' OR
      t.content ILIKE '%' || p_keyword || '%'
    ))
    AND (p_category_id IS NULL OR t.category_id = p_category_id)
    AND (p_sub_category_id IS NULL OR t.sub_category_id = p_sub_category_id)
  ORDER BY t.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 人気スレッド取得RPC（修正版）
DROP FUNCTION IF EXISTS get_popular_threads;
CREATE OR REPLACE FUNCTION get_popular_threads(
  p_category_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(100),
  content TEXT,
  category_id UUID,
  sub_category_id UUID,
  image_urls TEXT[],
  response_count INTEGER,
  last_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  category_name VARCHAR(255),
  sub_category_name VARCHAR(255)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.title,
    t.content,
    t.category_id,
    t.sub_category_id,
    t.image_urls,
    t.response_count,
    t.last_response_at,
    t.created_at,
    t.updated_at,
    c.name AS category_name,
    sc.name AS sub_category_name
  FROM threads t
  LEFT JOIN categories c ON t.category_id = c.id
  LEFT JOIN categories sc ON t.sub_category_id = sc.id
  WHERE 
    (p_category_id IS NULL OR t.category_id = p_category_id)
  ORDER BY t.response_count DESC, t.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;