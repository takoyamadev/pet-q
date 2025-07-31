-- スレッド作成RPC
CREATE OR REPLACE FUNCTION create_thread(
  p_title TEXT,
  p_content TEXT,
  p_category_id UUID,
  p_sub_category_id UUID,
  p_image_urls TEXT[] DEFAULT '{}',
  p_user_ip INET DEFAULT NULL
)
RETURNS threads AS $$
DECLARE
  v_thread threads;
BEGIN
  -- 同一IPからの連続投稿制限（1分間に1投稿）
  IF p_user_ip IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM threads
      WHERE user_ip = p_user_ip
      AND created_at > NOW() - INTERVAL '1 minute'
    ) THEN
      RAISE EXCEPTION '連続投稿はできません。1分後に再度お試しください。';
    END IF;
  END IF;

  -- スレッド作成
  INSERT INTO threads (
    title,
    content,
    category_id,
    sub_category_id,
    image_urls,
    user_ip
  ) VALUES (
    p_title,
    p_content,
    p_category_id,
    p_sub_category_id,
    p_image_urls,
    p_user_ip
  ) RETURNING * INTO v_thread;

  RETURN v_thread;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- レスポンス作成RPC
CREATE OR REPLACE FUNCTION create_response(
  p_thread_id UUID,
  p_content TEXT,
  p_image_urls TEXT[] DEFAULT '{}',
  p_anchor_to UUID DEFAULT NULL,
  p_user_ip INET DEFAULT NULL
)
RETURNS responses AS $$
DECLARE
  v_response responses;
BEGIN
  -- 同一IPからの連続投稿制限（1分間に1投稿）
  IF p_user_ip IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM responses
      WHERE user_ip = p_user_ip
      AND created_at > NOW() - INTERVAL '1 minute'
    ) THEN
      RAISE EXCEPTION '連続投稿はできません。1分後に再度お試しください。';
    END IF;
  END IF;

  -- レスポンス作成
  INSERT INTO responses (
    thread_id,
    content,
    image_urls,
    anchor_to,
    user_ip
  ) VALUES (
    p_thread_id,
    p_content,
    p_image_urls,
    p_anchor_to,
    p_user_ip
  ) RETURNING * INTO v_response;

  RETURN v_response;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スレッド検索RPC
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
  category_name TEXT,
  sub_category_name TEXT
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

-- 人気スレッド取得RPC
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
  category_name TEXT,
  sub_category_name TEXT
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