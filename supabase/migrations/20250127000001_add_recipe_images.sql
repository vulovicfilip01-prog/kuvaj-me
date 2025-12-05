-- Update svih recepata sa Unsplash slikama
-- Koristi kvalitetne stock fotografije sa Unsplash-a

DO $$
BEGIN
    -- Ćevapi
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&h=600&fit=crop' 
    WHERE title = 'Ćevapi';
    
    -- Sarma
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1609501676725-7186f017a4b7?w=800&h=600&fit=crop' 
    WHERE title = 'Sarma';
    
    -- Musaka
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop' 
    WHERE title = 'Musaka sa krompirom';
    
    -- Pečena paprika
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&h=600&fit=crop' 
    WHERE title = 'Pečena paprika sa sirom';
    
    -- Đuveč
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=800&h=600&fit=crop' 
    WHERE title = 'Đuveč';
    
    -- Šopska salata
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop' 
    WHERE title = 'Šopska salata';
    
    -- Prebranac
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1596040033229-a0b55ee2cad9?w=800&h=600&fit=crop' 
    WHERE title = 'Prebranac';
    
    -- Karađorđeva šnicla
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&h=600&fit=crop' 
    WHERE title = 'Karađorđeva šnicla';
    
    -- Ajvar
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&h=600&fit=crop' 
    WHERE title = 'Ajvar';
    
    -- Pasulj čorba
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop' 
    WHERE title = 'Pasulj čorba';
    
    -- Pljeskavica
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop' 
    WHERE title = 'Pljeskavica';
    
    -- Gibanica
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop' 
    WHERE title = 'Gibanica';
    
    -- Punjene paprike
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&h=600&fit=crop' 
    WHERE title = 'Punjene paprike';
    
    -- Proja
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop' 
    WHERE title = 'Proja';
    
    -- Punjena tikvica
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1597078217319-16993fb070dc?w=800&h=600&fit=crop' 
    WHERE title = 'Punjena tikvica';
    
    -- Roštilj kobasice
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1612392062798-2407b7f9d574?w=800&h=600&fit=crop' 
    WHERE title = 'Roštilj kobasice';
    
    -- Kajgana
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&h=600&fit=crop' 
    WHERE title = 'Kajgana';
    
    -- Kompir salata
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1588013273468-315fd88ea34c?w=800&h=600&fit=crop' 
    WHERE title = 'Kompir salata';
    
    -- Kupus salata
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=800&h=600&fit=crop' 
    WHERE title = 'Kupus salata';
    
    -- Podvarak
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop' 
    WHERE title = 'Podvarak';
    
    -- Pita sa sirom
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&h=600&fit=crop' 
    WHERE title = 'Pita sa sirom';
    
    -- Ruska salata
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&h=600&fit=crop' 
    WHERE title = 'Ruska salata';
    
    -- Krofne
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop' 
    WHERE title = 'Krofne';
    
    -- Palačinke
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop' 
    WHERE title = 'Palačinke';
    
    -- Pečurke na žaru
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop' 
    WHERE title = 'Pečurke na žaru';
    
    -- Sataraš
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1607621916823-039d38e00878?w=800&h=600&fit=crop' 
    WHERE title = 'Sataraš';
    
    -- Srpska čorba
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&h=600&fit=crop' 
    WHERE title = 'Srpska čorba';
    
    -- Paradajz čorba
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' 
    WHERE title = 'Paradajz čorba';
    
    -- Pita sa jabukama
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&h=600&fit=crop' 
    WHERE title = 'Pita sa jabukama';
    
    -- Krompir paprikaš
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop' 
    WHERE title = 'Krompir paprikaš';
    
    -- Pilav
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=800&h=600&fit=crop' 
    WHERE title = 'Pilav';
    
    -- Punjena vešalica
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop' 
    WHERE title = 'Punjena vešalica';
    
    -- Pečeno pile
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop' 
    WHERE title = 'Pečeno pile';
    
    -- Teleća čorba
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop' 
    WHERE title = 'Teleća čorba';
    
    -- Reform torta
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop' 
    WHERE title = 'Reform torta';
    
    -- Supa od povrća
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=600&fit=crop' 
    WHERE title = 'Supa od povrća';
    
    -- Uštipci
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1612201142855-966d1f46e7ad?w=800&h=600&fit=crop' 
    WHERE title = 'Uštipci';
    
    -- Pečena riba
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=600&fit=crop' 
    WHERE title = 'Pečena riba';
    
    -- Šopska salata sa tunjevinom
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop' 
    WHERE title = 'Šopska salata sa tunjevinom';
    
    -- Kiseljačka čorba
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1588566565463-180a5b2090d2?w=800&h=600&fit=crop' 
    WHERE title = 'Kiseljačka čorba';
    
    -- Kačamak
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop' 
    WHERE title = 'Kačamak';
    
    -- Pogača sa sirom
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop' 
    WHERE title = 'Pogača sa sirom';
    
    -- Punjene tikvice sa sirom
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1597078217319-16993fb070dc?w=800&h=600&fit=crop' 
    WHERE title = 'Punjene tikvice sa sirom';
    
    -- Baklava
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&h=600&fit=crop' 
    WHERE title = 'Baklava';
    
    -- Tufahija
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=800&h=600&fit=crop' 
    WHERE title = 'Tufahija';
    
    -- Hurmasice
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop' 
    WHERE title = 'Hurmasice';
    
    -- Vanilice
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&h=600&fit=crop' 
    WHERE title = 'Vanilice';
    
    -- Pasuljara
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1596040033229-a0b55ee2cad9?w=800&h=600&fit=crop' 
    WHERE title = 'Pasuljara';
    
    -- Cicvara
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop' 
    WHERE title = 'Cicvara';
    
    -- Mantije
    UPDATE recipes SET image_url = 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=600&fit=crop' 
    WHERE title = 'Mantije';

    RAISE NOTICE 'Uspešno ažurirano % recepata sa Unsplash slikama.', (SELECT COUNT(*) FROM recipes WHERE image_url IS NOT NULL);
END $$;
