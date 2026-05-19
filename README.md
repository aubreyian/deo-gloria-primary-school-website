# Deo Gloria Primary School Website

Official-style public school website for Deo Gloria Primary School, EMIS 909130154.

## Live website

GitHub Pages deployment target:

https://aubreyian.github.io/deo-gloria-primary-school-website/

## Open locally

Open `index.html` in a browser, or serve the folder with any static web server.

## What is included

- React single-page website using CDN React and Babel
- Premium official homepage with parent-friendly dashboard
- Pages for About, Academics, Admissions, Parents, Learners, Teachers, Announcements, Gallery, Contact, POPIA Privacy Notice and Admin / CMS
- Mobile-friendly navigation
- Safe SVG school illustration with no learner photos or private information
- Password-protected Admin / CMS dashboard for announcements, calendar events, enquiries, documents, FAQs and website settings
- Backend-ready local data structure using browser storage until a database or school system is connected
- GitHub Pages deployment workflow

## Admin / CMS

Open `#admin` from the website navigation, or go directly to `index.html#admin`.

The CMS can:

- Edit public school details such as phone numbers, email placeholder, principal placeholder and office hours
- Add, edit and delete announcements with date, category, audience and urgency
- Add and manage calendar events
- Review admissions enquiries and contact messages
- Mark enquiries as New, In progress or Resolved
- Manage downloadable document names and approved PDF links or file paths
- Manage public FAQs
- Search and filter admin records so staff can find notices, events, enquiries, documents and FAQs quickly
- Confirm before deleting announcements, calendar events, documents or FAQs
- Show validation messages when required information is missing or contact details are not valid
- Automatically refresh homepage notice, event, document and contact-detail sections after saved CMS updates
- Save changes in the current browser using local storage

Temporary local demo password: `DeoGloria@2026`.

This is a static website CMS. Changes saved in the Admin / CMS page are stored only in the browser where they were edited. For all visitors online to see the same changes, the site must be connected later to a hosted database, Google Sheets, Firebase, Supabase or an approved school admin system. Before public launch, replace the demo login with real server-side authentication.

## Privacy

Do not publish learner photos, learner names, ID numbers, reports, medical information, addresses or private information unless written consent is given by the parent/guardian or authorised person.
