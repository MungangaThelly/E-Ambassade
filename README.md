# e-Ambassade

En modern Next.js-applikation för enkla och snabba ambassadörbokningar.

## Funktioner

- 🔐 **Autentisering**: Säker användarregistrering och inloggning med NextAuth
- 📅 **Bokningssystem**: Enkelt bokningsformulär med datumväljare och tidsval
- 👥 **Användardashboard**: Mina bokningar och personlig profil
- 🏢 **Admin-panel**: Statistik och hantering av alla bokningar
- 🔔 **Notifikationer**: E-post och SMS-notifikationer
- 📱 **Responsiv design**: Optimerad för mobile, tablet och desktop

## Tech Stack

- **Frontend**: React 18, Next.js 14
- **Styling**: Tailwind CSS
- **Autentisering**: NextAuth.js
- **Database**: Supabase
- **HTTP-klient**: Axios

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
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Startsida
│   └── globals.css               # Global CSS
├── components/                   # React-komponenter
│   ├── Navbar.js
│   ├── Footer.js
│   ├── BookingForm.js
│   ├── BookingStatus.js
│   ├── AdminDashboard.js
│   └── NotificationBell.js
├── lib/                          # Utility-funktioner
│   ├── supabase.js              # Supabase-klient
│   ├── auth.js                  # Autentiseringsfunktioner
│   ├── bookings.js              # Bokningsfunktioner
│   └── notifications.js         # Notifikationsfunktioner
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

### Valfria variabler:

- `SENDGRID_API_KEY` - För e-postnotifikationer
- `TWILIO_*` - För SMS-notifikationer

## Database Schema

### Tabeller

**users**
- id (UUID)
- email (varchar)
- name (varchar)
- role (varchar: 'user' | 'admin')
- created_at (timestamp)
- updated_at (timestamp)

**bookings**
- id (UUID)
- user_id (UUID, FK)
- date (date)
- time (time)
- service_type (varchar)
- status (varchar: 'pending' | 'confirmed' | 'completed' | 'cancelled')
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)

**notifications**
- id (UUID)
- user_id (UUID, FK)
- type (varchar: 'email' | 'sms')
- subject (varchar)
- message (text)
- status (varchar: 'sent' | 'failed' | 'pending')
- created_at (timestamp)

## API Endpoints

### Autentisering
- `POST /api/auth/signin` - Logga in
- `POST /api/auth/signout` - Logga ut
- `POST /api/auth/callback` - NextAuth callback

### Bokningar
- `GET /api/bookings` - Hämta bokningar
- `POST /api/bookings` - Skapa bokning
- `GET /api/bookings/[id]` - Hämta bokningsdetaljer
- `PATCH /api/bookings/[id]` - Uppdatera bokning
- `DELETE /api/bookings/[id]` - Radera bokning

### Notifikationer
- `POST /api/notifications` - Skicka notifikation

### Admin
- `GET /api/admin` - Hämta admin-statistik

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
