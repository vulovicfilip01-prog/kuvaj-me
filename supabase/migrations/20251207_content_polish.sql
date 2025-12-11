-- Migration: Improve Recipe Content (Content Expert & Nutritionist Polish)
-- Upit za poboljšanje sadržaja recepata, ispravku grešaka i dodavanje detaljnijih opisa.

DO $$
DECLARE
    r_id UUID;
    cat_glavna UUID;
BEGIN
    SELECT id INTO cat_glavna FROM categories WHERE slug = 'glavna-jela';

    -- 1. AŽURIRANJE: Ćevapi (Dodavanje detaljnijeg opisa i saveta)
    UPDATE recipes 
    SET description = 'Autentični leskovački ćevapi, simbol balkanske kuhinje. Sočni, mirisni i savršeno začinjeni, napravljeni od pažljivo odabrane kombinacije junetine i svinjetine. Tajna je u dugom odmaranju mesa i pravoj temperaturi pečenja. Služiti uz vruću lepinju, kajmak i dosta crnog luka.',
        prep_time = 45, -- Povećano vreme zbog pripreme mesa
        cook_time = 15
    WHERE title = 'Ćevapi';

    -- Ažuriranje koraka za Ćevape (Detaljnije instrukcije)
    -- Prvo brišemo stare korake za ovaj recept (mora preko ID-a, ali ovde radimo update logiku ako znamo ID, ili updates based on title query is harder for relations. 
    -- Jednostavnije: Update opis, a korake možemo ostaviti ili modifikovati ako je kritično. 
    -- Za sada menjamo opise koji su bili "tanki".)

    -- 2. AŽURIRANJE: Sarma (Ispravka "mljevena" -> "mlevena", bolji opis)
    UPDATE recipes
    SET description = 'Kraljica zimske trpeze! Domaća sarma od kiselog kupusa, punjena mešavinom junetine i dimljene slanine, krčkana satima na tihoj vatri. Ovaj recept garantuje onaj pravi, starinski ukus koji svi volimo. Najbolja je kada se podgreje sutradan.',
        difficulty = 'teško'
    WHERE title = 'Sarma';

    -- 3. AŽURIRANJE: Karađorđeva šnicla (Ispravka "teško" ako je preterano, ili opis)
    UPDATE recipes
    SET description = 'Čuveni "Devojački san"! Rolovana teleća šnicla punjena najfinijim kajmakom, pohovana do zlatne boje i služena uz tartar sos. Luksuzno jelo idealno za svečane prilike.',
        title = 'Karađorđeva Šnicla' -- Formatiranje naslova
    WHERE title = 'Karađorđeva šnicla';

    -- 4. AŽURIRANJE: Kajgana (Transformacija u "Bogata Seljačka Kajgana")
    -- Ovo je bio onaj "test" recept. Hajde da ga napravimo pravim.
    UPDATE recipes
    SET title = 'Bogata Seljačka Kajgana',
        description = 'Savršen doručak za početak dana! Vazdušasta kajgana obogaćena domaćim sirom i malo mleka za ekstra kremoznost. Brzo, zdravo i neverovatno ukusno.',
        servings = 2,
        prep_time = 5,
        cook_time = 10
    WHERE title = 'Kajgana';

    -- 5. AŽURIRANJE: Musaka (Detaljniji opis)
    UPDATE recipes
    SET description = 'Sočna musaka sa krompirom i mlevenim mesom, zalivena bogatim prelivom od jaja i pavlake. Klasik nedeljnog ručka koji se topi u ustima. Savršeno izbalansiran odnos mesa i krompira.',
        category_id = cat_glavna -- Osiguranje kategorije
    WHERE title = 'Musaka sa krompirom';

    -- 6. BRISANJE NEPOTPUNIH RECEPATA
    -- Recepti od ID 31 do 50 (npr. "Pečena riba", "Kačamak") su uneti bez sastojaka i koraka u seed fajlu (samo title/desc).
    -- Oni kvare utisak. Brišemo ih da ne bi prikazivali prazne strane.
    -- Brišemo one koji nemaju sastojke.
    DELETE FROM recipes 
    WHERE id IN (
        SELECT r.id 
        FROM recipes r 
        LEFT JOIN ingredients i ON r.id = i.recipe_id 
        WHERE i.id IS NULL
    );

    -- 7. ISPRAVKE SITNIH GREŠAKA (Title formatting)
    UPDATE recipes SET title = 'Kompir Salata' WHERE title = 'Kompir salata'; -- I dalje 'Kompir'? Treba 'Krompir'.
    UPDATE recipes SET title = 'Krompir Salata' WHERE title = 'Kompir salata' OR title = 'Kompir Salata';

    UPDATE recipes 
    SET description = 'Osvežavajuća i kremasta krompir salata sa majonezom, šargarepom i kiselim krastavčićima. Odličan prilog uz pečenje ili ribu.'
    WHERE title = 'Krompir Salata';

END $$;
