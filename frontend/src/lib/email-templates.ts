/**
 * Base email template for Kuvaj.me
 */
export const baseEmailTemplate = (content: string, title: string = "Kuvaj.me") => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Outfit', 'Inter', Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #F8FAFC; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #556B2F 0%, #3D4D22 100%); padding: 40px 20px; text-align: center; }
        .logo { color: #FFB800; font-size: 28px; font-weight: bold; text-decoration: none; letter-spacing: -0.5px; }
        .content { padding: 40px 30px; }
        .footer { background-color: #F8FAFC; padding: 30px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0; }
        .button { display: inline-block; padding: 12px 24px; background-color: #556B2F; color: #ffffff !important; text-decoration: none; rounded: 8px; font-weight: bold; margin-top: 20px; border-radius: 12px; }
        .recipe-card { border: 1px solid #E2E8F0; border-radius: 16px; padding: 20px; margin-bottom: 20px; background-color: #FFFFFF; }
        .recipe-title { color: #1E293B; font-size: 18px; font-weight: bold; margin-bottom: 8px; display: block; text-decoration: none; }
        .recipe-rating { color: #FFB800; font-weight: bold; }
        h1 { color: #1E293B; font-size: 24px; margin-bottom: 20px; }
        p { margin-bottom: 15px; }
        .divider { height: 1px; background-color: #E2E8F0; margin: 30px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="https://kuvaj.me" class="logo">Kuvaj.me</a>
            <div style="color: #ffffff; font-size: 14px; margin-top: 8px; opacity: 0.8;">Tvoja digitalna knjiga recepata</div>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Kuvaj.me. Sva prava zadržana.</p>
            <p>Primiš ovaj e-mail jer si prijavljen na naš newsletter. Ukoliko više ne želiš da primaš vesti, možeš se <a href="#" style="color: #556B2F;">odjaviti ovde</a>.</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Weekly Digest Template
 */
export const weeklyDigestTemplate = (recipes: any[]) => {
    const recipesHtml = recipes.map(r => `
        <div class="recipe-card">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${r.id}" class="recipe-title">${r.title}</a>
            <div style="margin: 10px 0; font-size: 14px; color: #64748B;">
                Ocena: <span class="recipe-rating">★ ${r.average_rating || 'Nema ocena'}</span>
            </div>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/recipes/${r.id}" class="button" style="font-size: 14px; padding: 8px 16px;">Vidi recept</a>
        </div>
    `).join('');

    return baseEmailTemplate(`
        <h1>Nedeljni kuvar: Najbolje sa trpeze 🥗</h1>
        <p>Zdravo! Pogledaj recepte koji su obeležili proteklu nedelju na našoj platformi. Možda pronađeš inspiraciju za današnji ručak!</p>
        <div class="divider"></div>
        ${recipesHtml}
        <div class="divider"></div>
        <p>Srećno kuvanje,<br>Tim Kuvaj.me</p>
    `, "Nedeljni kuvar 🥗");
};
