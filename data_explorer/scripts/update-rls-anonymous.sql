-- ============================================
-- RLS 정책 업데이트 (익명 접근 허용)
-- ============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can insert their own tags" ON tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON tags;

-- 새 정책: 누구나 태그 추가/삭제 가능
CREATE POLICY "Anyone can insert tags"
ON tags FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete tags"
ON tags FOR DELETE
USING (true);

-- tags 테이블의 created_by 컬럼을 nullable로 변경
ALTER TABLE tags ALTER COLUMN created_by DROP NOT NULL;
