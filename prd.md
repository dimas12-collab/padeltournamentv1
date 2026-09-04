# Product Requirements Document (PRD) --- Padel Battle Series V1

**Product:** Padel Battle Series Tournament Management System\
**Version:** 1.0 (MVP)\
**Status:** Ready for Development\
**Organizer:** A Sportaiment\
**Platform:** Responsive Web Application\
**Primary users:** Tournament Organizer, Event Admin, Scorekeeper,
Players, Spectators

------------------------------------------------------------------------

## 1. Product Overview

Padel Battle Series V1 adalah aplikasi web untuk mengelola dan
menampilkan data turnamen padel secara terpusat.

Sistem memiliki dua area utama:

1.  **Public Tournament Website** --- dapat dibuka tanpa login untuk
    melihat event, jadwal, hasil pertandingan, klasemen, tim, dan
    bracket.
2.  **Admin Dashboard** --- digunakan panitia untuk membuat event,
    mengelola peserta, group, court, jadwal, skor, dan data turnamen
    lainnya.

Prinsip utama V1:

> **Admin cukup memasukkan data pertandingan dan skor. Sistem menghitung
> hasil serta klasemen secara otomatis.**

Semua data penting harus memiliki kemampuan CRUD agar kesalahan input
dapat diperbaiki tanpa mengubah database secara manual.

------------------------------------------------------------------------

## 2. Goals

### Primary Goals

-   Menjadi pusat informasi resmi Padel Battle Series.
-   Mengurangi pencatatan tournament melalui spreadsheet/manual.
-   Mempermudah panitia mengelola tim, group, jadwal dan hasil
    pertandingan.
-   Menghasilkan klasemen otomatis berdasarkan hasil pertandingan.
-   Memberikan pengalaman mobile-first kepada pemain dan penonton.
-   Memungkinkan koreksi data dengan aman melalui admin dashboard.
-   Menjadi fondasi untuk multi-event Padel Battle Series berikutnya.

### Non-Goals V1

Belum menjadi prioritas V1:

-   pembayaran online;
-   pendaftaran pemain publik;
-   marketplace;
-   chat;
-   push notification;
-   player ranking lintas event;
-   live point-by-point scoring;
-   aplikasi native iOS/Android.

Fitur tersebut dapat masuk roadmap V2+.

------------------------------------------------------------------------

# 3. Product Architecture

``` text
                         PADEL BATTLE SERIES
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
          PUBLIC WEBSITE                 ADMIN DASHBOARD
                 │                               │
      ┌──────────┼───────────┐          ┌────────┼─────────────┐
      │          │           │          │        │             │
    Event     Schedule   Standings     Event    Teams        Matches
      │          │           │          │        │             │
    Teams      Results     Groups     Groups   Players      Input Score
      │          │           │          │        │             │
   Bracket   Match Detail   Points    Courts   Categories    Results
                 │                               │
                 └──────────────┬────────────────┘
                                │
                           PostgreSQL
                                │
                         Automatic Engine
                                │
                    ┌───────────┴───────────┐
                    │                       │
              Match Calculation      Standings Engine
```

------------------------------------------------------------------------

# 4. User Roles

## 4.1 Super Admin

Akses penuh terhadap seluruh sistem.

Permissions:

-   create/read/update/delete event;
-   manage admin users;
-   manage teams;
-   manage players;
-   manage categories;
-   manage groups;
-   manage courts;
-   manage matches;
-   manage scores;
-   reset/reopen match;
-   manage standings rules;
-   restore deleted data;
-   view audit logs.

## 4.2 Event Admin

Mengelola event yang ditugaskan kepadanya.

Permissions:

-   edit event;
-   CRUD categories;
-   CRUD teams;
-   CRUD players;
-   CRUD groups;
-   CRUD courts;
-   CRUD schedules;
-   CRUD matches;
-   input/edit score;
-   finish/reopen match;
-   recalculate standings.

Tidak dapat mengelola Super Admin.

## 4.3 Scorekeeper

Role khusus petugas pertandingan.

Permissions:

-   melihat match yang diberikan;
-   melihat jadwal;
-   input score;
-   edit score sebelum/berdasarkan permission;
-   finish match.

Tidak dapat menghapus event/team/category.

## 4.4 Viewer

Tidak perlu login.

