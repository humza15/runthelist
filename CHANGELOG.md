# Changelog

All notable changes to Rounding List are documented here. Dates reflect when a version was deployed.

## 0.4.1 — 2026-07-26
### Bug fixes
- Fixed the NEW/APP tag buttons in the edit-problem screen rendering at full-screen size instead of small pills (a flexbox stretch bug)
- New Day now also clears completed (checked-off) Rounds tasks, so the list doesn't get cluttered with old finished to-dos over a multi-day week
- Fixed the Estimated Discharge Date dropdown getting "stuck" on the originally-picked option (e.g. staying on "Tomorrow" even after that date becomes today) — it now always reflects the actual resolved date on every load
- Discharge Pending items now have their own checkbox to mark resolved, in addition to the remove button
- Added a green card highlight for the Ready state (EDD = Today), matching the existing orange highlight style
- The orange "waiting" icon/card color now triggers only when EDD = Tomorrow specifically — Discharge Pending items no longer affect the status icon

## 0.4.0 — 2026-07-26
### What's new
- Added NEW and APP patient tags, toggled from the edit-problem screen (small colored chips next to the room number)
- Hold the timer button to reset it back to 00:00 (with a confirmation); New Day now also resets all timers automatically
- Editing a to-do/reminder now opens a proper edit screen with priority selection, not just a text prompt
- Fixed the Consult auto-cascade — typing "Consult X" now immediately shows both "Consult called?" and "Recs followed?" checkboxes, without needing to check anything first
- Fixed a scroll-jump bug where the screen would jump after adding or editing a to-do/reminder
- "Discharge Pending" is now a running list you can add multiple items to, instead of a single flag + reason
- Opening a card now automatically collapses any other open card — no more juggling a dozen expanded cards at once (applies to both Rounds and Dispo tabs)
- M.O.I.S.T. discharge checklist checkboxes now align at a consistent height regardless of label length, with a cleaner bold-first-letter style ("**M**eds" instead of a big "M" over "Meds")
- Reminders tab priority chips (High/Medium/Low) are now clickable filters showing only open tasks of that priority
- Added a small "Dispo" button on each Rounds card that jumps straight to that patient's entry on the Dispo tab

### Why 0.4.0
Several items here add new data (patient tags, multi-item pending list) and new interaction patterns (long-press, accordion behavior, cross-tab jump, filterable chips) beyond what a patch release typically covers, consistent with the same reasoning used for 0.3.0.

## 0.3.0 — 2026-07-25
### What's new
- Notes now auto-expand to fit their content instead of scrolling in a fixed box
- Removed the in-app dictate button — use your iPhone keyboard's built-in dictation instead (tap the mic on the keyboard itself)
- The trash icon now opens a Delete vs. Clear choice, each requiring confirmation:
  - **Delete** permanently removes the bed from your list
  - **Clear** resets everything for that bed (rounding/note status, to-dos, notes, timer, dispo info) so it's ready for a new patient in that room
- Dispo tab retitled to "Disposition Overview & Discharge Planning"
- Reminders tab now shows a "Tasks completed today" counter with a progress bar, plus a High/Medium/Low open-task breakdown
- Adding a to-do now opens a small modal with High/Medium/Low priority buttons instead of a plain text prompt — priority shows as a colored dot next to the task

### Why 0.3.0 and not a patch release
This batch adds a new data field (task priority) and two new interaction patterns (the priority-picker modal and the Delete/Clear bed reset flow) rather than just refining existing visuals, so it's a minor version bump rather than a 0.2.x patch.

## 0.2.1 — 2026-07-25
### What's new
- Animated status icon on the Dispo tab, to the left of each patient: sleeping (not ready), jumping (EDD is today), waiting with bags (pending) — shows a dash until an EDD is set
- Rounds progress now shows two color-coded bars: green for rounded, blue for notes completed
- MOIST discharge checklist labels shortened to Meds / Order / Instr. / Summary / Time
- Dispo tab now defaults to room-number order, with a calendar icon in the header to sort by EDD instead
- Share sign-out summary is now a small text link at the bottom instead of a large button
- Simplified the to-do/reminder prompt text
- Rounds header now shows your selected unit name and day instead of a bed count

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
