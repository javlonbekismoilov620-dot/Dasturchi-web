-- ════════════════════════════════════════════════════════════════
-- Dasturchi — Supabase (PostgreSQL) sxemasi
-- Supabase SQL Editor'da yoki `supabase db push` orqali bajaring.
--
-- Xavfsiz qayta ishga tushirish: skript idempotent. U hech qachon
-- jadval, ustun yoki qatorlarni o'chirmaydi va mavjud ma'lumotlarni
-- qayta yozmaydi. Faqat yo'q obyektlar yaratiladi; funksiyalar,
-- trigger, ruxsatlar (grant) va RLS siyosatlari shu fayldagi holatga
-- keltiriladi (siyosatlar ma'lumot emas — ular qayta e'lon qilinadi).
--
-- Arxitektura: Next.js serveri service-role (secret) kaliti bilan
-- ishlaydi va ruxsatlarni ilova qatlamida tekshiradi. RLS va minimal
-- grant'lar esa publishable/anon kalit bilan brauzerdan to'g'ridan-
-- to'g'ri kirishga qarshi ikkinchi himoya qatlami.
-- ════════════════════════════════════════════════════════════════

-- ── Kontent jadvallari ───────────────────────────────────────────
create table if not exists public.categories (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null default '',
  icon text not null default 'GraduationCap',
  color text not null default 'azure',
  sort_order int not null default 0,
  topics jsonb not null default '[]'
);

create table if not exists public.courses (
  id text primary key,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  category_id text not null references public.categories(id) on delete restrict,
  level int not null check (level between 1 and 5),
  status text not null default 'draft' check (status in ('published', 'preparing', 'draft')),
  featured boolean not null default false,
  sort_order int not null default 0,
  cover_url text,
  accent text not null default 'azure',
  icon text not null default 'GraduationCap',
  instructor jsonb not null default '{}',
  objectives jsonb not null default '[]',
  skills jsonb not null default '[]',
  requirements jsonb not null default '[]',
  audience jsonb not null default '[]',
  software jsonb not null default '[]',
  tags jsonb not null default '[]',
  estimated_hours numeric not null default 0,
  final_project jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists courses_category_idx on public.courses(category_id);

create table if not exists public.modules (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  sort_order int not null default 0
);
create index if not exists modules_course_idx on public.modules(course_id);

create table if not exists public.lessons (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  module_id text not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null default '',
  duration_min int not null default 10,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('published', 'planned', 'draft')),
  is_preview boolean not null default false,
  video jsonb,
  content jsonb not null default '{}',
  resources jsonb not null default '[]',
  interactive jsonb not null default '[]',
  updated_at timestamptz not null default now(),
  unique (course_id, slug)
);
create index if not exists lessons_course_idx on public.lessons(course_id, sort_order);
create index if not exists lessons_module_idx on public.lessons(module_id);

create table if not exists public.quizzes (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  module_id text references public.modules(id) on delete cascade,
  title text not null,
  description text not null default '',
  passing_score int not null default 70,
  questions jsonb not null default '[]'
);
create index if not exists quizzes_course_idx on public.quizzes(course_id);
create index if not exists quizzes_module_idx on public.quizzes(module_id);

create table if not exists public.paths (
  id text primary key,
  slug text not null unique,
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  icon text not null default 'Map',
  color text not null default 'azure',
  outcomes jsonb not null default '[]',
  steps jsonb not null default '[]',
  sort_order int not null default 0
);

-- ── Foydalanuvchi jadvallari ─────────────────────────────────────
-- role ustunini faqat server (service role) o'zgartiradi: pastdagi
-- ustun darajasidagi grant'lar authenticated rolga role'ni yozishga
-- ruxsat bermaydi.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '' check (char_length(name) <= 120),
  role text not null default 'student' check (role in ('student', 'admin')),
  bio text not null default '' check (char_length(bio) <= 500),
  goal text not null default '' check (char_length(goal) <= 200),
  weekly_goal int not null default 5 check (weekly_goal between 1 and 50),
  level int check (level between 1 and 5),
  interests jsonb not null default '[]' check (jsonb_typeof(interests) = 'array' and jsonb_array_length(interests) <= 20),
  onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  last_lesson_id text,
  last_access_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, course_id)
);
create index if not exists enrollments_course_idx on public.enrollments(course_id);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  video_position int not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists lesson_progress_user_course_idx on public.lesson_progress(user_id, course_id);
create index if not exists lesson_progress_lesson_idx on public.lesson_progress(lesson_id);
create index if not exists lesson_progress_course_idx on public.lesson_progress(course_id);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  score int not null,
  passed boolean not null,
  answers jsonb not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists quiz_attempts_user_idx on public.quiz_attempts(user_id, course_id);