Dapat melihat seluruh data publik tournament.

------------------------------------------------------------------------

# 5. Public Website

## 5.1 Event Hero

Halaman event harus langsung memperlihatkan identitas Padel Battle
Series.

Contoh:

``` text
PADEL BATTLE SERIES

[Event Edition / Subtitle]

Organized by A Sportaiment

12–14 September 2026
Venue Name

32 Teams • 4 Categories • 48 Matches
```

Hero mendukung:

-   event logo;
-   event name;
-   banner/background;
-   organizer;
-   location;
-   start/end date;
-   event status;
-   jumlah team;
-   jumlah category;
-   jumlah match.

Status:

``` text
UPCOMING
ONGOING
FINISHED
```

### Navigation

``` text
Overview
Schedule
Standings
Teams
Bracket
```

Mobile menggunakan horizontal scroll/tab navigation bila diperlukan.

------------------------------------------------------------------------

# 6. Event Overview

Homepage event menampilkan informasi paling penting.

### Next Match

``` text
NEXT MATCH

Court 1 • 20:00

SMASH BROS
VS
LOBSTER
```

### Live/Ongoing Match

``` text
LIVE

Court 2

TEAM A
VS
TEAM B
```

### Latest Results

``` text
LATEST RESULTS

Smash Bros     2 - 0     Lobster
Team C         2 - 1     Team D
Team E         0 - 2     Team F
```

### Quick Standings

Menampilkan standings group terpilih.

------------------------------------------------------------------------

# 7. Categories

Satu event dapat memiliki banyak kategori.

Contoh:

``` text
Men Bronze
Men Silver
Men Gold
Women Bronze
Women Silver
Women Gold
Mixed
```

Relasi:

``` text
Event
 │
 ├── Category A
 │    ├── Groups
 │    └── Matches
 │
 └── Category B
      ├── Groups
      └── Matches
```

Admin dapat:

-   create;
-   view;
-   edit;
-   duplicate;
-   delete;
-   restore category.

------------------------------------------------------------------------

# 8. Team Management

Team memiliki:

``` text
Team Name
Logo (optional)
Category
Group
Players
Status
Seed Number (optional)
```

Contoh:

``` text
SMASH BROS

Player 1: Dimas
Player 2: Andi

Category: Men Bronze
Group: A
```

V1 mengasumsikan team padel umumnya memiliki dua pemain, tetapi database
tidak boleh mengunci maksimal dua agar fleksibel terhadap kebutuhan
event.

### Admin Actions

``` text
Add Team
View Team
Edit Team
Duplicate Team
Delete Team
Restore Team
Move Group
Change Category
```

------------------------------------------------------------------------

# 9. Player Management

Data minimum:

``` text
Full Name
Team
```

Optional:

``` text
Nickname
Photo
Phone
Email
```

Phone dan email tidak ditampilkan publik secara default.

Admin Actions:

``` text
Add
View
Edit
Delete
Restore
Move Team
```

------------------------------------------------------------------------

# 10. Group Management

Contoh:

``` text
MEN BRONZE

GROUP A
Team A
Team B
Team C
Team D

GROUP B
Team E
Team F
Team G
Team H
```

Admin dapat membuat group secara manual.

### Group Actions

``` text
Create Group
Rename Group
Add Team
Remove Team
Move Team
Delete Group
Restore Group
```

### Optional MVP Enhancement --- Generate Groups

Admin memilih:

``` text
16 Teams
4 Groups
4 Teams per Group
```

Kemudian:

``` text
GENERATE GROUPS
```

Sistem membagi tim secara otomatis.

Admin tetap dapat melakukan koreksi manual setelah generation.

------------------------------------------------------------------------

# 11. Courts

Admin dapat membuat daftar court per event.

Contoh:

``` text
Court 1
Court 2
Court 3
Court 4
```

Fields:

``` text
id
event_id
name
sort_order
status
```

Court dapat dinonaktifkan tanpa menghapus histori pertandingan.

------------------------------------------------------------------------

# 12. Match Management

Match merupakan pusat sistem.

Fields utama:

``` text
Category
Stage
Group
Team A
Team B
Court
Date
Start Time
Status
Winner
Notes
```

Stage:

``` text
GROUP
QUARTER_FINAL
SEMI_FINAL
FINAL
OTHER
```

