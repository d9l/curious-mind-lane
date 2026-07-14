
-- Drop admin-only write policies and public read policies, replace with open policies for dev
DROP POLICY IF EXISTS "Admins write boards" ON public.boards;
DROP POLICY IF EXISTS "Boards are public" ON public.boards;
DROP POLICY IF EXISTS "Admins write classes" ON public.classes;
DROP POLICY IF EXISTS "Classes are public" ON public.classes;
DROP POLICY IF EXISTS "Admins write subjects" ON public.subjects;
DROP POLICY IF EXISTS "Subjects are public" ON public.subjects;
DROP POLICY IF EXISTS "Admins write chapters" ON public.chapters;
DROP POLICY IF EXISTS "Published chapters are public" ON public.chapters;
DROP POLICY IF EXISTS "Admins write lessons" ON public.lessons;
DROP POLICY IF EXISTS "Published lessons are public" ON public.lessons;
DROP POLICY IF EXISTS "Admins write resources" ON public.resources;
DROP POLICY IF EXISTS "Resources are public" ON public.resources;

CREATE POLICY "Dev open boards" ON public.boards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Dev open classes" ON public.classes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Dev open subjects" ON public.subjects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Dev open chapters" ON public.chapters FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Dev open lessons" ON public.lessons FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Dev open resources" ON public.resources FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.boards TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chapters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO anon;