create index if not exists quiz_attempts_quiz_idx on public.quiz_attempts(quiz_id);
create index if not exists quiz_attempts_course_idx on public.quiz_attempts(course_id);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  course_id text not null,
  body text not null default '' check (char_length(body) <= 20000),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists notes_lesson_idx on public.notes(lesson_id);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  course_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists bookmarks_lesson_idx on public.bookmarks(lesson_id);

create table if not exists public.saved_courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index if not exists saved_courses_course_idx on public.saved_courses(course_id);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null references public.lessons(id) on delete cascade,
  course_id text not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null,
  body text not null check (char_length(body) <= 4000),
  created_at timestamptz not null default now()
);
create index if not exists questions_lesson_idx on public.questions(lesson_id);
create index if not exists questions_user_idx on public.questions(user_id);

create table if not exists public.question_replies (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null,
  is_staff boolean not null default false,
  body text not null check (char_length(body) <= 4000),
  created_at timestamptz not null default now()
);
create index if not exists question_replies_question_idx on public.question_replies(question_id);
create index if not exists question_replies_user_idx on public.question_replies(user_id);

-- Sertifikat kurs o'chirilganda ham haqiqiyligini saqlaydi (kurs nomi nusxalangan)
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null,
  user_name text not null,
  course_title text not null,
  issued_at timestamptz not null default now(),
  revoked boolean not null default false
);
create index if not exists certificates_user_idx on public.certificates(user_id);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  course_id text not null,
  ref_id text,
  label text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists activities_user_idx on public.activities(user_id, created_at desc);

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  mime text not null,
  size bigint not null default 0,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists media_uploaded_by_idx on public.media(uploaded_by);

-- ── Yordamchi funksiyalar ────────────────────────────────────────
-- is_admin() API'da ochilmagan `private` sxemasida: RLS siyosatlari uni chaqira oladi,
-- lekin /rest/v1/rpc orqali to'g'ridan-to'g'ri chaqirib bo'lmaydi (Supabase security advisor).
-- search_path bo'sh: barcha nomlar to'liq ko'rsatilgan (search_path hujumiga qarshi).
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin');
$$;

