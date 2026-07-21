# e-Ambassade

En modern Next.js-applikation för enkla och snabba konsulära bokningar för
RDC-ambassaden i Sverige och Skandinavien.

## Funktioner

- 🔐 **Autentisering**: Säker användarregistrering och inloggning med NextAuth
- 📅 **Bokningssystem**: Enkelt bokningsformulär med datumväljare och tidsval
- 👥 **Användardashboard**: Mina bokningar och personlig profil
- 🏢 **Admin-panel**: Statistik och hantering av alla bokningar
- 🔔 **Notifikationer**: Automatiska e-postnotifikationer och statusuppdateringar
- 🌐 **Flerspråkigt stöd**: Franska, svenska och engelska
- 🧾 **Språkpreferens**: Sparas per användare i profilen
- 📱 **Responsiv design**: Optimerad för mobile, tablet och desktop

## Tech Stack

- **Frontend**: React 18, Next.js 14
- **Styling**: Tailwind CSS
- **Autentisering**: NextAuth.js
- **Database**: Supabase
- **E-post**: Resend
- **HTTP-klient**: Axios
- **Internationalisering**: Egen i18n-lösning med lokala och server-side översättningar

## Installation

1. Klona repositoriet:
```bash
git clone <repository-url>
cd e-ambassade
```

2. Installera beroenden:
```bash
npm install
```

3. Konfigurera miljövariabler:
```bash
cp .env.local.example .env.local
# Redigera .env.local med dina värden
```

4. Starta utvecklingsservern:
```bash
npm run dev
```

Öppna [http://localhost:3000](http://localhost:3000) i din webbläsare.

## Projektstruktur

```
e-ambassade/
├── app/                          # Next.js App Router
│   ├── api/                      # API-routes
│   ├── auth/                     # Autentiseringssidor
│   ├── dashboard/                # Användardashboard
│   ├── admin/                    # Admin-panel
│   ├── booking/                  # Bokningssida
│   ├── providers.js              # Session + språkprovider
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Startsida
│   └── globals.css               # Global CSS
├── components/                   # React-komponenter
│   ├── Navbar.js
│   ├── Footer.js
│   ├── BookingForm.js
│   ├── BookingStatus.js
│   ├── AdminDashboard.js
│   ├── NotificationBell.js
│   ├── LanguageSwitcher.js
│   ├── DashboardShell.js
│   └── AdminShell.js
├── lib/                          # Utility-funktioner
│   ├── supabase.js              # Supabase-klient
│   ├── auth.js                  # Autentiseringsfunktioner
│   ├── bookings.js              # Bokningsfunktioner
│   ├── notifications.js         # Notifikationsfunktioner
│   ├── resend.js                # Resend-klient
│   └── i18n/                    # Språk och översättningar
│       ├── translations.js
│       ├── language-context.js
│       └── server.js
├── app/api/profile/              # Profil och språkpreferens
├── lib/emails/                   # E-postmallar
├── types/                        # TypeScript-types
│   └── index.ts
├── middleware.js                 # NextAuth middleware
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.local                    # Miljövariabler (inte committa)

## Miljövariabler

Se `.env.local` för alla nödvändiga miljövariabler.

### Krävda variabler:

- `NEXT_PUBLIC_SUPABASE_URL` - Din Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Din Supabase anonyma nyckel
- `SUPABASE_SERVICE_ROLE_KEY` - Din Supabase service role nyckel
- `NEXTAUTH_SECRET` - En hemlig nyckel för NextAuth
- `NEXTAUTH_URL` - Din applikations URL
- `RESEND_API_KEY` - API-nyckel för e-postutskick via Resend

### Valfria variabler:

- `AUTH_SECRET` - Alternativ hemlig nyckel för NextAuth

## Database Schema

### Tabeller

**profiles**
- user_id (UUID, FK)
- full_name (varchar)
- email (varchar)
- phone (varchar)
- role (varchar: 'user' | 'admin')
- preferred_language (varchar: 'fr' | 'sv' | 'en')
- created_at (timestamp)
- updated_at (timestamp)

**bookings**
- id (UUID)
- user_id (UUID, FK)
- appointment_date (date)
- appointment_time (time)
- service_type (varchar)
- full_name (varchar)
- email (varchar)
- phone (varchar)
- passport_number (varchar)
- message (text)
- status (varchar: 'pending' | 'confirmed' | 'completed' | 'cancelled')
- created_at (timestamp)
- updated_at (timestamp)

**notifications**
- id (UUID)
- user_id (UUID, FK)
- title (varchar)
- message (text)
- read (boolean)
- created_at (timestamp)
- updated_at (timestamp)

## API Endpoints

### Autentisering
- `GET /api/auth/[...nextauth]` - NextAuth auth routes
- `POST /api/auth/[...nextauth]` - NextAuth auth routes

### Bokningar
- `GET /api/bookings` - Hämta bokningar
- `POST /api/bookings` - Skapa bokning
- `GET /api/bookings/[id]` - Hämta bokningsdetaljer
- `PATCH /api/bookings/[id]` - Uppdatera bokning

### Notifikationer
- `GET /api/notifications` - Hämta användarens notifikationer
- `POST /api/notifications` - Skapa notifikation
- `PATCH /api/notifications` - Markera som läst

### Profil
- `GET /api/profile` - Hämta profil och språkpreferens
- `PATCH /api/profile` - Uppdatera språkpreferens

### Admin
- `GET /api/admin` - Hämta admin-statistik
- `GET /api/admin/bookings` - Hämta alla bokningar
- `GET /api/admin/bookings/[id]` - Hämta en bokning
- `PATCH /api/admin/bookings/[id]` - Uppdatera bokningsstatus
- `GET /api/admin/users` - Hämta användare

## Utvikling

### Bygga för produktion
```bash
npm run build
```

### Starta produktionsserver
```bash
npm start
```

### Linting
```bash
npm run lint
```

## Bidrag

Bidrag är välkomna! Vänligen öppna en issue eller pull request.

## Licens

MIT
