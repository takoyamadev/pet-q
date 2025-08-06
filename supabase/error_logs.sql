-- エラーログテーブル
-- このSQLはSupabaseのダッシュボードで実行してください

-- エラーログテーブルの作成
CREATE TABLE error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- エラー情報
  error_message TEXT NOT NULL,
  error_stack TEXT,
  error_type VARCHAR(100),
  
  -- コンテキスト情報
  function_name VARCHAR(255),
  endpoint VARCHAR(255),
  user_action VARCHAR(255),
  
  -- リクエスト情報
  user_ip INET,
  user_agent TEXT,
  request_data JSONB,
  
  -- メタデータ
  severity VARCHAR(20) DEFAULT 'error' CHECK (severity IN ('info', 'warn', 'error', 'critical')),
  environment VARCHAR(50) DEFAULT 'production',
  
  -- タイムスタンプ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_error_logs_created_at ON error_logs(created_at DESC);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);
CREATE INDEX idx_error_logs_function ON error_logs(function_name);
CREATE INDEX idx_error_logs_endpoint ON error_logs(endpoint);
CREATE INDEX idx_error_logs_error_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_user_ip ON error_logs(user_ip);

-- RLS（Row Level Security）ポリシー
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- 管理者のみ閲覧可能（将来的に認証システム実装時）
CREATE POLICY "Only admins can view error logs" ON error_logs
  FOR SELECT USING (false);

-- サーバーサイドからのみ挿入可能
CREATE POLICY "Server can insert error logs" ON error_logs
  FOR INSERT WITH CHECK (true);

-- エラーログ挿入用のRPC関数
CREATE OR REPLACE FUNCTION log_error(
  p_error_message TEXT,
  p_error_stack TEXT DEFAULT NULL,
  p_error_type VARCHAR(100) DEFAULT NULL,
  p_function_name VARCHAR(255) DEFAULT NULL,
  p_endpoint VARCHAR(255) DEFAULT NULL,
  p_user_action VARCHAR(255) DEFAULT NULL,
  p_user_ip INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_request_data JSONB DEFAULT NULL,
  p_severity VARCHAR(20) DEFAULT 'error',
  p_environment VARCHAR(50) DEFAULT 'production'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO error_logs (
    error_message,
    error_stack,
    error_type,
    function_name,
    endpoint,
    user_action,
    user_ip,
    user_agent,
    request_data,
    severity,
    environment
  ) VALUES (
    p_error_message,
    p_error_stack,
    p_error_type,
    p_function_name,
    p_endpoint,
    p_user_action,
    p_user_ip,
    p_user_agent,
    p_request_data,
    p_severity,
    p_environment
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- エラー統計取得用のRPC関数
CREATE OR REPLACE FUNCTION get_error_stats(
  p_hours INTEGER DEFAULT 24
)
RETURNS TABLE (
  error_count BIGINT,
  critical_count BIGINT,
  most_common_error TEXT,
  most_common_function TEXT,
  hourly_counts JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM error_logs WHERE created_at >= NOW() - INTERVAL '1 hour' * p_hours) as error_count,
    (SELECT COUNT(*) FROM error_logs WHERE severity = 'critical' AND created_at >= NOW() - INTERVAL '1 hour' * p_hours) as critical_count,
    (SELECT error_message FROM error_logs WHERE created_at >= NOW() - INTERVAL '1 hour' * p_hours GROUP BY error_message ORDER BY COUNT(*) DESC LIMIT 1) as most_common_error,
    (SELECT function_name FROM error_logs WHERE created_at >= NOW() - INTERVAL '1 hour' * p_hours AND function_name IS NOT NULL GROUP BY function_name ORDER BY COUNT(*) DESC LIMIT 1) as most_common_function,
    (SELECT jsonb_agg(jsonb_build_object('hour', hour_bucket, 'count', cnt)) 
     FROM (
       SELECT 
         date_trunc('hour', created_at) as hour_bucket,
         COUNT(*) as cnt
       FROM error_logs 
       WHERE created_at >= NOW() - INTERVAL '1 hour' * p_hours
       GROUP BY date_trunc('hour', created_at)
       ORDER BY hour_bucket DESC
     ) hourly_data
    ) as hourly_counts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 古いログの自動削除（30日以上古いログを削除）
CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM error_logs 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;