-- Yangi foydalanuvchi (email yoki Google) uchun profil avtomatik yaratiladi.
-- Rol HECH QACHON metadata'dan olinmaydi — har doim 'student'. Admin huquqi
-- faqat server tomonida, tasdiqlangan email ADMIN_EMAILS ro'yxatida bo'lsa beriladi.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    lower(coalesce(new.email, '')),
    left(coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'), ''), nullif(trim(new.raw_user_meta_data->>'name'), ''), split_part(coalesce(new.email, ''), '@', 1)), 80),
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Ruxsatlar (minimal grant'lar) ────────────────────────────────
-- Supabase standart holatda anon/authenticated rollariga yangi jadvallar
-- ustida BARCHA huquqlarni (TRUNCATE ham) beradi. Bu yerda ular olib
-- tashlanib, faqat kerakli minimal huquqlar beriladi. Qatorlarga ta'sir qilmaydi.
revoke all on table
  public.categories, public.courses, public.modules, public.lessons, public.quizzes, public.paths,
  public.profiles, public.enrollments, public.lesson_progress, public.quiz_attempts, public.notes,
  public.bookmarks, public.saved_courses, public.questions, public.question_replies,
  public.certificates, public.activities, public.media
from anon, authenticated;

grant all on table
  public.categories, public.courses, public.modules, public.lessons, public.quizzes, public.paths,
  public.profiles, public.enrollments, public.lesson_progress, public.quiz_attempts, public.notes,
  public.bookmarks, public.saved_courses, public.questions, public.question_replies,
  public.certificates, public.activities, public.media
to service_role;

-- Ochiq katalog (RLS qoralamalarni yashiradi)
grant select on table public.categories, public.courses, public.modules, public.lessons, public.paths to anon, authenticated;
-- Kontent tahriri (RLS: faqat admin)
grant insert, update, delete on table public.categories, public.courses, public.modules, public.lessons, public.paths to authenticated;
grant select, insert, update, delete on table public.quizzes, public.media to authenticated;
-- Profil: o'qish va faqat xavfsiz ustunlarni tahrirlash (role, email, id — yo'q)
grant select on table public.profiles to authenticated;
grant update (name, bio, goal, weekly_goal, level, interests, onboarded) on table public.profiles to authenticated;
-- Server yozadigan jadvallar: mijoz faqat o'qiydi (progress/natijalarni soxtalashtirishga qarshi)
grant select on table public.enrollments, public.lesson_progress, public.quiz_attempts, public.activities, public.certificates to authenticated;
grant update (revoked) on table public.certificates to authenticated;
-- Shaxsiy yozuvlar
grant select, insert, update, delete on table public.notes, public.bookmarks, public.saved_courses to authenticated;
-- Savol-javob: yozish faqat server orqali (muallif nomini soxtalashtirishga qarshi)
grant select, delete on table public.questions, public.question_replies to authenticated;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon, authenticated, service_role;

-- ── Row Level Security ───────────────────────────────────────────
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.quizzes enable row level security;
alter table public.paths enable row level security;
alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.notes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.saved_courses enable row level security;
alter table public.questions enable row level security;
alter table public.question_replies enable row level security;
alter table public.certificates enable row level security;
alter table public.activities enable row level security;
alter table public.media enable row level security;

-- Siyosatlar qayta e'lon qilinadi (drop if exists + create) — ma'lumotga tegmaydi.
-- (select auth.uid()) / (select private.is_admin()) — har bir qator uchun qayta hisoblanmasligi uchun.
-- Har bir rol + amal uchun bitta siyosat (bir nechta permissive siyosat sekinlashtiradi).

-- Eski nomdagi siyosatlar (oldingi versiyadan) — almashtirildi
drop policy if exists "categories_admin_write" on public.categories;
drop policy if exists "courses_admin_write" on public.courses;
drop policy if exists "modules_admin_write" on public.modules;
drop policy if exists "lessons_admin_write" on public.lessons;
drop policy if exists "quizzes_admin_write" on public.quizzes;
drop policy if exists "paths_admin_write" on public.paths;
drop policy if exists "profiles_self_update" on public.profiles;
drop policy if exists "profiles_admin_update" on public.profiles;

-- Ochiq kontent (o'qish). Admin qoralamalarni ham ko'radi.
drop policy if exists "categories_read" on public.categories;
create policy "categories_read" on public.categories for select to anon, authenticated using (true);
drop policy if exists "paths_read" on public.paths;
create policy "paths_read" on public.paths for select to anon, authenticated using (true);
drop policy if exists "courses_read" on public.courses;
create policy "courses_read" on public.courses for select to anon, authenticated
  using (status <> 'draft' or (select private.is_admin()));
drop policy if exists "modules_read" on public.modules;
create policy "modules_read" on public.modules for select to anon, authenticated using (
  exists (select 1 from public.courses c where c.id = course_id and (c.status <> 'draft' or (select private.is_admin())))
);
-- Darslar: namuna va rejalashtirilgan darslar hammaga, qolganlari tizimga kirganlarga;
-- qoralama kurs darslari faqat adminga.
drop policy if exists "lessons_read" on public.lessons;
create policy "lessons_read" on public.lessons for select to anon, authenticated using (
  (select private.is_admin())
  or (
    exists (select 1 from public.courses c where c.id = course_id and c.status <> 'draft')
    and (status = 'planned' or (status = 'published' and (is_preview or (select auth.uid()) is not null)))
  )
);
-- Testlarda to'g'ri javoblar bor — faqat admin to'g'ridan-to'g'ri o'qiy oladi
drop policy if exists "quizzes_admin_read" on public.quizzes;
create policy "quizzes_admin_read" on public.quizzes for select to authenticated using ((select private.is_admin()));

-- Kontentni faqat admin o'zgartiradi (insert / update / delete alohida)
do $$
declare t text;
begin
  foreach t in array array['categories', 'courses', 'modules', 'lessons', 'quizzes', 'paths'] loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_insert', t);
    execute format('create policy %I on public.%I for insert to authenticated with check ((select private.is_admin()))', t || '_admin_insert', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_update', t);
    execute format('create policy %I on public.%I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t || '_admin_update', t);
    execute format('drop policy if exists %I on public.%I', t || '_admin_delete', t);
    execute format('create policy %I on public.%I for delete to authenticated using ((select private.is_admin()))', t || '_admin_delete', t);
  end loop;
end
$$;

-- Profillar: o'zingiznikini ko'rish va (rol'dan tashqari) tahrirlash; admin hammasini
drop policy if exists "profiles_self_read" on public.profiles;
create policy "profiles_self_read" on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()));
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update to authenticated
  using (id = (select auth.uid()) or (select private.is_admin()))
  with check (id = (select auth.uid()) or (select private.is_admin()));

-- O'quv ma'lumotlari: egasi va admin o'qiydi, yozish faqat server orqali
drop policy if exists "enrollments_read" on public.enrollments;
create policy "enrollments_read" on public.enrollments for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
drop policy if exists "progress_read" on public.lesson_progress;
create policy "progress_read" on public.lesson_progress for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
drop policy if exists "attempts_own_read" on public.quiz_attempts;
create policy "attempts_own_read" on public.quiz_attempts for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
drop policy if exists "activities_own_read" on public.activities;
create policy "activities_own_read" on public.activities for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

-- Shaxsiy yozuvlar: faqat egasi
drop policy if exists "notes_own" on public.notes;
create policy "notes_own" on public.notes for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "bookmarks_own" on public.bookmarks;
create policy "bookmarks_own" on public.bookmarks for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "saved_own" on public.saved_courses;
create policy "saved_own" on public.saved_courses for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Savol-javoblar: tizimga kirganlar o'qiydi; muallif yoki admin o'chiradi
drop policy if exists "questions_read" on public.questions;
create policy "questions_read" on public.questions for select to authenticated using (true);
drop policy if exists "questions_delete" on public.questions;
create policy "questions_delete" on public.questions for delete to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
drop policy if exists "replies_read" on public.question_replies;
create policy "replies_read" on public.question_replies for select to authenticated using (true);
drop policy if exists "replies_delete" on public.question_replies;
create policy "replies_delete" on public.question_replies for delete to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));

-- Sertifikatlar: egasi va admin ko'radi; ommaviy tekshiruv server orqali kod bo'yicha
-- (ro'yxatni anon kalit bilan yig'ib olishning oldi olinadi); bekor qilish — faqat admin.
drop policy if exists "certificates_read" on public.certificates;
create policy "certificates_read" on public.certificates for select to authenticated
  using (user_id = (select auth.uid()) or (select private.is_admin()));
drop policy if exists "certificates_admin_update" on public.certificates;
create policy "certificates_admin_update" on public.certificates for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- Media kutubxonasi: faqat admin (fayllarning o'zi ommaviy URL orqali ochiladi)
drop policy if exists "media_admin_all" on public.media;
create policy "media_admin_all" on public.media for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- ── Storage: darslar uchun media (video, rasm, fayllar) ─────────
-- Ommaviy bucket: fayllar /storage/v1/object/public/media/... orqali o'qiladi.
-- Ro'yxatni ko'rish, yuklash, almashtirish va o'chirish — faqat admin.
-- 50 MB — Supabase Free tarifidagi global chegara.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml', 'image/avif',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4',
    'application/pdf', 'application/zip', 'application/x-zip-compressed', 'application/json',
    'text/plain', 'text/csv', 'text/markdown',
    'model/gltf-binary', 'application/octet-stream'
  ]
)
on conflict (id) do nothing;

drop policy if exists "media_bucket_admin_read" on storage.objects;
create policy "media_bucket_admin_read" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));
drop policy if exists "media_bucket_admin_write" on storage.objects;
create policy "media_bucket_admin_write" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select private.is_admin()));
drop policy if exists "media_bucket_admin_update" on storage.objects;
create policy "media_bucket_admin_update" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select private.is_admin())) with check (bucket_id = 'media' and (select private.is_admin()));
drop policy if exists "media_bucket_admin_delete" on storage.objects;
create policy "media_bucket_admin_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select private.is_admin()));

-- Oldingi versiyadagi API orqali chaqiriladigan funksiya (endi private.is_admin) —
-- barcha siyosatlar yangisiga o'tkazilgandan keyin olib tashlanadi. Ma'lumotga tegmaydi.
drop function if exists public.is_admin();
