# Moonveil Oracle

Static GitHub Pages MVP for an overseas English-language fortune-telling site.

## What This Site Does

- Free tarot-style oracle reading
- Optional zodiac sign and birth date
- Three-card spread
- Example readings for Love, Career, and Personal Growth
- Lucky signs and mini ritual
- Short first result with deeper reflection below
- Three-step ritual section
- Loading ceremony before the reading is revealed
- Save and copy buttons for the reading
- AI-generated hero background image at `assets/moonveil-hero.png`

This version is intentionally static so it can launch with no domain and no server.

## Run Locally

Open `index.html` directly in your browser.

For example:

```text
C:\Users\hachi\OneDrive\Documents\New project\index.html
```

## Publish With GitHub Pages

GitHub Pages hosts static HTML, CSS, and JavaScript files directly from a repository.

1. Create a GitHub repository.
2. Upload these files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `assets/moonveil-hero.png`
   - `privacy.html`
   - `terms.html`
3. Go to repository `Settings` -> `Pages`.
4. Set source to the `main` branch and root folder.
5. GitHub will publish a free URL like:

```text
https://yourname.github.io/repository-name/
```

Official docs: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages

## AI Image Prompts

See `image-prompts.md` for ready-to-use prompts for the hero background, a more surreal oracle altar, and a subtle paper texture.

## Add AI Later

Do not put an OpenAI API key in browser JavaScript.

When the site starts getting traffic, add one of these:

- PHP backend on shared hosting
- Cloudflare Worker
- Netlify Function
- Vercel serverless function

Then the browser sends the reading inputs to that backend, and the backend calls the AI API securely.

## Safety Positioning

Keep the site framed as entertainment and reflection only.

Avoid claims like:

- Guaranteed love
- Guaranteed money
- Guaranteed healing
- Guaranteed contact from a specific person
- Medical, legal, financial, or safety advice

Use claims like:

- A reflective oracle reading
- Tarot-style prompts
- Zodiac timing
- Journaling guidance
- Entertainment reading