Status:

``` text
SCHEDULED
LIVE
FINISHED
POSTPONED
CANCELLED
```

------------------------------------------------------------------------

# 13. Match Generator

Untuk group dengan:

``` text
Team A
Team B
Team C
Team D
```

Generate Matches menghasilkan round-robin:

``` text
A vs B
C vs D

A vs C
B vs D

A vs D
B vs C
```

Admin kemudian dapat mengatur:

``` text
Date
Time
Court
```

Semua generated match tetap dapat diedit.

------------------------------------------------------------------------

# 14. Schedule

Public schedule menampilkan:

``` text
SATURDAY — 12 SEPTEMBER

08:00
Court 1
Group A

SMASH BROS
vs
LOBSTER

UPCOMING
```

Filter:

``` text
Category
Group
Date
Court
Status
```

Status filter:

``` text
All
Upcoming
Live
Finished
```

Public schedule wajib mobile-friendly dan lebih mengutamakan cards
daripada tabel lebar.

------------------------------------------------------------------------

# 15. Score Input

Admin/Scorekeeper membuka match.

Contoh:

``` text
SMASH BROS
vs
LOBSTER
```

Input:

``` text
SET 1
Smash Bros    6
Lobster       3

SET 2
Smash Bros    4
Lobster       6

SET 3
Smash Bros   10
Lobster       7
```

Actions:

``` text
Save Draft
Start Match
Finish Match
```

Saat **Finish Match**:

1.  validasi score;
2.  tentukan pemenang;
3.  simpan result;
4.  update match status;
5.  hitung statistik team;
6.  hitung points;
7.  regenerate standings;
8.  public website menampilkan result terbaru.

------------------------------------------------------------------------

# 16. Score Correction

Ini requirement penting V1.

Admin harus dapat memperbaiki pertandingan yang sudah selesai.

Actions:

``` text
Edit Score
Reset Score
Reopen Match
Finish Again
```

Flow:

``` text
Finished Match
      │
      ▼
Reopen Match
      │
      ▼
Edit Score
      │
      ▼
Finish Match
      │
      ▼
Recalculate Standings
```

Klasemen lama tidak boleh tetap digunakan setelah score berubah.

Sistem harus melakukan perhitungan ulang berdasarkan seluruh finished
matches di group terkait.

------------------------------------------------------------------------

# 17. Standings Engine

Standings **tidak diedit manual sebagai sumber utama**.

Data berasal dari finished matches.

Statistik:

``` text
MP  = Matches Played
W   = Wins
L   = Losses
SF  = Sets For
SA  = Sets Against
SD  = Set Difference
GF  = Games For
GA  = Games Against
GD  = Game Difference
PTS = Points
```

Contoh:

    Pos Team               MP   W   L   SF   SA   SD   PTS
  ----- ---------------- ---- --- --- ---- ---- ---- -----
      1 Smash Bros          3   3   0    6    1   +5     9
      2 Lobster             3   2   1    5    3   +2     6
      3 Bandeja Boys        3   1   2    3    5   -2     3
      4 Glass Warriors      3   0   3    1    6   -5     0

------------------------------------------------------------------------

# 18. Points Configuration

Jangan hard-code satu peraturan.

Admin dapat menentukan scoring rule per category/event.

Default sederhana:

``` text
WIN  = 3 PTS
LOSS = 0 PTS
```

Sistem disiapkan agar nantinya dapat mendukung:

``` text
Win 2-0  = 3
Win 2-1  = 2
Loss 1-2 = 1
Loss 0-2 = 0
```

------------------------------------------------------------------------

# 19. Tie Break Rules

Default:

``` text
1. Points
2. Head-to-Head
3. Set Difference
4. Game Difference
5. Games Won
```

Rule harus disimpan sebagai konfigurasi event/category sehingga dapat
dikembangkan tanpa redesign database besar.

Jika dua atau lebih team masih identik setelah seluruh rule, admin harus
mendapatkan indikator bahwa diperlukan keputusan manual/tournament rule
tambahan.

------------------------------------------------------------------------

# 20. Knockout / Bracket

V1 mendukung:

``` text
Quarter Final
Semi Final
Final
```

Contoh:

