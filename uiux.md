# UI/UX Specification V1 — Padel Battle Series

**Product:** Padel Battle Series Tournament Management System  
**Version:** 1.0  
**Scope:** Public Tournament Website + Admin Dashboard  
**Organizer:** A Sportaiment  
**Primary Device:** Mobile-first untuk public, desktop-first responsive untuk admin

---

# 1. Tujuan Dokumen

Dokumen ini menjadi panduan tampilan dan pengalaman pengguna untuk implementasi **Padel Battle Series V1**.

Gunakan bersama:

```text
PRD_Padel_Battle_Series_V1.md
```

PRD menjelaskan fitur dan business rules. Dokumen ini menjelaskan:

- layout halaman;
- hierarchy informasi;
- component pattern;
- posisi tombol;
- form;
- tabel;
- cards;
- filter;
- modal;
- error/empty state;
- responsive behavior;
- workflow admin dan public.

---

# 2. Design Direction

Padel Battle Series menggunakan **LIGHT THEME sebagai default dan tampilan utama**.

Tidak menggunakan dark UI sebagai identitas utama.

Target visual:

```text
Clean
Bright
Premium
Sporty
Modern
Airy
Easy on the eyes
High readability
```

Inspirasi rasa visual:

```text
Premium sports management platform
Tournament dashboard modern
Minimal editorial sport layout
```

Bukan:

```text
Dark gaming dashboard
Neon esports interface
Heavy black backgrounds
Overuse gradient
```

---

# 3. Color System

## 3.1 Primary Tokens

```text
Background Main      : #F8F7F4
Background White     : #FFFFFF
Surface Secondary    : #F2F1ED
Border               : #E6E3DC

Text Primary         : #181818
Text Secondary       : #6F6B63
Text Muted           : #9B978F

Gold Primary         : #B98A4A
Gold Soft            : #D6B98C
Gold Background      : #F6EFE4
```

Semantic colors:

```text
Success              : Green
Warning              : Amber
Danger               : Red
Info                  : Blue
```

Gunakan semantic design tokens pada code.

Jangan hard-code warna yang sama berulang-ulang di banyak component.

---

# 4. Typography

Recommended:

```text
UI / Body:
Geist
Inter

Alternative:
Manrope
```

Heading:

```text
700 / Bold
```

Body:

```text
400–500
```

Scores:

```text
600–700
Tabular numbers jika tersedia
```

Tujuan utama adalah readability.

---

# 5. Public UX Principles

Halaman publik harus menjawab empat hal dalam beberapa detik:

```text
Event apa?
Saya main kapan?
Hasil pertandingan bagaimana?
Klasemennya bagaimana?
```

Prioritas navigasi:

```text
Overview
Schedule
Standings
Teams
Bracket
```

Tidak perlu login untuk public website.

---

# 6. Admin UX Principles

Admin dashboard dipakai saat kondisi turnamen bisa ramai.

Karena itu interface harus:

```text
Fast
Predictable
Low cognitive load
Easy to correct
Clear status
Minimal unnecessary animation
```

Semua data penting harus mudah:

```text
Create
Read
Edit
Delete
Restore
```

Tindakan berisiko selalu menggunakan confirmation.

---

# 7. Global Public Header

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ PADEL BATTLE SERIES       Overview Schedule Standings Teams │
│                                               Bracket        │
└──────────────────────────────────────────────────────────────┘
```

Style:

```text
Background white
Bottom border subtle
Sticky optional
Logo left
Navigation right
```

Mobile:

```text
┌──────────────────────────────┐
│ PADEL BATTLE SERIES      ☰   │
└──────────────────────────────┘
```

Pada event page gunakan sticky tabs:

```text
Overview | Schedule | Standings | Teams | Bracket
```

Mobile:

```text
horizontal scroll
```

---

# 8. Event Hero

Route:

```text
/e/[eventSlug]
```

Hero tidak menggunakan background hitam penuh.

Gunakan:

```text
Off-white / warm gray background
Subtle gold decorative shape
Event logo
Optional event banner/image
```

Desktop:

```text
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│ PADEL BATTLE SERIES                      [Event Logo]       │
│                                                             │
│ 12–14 September 2026                                       │
│ Venue Name                                                  │
│                                                             │
│ 32 Teams • 4 Categories • 48 Matches                       │
│                                                             │
│ [ONGOING]                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Hero dapat memiliki gold accent line atau subtle geometric pattern.

Jangan menggunakan gold berlebihan.

---

# 9. Event Overview

Urutan:

```text
Next Match
Live Match
Latest Results
Quick Standings
Event Information
```

## 9.1 Next Match Card

