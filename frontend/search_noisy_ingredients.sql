SELECT name, count(*) FROM ingredients WHERE name ILIKE '%1/2%' OR name ILIKE '%(1)%' GROUP BY name ORDER BY count DESC LIMIT 20;
