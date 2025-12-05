-- Migration to clean up duplicate categories
-- Run this in Supabase SQL Editor

DO $$
DECLARE
    target_id UUID;
    source_id UUID;
    pair RECORD;
BEGIN
    -- List of pairs to merge: (source_name, target_name)
    -- We want to merge 'source_name' INTO 'target_name'.
    -- If target exists, source recipes are moved to target, and source is deleted.
    -- If target does NOT exist, source is renamed to target.
    
    FOR pair IN SELECT * FROM (VALUES 
        ('Desert', 'Deserti'),
        ('Glavno jelo', 'Glavna jela'),
        ('Pecivo', 'Peciva'),
        ('Salata', 'Salate'),
        ('Supa', 'Supe i čorbe'),
        ('Supte i čorbe', 'Supe i čorbe'), -- Fix typo
        ('Piće', 'Pića'), -- Optional: Standardize on plural
        ('Predjelo', 'Predjela') -- Optional: Standardize on plural
    ) AS t(source_name, target_name)
    LOOP
        -- Find IDs
        SELECT id INTO source_id FROM categories WHERE name = pair.source_name;
        SELECT id INTO target_id FROM categories WHERE name = pair.target_name;

        IF source_id IS NOT NULL THEN
            IF target_id IS NOT NULL AND target_id != source_id THEN
                -- Both exist: Move recipes and delete source
                UPDATE recipes SET category_id = target_id WHERE category_id = source_id;
                DELETE FROM categories WHERE id = source_id;
                RAISE NOTICE 'Merged % into %', pair.source_name, pair.target_name;
            ELSIF target_id IS NULL THEN
                -- Only source exists: Rename source to target
                UPDATE categories SET name = pair.target_name WHERE id = source_id;
                RAISE NOTICE 'Renamed % to %', pair.source_name, pair.target_name;
            ELSE
                RAISE NOTICE 'Source % exists but target % is the same or issue found', pair.source_name, pair.target_name;
            END IF;
        ELSE
            RAISE NOTICE 'Source category % not found, skipping', pair.source_name;
        END IF;
    END LOOP;
END $$;
