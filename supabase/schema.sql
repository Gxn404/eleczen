-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- Component Libraries Table
create table component_libraries (
  id uuid primary key default uuid_generate_v4(),
  file_path text not null,
  library_type text not null check (library_type in ('spice', 'kicad', 'ltspice', 'custom')),
  uploaded_by uuid references auth.users(id),
  uploaded_at timestamp with time zone default now(),
  version text,
  status text check (status in ('ok', 'warning', 'error', 'processing')),
  component_count int default 0,
  parsed_metadata jsonb,
  warnings jsonb,
  errors jsonb,
  dependencies jsonb,
  checksum text,
  is_public boolean default false
);

-- Library Index Table (Flattened components)
create table library_index (
  id uuid primary key default uuid_generate_v4(),
  library_id uuid references component_libraries(id) on delete cascade,
  name text not null,
  type text not null, -- diode, bjt, mosfet, opamp, subckt, etc.
  prefix text,
  pins jsonb,
  parameters jsonb,
  source_file text,
  tags text[],
  search_blob tsvector
);

-- Indexes for Search
create index idx_library_index_search on library_index using gin(search_blob);
create index idx_library_index_name_trgm on library_index using gin(name gin_trgm_ops);
create index idx_library_index_tags on library_index using gin(tags);
create index idx_component_libraries_checksum on component_libraries(checksum);

-- RLS Policies

-- Enable RLS
alter table component_libraries enable row level security;
alter table library_index enable row level security;

-- Policies for component_libraries
create policy "Public libraries are viewable by everyone"
  on component_libraries for select
  using ( is_public = true );

create policy "Users can view their own private libraries"
  on component_libraries for select
  using ( auth.uid() = uploaded_by );

create policy "Admins can insert libraries"
  on component_libraries for insert
  with check ( 
    -- Assuming a custom claim or role check, simplified here:
    auth.role() = 'service_role' or auth.uid() in (select id from auth.users where is_super_admin = true) -- Hypothetical check
    -- For now, allow authenticated users to upload their own
    or auth.uid() = uploaded_by
  );

create policy "Admins can update libraries"
  on component_libraries for update
  using ( auth.uid() = uploaded_by );

create policy "Admins can delete libraries"
  on component_libraries for delete
  using ( auth.uid() = uploaded_by );

-- Policies for library_index (inherit from library)
create policy "Public index viewable"
  on library_index for select
  using ( exists (
    select 1 from component_libraries
    where component_libraries.id = library_index.library_id
    and component_libraries.is_public = true
  ));

create policy "Private index viewable by owner"
  on library_index for select
  using ( exists (
    select 1 from component_libraries
    where component_libraries.id = library_index.library_id
    and component_libraries.uploaded_by = auth.uid()
  ));

-- Storage Bucket Policies (Conceptual - apply in Supabase Dashboard)
-- Bucket: libraries
-- Policy: "Public Access" -> false
-- Policy: "Authenticated Upload" -> true
-- Policy: "Owner Delete" -> true
