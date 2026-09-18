# DaySpring Centre England

A responsive, accessible website for DaySpring Centre Limited, built with semantic HTML, CSS and a small amount of vanilla JavaScript. No framework, runtime dependency or database is required.

## Website

Production: https://dayspring-centre-england-levi-b251.vercel.app

21 pages cover the homepage, services, adult support, young adults, children and families, community support, consultancy, about, referrals, careers, safeguarding, contact, England-wide coverage, complaints, privacy, cookies, accessibility, equality, terms, modern slavery and the custom 404 page.

## Editing

The complete static HTML is checked in and deploys as-is. Shared styles are in `assets/style.css`; interactions are in `assets/app.js`. `tools/build.py` contains the page templates and content. After changing this generator, run `python tools/build.py` to regenerate the HTML. Direct HTML edits should also be reflected in the generator to avoid losing them on regeneration.

Preview with `python -m http.server 4173`, then open http://localhost:4173. Use an HTTP server rather than opening HTML directly because internal paths are rooted at `/`.

## Deployment

Use Vercel's Other/static preset, no build command, output directory `.`. All served assets are local except Google Fonts. `vercel.json` configures response security headers. No API keys belong in browser JavaScript or in this repository.

## Enquiries and referrals

Telephone contact is operational through `tel:+447519560119`. Email links use the owner-provided `dayspringcentre@dayspringcentre.co.uk`. The enquiry planners generate a local summary, with a download option and a mailto link that opens a draft in the visitor's email application. The visitor must review and send the email there. The website does **not** submit enquiries server-side and must not be represented as a secure referral portal.

Before enabling server-side submissions, configure delivery/storage; agree the detailed privacy notice, retention, permissions, anti-spam and secure referral handling. Do not send sensitive care records or CVs to an unverified third-party form endpoint. See `LAUNCH-NOTES.md`.

## Content and images

Content is based on the supplied DaySpring PRD with England-wide coverage prioritised. Childcare registration EY552018 is described separately from adult support and independent consultancy. No ratings, testimonials, staff identities, partnerships or current vacancies have been invented. Images are AI-generated illustrations and disclosed as illustrative in the footer. See `asset-notes.md`.
