-- ════════════════════════════════════════════════════════════════
-- Dasturchi — RLS va grant'lar uchun avtomatik test to'plami
--
-- Supabase SQL Editor'da (postgres roli) to'liq bajaring. Hammasi bitta
-- tranzaksiyada ishlaydi va oxirida ROLLBACK qilinadi: test foydalanuvchilari,
-- kurslar va boshqa yozuvlar bazada QOLMAYDI, mavjud ma'lumotlarga tegilmaydi.
--
-- Natija: har bir tekshiruv uchun qator (ok = true/false). Hammasi true
-- bo'lishi kerak. Talab: 0001_init.sql qo'llangan va kontent seed qilingan.
--
-- Usul: `set local role anon|authenticated` + request.jwt.claims orqali
-- PostgREST'ning brauzerdan keladigan so'rovlari aynan taqlid qilinadi.
-- ════════════════════════════════════════════════════════════════
begin;

create temp table rls_results (id serial primary key, name text not null, ok boolean not null, detail text);
grant insert, select on rls_results to anon, authenticated;
grant usage on sequence rls_results_id_seq to anon, authenticated;

-- _expect: 'rows>0' | 'rows=0' | 'rows=N' | 'denied' (ruxsat/RLS xatosi) | 'ok' (xatosiz)
create function pg_temp.t(_name text, _role text, _uid uuid, _sql text, _expect text)
returns void language plpgsql as $$
declare
  n bigint;
  err text;
  sqlstate_ text;
  passed boolean;
  is_select boolean := _sql ~* '^\s*select';
begin
  perform set_config('request.jwt.claims',
    case when _uid is null then json_build_object('role', _role)::text
         else json_build_object('sub', _uid, 'role', _role, 'aud', 'authenticated')::text end, true);
  perform set_config('request.jwt.claim.sub', coalesce(_uid::text, ''), true);
  execute format('set local role %I', _role);
  begin
    if is_select then
      execute 'select count(*) from (' || _sql || ') q' into n;
    else
      execute 'with x as (' || _sql || ' returning 1) select count(*) from x' into n;
    end if;
  exception when others then
    err := sqlerrm;
    sqlstate_ := sqlstate;
  end;
  reset role;
  perform set_config('request.jwt.claims', '', true);
  perform set_config('request.jwt.claim.sub', '', true);

  passed := case
    when _expect = 'denied' then err is not null and sqlstate_ in ('42501', '42P01', '23514')
    when err is not null then false
    when _expect = 'ok' then true
    when _expect = 'rows>0' then n > 0
    when _expect = 'rows=0' then n = 0
    when _expect like 'rows=%' then n = substring(_expect from 6)::bigint
    else false end;
  insert into rls_results (name, ok, detail)
  values (_name, passed, coalesce('xato ' || sqlstate_ || ': ' || left(err, 90), 'qatorlar: ' || n) || ' (kutilgan: ' || _expect || ')');
end;
$$;

