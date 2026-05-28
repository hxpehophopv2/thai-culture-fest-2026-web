# KMUTT ROOTED: Thai Sustainable Culture Fest 2026

Welcome to the codebase that somehow survived the Vue.js reactivity system. This is the official web application for the KMUTT ROOTED 2026 event happening at the Science Learning Space, KMUTT. We basically forced traditional Thai culture onto a modern tech stack to see what would happen.

## What It Actually Does (Features)

- LINE LIFF Authentication: Because making users remember another password is a terrible idea. We just casually borrow their LINE profile data instead.
- Activity Booking: A robust reservation system to stop people from cloning themselves and booking overlapping LABs and STAGEs.
- Digital Passport & QR: Scan a QR code, get a virtual stamp. It is like collecting items in a game, but for Thai culture workshops.
- Bilingual Support: Seamlessly switch between Thai and English. We are international like that.
- Unnecessary Smooth Animations: We spent way too much time making things bounce, stagger, and fade using GSAP instead of writing unit tests.

## Under The Hood (Tech Stack)

- Vue 3 (Composition API)
- Vue Router
- GSAP (GreenSock Animation Platform)
- Lucide Vue & Boxicons
- LINE LIFF SDK

Strictly developed on Linux using a terminal with no GUI, because real developers just stare at text all day. If you try to run this on Windows, whatever breaks is your own fault.

## Folder Structure

```
src/
|-- assets/          # CSS files that we promise we will refactor later
|-- components/      # The reusable Vue parts that are probably tightly coupled
|-- composables/     # Where the actual brain of the app lives (useAuth, useUserData)
|-- data/            # Hardcoded stuff like zonesData.js
|-- services/        # The API fetchers that occasionally yell at you in the console
|-- views/           # The main pages (Home, Register, Profile, Activities)
|-- router/          # The bouncer that checks if you are actually logged in via LINE
```

## How To Run (Good luck)

1. Clone this repository to your local machine.
2. Run the holy command to fetch half the internet into your hard drive:
   npm install
3. Create a .env file and put your secrets in there.
   VITE_LIFF_ID=your_liff_id_here
   VITE_API_BASE_URL=your_api_endpoint
4. Start the dev server:
   npm run dev
5. If it crashes, delete node_modules and try again. That usually works lol.

## The Blame List (Authors)

- Teeruch Songtalay (Hope)
- Jeerayut Rattanamanee (Leaf)

Copyright 2026 KMUTT ROOTED Team. Or not, just do not steal our API keys.
