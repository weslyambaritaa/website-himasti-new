# Database Design

## Tabel Utama

```text
users
roles
user_roles
user_divisions
banners
organization_profiles
divisions
division_members
work_programs
news_categories
news
events
documentations
documentation_images
instagram_posts
services
settings
```

## users

```text
id
name
email
email_verified_at
password
remember_token
is_active
created_at
updated_at
```

## roles

```text
id
name
slug
created_at
updated_at
```

Contoh role:

```text
super-admin
admin-umum
admin-divisi
```

## user_roles

```text
id
user_id
role_id
created_at
updated_at
```

## user_divisions

```text
id
user_id
division_id
created_at
updated_at
```

## banners

```text
id
title
subtitle
image
button_text
button_url
order_number
is_shown
created_at
updated_at
deleted_at nullable
```

## organization_profiles

```text
id
organization_name
short_name
description
history
vision
mission
logo
chairman_message
address
email
phone
instagram_url
youtube_url
created_at
updated_at
```

## divisions

```text
id
name
slug
short_name
description
logo
cover_image
order_number
is_active
created_at
updated_at
deleted_at nullable
```

## division_members

```text
id
division_id
name
position
photo
order_number
period
is_active
created_at
updated_at
deleted_at nullable
```

## work_programs

```text
id
division_id
name
slug
cover_image
description
status
year
start_date nullable
end_date nullable
order_number
is_featured
is_published
created_at
updated_at
deleted_at nullable
```

Status program kerja:

```text
planned
ongoing
completed
cancelled
```

## news_categories

```text
id
name
slug
created_at
updated_at
```

## news

```text
id
category_id nullable
author_id nullable
title
slug
cover_image
excerpt
content
status
published_at nullable
view_count default 0
created_at
updated_at
deleted_at nullable
```

Status berita:

```text
draft
published
archived
```

## events

```text
id
title
slug
cover_image
description
location nullable
start_date
end_date nullable
registration_url nullable
status
is_featured
created_at
updated_at
deleted_at nullable
```

Status event:

```text
upcoming
ongoing
completed
cancelled
```

## documentations

```text
id
work_program_id nullable
title
slug
description nullable
event_date
location nullable
cover_image nullable
created_at
updated_at
deleted_at nullable
```

## documentation_images

```text
id
documentation_id
image
caption nullable
order_number
created_at
updated_at
```

## instagram_posts

```text
id
title
image
instagram_url
order_number
is_shown
published_at nullable
created_at
updated_at
```

## services

```text
id
name
description nullable
icon nullable
logo nullable
url
order_number
is_active
created_at
updated_at
```

## settings

```text
id
key
value
created_at
updated_at
```

## Relasi Penting

```text
Division 1 --- N DivisionMember
Division 1 --- N WorkProgram
Documentation 1 --- N DocumentationImage
WorkProgram 1 --- N Documentation
User N --- N Role
User N --- N Division
User 1 --- N News
```

## Catatan Desain

Jangan membuat tabel terpisah seperti:

```text
Ristek
Humas
Kominfo
RistekProker
HumasProker
```

Semua data tersebut harus menggunakan relasi `divisions`, `division_members`, dan `work_programs`.
