-- 1. Prvo proveri koji je tvoj email u Supabase Auth (Authentication -> Users)
-- 2. Zameni 'tvoj-email@gmail.com' sa tim emailom dole:

DO $$
BEGIN
    -- Dodaj profil ako nekim slučajem ne postoji (ali bi trebalo da postoji)
    INSERT INTO profiles (id, email, is_admin)
    SELECT id, email, true
    FROM auth.users
    WHERE email = 'tvoj-email@gmail.com'
    ON CONFLICT (id) DO UPDATE 
    SET is_admin = true;
END $$;

-- Provera:
SELECT id, email, is_admin FROM profiles WHERE is_admin = true;