```text
┌─────────────────────────────────────┐
│ NEXT MATCH                          │
│                                     │
│ Group A • Court 1                   │
│ 20:00                               │
│                                     │
│ SMASH BROS                          │
│              VS                     │
│ LOBSTER                             │
│                                     │
│ [View Match]                        │
└─────────────────────────────────────┘
```

Style:

```text
White card
Thin border
Small shadow
Rounded 12–16px
```

---

# 10. Latest Result

```text
┌──────────────────────────────────────────┐
│ LATEST RESULTS                           │
├──────────────────────────────────────────┤
│ Smash Bros       2 - 0        Lobster    │
│ Team C           2 - 1        Team D     │
│ Team E           0 - 2        Team F     │
└──────────────────────────────────────────┘
```

Winner menggunakan:

```text
font-weight lebih kuat
```

Tidak perlu menggunakan warna berlebihan.

---

# 11. Schedule Page

Route:

```text
/e/[eventSlug]/schedule
```

Desktop:

```text
Schedule

[Category ▼] [Date ▼] [Court ▼] [Status ▼]

Saturday, 12 September
```

Card:

```text
┌─────────────────────────────────────┐
│ 08:00                      Court 1  │
│ Group A                             │
│                                     │
│ Smash Bros                          │
│          VS                         │
│ Lobster                             │
│                                     │
│ UPCOMING                            │
└─────────────────────────────────────┘
```

Finished:

```text
┌─────────────────────────────────────┐
│ 09:00                      Court 2  │
│ Group A                             │
│                                     │
│ Smash Bros                    2     │
│ Lobster                       0     │
│                                     │
│ 6-3 / 6-4                           │
│ FINISHED                            │
└─────────────────────────────────────┘
```

Mobile filters tampil sebagai:

```text
[Filter]
```

yang membuka bottom sheet.

---

# 12. Standings Page

Route:

```text
/e/[eventSlug]/standings
```

Top:

```text
Standings

[Men Bronze ▼]

Group A | Group B | Group C
```

Desktop table:

```text
┌─────┬─────────────────┬────┬───┬───┬────┬────┬────┬─────┐
│ POS │ TEAM            │ MP │ W │ L │ SF │ SA │ SD │ PTS │
├─────┼─────────────────┼────┼───┼───┼────┼────┼────┼─────┤
│ 1   │ Smash Bros      │ 3  │ 3 │ 0 │ 6  │ 1  │ +5 │ 9   │
│ 2   │ Lobster         │ 3  │ 2 │ 1 │ 5  │ 3  │ +2 │ 6   │
└─────┴─────────────────┴────┴───┴───┴────┴────┴────┴─────┘
```

Table style:

```text
White surface
Soft row separator
No heavy borders
Header light gray
PTS emphasized
```

Mobile recommendation:

```text
1   Smash Bros                9 PTS
    MP 3 • W 3 • L 0 • SD +5
```

Dengan option switch:

```text
Compact | Full Table
```

Full table dapat horizontal scroll.

---

# 13. Teams Page

Route:

```text
/e/[eventSlug]/teams
```

Filters:

```text
Search
Category
Group
```

Team Card:

```text
┌─────────────────────────────┐
│ [Team Logo]                 │
│                             │
│ SMASH BROS                  │
│                             │
│ Dimas                       │
│ Andi                        │
│                             │
│ Men Bronze • Group A        │
└─────────────────────────────┘
```

Desktop:

```text
3–4 cards per row
```

Mobile:

```text
1 card per row
```

---

# 14. Team Detail

Header:

```text
[Logo]

SMASH BROS
Men Bronze • Group A
```

Player section:

```text
Players

Dimas
Andi
```

Stats cards:

```text
Played      3
Wins        3
Losses      0
Points      9
```

Match history:

```text
WIN
Smash Bros vs Lobster
6-3 / 6-4
```

---

# 15. Match Detail

```text
Group A

Court 1
12 September • 20:00

SMASH BROS
     VS
LOBSTER
```

Finished:

```text
                SET 1    SET 2    SET 3
Smash Bros         6        4       10
Lobster            3        6        7

SMASH BROS WIN
2 - 1
```

Score table menggunakan white surface dengan subtle border.

---

# 16. Bracket Page

Desktop:

```text
QUARTER FINAL      SEMI FINAL       FINAL

Team A ──┐
         ├── Team A ─────┐
Team B ──┘               │
                         ├── TEAM A ── CHAMPION
Team C ──┐               │
         ├── Team C ─────┘
Team D ──┘
```

Background tetap terang.

Connector lines:

```text
Light gray
```

Winner:

```text
Gold highlight
```

