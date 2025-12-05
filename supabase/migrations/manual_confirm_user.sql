-- Manually confirm the user by email
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'filip.s.1990@gmail.com';
