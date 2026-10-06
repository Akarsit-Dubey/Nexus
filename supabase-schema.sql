-- ==============================================================================
-- NEXUS Developer Universe - Supabase PostgreSQL Schema
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  github_username TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT,
  technologies TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'in-progress' CHECK (status IN ('active', 'in-progress', 'completed', 'archived', 'planned')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  github_url TEXT,
  live_url TEXT,
  related_skills TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Languages', 'DevOps & Cloud', 'Architecture', 'Tools')),
  proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
  projects_count INTEGER DEFAULT 0,
  last_practiced DATE DEFAULT CURRENT_DATE,
  related_technologies TEXT[] DEFAULT '{}',
  resources_count INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Repositories Table
CREATE TABLE IF NOT EXISTS repositories (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT,
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  open_issues INTEGER DEFAULT 0,
  language TEXT,
  updated_at TIMESTAMPTZ,
  html_url TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  default_branch TEXT DEFAULT 'main'
);

-- 5. Goals Table
CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  category TEXT,
  related_skills TEXT[] DEFAULT '{}',
  related_projects TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Learning Topics Table
CREATE TABLE IF NOT EXISTS learning_topics (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  checklist JSONB DEFAULT '[]'::jsonb,
  related_skills TEXT[] DEFAULT '{}',
  related_projects TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  criteria TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  max_progress INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('projects', 'skills', 'github', 'goals', 'universe'))
);

-- 8. Resources Table
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('documentation', 'article', 'video', 'course', 'tool', 'repository')),
  url TEXT NOT NULL,
  description TEXT,
  related_skills TEXT[] DEFAULT '{}',
  related_projects TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Universe Graph Nodes
CREATE TABLE IF NOT EXISTS universe_nodes (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('skill', 'project', 'repository', 'technology', 'goal', 'learning', 'achievement', 'resource')),
  label TEXT NOT NULL,
  description TEXT,
  position_x DOUBLE PRECISION NOT NULL DEFAULT 0,
  position_y DOUBLE PRECISION NOT NULL DEFAULT 0,
  progress INTEGER,
  proficiency INTEGER,
  icon TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Universe Graph Edges
CREATE TABLE IF NOT EXISTS universe_edges (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  source_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  relationship TEXT DEFAULT 'related_to' CHECK (relationship IN ('uses', 'related_to', 'built_with', 'targets', 'learned_in', 'rewarded_by', 'contains')),
  animated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
  accent TEXT DEFAULT 'cyan',
  node_size TEXT DEFAULT 'normal' CHECK (node_size IN ('compact', 'normal', 'large')),
  edge_visibility BOOLEAN DEFAULT TRUE,
  show_labels BOOLEAN DEFAULT TRUE,
  animation_intensity TEXT DEFAULT 'medium' CHECK (animation_intensity IN ('high', 'medium', 'subtle', 'none')),
  background_effects BOOLEAN DEFAULT TRUE,
  default_view TEXT DEFAULT '2d' CHECK (default_view IN ('2d', 'focus', 'timeline', '3d')),
  reduced_motion BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
