-- ============================================
-- Supabase Realtime 설정 (tags 테이블)
-- ============================================
-- Supabase Dashboard > Database > Replication 에서 실행하거나
-- SQL Editor에서 실행하세요.

-- 1. tags 테이블에 Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE tags;

-- 참고: 이미 추가되어 있으면 에러가 발생할 수 있습니다.
-- 그 경우 아래 명령으로 확인:
-- SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- 2. (선택사항) records 테이블에도 Realtime 활성화
-- ALTER PUBLICATION supabase_realtime ADD TABLE records;
