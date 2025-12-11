# Kuvaj.me Agent Guide 🤖

Ovaj projekat koristi specijalizovane AI agente kako bi se osigurao kvalitet i brzina razvoja.

## Dostupni Agenti

### 1. 🎨 Frontend Designer (`frontend_designer.md`)
**Kada koristiti:**
-   Kreiranje novih stranica ili komponenti.
-   Stilizovanje (CSS/Tailwind).
-   Poboljšanje UX-a ili animacija.
-   Primer: *"Dizajniraj modernu 'Hero' sekciju za početnu stranu."*

### 2. 🛠️ Backend Architect (`backend_architect.md`)
**Kada koristiti:**
-   Promene u bazi podataka (migracije).
-   Pisanje Server Actions funkcija.
-   Pitanja o sigurnosti (RLS) ili autentifikaciji.
-   Primer: *"Napravi tabelu za 'Meal Plans' i poveži je sa korisnikom."*

### 3. 🥗 Content Expert (`content_expert.md`)
**Kada koristiti:**
-   Pisanje tekstova i recepata.
-   Provera nutritivnih vrednosti.
-   SEO optimizacija.
-   Primer: *"Napiši opis za recept 'Sarma' i dodaj nutritivne vrednosti."*

### 4. 🧪 QA Verifier (`qa_verifier.md`)
**Kada koristiti:**
-   Testiranje funkcionalnosti pre puštanja u rad.
-   Provera "praznih stanja" (empty states).
-   Ažuriranje dokumentacije o testiranju.
-   Primer: *"Proveri da li radi registracija novog korisnika i napravi screenshot."*

## Kako koristiti?
Kada zatražite zadatak, možete eksplicitno navesti agenta (npr. *"@Frontend, sredite mi navbar"*), ili ću ja (Glavni Agent) automatski preuzeti odgovarajuću "ulogu" učitavanjem instrukcija iz `.agent/personas`.