Mobile:

```text
Horizontal scroll
```

---

# 17. Admin Layout

Desktop:

```text
┌─────────────────────────────────────────────────────────────┐
│ PBS ADMIN                                      Admin ▼     │
├──────────────┬──────────────────────────────────────────────┤
│ Dashboard    │                                              │
│ Events       │                                              │
│ Categories   │               PAGE CONTENT                   │
│ Teams        │                                              │
│ Players      │                                              │
│ Groups       │                                              │
│ Courts       │                                              │
│ Matches      │                                              │
│ Bracket      │                                              │
│ Audit Logs   │                                              │
│ Settings     │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

Admin colors:

```text
Main background: warm light gray
Sidebar: white
Content cards: white
Text: charcoal
Selected sidebar item: light gold background
Primary button: gold/bronze
Danger button: red
```

Jangan gunakan sidebar hitam.

---

# 18. Admin Dashboard Home

Header:

```text
Dashboard

Padel Battle Series
```

Cards:

```text
┌──────────────┐
│ Teams        │
│ 32           │
└──────────────┘

┌──────────────┐
│ Matches      │
│ 48           │
└──────────────┘

┌──────────────┐
│ Finished     │
│ 18           │
└──────────────┘

┌──────────────┐
│ Live         │
│ 2            │
└──────────────┘
```

Additional sections:

```text
Today's Matches
Recent Results
Pending Setup
```

Pending setup:

```text
3 matches without court
2 matches without time
1 team without group
```

---

# 19. Standard Admin Table

Contoh Teams:

```text
Teams                                        [+ Add Team]

[Search team...] [Category ▼] [Group ▼]

┌────┬───────────────┬───────────┬─────────┬──────────┐
│ #  │ Team          │ Category  │ Group   │ Actions  │
├────┼───────────────┼───────────┼─────────┼──────────┤
│ 1  │ Smash Bros    │ Bronze    │ A       │ •••      │
└────┴───────────────┴───────────┴─────────┴──────────┘
```

Actions:

```text
View
Edit
Duplicate
Delete
```

Soft deleted:

```text
Restore
Delete Permanently
```

---

# 20. Admin Event Form

```text
Event Information

Event Name *
Slug *
Organizer
Venue
Description

Start Date *
End Date *

Status
[Upcoming ▼]

Branding
[Upload Logo]
[Upload Banner]

[Cancel] [Save Event]
```

Form style:

```text
White card
Label above input
44px+ input height
Clear required indicator
Inline validation
```

---

# 21. Team Form

```text
Team Name *

Category *
Group

Team Logo

Players

Player 1 [________________]
Player 2 [________________]

[+ Add Player]

Seed Number

[Cancel] [Save Team]
```

Team dapat disimpan tanpa group.

---

# 22. Group Management

Recommended desktop:

```text
GROUP A                         GROUP B

┌────────────────┐             ┌────────────────┐
│ Smash Bros     │             │ Team E         │
│ Lobster        │             │ Team F         │
│ Bandeja Boys   │             │ Team G         │
│ Glass Warriors │             │ Team H         │
└────────────────┘             └────────────────┘
```

Actions:

```text
+ Add Group
Assign Team
Move Team
Rename
Delete
```

Drag and drop optional.

Harus tetap tersedia action menu agar fungsi tidak bergantung pada drag-and-drop.

---

# 23. Match Admin List

```text
Matches                                      [+ Add Match]

[All] [Upcoming] [Live] [Finished]

[Category ▼] [Group ▼] [Court ▼] [Date ▼]

┌────────┬────────────────────────┬─────────┬──────────┬────────┐
│ Time   │ Match                  │ Court   │ Status   │ Action │
├────────┼────────────────────────┼─────────┼──────────┼────────┤
│ 08:00  │ Smash vs Lobster       │ Court 1 │ Upcoming │ •••    │
└────────┴────────────────────────┴─────────┴──────────┴────────┘
```

Actions:

```text
Open Match
Edit
Edit Schedule
Input Score
Duplicate
Delete
```

Finished:

```text
View Result
Edit Score
Reopen Match
Reset Result
```

---

# 24. Match Form

```text
Category *
Stage *
Group

Team A *
Team B *

Court
Date
Start Time

Notes