``` text
QUARTER FINAL       SEMI FINAL          FINAL

A1 ─────┐
        ├──── QF1 Winner ────┐
B2 ─────┘                    │
                             ├──── FINALIST 1 ───┐
B1 ─────┐                    │                   │
        ├──── QF2 Winner ────┘                   │
A2 ─────┘                                        ├── CHAMPION
                                                 │
C1 ─────┐                                        │
        ├──── QF3 Winner ────┐                   │
D2 ─────┘                    │                   │
                             ├──── FINALIST 2 ───┘
D1 ─────┐                    │
        ├──── QF4 Winner ────┘
C2 ─────┘
```

Admin dapat memilih team yang lolos atau menggunakan hasil standings.

Winner dari knockout match otomatis maju ke match berikutnya jika
bracket sudah dikonfigurasi.

------------------------------------------------------------------------

# 21. Public Team Page

Team detail:

``` text
SMASH BROS

Dimas
Andi

Group A
Men Bronze
```

Statistics:

``` text
Played      3
Won         3
Lost        0
Points      9
```

Match History:

``` text
vs Lobster
6-3 / 6-4
WIN

vs Bandeja Boys
6-2 / 4-6 / 10-7
WIN
```

------------------------------------------------------------------------

# 22. Admin Dashboard

Route:

``` text
/admin
```

Sidebar:

``` text
Dashboard
Events
Categories
Teams
Players
Groups
Courts
Matches
Bracket
Users
Audit Logs
Settings
```

Dashboard summary:

``` text
Total Events
Total Teams
Total Matches
Finished Matches
Upcoming Matches
Live Matches
```

Untuk event aktif:

``` text
Today's Matches
Recent Results
Matches Without Court
Matches Without Schedule
```

------------------------------------------------------------------------

# 23. CRUD Requirements

Semua entity penting harus memiliki CRUD.

  Entity        Create   Read   Update   Delete   Restore   Duplicate
  ------------ -------- ------ -------- -------- --------- -----------
  Event           ✓       ✓       ✓        ✓         ✓          ✓
  Category        ✓       ✓       ✓        ✓         ✓          ✓
  Team            ✓       ✓       ✓        ✓         ✓          ✓
  Player          ✓       ✓       ✓        ✓         ✓         ---
  Group           ✓       ✓       ✓        ✓         ✓          ✓
  Court           ✓       ✓       ✓        ✓         ✓         ---
  Match           ✓       ✓       ✓        ✓         ✓          ✓
  Score           ✓       ✓       ✓      Reset      ---        ---
  Admin User      ✓       ✓       ✓        ✓         ✓         ---

Delete untuk data penting menggunakan **soft delete** jika memungkinkan.

------------------------------------------------------------------------

# 24. Safety Against Admin Mistakes

Sistem harus menggunakan confirmation dialog untuk destructive actions.

Contoh:

``` text
Delete Team "Smash Bros"?

Team tidak akan tampil di tournament.
Data dapat dipulihkan melalui Trash.

[Cancel] [Delete Team]
```

Untuk tindakan berdampak besar:

``` text
Reset Match Result?

This will remove the current result and
recalculate Group A standings.

[Cancel] [Reset Result]
```

Tidak boleh ada perubahan standings tanpa perhitungan ulang.

------------------------------------------------------------------------

# 25. Audit Log

Setiap perubahan penting dicatat.

Fields:

``` text
user_id
action
entity_type
entity_id
before_data
after_data
created_at
```

Contoh:

``` text
20:31

Admin changed score

Smash Bros vs Lobster

Set 1:
6-4 → 6-3
```

Audit minimal untuk:

-   score;
-   match status;
-   team;
-   group assignment;
-   schedule;
-   delete/restore;
-   standings/scoring settings.

------------------------------------------------------------------------

# 26. Database Schema

## users

``` text
id
name
email
password_hash / auth_reference
role
created_at
updated_at
deleted_at
```

## events

``` text
id
name
slug
logo_url
banner_url
organizer
venue
description
start_date
end_date
status
created_at
updated_at
deleted_at
```

## categories

``` text
id
event_id
name
slug
scoring_rule
tie_break_rule
created_at
updated_at
deleted_at
```

## groups

``` text
id
category_id
name
sort_order
created_at
updated_at
deleted_at
```

## teams

