insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cooked-screenshots', 'cooked-screenshots', false, 2000000, array['image/jpeg'])
on conflict (id) do nothing;
