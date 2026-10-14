# Maison Noor Salon — concept website

A concept business website for a fictional salon (sample prices, placeholder address). Static HTML/CSS/JS, no build step.

## Make it a real client site
- `index.html`: replace the name, address, phone, FAQ copy and remove the concept banner.
- `script.js`: edit `SERVICES` and `HOURS` at the top. Set `WHATSAPP` (digits with country code) so booking requests open a pre-filled WhatsApp message.
- `style.css`: colours and fonts are variables at the top.
- Add real photos only with the client's permission.

## Run / deploy
`python3 -m http.server 8000`, then open http://localhost:8000. Deploy by pushing to GitHub and enabling Pages (Settings → Pages → `main`, root).
