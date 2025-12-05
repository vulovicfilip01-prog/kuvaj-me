-- Create shopping_list_items table
create table if not exists shopping_list_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  quantity text,
  is_checked boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table shopping_list_items enable row level security;

-- Create policies
create policy "Users can view their own shopping list items"
  on shopping_list_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own shopping list items"
  on shopping_list_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own shopping list items"
  on shopping_list_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own shopping list items"
  on shopping_list_items for delete
  using (auth.uid() = user_id);
