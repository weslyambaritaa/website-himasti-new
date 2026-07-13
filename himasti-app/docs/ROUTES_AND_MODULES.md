# Routes and Modules

## Public Routes

```text
GET /
GET /profil
GET /berita
GET /berita/{slug}
GET /event
GET /event/{slug}
GET /dokumentasi
GET /dokumentasi/{slug}
GET /divisi
GET /divisi/{slug}
```

## Authentication Routes

```text
GET /admin/login
POST /admin/login
POST /admin/logout
```

## Admin Routes

Semua route berikut harus menggunakan middleware autentikasi:

```text
GET /admin/dashboard
RESOURCE /admin/banners
RESOURCE /admin/news
RESOURCE /admin/events
RESOURCE /admin/divisions
RESOURCE /admin/division-members
RESOURCE /admin/work-programs
RESOURCE /admin/documentations
RESOURCE /admin/instagram-posts
RESOURCE /admin/services
RESOURCE /admin/users
GET/PUT /admin/profile
GET/PUT /admin/settings
```

## Modul Frontend Publik

```text
LandingPage
ProfilePage
NewsIndexPage
NewsDetailPage
EventIndexPage
EventDetailPage
DocumentationIndexPage
DocumentationDetailPage
DivisionIndexPage
DivisionDetailPage
```

## Modul Admin

```text
AdminDashboard
BannerManagement
OrganizationProfileManagement
NewsManagement
EventManagement
DivisionManagement
DivisionMemberManagement
WorkProgramManagement
DocumentationManagement
InstagramPostManagement
ServiceManagement
UserManagement
SettingsManagement
```
