# Saule ❤️ — Proposal Website

A mobile-first, four-language romantic proposal experience.

## Files

- `index.html` — structure and all screens
- `style.css` — design tokens, glassmorphism, animations
- `translations.js` — every string in Uzbek, Kazakh, Russian, English
- `script.js` — navigation, reveal sequencing, the NO-button chase, confetti/heart burst, music, vibration

## Before you share it

1. **Photo** — drop your photo in as `assets/images/photo.jpg` (any photo works; it's shown on screen 3). Until you add one, a soft placeholder card shows instead.
2. **Music** — drop a quiet romantic piano track in as `assets/music/piano-romance.mp3`. Until you add one, the music button simply does nothing when tapped (no errors).
3. **Names / text** — every sentence lives in `translations.js`, one block per language (`uz`, `kk`, `ru`, `en`). Edit any line there and it updates everywhere it's used.
4. **The question screen** — search `translations.js` for `reveal_question` in each language to change the wording.

## Notes

- Works fully offline once the two Google Fonts load — no build step, no dependencies. Just open `index.html` in a mobile browser, or host the folder anywhere static (Netlify, Vercel, GitHub Pages).
- The NO button dodges the first several taps, then gently turns into the YES button — it doesn't trap the visitor.
- Music, vibration, and confetti only fire after an explicit tap, respecting mobile browser autoplay rules.
- `prefers-reduced-motion` is respected — animations shorten to near-instant for visitors who've set that OS preference.