``` text
id
event_id
category_id
name
logo_url
seed_number
created_at
updated_at
deleted_at
```

## players

``` text
id
team_id
name
nickname
photo_url
phone
email
created_at
updated_at
deleted_at
```

## group_teams

``` text
id
group_id
team_id
created_at
```

Unique constraint:

``` text
(group_id, team_id)
```

## courts

``` text
id
event_id
name
sort_order
is_active
created_at
updated_at
deleted_at
```

## matches

``` text
id
event_id
category_id
group_id
stage
round
team_a_id
team_b_id
court_id
scheduled_at
status
winner_id
next_match_id
next_match_slot
notes
created_at
updated_at
deleted_at
```

## match_sets

``` text
id
match_id
set_number
team_a_score
team_b_score
created_at
updated_at
```

Unique constraint:

``` text
(match_id, set_number)
```

## audit_logs

``` text
id
user_id
action
entity_type
entity_id
before_data JSONB
after_data JSONB
created_at
```

------------------------------------------------------------------------

# 27. Entity Relationship

``` text
EVENT
 │
 ├── CATEGORY
 │     │
 │     ├── GROUP
 │     │     │
 │     │     └── GROUP_TEAMS ─── TEAM
 │     │
 │     └── MATCH
 │            │
 │            └── MATCH_SETS
 │
 ├── TEAM
 │    │
 │    └── PLAYER
 │
 └── COURT
```

Match references:

``` text
MATCH
 ├── Team A
 ├── Team B
 ├── Winner
 ├── Group
 ├── Category
 ├── Court
 └── Match Sets
```

------------------------------------------------------------------------

# 28. Public Routes

``` text
/
```

Event list / active event.

``` text
/e/[eventSlug]
```

Event homepage.

``` text
/e/[eventSlug]/schedule
```

Schedule.

``` text
/e/[eventSlug]/standings
```

Standings.

``` text
/e/[eventSlug]/teams
```

Teams.

``` text
/e/[eventSlug]/teams/[teamId]
```

Team detail.

``` text
/e/[eventSlug]/matches/[matchId]
```

Match detail.

``` text
/e/[eventSlug]/bracket
```

Knockout bracket.

------------------------------------------------------------------------

# 29. Admin Routes

``` text
/admin
/admin/events
/admin/events/new
/admin/events/[eventId]

/admin/events/[eventId]/categories
/admin/events/[eventId]/teams
/admin/events/[eventId]/players
/admin/events/[eventId]/groups
/admin/events/[eventId]/courts
/admin/events/[eventId]/matches
/admin/events/[eventId]/bracket
/admin/events/[eventId]/settings

/admin/users
/admin/audit-logs
```

------------------------------------------------------------------------

# 30. Recommended Tech Stack

## Frontend

``` text
Next.js 16
App Router
TypeScript
Tailwind CSS
shadcn/ui
Lucide Icons
```

## Backend

``` text
Next.js Server Actions / Route Handlers
Drizzle ORM
PostgreSQL
```

## Authentication

``` text
Better Auth
```

Required:

-   login;
-   logout;
-   protected admin routes;
-   role-based access control.

## Validation

``` text
Zod
```

## Deployment

Target:

``` text
GitHub
   ↓
Coolify
   ↓
Docker
   ↓
Hostinger VPS
```

Database:

``` text
PostgreSQL
```

File storage digunakan untuk:

``` text
Event Logo
Event Banner
Team Logo
Player Photo
```

Storage provider harus dibuat interchangeable agar dapat menggunakan
S3-compatible storage/local object storage.

------------------------------------------------------------------------

# 31. UI / Design Direction

Brand direction mengikuti identitas **Padel Battle Series**:

``` text
Dark / Black
Gold / Bronze Accent
White Typography
Premium Sport
Competitive
Modern
```

Namun public website tidak boleh terlalu berat secara visual.

Prioritas:

``` text
Fast
Mobile First
Readable
Clear Score
Clear Schedule
Clear Standings
```

### Public

Sport broadcast / premium tournament feel.

### Admin

Lebih functional:

``` text
Clean
Dense but readable
Fast CRUD
Table + Filters
Minimal animation
```

Admin tidak perlu dibuat seperti poster tournament. Kecepatan
operasional lebih penting.

------------------------------------------------------------------------

