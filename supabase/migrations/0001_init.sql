-- ════════════════════════════════════════════════════════════════
-- Dasturchi — Supabase (PostgreSQL) sxemasi
-- Supabase SQL Editor'da yoki `supabase db push` orqali bajaring.
--
-- Arxitektura: Next.js serveri service-role kaliti bilan ishlaydi va
-- ruxsatlarni ilova qatlamida tekshiradi. RLS esa anon kalit orqali
-- brauzerdan to'g'ridan-to'g'ri kirishga qarshi himoya qatlami.
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
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'student' check (role in ('student', 'admin')),
  bio text not null default '',
  goal text not null default '',
  weekly_goal int not null default 5,
  level int check (level between 1 and 5),
  interests jsonb not null default '[]',
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

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  course_id text not null,
  body text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  course_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.saved_courses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

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

create table if not exists public.question_replies (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  author_name text not null,
  is_staff boolean not null default false,
  body text not null check (char_length(body) <= 4000),
  created_at timestamptz not null default now()
);

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

-- ── Yordamchi funksiyalar ────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Yangi foydalanuvchi (email yoki Google) uchun profil avtomatik yaratiladi
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

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

-- Ochiq kontent
create policy "categories_read" on public.categories for select using (true);
create policy "paths_read" on public.paths for select using (true);
create policy "courses_read" on public.courses for select using (status <> 'draft' or public.is_admin());
create policy "modules_read" on public.modules for select using (
  exists (select 1 from public.courses c where c.id = course_id and (c.status <> 'draft' or public.is_admin()))
);
-- Darslar: namuna darslar hammaga, qolganlari tizimga kirganlarga
create policy "lessons_read" on public.lessons for select using (
  public.is_admin()
  or (status = 'published' and (is_preview or auth.uid() is not null))
  or status = 'planned'
);
-- Testlarda to'g'ri javoblar bor — faqat admin to'g'ridan-to'g'ri o'qiy oladi
create policy "quizzes_admin_read" on public.quizzes for select using (public.is_admin());

-- Kontentni faqat admin o'zgartiradi
create policy "categories_admin_write" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "courses_admin_write" on public.courses for all using (public.is_admin()) with check (public.is_admin());
create policy "modules_admin_write" on public.modules for all using (public.is_admin()) with check (public.is_admin());
create policy "lessons_admin_write" on public.lessons for all using (public.is_admin()) with check (public.is_admin());
create policy "quizzes_admin_write" on public.quizzes for all using (public.is_admin()) with check (public.is_admin());
create policy "paths_admin_write" on public.paths for all using (public.is_admin()) with check (public.is_admin());

-- Profillar: o'zingiznikini ko'rish va (rol'dan tashqari) tahrirlash
create policy "profiles_self_read" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_self_update" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles_admin_update" on public.profiles for update using (public.is_admin()) with check (public.is_admin());
revoke update on public.profiles from authenticated;
grant update (name, bio, goal, weekly_goal, level, interests, onboarded) on public.profiles to authenticated;

-- Shaxsiy o'quv ma'lumotlari: faqat egasi (va admin o'qishi)
create policy "enrollments_own" on public.enrollments for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "enrollments_admin_read" on public.enrollments for select using (public.is_admin());
create policy "progress_own" on public.lesson_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "progress_admin_read" on public.lesson_progress for select using (public.is_admin());
create policy "notes_own" on public.notes for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "bookmarks_own" on public.bookmarks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "saved_own" on public.saved_courses for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Test natijalari va faollik faqat server (service role) tomonidan yoziladi — soxtalashtirishga qarshi
create policy "attempts_own_read" on public.quiz_attempts for select using (user_id = auth.uid() or public.is_admin());
create policy "activities_own_read" on public.activities for select using (user_id = auth.uid() or public.is_admin());

-- Savol-javoblar
create policy "questions_read" on public.questions for select using (auth.uid() is not null);
create policy "questions_insert" on public.questions for insert with check (user_id = auth.uid());
create policy "questions_delete" on public.questions for delete using (user_id = auth.uid() or public.is_admin());
create policy "replies_read" on public.question_replies for select using (auth.uid() is not null);
create policy "replies_insert" on public.question_replies for insert with check (user_id = auth.uid() and is_staff = public.is_admin());
create policy "replies_delete" on public.question_replies for delete using (user_id = auth.uid() or public.is_admin());

-- Sertifikatlar: tekshirish uchun hammaga ochiq, faqat server beradi
create policy "certificates_public_read" on public.certificates for select using (not revoked or user_id = auth.uid() or public.is_admin());
create policy "certificates_admin_update" on public.certificates for update using (public.is_admin()) with check (public.is_admin());

create policy "media_read" on public.media for select using (true);
create policy "media_admin_write" on public.media for all using (public.is_admin()) with check (public.is_admin());

-- ── Storage: darslar uchun media (video, rasm, fayllar) ─────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_bucket_public_read" on storage.objects for select using (bucket_id = 'media');
create policy "media_bucket_admin_write" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "media_bucket_admin_delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());
