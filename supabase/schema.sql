-- カテゴリテーブル
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('main', 'sub')),
  parent_id UUID REFERENCES categories(id),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- スレッドテーブル
CREATE TABLE threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) <= 2000),
  category_id UUID NOT NULL REFERENCES categories(id),
  sub_category_id UUID NOT NULL REFERENCES categories(id),
  image_urls TEXT[] DEFAULT '{}',
  user_ip INET,
  response_count INTEGER NOT NULL DEFAULT 0,
  last_response_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- レスポンステーブル
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  image_urls TEXT[] DEFAULT '{}',
  anchor_to UUID REFERENCES responses(id),
  user_ip INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_threads_category ON threads(category_id);
CREATE INDEX idx_threads_sub_category ON threads(sub_category_id);
CREATE INDEX idx_threads_created_at ON threads(created_at DESC);
CREATE INDEX idx_threads_last_response_at ON threads(last_response_at DESC NULLS LAST);
CREATE INDEX idx_threads_response_count ON threads(response_count DESC);
CREATE INDEX idx_responses_thread ON responses(thread_id);
CREATE INDEX idx_responses_created_at ON responses(created_at);

-- 更新時刻を自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE
  ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_threads_updated_at BEFORE UPDATE
  ON threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- レスポンス数を更新する関数
CREATE OR REPLACE FUNCTION update_thread_response_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE threads
    SET response_count = response_count + 1,
        last_response_at = NEW.created_at
    WHERE id = NEW.thread_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE threads
    SET response_count = response_count - 1
    WHERE id = OLD.thread_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- トリガー
CREATE TRIGGER update_thread_response_count_trigger
AFTER INSERT OR DELETE ON responses
FOR EACH ROW EXECUTE FUNCTION update_thread_response_count();

-- RLS（Row Level Security）ポリシー
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- カテゴリは誰でも読み取り可能
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- スレッドは誰でも読み取り・作成可能
CREATE POLICY "Threads are viewable by everyone" ON threads
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create threads" ON threads
  FOR INSERT WITH CHECK (true);

-- レスポンスは誰でも読み取り・作成可能
CREATE POLICY "Responses are viewable by everyone" ON responses
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create responses" ON responses
  FOR INSERT WITH CHECK (true);

-- 初期データ（カテゴリ）
INSERT INTO categories (name, type, display_order) VALUES
  ('犬', 'main', 1),
  ('猫', 'main', 2),
  ('小動物', 'main', 3),
  ('鳥', 'main', 4),
  ('爬虫類', 'main', 5),
  ('その他', 'main', 6);

-- サブカテゴリを追加
DO $$
DECLARE
  main_category RECORD;
BEGIN
  FOR main_category IN SELECT id FROM categories WHERE type = 'main'
  LOOP
    INSERT INTO categories (name, type, parent_id, display_order) VALUES
      ('飼育相談', 'sub', main_category.id, 1),
      ('病気・健康', 'sub', main_category.id, 2),
      ('しつけ', 'sub', main_category.id, 3),
      ('雑談', 'sub', main_category.id, 4);
  END LOOP;
END $$;