# 32. Responsive Requirements

Prioritas viewport:

``` text
Mobile
Tablet
Desktop
```

Public website harus nyaman mulai lebar ±320px.

Standings pada mobile boleh menggunakan horizontal scroll jika seluruh
statistik diperlukan.

Primary actions pada scorekeeper harus memiliki touch target yang cukup
besar untuk penggunaan cepat di venue.

------------------------------------------------------------------------

# 33. Search & Filters

Admin tables minimal mendukung:

``` text
Search
Filter
Sort
Pagination
```

Match:

``` text
Search Team
Category
Group
Court
Date
Status
```

Teams:

``` text
Search Team
Category
Group
```

------------------------------------------------------------------------

# 34. Core Business Rules

1.  Satu team tidak boleh melawan dirinya sendiri.
2.  Team A dan Team B wajib berada pada event/category yang valid.
3.  Group match harus merujuk pada group yang sesuai.
4.  Finished match harus memiliki result valid.
5.  Winner harus merupakan Team A atau Team B.
6.  Standings hanya menghitung match berstatus `FINISHED`.
7.  Cancelled match tidak memengaruhi standings.
8.  Mengubah finished match wajib memicu recalculation.
9.  Menghapus finished match wajib memicu recalculation.
10. Restore finished match wajib memicu recalculation.
11. Public page tidak menampilkan soft-deleted entities.
12. Perubahan scoring rules harus memicu recalculation standings
    terkait.
13. Slug event harus unik.
14. Match scheduling harus memberi warning jika court memiliki jadwal
    bentrok.
15. Sistem sebaiknya memberi warning jika team dijadwalkan pada dua
    match yang overlap.

------------------------------------------------------------------------

# 35. Standings Calculation Flow

``` text
Get Group
    │
    ▼
Get Active Teams
    │
    ▼
Get FINISHED Matches
    │
    ▼
Read Match Sets
    │
    ▼
Calculate:
MP / W / L
SF / SA / SD
GF / GA / GD
PTS
    │
    ▼
Apply Tie Break Rules
    │
    ▼
Sort Teams
    │
    ▼
Return Standings
```

Sumber kebenaran adalah pertandingan dan match sets.

Jika standings di-cache untuk performa, cache harus dapat
dibuang/regenerate setiap ada perubahan result.

------------------------------------------------------------------------

# 36. Match Result Transaction

Saat `Finish Match`, operasi kritis harus dijalankan secara transaction.

``` text
BEGIN

Validate Match
Validate Sets

Update Match Sets
Determine Winner
Update Match Winner
Set Status = FINISHED

Write Audit Log

COMMIT
```

Setelah commit:

``` text
Revalidate / refresh standings
Revalidate public match page
Revalidate event overview
```

Tujuannya mencegah keadaan seperti score tersimpan tetapi match belum
finished atau winner tidak sinkron.

------------------------------------------------------------------------

# 37. Empty & Error States

Contoh public:

``` text
No matches scheduled yet.
```

``` text
Standings will appear after the first completed match.
```

Contoh admin:

``` text
No teams found.

[Add First Team]
```

Error tidak boleh hanya berupa generic server error.

Gunakan pesan yang actionable.

------------------------------------------------------------------------

# 38. V1 Acceptance Criteria

V1 dianggap siap digunakan apabila:

-   Admin dapat login.
-   Admin dapat membuat event Padel Battle Series.
-   Admin dapat upload logo/banner.
-   Admin dapat CRUD category.
-   Admin dapat CRUD team.
-   Admin dapat CRUD player.
-   Admin dapat CRUD group.
-   Admin dapat memasukkan team ke group.
-   Admin dapat CRUD court.
-   Admin dapat CRUD match.
-   Admin dapat membuat schedule.
-   Admin dapat input score per set.
-   Sistem dapat menentukan winner.
-   Sistem dapat menghitung standings otomatis.
-   Admin dapat memperbaiki score pertandingan selesai.
-   Standings berubah otomatis setelah koreksi.
-   Admin dapat reset/reopen match.
-   Sistem mencatat audit log perubahan penting.
-   Public dapat melihat event homepage.
-   Public dapat melihat schedule.
-   Public dapat melihat match result.
-   Public dapat melihat standings.
-   Public dapat melihat teams.
-   Public dapat melihat bracket.
-   Website nyaman digunakan melalui smartphone.
-   Data yang dihapus secara soft-delete dapat direstore.
-   Permission role diterapkan di server, bukan hanya menyembunyikan
    tombol UI.

