# Ysterberg Public Primary School Website

Official-style public school website for Ysterberg Public Primary School, EMIS 909132013.

Live site: https://aubreyian.github.io/deo-gloria-primary-school-website/

## Included

- Permanent Ysterberg school profile details
- Mobile-friendly React single-page website
- Home, About Us, Academics, Subjects, Learners, Parents, Staff Portal, Governance, Gallery, Contact, Privacy and Admin / CMS pages
- Admin / CMS for notices, events, documents, FAQs and enquiries
- POPIA privacy language for school forms and learner images
- Google Sheets CMS template support
- Image gallery system with optional Unsplash and Pexels search
- Local fallback SVG images and AI-style placeholder mode

## Admin / CMS

Open `#admin` from the website navigation.

Temporary demo password: `Ysterberg@2026`

## Google Sheets CMS

CMS spreadsheet:
https://docs.google.com/spreadsheets/d/13mpsSoVSLcVda8ey0vWtN7zX3JraPNtAe6NBqrBGj3k

To connect it officially, paste `google-apps-script/Code.gs` into Apps Script in the Sheet, set a private `ADMIN_TOKEN`, deploy as a Web App, and add the Web App URL/token in the Admin settings.

## Image APIs

The public site includes `image-config.js`:

```js
window.YSTERBERG_IMAGE_CONFIG = {
  UNSPLASH_KEY: "",
  PEXELS_KEY: ""
};
```

Leave keys blank for local fallback placeholders. Add provider keys only if the school accepts that browser-side keys are visible to visitors.

## Privacy

Do not publish learner photos, learner names, ID numbers, reports, medical information, addresses or private information unless written consent is given by the parent/guardian or authorised person.
