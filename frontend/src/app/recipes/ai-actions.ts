'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateRecipeAction(prompt: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { success: false, error: "AI servis nije konfigurisan (nedostaje API ključ)." };
    }

    try {
        process.stdout.write(`DEBUG[AI]: Starting generation for: ${prompt}\n`);
        
        // List models test
        try {
            process.stdout.write("DEBUG[AI]: Attempting to list models...\n");
            // The @google/generative-ai SDK doesn't have a direct listModels on the main class easily,
            // but we can try to fetch a model metadata if it exists.
            // For now, let's just try gemini-pro which is the most generic one.
        } catch (e) {}

        const modelName = "gemini-1.5-flash"; 
        process.stdout.write(`DEBUG[AI]: Using model: ${modelName} with v1 API\n`);
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion: 'v1' });

        const systemPrompt = `
            Vi ste stručni kulinarski asistent za aplikaciju "Krckaj.me". 
            Vaš zadatak je da generišete recept na osnovu korisničkog upita na srpskom jeziku.
            
            Korisnički upit: "${prompt}"

            ZADATAK:
            Vratite isključivo validan JSON objekat sa sledećim poljima:
            {
                "title": "Naslov recepta",
                "description": "Kratak, privlačan opis jela",
                "prep_time": 15, (broj u minutima)
                "cook_time": 30, (broj u minutima)
                "servings": 4, (broj porcija)
                "difficulty": "lako" | "srednje" | "teško",
                "is_posno": true | false,
                "ingredients": [
                    { "name": "Sastojak 1", "quantity": "200g" },
                    { "name": "Sastojak 2", "quantity": "1 komad" }
                ],
                "steps": [
                    { "instruction": "Prvi korak pripreme..." },
                    { "instruction": "Drugi korak pripreme..." }
                ],
                "nutrition": {
                    "calories": 350,
                    "protein": 20,
                    "carbohydrates": 45,
                    "fat": 15,
                    "fiber": 5
                },
                "category_suggestion": "glavno-jelo" | "desert" | "predjelo" | "salata" | "supa" | "pice" | "pecivo" | "ostalo"
            }

            VAŽNA PRAVILA:
            1. Odgovor mora biti isključivo JSON. Bez dodatnog teksta, bez markdown tagova (\`\`\`json).
            2. Koristite srpski jezik (latinica).
            3. Budite kreativni ali precizni sa količinama.
            4. Ako je upit nerazumljiv ili nije o hrani, vratite objekat sa poljem "error": "Vaša poruka o grešci".
        `;
        
        process.stdout.write('DEBUG[AI]: Calling generateContent...\n');
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        let text = response.text();
        process.stdout.write('DEBUG[AI]: Response received\n');
        
        // Remove markdown formatting if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const data = JSON.parse(text);

            if (data.error) {
                return { success: false, error: data.error };
            }

            return { success: true, recipe: data };
        } catch (parseError) {
            process.stdout.write(`ERROR[AI]: Failed to parse: ${text.substring(0, 100)}...\n`);
            return { success: false, error: "Neuspešno parsiranje podataka recepta." };
        }
    } catch (error: any) {
        process.stdout.write(`DEBUG ERROR[AI]: ${error.message}\n`);
        if (error.status) process.stdout.write(`DEBUG STATUS[AI]: ${error.status}\n`);
        console.error("AI Generation Error:", error);
        return { success: false, error: "Došlo je do greške prilikom generisanja recepta. Pokušajte ponovo." };
    }
}