-- ── Test ma'lumotlari (ROLLBACK bilan yo'qoladi) ─────────────────
insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, raw_app_meta_data, created_at, updated_at, email_confirmed_at)
values
  ('00000000-0000-4000-a000-00000000000a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-student-a@rls.invalid', '{"full_name":"Talaba A"}', '{"provider":"email","providers":["email"]}', now(), now(), now()),
  ('00000000-0000-4000-a000-00000000000b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-student-b@rls.invalid', '{"full_name":"Talaba B"}', '{"provider":"email","providers":["email"]}', now(), now(), now()),
  ('00000000-0000-4000-a000-0000000000ad', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-admin@rls.invalid', '{"full_name":"Admin"}', '{"provider":"email","providers":["email"]}', now(), now(), now()),
  -- Hujumchi: metadata orqali admin bo'lishga urinadi va juda uzun ism yuboradi
  ('00000000-0000-4000-a000-0000000000ee', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-attacker@rls.invalid', jsonb_build_object('full_name', repeat('X', 5000), 'role', 'admin'), '{"provider":"email","providers":["email"]}', now(), now(), null);

-- Admin roli faqat server (service role / postgres) tomonidan beriladi
update public.profiles set role = 'admin' where id = '00000000-0000-4000-a000-0000000000ad';

insert into public.courses (id, slug, title, category_id, level, status)
select 'crs_rls_draft', 'rls-qoralama-kurs', 'RLS qoralama kurs', id, 1, 'draft' from public.categories order by sort_order limit 1;
insert into public.modules (id, course_id, title) values ('mod_rls_draft', 'crs_rls_draft', 'Qoralama modul');
insert into public.lessons (id, course_id, module_id, slug, title, status, is_preview)
values ('les_rls_draft', 'crs_rls_draft', 'mod_rls_draft', 'yashirin-dars', 'Yashirin dars', 'published', true);

-- B talabaning shaxsiy yozuvlari (server nomidan)
insert into public.notes (user_id, lesson_id, course_id, body)
select '00000000-0000-4000-a000-00000000000b', l.id, l.course_id, 'B ning shaxsiy qaydi'
from public.lessons l join public.courses c on c.id = l.course_id where c.status = 'published' and l.status = 'published' order by l.id limit 1;
insert into public.enrollments (user_id, course_id)
select '00000000-0000-4000-a000-00000000000b', id from public.courses where status = 'published' order by id limit 1;
insert into public.questions (lesson_id, course_id, user_id, author_name, body)
select l.id, l.course_id, '00000000-0000-4000-a000-00000000000b', 'Talaba B', 'B ning savoli'
from public.lessons l join public.courses c on c.id = l.course_id where c.status = 'published' and l.status = 'published' order by l.id limit 1;
insert into public.certificates (code, user_id, course_id, user_name, course_title)
values ('RLS-TEST-0001', '00000000-0000-4000-a000-00000000000b', 'x', 'Talaba B', 'Test kurs');

-- ── Trigger va funksiyalar ──────────────────────────────────────
insert into rls_results (name, ok, detail)
select 'trigger: metadata role=admin e''tiborsiz, profil talaba', role = 'student', 'role=' || role
from public.profiles where id = '00000000-0000-4000-a000-0000000000ee';
insert into rls_results (name, ok, detail)
select 'trigger: uzun ism 80 belgigacha qisqartiriladi', char_length(name) = 80, 'uzunlik=' || char_length(name)
from public.profiles where id = '00000000-0000-4000-a000-0000000000ee';
insert into rls_results (name, ok, detail)
select 'security definer funksiyalarda search_path qat''iy', bool_and(p.proconfig is not null and exists (select 1 from unnest(p.proconfig) c where c like 'search_path=%')), string_agg(p.proname, ',')
from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prosecdef;
insert into rls_results (name, ok, detail)
select 'is_admin() API''da ochiq emas (public sxemada yo''q)', count(*) = 0, count(*) || ' ta public.is_admin'
from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'is_admin';
insert into rls_results (name, ok, detail)
select 'private.is_admin: security definer, search_path qat''iy', bool_and(p.prosecdef and exists (select 1 from unnest(p.proconfig) c where c like 'search_path=%')), count(*) || ' ta'
from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'private' and p.proname = 'is_admin';
insert into rls_results (name, ok, detail)
select 'har bir rol+amal uchun bittadan ortiq permissive siyosat yo''q', count(*) = 0, coalesce(string_agg(tablename || ':' || cmd || ':' || role, ', '), 'yo''q')
from (
  select p.tablename, c.cmd, r.role
  from pg_policies p
  cross join lateral unnest(p.roles) as r(role)
  cross join lateral (select unnest(case when p.cmd = 'ALL' then array['SELECT', 'INSERT', 'UPDATE', 'DELETE'] else array[p.cmd] end) as cmd) c
  where p.schemaname = 'public' and p.permissive = 'PERMISSIVE'
  group by 1, 2, 3 having count(*) > 1
) dup;
insert into rls_results (name, ok, detail)
select 'barcha public jadvallarda RLS yoqilgan', bool_and(c.relrowsecurity), count(*) || ' ta jadval'
from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r';
insert into rls_results (name, ok, detail)
select 'anon/authenticated uchun TRUNCATE/TRIGGER/REFERENCES yo''q', count(*) = 0, count(*) || ' ta xavfli grant'
from information_schema.role_table_grants where table_schema = 'public' and grantee in ('anon', 'authenticated') and privilege_type in ('TRUNCATE', 'TRIGGER', 'REFERENCES');
insert into rls_results (name, ok, detail)
select 'authenticated profiles.role ustunini yangilay olmaydi (grant)', not has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE'), 'role UPDATE grant: ' || has_column_privilege('authenticated', 'public.profiles', 'role', 'UPDATE');

-- ── Anonim tashrif buyuruvchi ───────────────────────────────────
select pg_temp.t('anon: ochiq kurslar ko''rinadi', 'anon', null, 'select 1 from public.courses where status = ''published''', 'rows>0');
select pg_temp.t('anon: qoralama kurs yashirin', 'anon', null, 'select 1 from public.courses where id = ''crs_rls_draft''', 'rows=0');
select pg_temp.t('anon: qoralama kurs modullari yashirin', 'anon', null, 'select 1 from public.modules where course_id = ''crs_rls_draft''', 'rows=0');
select pg_temp.t('anon: qoralama kursdagi "published" dars ham yashirin', 'anon', null, 'select 1 from public.lessons where id = ''les_rls_draft''', 'rows=0');
select pg_temp.t('anon: namuna (preview) darslar ochiq', 'anon', null, 'select 1 from public.lessons where is_preview and status = ''published''', 'rows>0');
select pg_temp.t('anon: yopiq darslar matni berilmaydi', 'anon', null, 'select 1 from public.lessons where status = ''published'' and not is_preview', 'rows=0');
select pg_temp.t('anon: testlar (to''g''ri javoblar) — ruxsat yo''q', 'anon', null, 'select 1 from public.quizzes', 'denied');
select pg_temp.t('anon: profillar — ruxsat yo''q', 'anon', null, 'select 1 from public.profiles', 'denied');
select pg_temp.t('anon: sertifikatlar ro''yxati — ruxsat yo''q', 'anon', null, 'select 1 from public.certificates', 'denied');
select pg_temp.t('anon: media jadvali — ruxsat yo''q', 'anon', null, 'select 1 from public.media', 'denied');
select pg_temp.t('anon: kurs qo''sha olmaydi', 'anon', null, 'insert into public.courses (id, slug, title, category_id, level) select ''crs_x'', ''x'', ''x'', id, 1 from public.categories limit 1', 'denied');
select pg_temp.t('anon: storage media ro''yxati bo''sh', 'anon', null, 'select 1 from storage.objects where bucket_id = ''media''', 'rows=0');
select pg_temp.t('anon: storage''ga yuklay olmaydi', 'anon', null, 'insert into storage.objects (bucket_id, name) values (''media'', ''rls/anon.txt'')', 'denied');

-- ── A talaba ────────────────────────────────────────────────────
select pg_temp.t('talaba: faqat o''z profilini ko''radi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 from public.profiles', 'rows=1');
select pg_temp.t('talaba: o''z ismini o''zgartira oladi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'update public.profiles set name = ''Yangi ism'' where id = ''00000000-0000-4000-a000-00000000000a''', 'rows=1');
select pg_temp.t('talaba: o''ziga admin rolini bera olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'update public.profiles set role = ''admin'' where id = ''00000000-0000-4000-a000-00000000000a''', 'denied');
select pg_temp.t('talaba: pochtasini o''zgartira olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'update public.profiles set email = ''rls-admin@rls.invalid'' where id = ''00000000-0000-4000-a000-00000000000a''', 'denied');
select pg_temp.t('talaba: boshqaning profilini o''zgartira olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'update public.profiles set name = ''buzildi'' where id = ''00000000-0000-4000-a000-00000000000b''', 'rows=0');
select pg_temp.t('talaba: juda uzun bio rad etiladi (check)', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'update public.profiles set bio = repeat(''x'', 600) where id = ''00000000-0000-4000-a000-00000000000a''', 'denied');
select pg_temp.t('talaba: yopiq darslarni ko''radi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 from public.lessons where status = ''published'' and not is_preview', 'rows>0');
select pg_temp.t('talaba: qoralama kurs darsi yashirin', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 from public.lessons where id = ''les_rls_draft''', 'rows=0');
select pg_temp.t('talaba: test javoblarini o''qiy olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 from public.quizzes', 'rows=0');
select pg_temp.t('talaba: kurs qo''sha olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into public.courses (id, slug, title, category_id, level) select ''crs_x'', ''x'', ''x'', id, 1 from public.categories limit 1', 'denied');
select pg_temp.t('talaba: kursni o''zgartira olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'update public.courses set title = ''buzildi'' where status = ''published''', 'rows=0');
select pg_temp.t('talaba: kursni o''chira olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'delete from public.courses where status = ''published''', 'rows=0');
select pg_temp.t('talaba: progressni soxtalashtira olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into public.lesson_progress (user_id, lesson_id, course_id, completed) select ''00000000-0000-4000-a000-00000000000a'', id, course_id, true from public.lessons limit 1', 'denied');
select pg_temp.t('talaba: test natijasini soxtalashtira olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into public.quiz_attempts (user_id, quiz_id, course_id, score, passed) values (''00000000-0000-4000-a000-00000000000a'', ''q'', ''c'', 100, true)', 'denied');
select pg_temp.t('talaba: o''ziga sertifikat bera olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into public.certificates (code, user_id, course_id, user_name, course_title) values (''FAKE'', ''00000000-0000-4000-a000-00000000000a'', ''c'', ''A'', ''K'')', 'denied');
select pg_temp.t('talaba: boshqaning sertifikatini ko''rmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 from public.certificates where code = ''RLS-TEST-0001''', 'rows=0');
select pg_temp.t('talaba: sertifikatni bekor qila olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000b', 'update public.certificates set revoked = true where code = ''RLS-TEST-0001''', 'rows=0');
select pg_temp.t('talaba: boshqaning yozilishlarini ko''rmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 from public.enrollments', 'rows=0');
select pg_temp.t('talaba: boshqaning qaydlarini ko''rmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 from public.notes', 'rows=0');
select pg_temp.t('talaba: o''ziga qayd yoza oladi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into public.notes (user_id, lesson_id, course_id, body) select ''00000000-0000-4000-a000-00000000000a'', id, course_id, ''mening qaydim'' from public.lessons where status = ''published'' limit 1', 'rows=1');
select pg_temp.t('talaba: boshqa nomidan qayd yoza olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into public.notes (user_id, lesson_id, course_id, body) select ''00000000-0000-4000-a000-00000000000b'', id, course_id, ''soxta'' from public.lessons where status = ''published'' offset 1 limit 1', 'denied');
select pg_temp.t('talaba: savolni to''g''ridan-to''g''ri yoza olmaydi (muallif soxtalashtirish)', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into public.questions (lesson_id, course_id, user_id, author_name, body) select id, course_id, ''00000000-0000-4000-a000-00000000000a'', ''Admin'', ''x'' from public.lessons limit 1', 'denied');
select pg_temp.t('talaba: boshqaning savolini o''chira olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'delete from public.questions where user_id = ''00000000-0000-4000-a000-00000000000b''', 'rows=0');
select pg_temp.t('talaba: is_admin() = false', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 where private.is_admin()', 'rows=0');
select pg_temp.t('talaba: storage media ro''yxatini ko''rmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'select 1 from storage.objects where bucket_id = ''media''', 'rows=0');
select pg_temp.t('talaba: storage''ga yuklay olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into storage.objects (bucket_id, name) values (''media'', ''rls/student.txt'')', 'denied');
select pg_temp.t('talaba: media jadvaliga yoza olmaydi', 'authenticated', '00000000-0000-4000-a000-00000000000a', 'insert into public.media (name, url, mime) values (''x'', ''https://x'', ''image/png'')', 'denied');
select pg_temp.t('hujumchi (metadata role=admin): is_admin() = false', 'authenticated', '00000000-0000-4000-a000-0000000000ee', 'select 1 where private.is_admin()', 'rows=0');

-- ── Administrator ───────────────────────────────────────────────
select pg_temp.t('admin: is_admin() = true', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'select 1 where private.is_admin()', 'rows=1');
select pg_temp.t('admin: testlarni o''qiy oladi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'select 1 from public.quizzes', 'rows>0');
select pg_temp.t('admin: qoralama kursni ko''radi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'select 1 from public.courses where id = ''crs_rls_draft''', 'rows=1');
select pg_temp.t('admin: kategoriya qo''sha oladi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'insert into public.categories (id, slug, title) values (''cat_rls'', ''rls-kategoriya'', ''RLS'')', 'rows=1');
select pg_temp.t('admin: darsni o''chira oladi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'delete from public.lessons where id = ''les_rls_draft''', 'rows=1');
select pg_temp.t('admin: boshqa foydalanuvchi ismini tahrirlay oladi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'update public.profiles set name = ''Admin tahriri'' where id = ''00000000-0000-4000-a000-00000000000b''', 'rows=1');
select pg_temp.t('admin: kursni tahrirlay oladi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'update public.courses set title = ''Tahrirlandi'' where id = ''crs_rls_draft''', 'rows=1');
select pg_temp.t('admin: barcha profillarni ko''radi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'select 1 from public.profiles where email like ''%@rls.invalid''', 'rows=4');
select pg_temp.t('admin: rolni API orqali o''zgartira olmaydi (faqat server)', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'update public.profiles set role = ''admin'' where id = ''00000000-0000-4000-a000-00000000000a''', 'denied');
select pg_temp.t('admin: sertifikatni bekor qila oladi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'update public.certificates set revoked = true where code = ''RLS-TEST-0001''', 'rows=1');
select pg_temp.t('admin: storage''ga yuklay oladi', 'authenticated', '00000000-0000-4000-a000-0000000000ad', 'insert into storage.objects (bucket_id, name, owner) values (''media'', ''rls/admin-test.txt'', ''00000000-0000-4000-a000-0000000000ad'')', 'rows=1');

-- ── Natija ──────────────────────────────────────────────────────
select
  (select count(*) from rls_results where ok) || '/' || (select count(*) from rls_results) as passed,
  coalesce((select json_agg(json_build_object('name', name, 'detail', detail) order by id) from rls_results where not ok), '[]'::json) as failures,
  (select json_agg(json_build_object('ok', ok, 'name', name) order by id) from rls_results) as all_results;

rollback;