[Cancel] [Save Match]
```

Validation:

```text
Team A cannot be the same as Team B.
```

Conflict warning:

```text
⚠ Court 1 already has another match at 20:00.
```

Team warning:

```text
⚠ Smash Bros has another match around this time.
```

---

# 25. Scorekeeper UI

Score input adalah salah satu halaman terpenting.

Harus nyaman digunakan dari HP/tablet.

```text
┌─────────────────────────────────┐
│ Group A • Court 1               │
│                                 │
│ SMASH BROS      VS     LOBSTER  │
├─────────────────────────────────┤
│             SMASH    LOBSTER    │
│ SET 1        [6]       [3]      │
│ SET 2        [4]       [6]      │
│ SET 3       [10]       [7]      │
├─────────────────────────────────┤
│ [Save Draft]                    │
│                                 │
│ [Finish Match]                  │
└─────────────────────────────────┘
```

Score inputs:

```text
Large
Centered
Numeric
High contrast
```

Buttons minimum height:

```text
44–48px
```

---

# 26. Finish Match Confirmation

Saat klik Finish Match:

```text
Finish this match?

Smash Bros
2

Lobster
1

Winner:
SMASH BROS

Please confirm the result before publishing.

[Back]
[Finish Match]
```

Setelah finish:

```text
✓ Match completed

Standings have been recalculated.
```

---

# 27. Edit Finished Score

Admin klik:

```text
Edit Score
```

Warning banner:

```text
You are editing a finished match.

Changing this result will recalculate Group A standings.
```

Setelah save:

```text
Confirm Score Change

Old Result
Smash Bros 2 - 0 Lobster

New Result
Smash Bros 2 - 1 Lobster

[Cancel]
[Update & Recalculate]
```

---

# 28. Reset Match Modal

```text
Reset match result?

Smash Bros vs Lobster

This action will:
• remove the current score
• remove the winner
• change match status
• recalculate Group A standings

The change will be recorded in Audit Log.

[Cancel]
[Reset Result]
```

Danger action harus memiliki visual berbeda dari primary action.

---

# 29. Delete Confirmation

```text
Delete Team?

Smash Bros will no longer appear in the tournament.

The team can be restored from Trash.

[Cancel]
[Delete Team]
```

Untuk permanent delete:

```text
Permanent Delete

This cannot be undone.

Type:
DELETE

[Cancel]
[Delete Permanently]
```

Hanya untuk role yang berhak.

---

# 30. Toasts

Success:

```text
Team created successfully.
```

```text
Match updated.
```

```text
Standings recalculated.
```

Error:

```text
Unable to save score.
Please check the input and try again.
```

Toast tidak digunakan sebagai satu-satunya tempat untuk menjelaskan error penting.

---

# 31. Empty States

Teams:

```text
No teams yet.

Add the first team to start setting up this event.

[Add Team]
```

Schedule:

```text
No matches scheduled yet.
```

Standings:

```text
Standings will appear after the first completed match.
```

Bracket:

```text
Knockout bracket has not been generated yet.
```

---

# 32. Loading States

Gunakan:

```text
Skeleton cards
Skeleton table rows
Button spinner
```

Jangan mengubah seluruh halaman menjadi blank spinner jika tidak perlu.

---

# 33. Search and Filter UX

Tables:

```text
Search
Filter
Sort
Pagination
```

Matches:

```text
Search team
Category
Group
Court
Date
Status
```

Filter yang aktif ditampilkan sebagai chips:

```text
Group A ×
Court 1 ×
Finished ×
```

Button:

```text
Clear Filters
```

---

# 34. CRUD Interaction Standard

Create:

```text
Primary button top-right:
+ Add Team
```

Edit:

```text
Row action → Edit
```

Delete:

```text
Row action → Delete
→ confirmation
```

Restore:

```text
Trash view
→ Restore
```

Duplicate:

```text
Row action → Duplicate
```

Duplicated item:

```text
Smash Bros Copy
```

harus masuk edit mode sebelum final save jika perlu.

---

# 35. Audit Log UI

```text
Audit Logs

[User ▼] [Action ▼] [Entity ▼] [Date ▼]

20:31
Admin Dimas
Updated Match Score

Smash Bros vs Lobster

Set 1:
6-4 → 6-3
```

Expandable detail:

```text
View Changes
```

JSON mentah tidak dijadikan default tampilan.

---

# 36. Role Permission UI

User management:

```text
Name
Email
Role
Assigned Event
Status
Actions
```

Roles:

```text
Super Admin
Event Admin
Scorekeeper
```

Scorekeeper optional assignment:

```text
All Courts
Court 1
Court 2
Specific Matches
```

V1 minimum cukup role-level access; granular court assignment dapat dikembangkan bila waktu memungkinkan.

---

# 37. Navigation Protection

Admin yang tidak memiliki permission:

- menu terkait tidak ditampilkan;
- direct URL access tetap harus diblokir server-side.

Unauthorized page:

```text
You don't have permission to access this page.

