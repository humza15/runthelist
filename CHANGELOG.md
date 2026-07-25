# Changelog

All notable changes to Rounding List are documented here. Dates reflect when a version was deployed.

## 0.2.0 — 2026-07-25
### What's new
- To-dos and dispo planning are now fully separate: patient to-dos/reminders (e.g. "Obtain CBC at 2PM") live on the Rounds card; dispo planning lives only in the Dispo tab
- Removed swipe-to-toggle entirely — it was too easy to trigger by accident while scrolling
- Rounded/note toggles are now large, clearly labeled buttons instead of small icons
- Cards no longer reorder themselves automatically — a "Sort" button lets you switch between room order and progress order on demand
- Tapping anywhere on a card (including the room number) opens or closes it with a smooth expand animation
- Expanded card shows a big primary-problem banner up top, to-dos/reminders in the middle, and notes (with dictation) at the bottom
- A big, always-visible start/stop timer on every card — no need to open it first
- New Reminders tab: every patient's to-do/reminder list in one place, checkable there too
- Dispo tab: EDD is now a dropdown (Today / Tomorrow / 2–3 days / 3–5 days / pick a date) that resolves to a real calendar date and automatically updates its label as days pass
- Reaching EDD = Today automatically reveals a M.O.I.S.T. discharge checklist (Med rec, Order for DC, Instructions, Summary note, Time for appts) on that patient's dispo card
- Added a PT/OT disposition recommendation dropdown with the date it was recommended
- Added a "pending / awaiting something" flag with a short reason field, shown as a badge on the Dispo tab

## 0.1.0 — 2026-07-24
### What's new
- First build of the app
- Rounds tab: room cards with a stethoscope toggle (rounded) and note toggle, both auto-timestamped
- Swipe a card right to toggle rounded, swipe left to toggle note, without opening it
- Dispo checklist per patient, including a consult tracker that reveals a "recs followed?" item once a consult is checked
- Quick notes with an option to dictate using your phone's microphone
- Start/stop encounter timer per patient, sessions logged and summed for the day
- Reminders strip for time-sensitive to-dos
- Dispo tab: patients sorted by estimated discharge date, with a shareable plain-text sign-out summary
- Fresh-launch screen to resume your current rounding week or start a new one by unit
- Installable as a home screen app (PWA), works offline, no patient names stored, all data stays on your device
