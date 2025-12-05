-- 1. Pronađi postojećeg korisnika ili koristi NULL
-- Napomena: Recepti će biti dodeljeni prvom postojećem korisniku u sistemu
-- Ako ne postoji nijedan korisnik, user_id će biti NULL (što može biti OK za demo podatke)

DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Pokušaj da pronađeš prvog postojećeg korisnika
    SELECT id INTO demo_user_id FROM profiles LIMIT 1;
    
    -- Ako ne postoji nijedan korisnik, kreiraj privremenu promenljivu
    -- ali NE insertuj u profiles (to će biti automatski kreirano pri signup)
    IF demo_user_id IS NULL THEN
        RAISE NOTICE 'Nema postojećih korisnika. Koristićemo NULL za user_id.';
        demo_user_id := NULL;
    ELSE
        RAISE NOTICE 'Koristim postojećeg korisnika: %', demo_user_id;
    END IF;
    
    -- Čuvamo demo_user_id u privremenu tabelu za upotrebu u sledećem bloku
    CREATE TEMP TABLE IF NOT EXISTS temp_demo_user (user_id UUID);
    DELETE FROM temp_demo_user;
    INSERT INTO temp_demo_user VALUES (demo_user_id);
END $$;

-- 2. Dodaj kategorije (ako već ne postoje)
INSERT INTO categories (name, slug, icon) VALUES
    ('Glavna jela', 'glavna-jela', '🍖'),
    ('Supte i čorbe', 'supe-corbe', '🍲'),
    ('Testenine i rižoto', 'testenine-rizoto', '🍝'),
    ('Salate', 'salate', '🥗'),
    ('Deserti', 'deserti', '🍰'),
    ('Peciva', 'peciva', '🥐')
ON CONFLICT (slug) DO NOTHING;

-- 3. Dodaj recepte
DO $$
DECLARE
    demo_user_id UUID;
    cat_glavna UUID;
    cat_supe UUID;
    cat_testenine UUID;
    cat_salate UUID;
    cat_deserti UUID;
    cat_peciva UUID;
    
    recipe_id UUID;
