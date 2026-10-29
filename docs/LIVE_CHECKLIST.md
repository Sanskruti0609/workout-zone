# Go-live checklist

## Content (owner must verify)
- [ ] Gym name, address, phone number and opening hours are correct
- [ ] Timings and the ladies-only window are correct
- [ ] Membership names, durations and prices entered (until then, the site shows "Contact for Pricing")
- [ ] Trainer names and roles confirmed; trainer photos match the right person
- [ ] Only approved current gym photos are used; each is listed in `images/MANIFEST.md`
- [ ] No old, stock or AI-generated gym interiors, and no placeholder text visible to visitors
- [ ] Google rating and review count are current (edit in Admin > Business)
- [ ] Google Maps link entered (Admin > Business), or the auto-generated directions link tested
- [ ] HYROX, Yoga, Steam, Massage and Supplement descriptions entered only if verified
- [ ] No claims about certifications, results or offers that haven't been confirmed

## Redesign content
- [ ] Gallery has only real photos and videos of the Workout Zone equipment; no other places or stock images
- [ ] Every published review is genuine, and the customer agreed to it (and to their photo, if shown)
- [ ] The timings page shows the correct Saturday and Sunday hours, and the ladies-only window is only on the days it applies
- [ ] The Instagram link (@workoutzone_parel) is the gym's real account
- [ ] Any offer has correct dates, terms and button link, and was previewed on a phone
- [ ] Uploaded files survive a redeploy (persistent disk set up, or re-upload after deploying)

## Security
- [ ] Production `JWT_SECRET` is new, long and random
- [ ] Admin password is 12+ characters and not reused anywhere
- [ ] No `.env` file or secret is committed or shared
- [ ] `NODE_ENV=production` on the backend
- [ ] `FRONTEND_URL` is exactly the live site address
- [ ] The test enquiries and any test admin accounts are removed

## Functionality
- [ ] Every page loads and the mobile menu works on a real phone
- [ ] Enquiry form: success message, error message, and the record appears in Admin
- [ ] Admin: login, logout, edit a trainer, change an enquiry status
- [ ] Phone link dials the correct number; directions link opens the right place
- [ ] Refreshing a deep page (e.g. /memberships) works

## Operations
- [ ] Someone checks Admin > Enquiries regularly (no email/WhatsApp alerts exist yet)
- [ ] A database backup routine is decided and a restore has been tested
- [ ] HTTPS is active on both the site and the API
- [ ] The owner knows how to reset the admin password (`npm run admin:create`)
- [ ] Hosting costs and renewal dates are known to the owner

## Legal / privacy
- [ ] Consider adding a short privacy note near the enquiry form, since it collects names and phone numbers. Ask a qualified person for the wording required for your situation.