------------------------------------------------------------------------

# 39. Recommended Development Phases

## Phase 1 --- Foundation

``` text
Project Setup
Database
Drizzle Schema
Authentication
RBAC
Admin Layout
Event CRUD
```

## Phase 2 --- Tournament Data

``` text
Category CRUD
Team CRUD
Player CRUD
Group CRUD
Court CRUD
```

## Phase 3 --- Match Engine

``` text
Match CRUD
Schedule
Match Generator
Score Input
Match Result
Score Correction
Audit Log
```

## Phase 4 --- Standings

``` text
Statistics Engine
Points Rules
Tie Break
Automatic Recalculation
```

## Phase 5 --- Public Website

``` text
Event Hero
Overview
Schedule
Standings
Teams
Match Detail
```

## Phase 6 --- Knockout

``` text
Bracket
Qualification
Winner Progression
Final
Champion
```

## Phase 7 --- QA & Production

``` text
Mobile QA
Permission Testing
Score Calculation Tests
Tie Break Tests
Database Backup
Deployment
```

------------------------------------------------------------------------

# 40. Testing Priorities

Automated tests sangat disarankan untuk logic tournament.

Minimum test cases:

``` text
2-0 Win
2-1 Win
0-2 Loss
1-2 Loss

Multiple teams same points

Head-to-head tie
Set difference tie
Game difference tie

Edit finished score
Reset match
Delete finished match
Restore finished match

Move team between groups

Change scoring rule
```

UI test fokus pada:

``` text
Admin CRUD
Score submission
Mobile standings
Schedule filters
Role permissions
```

------------------------------------------------------------------------

# 41. Suggested Seed Data

Development environment sebaiknya memiliki dummy event:

``` text
PADEL BATTLE SERIES — TEST EVENT
```

Category:

``` text
Men Bronze
```

Groups:

``` text
Group A
Group B
```

Teams:

``` text
Smash Bros
Lobster
Bandeja Boys
Glass Warriors
Padelholic
The Bandejas
Team Seven
Team Eight
```

Tujuannya agar development standings dan bracket dapat langsung diuji.

------------------------------------------------------------------------

# 42. Definition of Done

Sebuah feature dianggap selesai jika:

-   UI selesai;
-   mobile responsive;
-   server validation tersedia;
-   permission diterapkan;
-   database migration tersedia;
-   error state tersedia;
-   destructive action memiliki confirmation;
-   audit log dibuat bila relevan;
-   calculation tests lolos bila feature menyentuh score/standings;
-   tidak ada perubahan data penting yang hanya bergantung pada
    client-side validation.

------------------------------------------------------------------------

# 43. V2 Roadmap

Setelah V1 stabil:

``` text
Public Team Registration
Payment Gateway
QR Event
QR Match / Court
Live Scoring
Realtime WebSocket/SSE Updates
Player Profiles
Player Ranking
Tournament History
Multi-Organizer SaaS
Sponsor Management
Sponsor Rotation
Notifications
WhatsApp Integration
Export PDF
Export Excel
Public Share Cards
Automatic Seeding
Advanced Bracket Types
Double Elimination
Round Robin Variations
Walkover / Retirement Rules
Referee Mode
TV / Big Screen Scoreboard
```

------------------------------------------------------------------------

# 44. Product Vision

V1 bukan sekadar tabel tournament online.

Fondasinya dirancang menjadi:

> **Padel Tournament Management Platform**

Alur ideal di venue:

``` text
ORGANIZER
creates tournament
       │
       ▼
ADMIN
adds teams & schedule
       │
       ▼
SCOREKEEPER
inputs match result
       │
       ▼
SYSTEM
calculates standings
       │
       ▼
PLAYER / SPECTATOR
opens website
       │
       ▼
Schedule • Result • Standings • Bracket
```

Dengan struktur ini, Padel Battle Series dapat menjalankan event pertama
menggunakan MVP, sementara arsitekturnya tetap memungkinkan pengembangan
menjadi platform multi-event yang lebih besar tanpa harus membangun
ulang fondasi utama.