BEGIN
    -- Uzmi user_id iz temp tabele
    SELECT user_id INTO demo_user_id FROM temp_demo_user LIMIT 1;
    
    -- Uzmi ID-jeve kategorija
    SELECT id INTO cat_glavna FROM categories WHERE slug = 'glavna-jela';
    SELECT id INTO cat_supe FROM categories WHERE slug = 'supe-corbe';
    SELECT id INTO cat_testenine FROM categories WHERE slug = 'testenine-rizoto';
    SELECT id INTO cat_salate FROM categories WHERE slug = 'salate';
    SELECT id INTO cat_deserti FROM categories WHERE slug = 'deserti';
    SELECT id INTO cat_peciva FROM categories WHERE slug = 'peciva';

    -- RECEPT 1: Ćevapi
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Ćevapi', 'Tradicionalni balkanski ćevapi, sočni i mirisni.', cat_glavna, 30, 15, 4, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'mleveno meso (junetina i svinjetina)', '500g', 0),
    (recipe_id, 'crni luk', '1 glavni', 1),
    (recipe_id, 'beli luk', '3 čena', 2),
    (recipe_id, 'so', 'po ukusu', 3),
    (recipe_id, 'biber', 'po ukusu', 4),
    (recipe_id, 'crvena mljevena paprika', '1 kašičica', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Sitno iseckaj luk i beli luk.'),
    (recipe_id, 2, 'Izmešaj mleveno meso sa lukom, belim lukom i začinima.'),
    (recipe_id, 3, 'Ostavi mešavinu u frižideru najmanje 2 sata.'),
    (recipe_id, 4, 'Oblikuj male kobasice (ćevapiće).'),
    (recipe_id, 5, 'Peći na roštilju ili tiganju 10-15 minuta.');

    -- RECEPT 2: Sarma
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Sarma', 'Klasična srpska sarma u kiselom kupusu.', cat_glavna, 60, 120, 6, 'teško', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'kiseli kupus', '1kg', 0),
    (recipe_id, 'mleveno meso', '700g', 1),
    (recipe_id, 'pirinač', '200g', 2),
    (recipe_id, 'crni luk', '2 glavice', 3),
    (recipe_id, 'dimljena slanina', '150g', 4),
    (recipe_id, 'crvena mljevena paprika', '2 kašike', 5),
    (recipe_id, 'so i biber', 'po ukusu', 6);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Izmešaj mleveno meso, pirinač, sitno iseckan luk i začine.'),
    (recipe_id, 2, 'Odvoji listove kiselog kupusa i odstrani deblje žile.'),
    (recipe_id, 3, 'Stavi nadjev na list kupusa i zamotaj sarmu.'),
    (recipe_id, 4, 'Postavi slanicom na dno šerpe, pa složi sarme.'),
    (recipe_id, 5, 'Prelij vodom da pokrije sarme i kuvaj 2 sata na laganoj vatri.');

    -- RECEPT 3: Musaka
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Musaka sa krompirom', 'Bogata musaka sa slojevima krompira i mesa.', cat_glavna, 30, 60, 6, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'krompir', '1kg', 0),
    (recipe_id, 'mleveno meso', '500g', 1),
    (recipe_id, 'crni luk', '2 glavice', 2),
    (recipe_id, 'jaja', '3 komada', 3),
    (recipe_id, 'pavlaka', '200ml', 4),
    (recipe_id, 'so, biber, paprika', 'po ukusu', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Iseckaj krompir na kolutove i posoли.'),
    (recipe_id, 2, 'Poprži luk, dodaj mleveno meso i začine.'),
    (recipe_id, 3, 'U podmazan pleh složi sloj krompira, pa meso, pa opet krompir.'),
    (recipe_id, 4, 'Izmešaj jaja i pavlaku, prelij preko musake.'),
    (recipe_id, 5, 'Peci na 200°C oko 60 minuta.');

    -- RECEPT 4: Pečena paprika sa sirom
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Pečena paprika sa sirom', 'Lagan vegetarijanski obrok.', cat_salate, 15, 30, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'crvene paprike', '6 komada', 0),
    (recipe_id, 'feta sir', '200g', 1),
    (recipe_id, 'beli luk', '3 čena', 2),
    (recipe_id, 'maslinovo ulje', '3 kašike', 3),
    (recipe_id, 'persun', 'šaka', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Peći paprike u rerni na 200°C dok ne omekšaju (25-30 min).'),
    (recipe_id, 2, 'Oguli paprike i odstrani seme.'),
    (recipe_id, 3, 'Iseckaj sir, beli luk i persun sitno.'),
    (recipe_id, 4, 'Izmešaj sa uljem i preliј preko paprika.'),
    (recipe_id, 5, 'Služi hladno ili mlako.');

    -- RECEPT 5: Đuveč
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Đuveč', 'Balkansko jelo sa pirinčem i povrćem.', cat_glavna, 20, 50, 4, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'pirinač', '300g', 0),
    (recipe_id, 'svinjsko meso', '400g', 1),
    (recipe_id, 'paprike', '3 komada', 2),
    (recipe_id, 'paradajz', '4 komada', 3),
    (recipe_id, 'crni luk', '2 glavice', 4),
    (recipe_id, 'so, biber, vegeta', 'po ukusu', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Poprži meso sa lukom dok ne porumeni.'),
    (recipe_id, 2, 'Dodaj iseckane paprike i paradajz.'),
    (recipe_id, 3, 'Dodaj pirinač i začine.'),
    (recipe_id, 4, 'Prelij sa 2 šolje vode i kuvaj poklopljeno 30 minuta.'),
    (recipe_id, 5, 'Prođi sa čačkalicom da proveriš da li je pirinač mek.');

    -- RECEPT 6: Shopska salata
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Šopska salata', 'Osvežavajuća salata sa sirom.', cat_salate, 15, 0, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'paradajz', '4 komada', 0),
    (recipe_id, 'krastavac', '2 komada', 1),
    (recipe_id, 'paprika', '2 komada', 2),
    (recipe_id, 'crni luk', '1 glavni', 3),
    (recipe_id, 'sir', '150g', 4),
    (recipe_id, 'maslinovo ulje', '3 kašike', 5),
    (recipe_id, 'so', 'po ukusu', 6);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Iseckaj paradajz, krastavac i paprike na kockice.'),
    (recipe_id, 2, 'Iseckaj luk na tanke kolutove.'),
    (recipe_id, 3, 'Izmešaj povrće u činiji.'),
    (recipe_id, 4, 'Narendaj sir preko salate.'),
    (recipe_id, 5, 'Prelij maslinovim uljem i posoли.');

    -- RECEPT 7: Prebranac
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Prebranac', 'Tradicionalno jelo sa pasuljem i lukom.', cat_glavna, 480, 60, 6, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'pasulj', '500g', 0),
    (recipe_id, 'crni luk', '4 glavice', 1),
    (recipe_id, 'crvena mljevena paprika', '2 kašike', 2),
    (recipe_id, 'ulje', '100ml', 3),
    (recipe_id, 'lovorov list', '2 lista', 4),
    (recipe_id, 'so i biber', 'po ukusu', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Namači pasulj u vodi preko noći.'),
    (recipe_id, 2, 'Prokuvaj pasulj sa lovorovim listom dok ne omekša.'),
    (recipe_id, 3, 'Iseckaj luk na kolutove i poprži.'),
    (recipe_id, 4, 'Izmešaj pasulj sa lukom i papri kom.'),
    (recipe_id, 5, 'Stavi u pleh i peci 40 minuta na 180°C.');

    -- RECEPT 8: Karađorđeva šnicla
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Karađorđeva šnicla', 'Rolat od telećeg mesa punjen kajmakom.', cat_glavna, 30, 20, 4, 'teško', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'teleće šnicle', '4 komada', 0),
    (recipe_id, 'kajmak', '200g', 1),
    (recipe_id, 'brašno', '100g', 2),
    (recipe_id, 'jaja', '2 komada', 3),
    (recipe_id, 'prezle', '150g', 4),
    (recipe_id, 'ulje za prženje', '200ml', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Istanjи šnicle i posoли.'),
    (recipe_id, 2, 'Namaži svaku šniclu kajmakom i zarolaj.'),
    (recipe_id, 3, 'Uvaљaj u brašno, pa u umućena jaja, pa u prezle.'),
    (recipe_id, 4, 'Prži u dubokom ulju dok ne porumeni.'),
    (recipe_id, 5, 'Služi toplo sa pomfritom.');

    -- RECEPT 9: Ajvar
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Ajvar', 'Tradicionalni namaz od paprike i patlidžana.', cat_salate, 60, 90, 10, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'crvene paprike', '2kg', 0),
    (recipe_id, 'patlidžan', '1kg', 1),
    (recipe_id, 'beli luk', '5 čenova', 2),
    (recipe_id, 'sunčokretovo ulje', '200ml', 3),
    (recipe_id, 'sirće', '50ml', 4),
    (recipe_id, 'so i šećer', 'po ukusu', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Peći paprike i patlidžane u rerni na 200°C.'),
    (recipe_id, 2, 'Oguli povrће i odstrani seme.'),
    (recipe_id, 3, 'Sameljи ili iseckaj sitno.'),
    (recipe_id, 4, 'Dinстaj na ulju 60-90 minuta uz mešanje.'),
    (recipe_id, 5, 'Dodaj beli luk, sirće, so i šećer. Kuvaj još 10 minuta.');

    -- RECEPT 10: Pasulj čorba
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Pasulj čorba', 'Gusta i hranljiva čorba.', cat_supe, 480, 90, 6, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'pasulj', '400g', 0),
    (recipe_id, 'dimljena slanina', '200g', 1),
    (recipe_id, 'crni luk', '2 glavice', 2),
    (recipe_id, 'šargarepa', '2 komada', 3),
    (recipe_id, 'crvena mljevena paprika', '1 kašika', 4),
    (recipe_id, 'lovorov list', '2 lista', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Namači pasulj preko noći.'),
    (recipe_id, 2, 'Prokuvaj pasulj sa lovorovim listom.'),
    (recipe_id, 3, 'Dodaj iseckanu slaninu, luk i šargarepu.'),
    (recipe_id, 4, 'Kuvaj 60-90 minuta dok pasulj ne omekša.'),
    (recipe_id, 5, 'Na kraju dodaj papriku i začini.');

    -- RECEPT 11: Pljeskavica
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Pljeskavica', 'Velika pečena pljeskavica, savršena za roštilj.', cat_glavna, 20, 15, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'mleveno meso', '600g', 0),
    (recipe_id, 'crni luk', '1 glavni', 1),
    (recipe_id, 'beli luk', '2 čena', 2),
    (recipe_id, 'so i biber', 'po ukusu', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Izmešaj mleveno meso sa sitnim lukom i začinima.'),
    (recipe_id, 2, 'Oblikuj velike okrugle pljeskavice.'),
    (recipe_id, 3, 'Peći na roštilju 12-15 minuta.'),
    (recipe_id, 4, 'Služi u lepinji sa lukom i ajvarom.');

    -- RECEPT 12: Gibanica
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Gibanica', 'Slana pita sa sirom i korama.', cat_peciva, 30, 45, 8, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'kore za pitu', '500g', 0),
    (recipe_id, 'sir', '500g', 1),
    (recipe_id, 'jaja', '4 komada', 2),
    (recipe_id, 'pavlaka', '200ml', 3),
    (recipe_id, 'kisela voda', '200ml', 4),
    (recipe_id, 'ulje', '100ml', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Izmešaj sir, jaja i pavlaku.'),
    (recipe_id, 2, 'Namaži kore uljem i složi u pleh naizmenično sa sirom.'),
    (recipe_id, 3, 'Prelij kiseli com vodom pre pečenja.'),
    (recipe_id, 4, 'Peci 45 minuta na 180°C.');

    -- RECEPT 13: Punjene paprike
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Punjene paprike', 'Paprike punjene mesom i pirinčem.', cat_glavna, 40, 90, 6, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'paprike', '10 komada', 0),
    (recipe_id, 'mleveno meso', '600g', 1),
    (recipe_id, 'pirinač', '150g', 2),
    (recipe_id, 'crni luk', '2 glavice', 3),
    (recipe_id, 'paradajz sos', '400ml', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Izmešaj mleveno meso, pirinač i luk.'),
    (recipe_id, 2, 'Operi paprike i izvadi seme.'),
    (recipe_id, 3, 'Napuni paprike mešavinom.'),
    (recipe_id, 4, 'Složi u šerpu, prelij paradajz sosom.'),
    (recipe_id, 5, 'Kuvaj 90 minuta.');

    -- RECEPT 14: Proja
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Proja', 'Kukuruzni hleb sa sirom.', cat_peciva, 15, 40, 6, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'kukuruzno brašno', '300g', 0),
    (recipe_id, 'sir', '200g', 1),
    (recipe_id, 'jaja', '3 komada', 2),
    (recipe_id, 'jogurt', '200ml', 3),
    (recipe_id, 'ulje', '100ml', 4),
    (recipe_id, 'prašak za pecivo', '1 kesica', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Izmešaj brašno, jaja, jogurt i ulje.'),
    (recipe_id, 2, 'Dodaj narendani sir i prašak za pecivo.'),
    (recipe_id, 3, 'Izlij u podmazan pleh.'),
    (recipe_id, 4, 'Peci 40 minuta na 200°C.');

    -- RECEPT 15: Punjena tikvica
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Punjena tikvica', 'Tikvice punjene mesom i pirinčem.', cat_glavna, 30, 60, 4, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'tikvice', '6 komada', 0),
    (recipe_id, 'mleveno meso', '400g', 1),
    (recipe_id, 'pirinač', '100g', 2),
    (recipe_id, 'crni luk', '1 glavni', 3),
    (recipe_id, 'paradajz', '3 komada', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Izvadi sredinu tikvica.'),
    (recipe_id, 2, 'Izmešaj meso, pirinač i luk.'),
    (recipe_id, 3, 'Napuni tikvice.'),
    (recipe_id, 4, 'Složi u šerpu sa paradajzom.'),
    (recipe_id, 5, 'Kuvaj 60 minuta.');

    -- RECEPT 16: Roštilj kobasice
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Roštilj kobasice', 'Domaće kobasice sa roštilja.', cat_glavna, 10, 20, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'sveže kobasice', '800g', 0),
    (recipe_id, 'so i biber', 'po ukusu', 1);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Zagrij roštilj.'),
    (recipe_id, 2, 'Pobodikobasice viljuškom.'),
    (recipe_id, 3, 'Peći 15-20 minuta okrečući.');

    -- RECEPT 17: Kajgana
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Kajgana', 'Brz i jednostavan doručak.', cat_glavna, 5, 10, 2, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'jaja', '4 komada', 0),
    (recipe_id, 'mleko', '50ml', 1),
    (recipe_id, 'sir', '50g', 2),
    (recipe_id, 'so', 'po ukusu', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Umuti jaja sa mlekom.'),
    (recipe_id, 2, 'Ispeci na tiganju.'),
    (recipe_id, 3, 'Pospi sirom pre kraja.');

    -- RECEPT 18: Kompir salata
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Kompir salata', 'Klasična krompir salata.', cat_salate, 30, 20, 6, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'krompir', '1kg', 0),
    (recipe_id, 'majonez', '200g', 1),
    (recipe_id, 'krastavčići', '5 komada', 2),
    (recipe_id, 'jaja', '3 komada', 3),
    (recipe_id, 'šargarepa', '2 komada', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Skuvaj krompir, jaja i šargarepu.'),
    (recipe_id, 2, 'Iseckaj sve na kockice.'),
    (recipe_id, 3, 'Dodaj krastavčiće i majonez.'),
    (recipe_id, 4, 'Izmešaj i охлади.');

    -- RECEPT 19: Kupus salata
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Kupus salata', 'Svježa salata od kupusa.', cat_salate, 15, 0, 6, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'kupus', '500g', 0),
    (recipe_id, 'šargarepa', '2 komada', 1),
    (recipe_id, 'sirće', '3 kašike', 2),
    (recipe_id, 'ulje', '2 kašike', 3),
    (recipe_id, 'so i šećer', 'po ukusu', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Iseckaj kupus sitno.'),
    (recipe_id, 2, 'Narendaj šargarepu.'),
    (recipe_id, 3, 'Izmešaj sa sirćetom, uljem i začinima.');

    -- RECEPT 20: Podvarak
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Podvarak', 'Tradicionalno jelo sa mesom i kupusom.', cat_glavna, 20, 90, 6, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'kiseli kupus', '1kg', 0),
    (recipe_id, 'svinjsko meso', '800g', 1),
    (recipe_id, 'crni luk', '2 glavice', 2),
    (recipe_id, 'slanina', '100g', 3),
    (recipe_id, 'crvena paprika', '2 kašike', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Poprži meso sa lukom.'),
    (recipe_id, 2, 'Dodaj kiseli kupus.'),
    (recipe_id, 3, 'Kuvaj 90 minuta.'),
    (recipe_id, 4, 'Dodaj papriku na kraju.');

    -- RECEPT 21: Pita sa sirom
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Pita sa sirom', 'Domaća pita sa sirom.', cat_peciva, 30, 50, 8, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'kore za pitu', '500g', 0),
    (recipe_id, 'sir', '600g', 1),
    (recipe_id, 'jaja', '4 komada', 2),
    (recipe_id, 'pavlaka', '200ml', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Izmešaj sir, jaja i pavlaku.'),
    (recipe_id, 2, 'Složi kore sa nadjevom.'),
    (recipe_id, 3, 'Peci 50 minuta na 180°C.');

    -- RECEPT 22: Ruska salata
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Ruska salata', 'Bogata salata sa povrćem.', cat_salate, 40, 20, 8, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'krompir', '600g', 0),
    (recipe_id, 'šargarepa', '3 komada', 1),
    (recipe_id, 'krastavčići', '8 komada', 2),
    (recipe_id, 'jaja', '4 komada', 3),
    (recipe_id, 'grašak', '200g', 4),
    (recipe_id, 'majonez', '300g', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Skuvaj krompir, šargarepu, grašak i jaja.'),
    (recipe_id, 2, 'Iseckaj sve na kockice.'),
    (recipe_id, 3, 'Izmešaj sa majonezom.');

    -- RECEPT 23: Krofne
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Krofne', 'Punene krofne sa đemom.', cat_deserti, 120, 20, 12, 'teško', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'brašno', '500g', 0),
    (recipe_id, 'mleko', '250ml', 1),
    (recipe_id, 'š ećer', '80g', 2),
    (recipe_id, 'kvasac', '20g', 3),
    (recipe_id, 'jaja', '2 komada', 4),
    (recipe_id, 'đem', '200g', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Napravi testo i ostavi da naraste.'),
    (recipe_id, 2, 'Oblikuj male lopte.'),
    (recipe_id, 3, 'Prži u dubokom ulju.'),
    (recipe_id, 4, 'Napuni đemom.');

    -- RECEPT 24: Palačinke
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Palačinke', 'Tanke palačinke sa različitim nadjevima.', cat_deserti, 15, 30, 6, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'brašno', '300g', 0),
    (recipe_id, 'mleko', '500ml', 1),
    (recipe_id, 'jaja', '3 komada', 2),
    (recipe_id, 'so', 'prstohvat', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Izmešaj sve sastojke.'),
    (recipe_id, 2, 'Peci tanke palačinke na tiganju.'),
    (recipe_id, 3, 'Napuni nutelo m ili đemom.');

    -- RECEPT 25: Pečurke na žaru
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Pečurke na žaru', 'Pečene šampinjoni sa začinima.', cat_salate, 10, 15, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'šampinjoni', '500g', 0),
    (recipe_id, 'beli luk', '4 čena', 1),
    (recipe_id, 'maslinovo ulje', '3 kašike', 2),
    (recipe_id, 'persun', 'šaka', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Očisti pečurke.'),
    (recipe_id, 2, 'Izmešaj ulje, beli luk i persun.'),
    (recipe_id, 3, 'Peći na roštilju 15 minuta.');

    -- RECEPT 26: Sataraš
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Sataraš', 'Vegetarijansko jelo od paprike i jaja.', cat_glavna, 15, 25, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'paprike', '5 komada', 0),
    (recipe_id, 'paradajz', '3 komada', 1),
    (recipe_id, 'crni luk', '1 glavni', 2),
    (recipe_id, 'jaja', '4 komada', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Dinстaj luk, paprike i paradajz.'),
    (recipe_id, 2, 'Dodaj jaja na kraju.'),
    (recipe_id, 3, 'Služi toplo.');

    -- RECEPT 27: Srpska čorba
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Srpska čorba', 'Bogata čorba sa mesom i povrćem.', cat_supe, 30, 60, 6, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'govedina', '500g', 0),
    (recipe_id, 'krompir', '4 komada', 1),
    (recipe_id, 'šargarepa', '2 komada', 2),
    (recipe_id, 'crni luk', '1 glavni', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Kuvaj meso 30 minuta.'),
    (recipe_id, 2, 'Dodaj povrće.'),
    (recipe_id, 3, 'Kuvaj još 30 minuta.');

    -- RECEPT 28: Paradajz čorba
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Paradajz čorba', 'Ljetnja čorba od paradajza.', cat_supe, 15, 30, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'paradajz', '1kg', 0),
    (recipe_id, 'crni luk', '1 glavni', 1),
    (recipe_id, 'pavlaka', '100ml', 2),
    (recipe_id, 'brašno', '2 kašike', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Dinстaj luk i paradajz.'),
    (recipe_id, 2, 'Dodaj vodu i kuvaj 20 minuta.'),
    (recipe_id, 3, 'Zaprži pavlaku sa brašnom i dodaj.');

    -- RECEPT 29: Pita sa jabukama
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Pita sa jabukama', 'Slatka pita sa cimetom.', cat_deserti, 30, 45, 8, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'kore za pitu', '500g', 0),
    (recipe_id, 'jabuke', '6 komada', 1),
    (recipe_id, 'šećer', '150g', 2),
    (recipe_id, 'cimet', '2 kašičice', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Narendaj jabuke.'),
    (recipe_id, 2, 'Izmešaj sa šećerom i cimetom.'),
    (recipe_id, 3, 'Složi kore sa nadjevom.'),
    (recipe_id, 4, 'Peci 45 minuta.');

    -- RECEPT 30: Krompir paprikaš
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Krompir paprikaš', 'Dinствано jelo sa krompirom.', cat_glavna, 15, 40, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'krompir', '1kg', 0),
    (recipe_id, 'crni luk', '2 glavice', 1),
    (recipe_id, 'crvena paprika', '2 kašike', 2),
    (recipe_id, 'kobasice', '300g', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Poprži luk i kobasice.'),
    (recipe_id, 2, 'Dodaj krompir i papriku.'),
    (recipe_id, 3, 'Kuvaj 40 minuta.');

    -- RECEPT 31-50: Dodajem još 20 recepata
    
    -- RECEPT 31: Pilav
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Pilav', 'Jelo sa pirinčem i povrćem.', cat_testenine, 15, 30, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'pirinač', '300g', 0),
    (recipe_id, 'šargarepa', '2 komada', 1),
    (recipe_id, 'pileće meso', '300g', 2);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Dinстaj meso i povrće.'),
    (recipe_id, 2, 'Dodaj pirinač i vodu.'),
    (recipe_id, 3, 'Kuvaj 25 minuta.');

    -- RECEPT 32: Punjena vešalica
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Punjena vešalica', 'Rolat od mesa i sira.', cat_glavna, 25, 40, 4, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'šnicle', '4 komada', 0),
    (recipe_id, 'šunka', '8 kriški', 1),
    (recipe_id, 'sir', '200g', 2);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Zarolaj šnicle sa šunkom i sirom.'),
    (recipe_id, 2, 'Peći u rerni 40 minuta.');

    -- RECEPT 33: Pečeno pile
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Pečeno pile', 'Celo pile pečeno u rerni.', cat_glavna, 15, 90, 6, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'celo pile', '1.5kg', 0),
    (recipe_id, 'krompir', '1kg', 1),
    (recipe_id, 'začini', 'po ukusu', 2);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Začini pile.'),
    (recipe_id, 2, 'Složi krompir oko pileta.'),
    (recipe_id, 3, 'Peci 90 minuta na 200°C.');

    -- RECEPT 34: Teleća čorba
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Teleća čorba', 'Tradicionalna teleća čorba.', cat_supe, 20, 90, 6, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'teleće meso', '600g', 0),
    (recipe_id, 'šargarepa', '3 komada', 1),
    (recipe_id, 'krompir', '4 komada', 2);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Kuvaj meso 60 minuta.'),
    (recipe_id, 2, 'Dodaj povrće.'),
    (recipe_id, 3, 'Kuvaj još 30 minuta.');

    -- RECEPT 35: Reform torta
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Reform torta', 'Poznata srpska torta.', cat_deserti, 60, 30, 12, 'teško', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'brašno', '200g', 0),
    (recipe_id, 'šećer', '200g', 1),
    (recipe_id, 'jaja', '6 komada', 2),
    (recipe_id, 'oraси', '150g', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Napravi kore.'),
    (recipe_id, 2, 'Napravi fil.'),
    (recipe_id, 3, 'Složi tortu.');

    -- RECEPT 36: Supa od povrća
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Supa od povrća', 'Zdrava vegetarijanska supa.', cat_supe, 15, 30, 4, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'šargarepa', '3 komada', 0),
    (recipe_id, 'krompir', '3 komada', 1),
    (recipe_id, 'grašak', '200g', 2);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Iseckaj povrće.'),
    (recipe_id, 2, 'Kuvaj 30 minuta.');

    -- RECEPT 37-50: Još 14 recepata
    
    -- RECEPT 37: Uštipci
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Uštipci', 'Pržene lopte od testa.', cat_peciva, 60, 20, 8, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'brašno', '500g', 0),
    (recipe_id, 'kvasac', '20g', 1),
    (recipe_id, 'mleko', '300ml', 2);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Napravi testo.'),
    (recipe_id, 2, 'Ostavi da naraste.'),
    (recipe_id, 3, 'Prži u dubokom ulju.');

    -- RECEPT 38-50: Dovršavam sa još 13 tradicionalnih recepata
    
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES 
    (demo_user_id, 'Pečena riba', 'Riba sa roštilja.', cat_glavna, 15, 20, 4, 'lako', true),
    (demo_user_id, 'Šopska salata sa tunjevinom', 'Modifikovana šopska.', cat_salate, 15, 0, 4, 'lako', true),
    (demo_user_id, 'Kiseljačka čorba', 'Kisela čorba sa mesom.', cat_supe, 30, 60, 6, 'srednje', true),
    (demo_user_id, 'Kačamak', 'Tradicionalno jelo od kukuruza.', cat_glavna, 10, 20, 4, 'lako', true),
    (demo_user_id, 'Pogača sa sirom', 'Mekana pogača.', cat_peciva, 90, 30, 8, 'srednje', true),
    (demo_user_id, 'Punjene tikvice sa sirom', 'Vegetarijanska varijanta.', cat_glavna, 30, 45, 4, 'srednje', true),
    (demo_user_id, 'Baklava', 'Slatka poslastica sa orasima.', cat_deserti, 60, 40, 12, 'teško', true),
    (demo_user_id, 'Tufahija', 'Desert od jabuka.', cat_deserti, 20, 40, 6, 'srednje', true),
    (demo_user_id, 'Hurmasice', 'Kolačići sa sirupom.', cat_deserti, 30, 25, 20, 'srednje', true),
    (demo_user_id, 'Vanilice', 'Sitni kolačići.', cat_deserti, 40, 15, 30, 'srednje', true),
    (demo_user_id, 'Pasuljara', 'Густa čorba od pasulja.', cat_supe, 480, 120, 8, 'srednje', true),
    (demo_user_id, 'Cicvara', 'Jelo od kukuruznog brašna i sira.', cat_glavna, 10, 20, 4, 'lako', true),
    (demo_user_id, 'Mantije', 'Pečene mantije sa mesom.', cat_glavna, 60, 30, 6, 'teško', true);

END $$;
