-- Migration: Add additional Serbian recipes (Batch 2)
-- Date: 2025-12-07

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
    -- Get IDs (Reuse logic from previous seed)
    SELECT id INTO demo_user_id FROM profiles LIMIT 1;
    IF demo_user_id IS NULL THEN RAISE NOTICE 'No user found, user_id will be NULL'; END IF;
    
    SELECT id INTO cat_glavna FROM categories WHERE slug = 'glavna-jela';
    SELECT id INTO cat_supe FROM categories WHERE slug = 'supe-corbe';
    SELECT id INTO cat_testenine FROM categories WHERE slug = 'testenine-rizoto';
    SELECT id INTO cat_salate FROM categories WHERE slug = 'salate';
    SELECT id INTO cat_deserti FROM categories WHERE slug = 'deserti';
    SELECT id INTO cat_peciva FROM categories WHERE slug = 'peciva';

    -- RECEPT 1: Riblja čorba
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Riblja čorba', 'Tradicionalna pikantna čorba od više vrsta rečne ribe.', cat_supe, 45, 90, 8, 'teško', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'mešana rečna riba (šaran, som, smuđ)', '1.5kg', 0),
    (recipe_id, 'crni luk', '3 glavice', 1),
    (recipe_id, 'šargarepa', '2 komada', 2),
    (recipe_id, 'paradajz sok', '500ml', 3),
    (recipe_id, 'ljuta tucana paprika', '1 kašika', 4),
    (recipe_id, 'začin za riblju čorbu', '1 kesica', 5),
    (recipe_id, 'belo vino', '100ml', 6);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Ribu očisti i iseci na komade. Glave i repove skuvaj posebno pa ispasiraj (ili procedi vodu).'),
    (recipe_id, 2, 'Sitno iseckan luk i šargarepu dinstaj dok se ne raspadnu.'),
    (recipe_id, 3, 'Dodaj pasiranu ribu/vodu, paradajz sok i začine.'),
    (recipe_id, 4, 'Kuvaj na laganoj vatri 30 minuta.'),
    (recipe_id, 5, 'Dodaj komade ribe i kuvaj još 20-30 min. Ne mešaj da se riba ne raspadne, samo protresi šerpu.'),
    (recipe_id, 6, 'Pred kraj dodaj vino.');

    -- RECEPT 2: Komplet lepinja
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Komplet lepinja', 'Užički specijalitet - lepinja sa "sve".', cat_peciva, 10, 20, 1, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'lepinja', '1 komad', 0),
    (recipe_id, 'jaje', '1 komad', 1),
    (recipe_id, 'stari kajmak', '1 puna kašika', 2),
    (recipe_id, 'pretop (moca)', '1 kutlača', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Odseci poklopac lepinje.'),
    (recipe_id, 2, 'U donji deo umuti jaje i kajmak viljuškom direktno u lepinji.'),
    (recipe_id, 3, 'Stavi u zagrejanu rernu (250°C) i peci 10-tak minuta dok se ne zapeče.'),
    (recipe_id, 4, 'Izvadi, prelij vrelim pretopom i poklopi poklopcem (koji samo kratko zagreješ).'),
    (recipe_id, 5, 'Jede se prstima!');

    -- RECEPT 3: Leskovačka mućkalica
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Leskovačka mućkalica', 'Pikantno jelo od roštilj mesa i povrća.', cat_glavna, 40, 60, 4, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'svinjsko meso (od vrata)', '600g', 0),
    (recipe_id, 'crni luk', '3 glavice', 1),
    (recipe_id, 'paprika šilja (pečena)', '5 komada', 2),
    (recipe_id, 'paradajz', '3 komada', 3),
    (recipe_id, 'ljuta paprika', '2 komada', 4),
    (recipe_id, 'svinjska mast', '1 kašika', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Meso iseci na kocke, posoli i ispeci na roštilju (ili gril tiganju) da dobije šmek.'),
    (recipe_id, 2, 'Luk iseci na rebarca i dinstaj na masti dok ne omekša.'),
    (recipe_id, 3, 'Dodaj iseckanu pečenu papriku i oljušten paradajz.'),
    (recipe_id, 4, 'Krčkaj dok tečnost ne ispari.'),
    (recipe_id, 5, 'Dodaj meso i ljutu papriku, pa "mućkaj" (krčkaj) još malo da se ukusi sjedine. Ne mešati previše.');

    -- RECEPT 4: Bela čorba
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Bela čorba', 'Kremasta teleća čorba sa pavlakom.', cat_supe, 20, 60, 6, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'teleće meso (od buta)', '400g', 0),
    (recipe_id, 'šargarepa, paškanat, celer', 'veza zeleni', 1),
    (recipe_id, 'crni luk', '1 glavica', 2),
    (recipe_id, 'žumance', '1 komad', 3),
    (recipe_id, 'kisela pavlaka', '100ml', 4),
    (recipe_id, 'limun', 'po ukusu', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Iseckaj luk i dinstaj. Dodaj meso isečeno na kockice.'),
    (recipe_id, 2, 'Dodaj korenasto povrće i nalij vodom.'),
    (recipe_id, 3, 'Kuvaj dok meso ne omekša.'),
    (recipe_id, 4, 'Napravi zapršku (brašno i ulje) i dodaj u čorbu (opciono) ili samo zgusni pasisranim povrćem.'),
    (recipe_id, 5, 'Pred služenje, umuti žumance sa pavlakom u tanjiru/činiji i polako dodaj malo vruće čorbe, pa sve vrati u lonac (da se ne zgruša). Isključi ringlu.');

    -- RECEPT 5: Knedle sa šljivama
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Knedle sa šljivama', 'Gomboce - slatkia od krompir testa punjena šljivama.', cat_deserti, 60, 30, 6, 'teško', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'krompir (beli)', '500g', 0),
    (recipe_id, 'brašno', '150-200g', 1),
    (recipe_id, 'jaje', '1 komad', 2),
    (recipe_id, 'šljive', '12 komada', 3),
    (recipe_id, 'prezle', '100g', 4),
    (recipe_id, 'ulje', 'pola šoljice', 5),
    (recipe_id, 'šećer i cimet', 'za posipanje', 6);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Skuvaj krompir u ljusci, oljušti i ispasiraj. Ostavi da se prohladi.'),
    (recipe_id, 2, 'Dodaj jaje i brašno, umesi mekano testo (ne sme da bude pretvrdo).'),
    (recipe_id, 3, 'Razvij testo, seci kvadrate. U svaki stavi šljivu (bez koštice) i malo šećera.'),
    (recipe_id, 4, 'Formiraj kugle rukama.'),
    (recipe_id, 5, 'Kuvaj u ključaloj vodi dok ne isplivaju na površinu.'),
    (recipe_id, 6, 'U tiganju proprži prezle na ulju. Uvaljaj kuvane knedle u prezle i pospi šećerom.');

    -- RECEPT 6: Bečka šnicla (popularno u Srbiji)
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Bečka šnicla', 'Tanka pohovana teleća šnicla.', cat_glavna, 20, 15, 4, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'teleće šnicle', '4 velika komada', 0),
    (recipe_id, 'brašno', '100g', 1),
    (recipe_id, 'jaja', '2 komada', 2),
    (recipe_id, 'prezle', '150g', 3),
    (recipe_id, 'puter/mast', 'za prženje', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Šnicle dobro istanji tučkom za meso.'),
    (recipe_id, 2, 'Posoli. Uvaljaj u brašno, pa u umućena jaja, pa u prezle.'),
    (recipe_id, 3, 'Prži u dosta masnoće da plivaju, okreći dok ne porumene.'),
    (recipe_id, 4, 'Služi sa krompir salatom i kriškom limuna.');

    -- RECEPT 7: Vasina torta
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Vasina torta', 'Klasik srpskog poslastičarstva sa orasima i narandžom.', cat_deserti, 120, 40, 12, 'teško', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'orasi mlevni', '300g', 0),
    (recipe_id, 'jaja', '10 komada', 1),
    (recipe_id, 'šećer', '300g', 2),
    (recipe_id, 'pomorandža (sok i kora)', '1 komad', 3),
    (recipe_id, 'čokolada za kuvanje', '100g', 4),
    (recipe_id, 'slatka pavlaka ili šlag', 'za ukras', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Ispeci koru od 5 jaja, 5 kašika šećera i 6 kašika oraha.'),
    (recipe_id, 2, 'Fil: popari ostatak oraha sa malo mleka, dodaj istopljenu čokoladu, sok i koru pomorandže.'),
    (recipe_id, 3, 'Umuti žumanca sa šećerom na pari dok se ne zgusne, ohladi i dodaj u fil.'),
    (recipe_id, 4, 'Premaži koru, gore stavi šam od belanaca (špinovan šećer) ili šlag.');

    -- RECEPT 8: Oblanda
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Oblanda sa čokoladom', 'Starinski kolač sa korama.', cat_deserti, 40, 20, 10, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'pakovanje oblandi', '1 komad', 0),
    (recipe_id, 'mleko', '1l', 1),
    (recipe_id, 'šećer', '800g', 2),
    (recipe_id, 'margarin/puter', '250g', 3),
    (recipe_id, 'orasi (opciono)', '100g', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Kuvaj mleko sa šećerom oko 1.5 - 2 sata na tihoj vatri dok se ne zgusne (karamelizuje) i promeni boju.'),
    (recipe_id, 2, 'Dodaj margarin da se rastopi. Opciono dodaj orahe.'),
    (recipe_id, 3, 'Maži hrapavu stranu oblande vrućim filom. Pritisni nečim teškim.'),
    (recipe_id, 4, 'Ostavi da se ohladi i stegne pre sečenja.');

    -- RECEPT 9: Čupavci
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Čupavci', 'Meki biskvit u čokoladi i kokosu.', cat_deserti, 40, 30, 8, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'brašno', '300g', 0),
    (recipe_id, 'šećer', '250g', 1),
    (recipe_id, 'jaja', '3 komada', 2),
    (recipe_id, 'mleko + ulje', 'po 100ml', 3),
    (recipe_id, 'kakao', '3 kašike', 4),
    (recipe_id, 'kokosovo brašno', '200g', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Ispeci biskvit od jaja, šećera, brašna, mleka, ulja i praška za pecivo.'),
    (recipe_id, 2, 'Iseci ohlađen biskvit na kocke.'),
    (recipe_id, 3, 'Napravi preliv od prokuvanog mleka, margarina, šećera i kakaa.'),
    (recipe_id, 4, 'Umači kocke u preliv pa valjaj u kokos.');

    -- RECEPT 10: Salčići
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Salčići', 'Lisnato testo sa salom i džemom.', cat_peciva, 120, 20, 8, 'teško', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'svinjsko salo (mleveno)', '300g', 0),
    (recipe_id, 'brašno', '500g', 1),
    (recipe_id, 'žumanca', '3 komada', 2),
    (recipe_id, 'kisela voda', 'po potrebi', 3),
    (recipe_id, 'džem od kajsije', 'za punjenje', 4);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Umesi testo od brašna, žumanaca i vode. Salo očisti od žilica.'),
    (recipe_id, 2, 'Razvij testo, premaži salom, preklopi (kao knjigu). Ostavi 20 min.'),
    (recipe_id, 3, 'Ponovi postupak premazivanja i preklapanja bar 3 puta.'),
    (recipe_id, 4, 'Na kraju razvij, seci kvadrate, stavi džem, preklopi i peci na 200°C.'),
    (recipe_id, 5, 'Vruće uvaljaj u prah šećer.');

    -- RECEPT 11: Kiflice sa sirom
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Kiflice sa sirom', 'Mekane domaće kiflice.', cat_peciva, 60, 20, 8, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'brašno', '1kg', 0),
    (recipe_id, 'sveži kvasac', '1 kocka', 1),
    (recipe_id, 'mleko', '500ml', 2),
    (recipe_id, 'ulje', '200ml', 3),
    (recipe_id, 'sir', '300g', 4),
    (recipe_id, 'jaje', 'za premazivanje', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Aktiviraj kvasac u toplom mleku sa kašičicom šećera. Zamesi testo sa ostalim sastojcima.'),
    (recipe_id, 2, 'Kad naraste, podeli na lopte, razvij u krug i seci trouglove.'),
    (recipe_id, 3, 'Filuj sirom, uvij kiflice.'),
    (recipe_id, 4, 'Premaži jajetom, pospi susamom i peci na 200°C dok ne porumene.');

    -- RECEPT 12: Popara
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Popara', 'Starinski način da se iskoristi stari hleb.', cat_glavna, 5, 10, 2, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'stari hleb', 'pola vekne', 0),
    (recipe_id, 'voda/mleko', '300ml', 1),
    (recipe_id, 'sir', '150g', 2),
    (recipe_id, 'kajmak ili mast', '1 kašika', 3);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Iskidaj hleb na komade.'),
    (recipe_id, 2, 'Prokuvaj vodu/mleko sa mašću/kajmakom.'),
    (recipe_id, 3, 'Dodaj hleb i mešaj dok se ne napravi kaša.'),
    (recipe_id, 4, 'Umešaj izmrvljeni sir.');

    -- RECEPT 13: Svadbarski kupus
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Svadbarski kupus', 'Kupus kuvan u zemljanom loncu satima.', cat_glavna, 60, 240, 10, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'kiseli kupus', '3kg', 0),
    (recipe_id, 'mešano meso (junetina, svinjetina, ovčetina)', '1kg', 1),
    (recipe_id, 'suva rebra/slanina', '500g', 2),
    (recipe_id, 'crni luk', '3 glavice', 3),
    (recipe_id, 'mast', '2 kašike', 4),
    (recipe_id, 'lovorov list, biber u zrnu', 'po želji', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Kupus nareži na krupnije kocke. Meso takođe.'),
    (recipe_id, 2, 'U veliki lonac ređaj red kupusa, red mesa, red suvog mesa. Ponovi.'),
    (recipe_id, 3, 'Zalij vodom da ogrezne, dodaj začine i mast.'),
    (recipe_id, 4, 'Kuvaj na tihoj vatri što duže (bar 4-5 sati), najbolje u zemljanom loncu. Ne mešaj, samo protresi.');

    -- RECEPT 14: Lenja pita
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Lenja pita sa jabukama', 'Pita od prhkog testa.', cat_deserti, 40, 45, 8, 'srednje', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'brašno', '500g', 0),
    (recipe_id, 'mast', '250g', 1),
    (recipe_id, 'šećer', '150g', 2),
    (recipe_id, 'jaja', '2 komada', 3),
    (recipe_id, 'jabuke', '1kg', 4),
    (recipe_id, 'cimet', '1 kašičica', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Umesi prhko testo od brašna, masti, šećera i jaja. Ostavi u frižideru.'),
    (recipe_id, 2, 'Jabuke izrendaj i prodinstaj sa šećerom i cimetom (ocedi višak soka).'),
    (recipe_id, 3, 'Podeli testo na dva dela. Razvij prvi i stavi u pleh.'),
    (recipe_id, 4, 'Sipaj fil od jabuka. Prekrij drugom korom. Izbuši viljuškom.'),
    (recipe_id, 5, 'Peci na 180°C oko 45 min dok ne porumeni.');

    -- RECEPT 15: Bajadera
    INSERT INTO recipes (user_id, title, description, category_id, prep_time, cook_time, servings, difficulty, is_public)
    VALUES (demo_user_id, 'Bajadera', 'Najpoznatiji sitni kolač (bez pečenja).', cat_deserti, 30, 0, 15, 'lako', true)
    RETURNING id INTO recipe_id;
    
    INSERT INTO ingredients (recipe_id, name, quantity, order_index) VALUES
    (recipe_id, 'šećer', '400g', 0),
    (recipe_id, 'voda', '12 kašika', 1),
    (recipe_id, 'margarin', '250g', 2),
    (recipe_id, 'mleveni keks', '300g', 3),
    (recipe_id, 'orasi mleveni', '300g', 4),
    (recipe_id, 'čokolada', '100g (za tamni deo) + 100g (glazura)', 5);
    
    INSERT INTO recipe_steps (recipe_id, step_number, instruction) VALUES
    (recipe_id, 1, 'Ušpinuj šećer i vodu. Dodaj margarin da se istopi.'),
    (recipe_id, 2, 'Skini sa vatre, dodaj keks i orahe. Dobro izmešaj.'),
    (recipe_id, 3, 'Podeli smesu na dva dela. U jedan deo dodaj otopljenu čokoladu.'),
    (recipe_id, 4, 'U pleh prvo stavi tamni deo, poravnaj, pa svetli deo.'),
    (recipe_id, 5, 'Prelij glazurom od čokolade.');

END $$;