[Back to Dashboard]
```

---

# 38. Light Theme Rules

Agar UI nyaman digunakan lama:

```text
Do not use pure white #FFFFFF for every large background.
```

Gunakan warm off-white:

```text
#F8F7F4
```

Cards:

```text
#FFFFFF
```

Gunakan border lembut untuk separation.

Jangan terlalu mengandalkan shadow.

Gold hanya digunakan untuk:

```text
Primary CTA
Active navigation
Winner highlight
Selected state
Small accents
```

Jangan menjadikan seluruh card berwarna gold.

---

# 39. Accessibility

Minimum:

```text
Readable contrast
Keyboard-focus visible
Buttons have labels
Icons not used without accessible names
Inputs have labels
Error messages linked to fields
```

Jangan menggunakan warna sebagai satu-satunya indikator status.

Contoh:

```text
● LIVE
```

bukan hanya titik merah tanpa teks.

---

# 40. Mobile Bottom Actions

Pada scorekeeper mobile, action penting dapat sticky di bawah:

```text
┌──────────────────────────────┐
│ [Save Draft] [Finish Match]  │
└──────────────────────────────┘
```

Pastikan tidak tertutup browser safe-area.

---

# 41. Page Width

Public:

```text
max-width sekitar 1200–1280px
```

Admin:

```text
fluid
```

dengan content padding yang konsisten.

Forms:

```text
jangan terlalu lebar.
```

Recommended:

```text
640–800px
```

untuk form biasa.

---

# 42. Component Library

Gunakan shadcn/ui sebagai base.

Recommended components:

```text
Button
Card
Badge
Tabs
Table
Input
Textarea
Select
Dialog
AlertDialog
DropdownMenu
Sheet
Drawer
Popover
Command
Tooltip
Toast / Sonner
Skeleton
Pagination
Breadcrumb
```

Komponen harus dibungkus menjadi design system Padel Battle Series, bukan digunakan dengan styling acak per halaman.

---

# 43. Core Reusable Components

Recommended:

```text
<EventHero />
<EventStatusBadge />

<MatchCard />
<MatchScore />
<MatchStatusBadge />

<StandingsTable />
<GroupTabs />

<TeamCard />

<AdminPageHeader />
<DataTable />
<FilterBar />

<DeleteDialog />
<RestoreDialog />

<ScoreEditor />
<ScoreConfirmation />

<AuditLogItem />
```

---

# 44. Suggested Admin Flow

Setup event:

```text
Login
 ↓
Create Event
 ↓
Create Categories
 ↓
Add Teams + Players
 ↓
Create Groups
 ↓
Assign Teams
 ↓
Create Courts
 ↓
Generate/Create Matches
 ↓
Set Schedule
 ↓
Tournament Ready
```

During event:

```text
Admin Dashboard
 ↓
Today's Matches
 ↓
Open Match
 ↓
Input Score
 ↓
Finish Match
 ↓
Standings Auto Update
```

Correction:

```text
Match History
 ↓
Open Finished Match
 ↓
Edit / Reopen
 ↓
Correct Score
 ↓
Confirm
 ↓
Recalculate
 ↓
Audit Log
```

---

# 45. Public Flow

```text
Open Event
 ↓
Event Overview
 ↓
Schedule
 ↓
Match Detail
 ↓
Standings
 ↓
Bracket
```

User tidak boleh dipaksa kembali ke homepage untuk pindah antar halaman event.

---

# 46. Acceptance Criteria UI/UX

UI V1 dianggap sesuai jika:

- menggunakan light theme;
- tidak memiliki dark main layout;
- public mobile nyaman digunakan;
- schedule dapat dibaca cepat;
- standings tidak membingungkan pada mobile;
- score input nyaman dari tablet/phone;
- semua CRUD utama mudah ditemukan;
- destructive action memiliki confirmation;
- edit score memberikan warning;
- standings recalculation diinformasikan;
- empty/loading/error state tersedia;
- admin navigation konsisten;
- tombol primary konsisten;
- gold tidak digunakan berlebihan;
- public dan admin terlihat sebagai satu brand;
- WCAG readability dasar diperhatikan.

---

# 47. Visual Summary

Target final:

```text
PADEL BATTLE SERIES

LIGHT
PREMIUM
SPORTY
CLEAN

White / Warm Off-white
        +
Gold / Bronze Accent
        +
Charcoal Typography
        +
Simple Cards
        +
Clear Tournament Data
```

Tujuan akhirnya:

> Pemain dapat menemukan jadwal dan klasemen dalam hitungan detik, sementara panitia dapat mengelola tournament sepanjang hari tanpa UI yang melelahkan mata.
