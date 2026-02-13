<p align="center">
  <h1 align="center">Eventia</h1>
  <p align="center">
    <strong>Plateforme Événementielle Professionnelle</strong>
  </p>
  <p align="center">
    Une application full-stack moderne pour la gestion et la réservation d'événements professionnels — conférences, séminaires, formations et ateliers.
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

---

## Table des Matières

- [Aperçu du Projet](#-aperçu-du-projet)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture & Stack Technique](#-architecture--stack-technique)
- [Structure du Projet](#-structure-du-projet)
- [Prérequis](#-prérequis)
- [Installation & Configuration](#-installation--configuration)
- [Lancement du Projet](#-lancement-du-projet)
- [Variables d'Environnement](#-variables-denvironnement)
- [Documentation API](#-documentation-api)
- [Système d'Emails](#-système-demails)
- [Tests](#-tests)
- [Déploiement Docker](#-déploiement-docker)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Contributeurs](#-contributeurs)
- [Licence](#-licence)

---

## Aperçu du Projet

**Eventia** est une plateforme événementielle complète conçue pour les entreprises et les professionnels. Elle permet de parcourir, réserver et gérer des événements (formations, workshops, conférences, networking) avec un design premium et une expérience utilisateur soignée.

L'application est composée de deux parties principales :
- **Backend** — API REST construite avec NestJS, MongoDB et Mongoose
- **Frontend** — Application web moderne avec Next.js 16, React 19 et TailwindCSS

---

## Fonctionnalités

### Authentification & Sécurité
- Inscription et connexion sécurisées avec hash bcrypt
- Authentification basée sur **JWT httpOnly cookies** (Access Token + Refresh Token)
- Rotation automatique des tokens via le mécanisme de refresh
- Protection **RBAC** (Role-Based Access Control) avec deux rôles : `ADMIN` et `PARTICIPANT`
- **Rate limiting** global (Throttler) et par endpoint pour la protection contre les attaques brute-force
- Sécurisation des en-têtes HTTP via **Helmet**
- Validation des données avec `class-validator` et **Zod** côté frontend
- Protection **CORS** configurée

### Gestion des Événements
- Création, modification et suppression d'événements (ADMIN)
- Catégories d'événements : `Formation`, `Workshop`, `Conférence`, `Networking`
- Statuts d'événements : `DRAFT`, `PUBLISHED`, `CANCELED`
- Filtrage par catégorie et statut
- Affichage des événements à venir
- Détails complets : titre, description, date, heure, lieu, prix, image, capacité maximale
- Support des événements gratuits et payants

### Système de Réservation
- Réservation d'événements par les participants authentifiés
- Workflow complet de statuts : `PENDING` → `CONFIRMED` / `REJECTED` / `CANCELED`
- Génération automatique de numéros de tickets uniques
- Vérification de la capacité maximale et prévention des doublons
- Annulation de réservation par l'utilisateur ou l'administrateur
- Consultation de l'historique des réservations personnelles

### Génération de Billets PDF
- Génération de billets au format PDF avec un design premium
- Code QR intégré contenant les informations de la réservation
- Design professionnel avec couleurs gold/noir et typographie soignée
- Téléchargement direct depuis l'application

### Notifications par Email
- Email de bienvenue à l'inscription
- Notification de réservation en attente
- Confirmation de réservation avec billet PDF en pièce jointe
- Notification de rejet de réservation
- Notification d'annulation de réservation
- Templates HTML professionnels avec Handlebars

### Tableau de Bord Administrateur
- **Dashboard Analytics** avec statistiques clés :
  - Revenu total du mois (avec tendance vs mois précédent)
  - Nombre d'événements actifs
  - Total des réservations confirmées
  - Nombre total d'utilisateurs
- **Graphiques interactifs** (Recharts) :
  - Évolution du revenu (Area Chart)
  - Statistiques des réservations (Bar Chart)
- Gestion complète des événements (CRUD)
- Gestion des réservations : confirmer, rejeter, annuler
- Gestion des utilisateurs

### Pro fil Utilisateur
- Consultation et modification du profil
- Changement de mot de passe sécurisé
- Visualisation des réservations personnelles

### Interface Utilisateur Premium
- Design moderne avec palette gold (#C5A059) et dark (#1A1A1A)
- Landing page avec sections : Hero, À propos, Événements, Témoignages, Contact
- Animations fluides avec **Framer Motion**
- Icônes professionnelles avec **Lucide React**
- Composants réutilisables (ConfirmModal, Toast, CustomSelect, EventCard, SearchInput)
- Design responsive et mobile-friendly
- Navigation conditionnelle (public / admin)
- Gestion d'état globale avec **Zustand**

---

## Architecture & Stack Technique

### Backend
| Technologie | Version | Rôle |
|---|---|---|
| **NestJS** | 11 | Framework Node.js |
| **MongoDB** | 7 | Base de données NoSQL |
| **Mongoose** | 9 | ODM pour MongoDB |
| **Passport.js** | 0.7 | Stratégies d'authentification (JWT) |
| **bcrypt** | 6 | Hashage des mots de passe |
| **Nodemailer** | 8 | Envoi d'emails |
| **Handlebars** | 4.7 | Templates HTML pour les emails |
| **PDFKit** | 0.17 | Génération de billets PDF |
| **QRCode** | 1.5 | Génération de codes QR |
| **Helmet** | 8 | Sécurité HTTP |
| **class-validator** | 0.14 | Validation des DTOs |
| **Throttler** | 6.5 | Rate limiting |

### Frontend
| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 16 | Framework React avec SSR |
| **React** | 19 | Bibliothèque UI |
| **TypeScript** | 5 | Typage statique |
| **TailwindCSS** | 4 | Framework CSS utilitaire |
| **Zustand** | 5 | Gestion d'état |
| **Axios** | 1.13 | Client HTTP |
| **Framer Motion** | 12 | Animations |
| **Recharts** | 3.7 | Graphiques & visualisations |
| **Lucide React** | 0.563 | Librairie d'icônes |
| **Zod** | 4 | Validation de formulaires |

### DevOps & Outillage
| Technologie | Rôle |
|---|---|
| **Docker** | Conteneurisation |
| **Docker Compose** | Orchestration multi-conteneurs |
| **GitHub Actions** | CI/CD Pipeline |
| **Docker Hub** | Registre d'images |
| **Jest** | Tests unitaires & E2E |
| **React Testing Library** | Tests composants frontend |
| **ESLint** | Linting du code |
| **Prettier** | Formatage du code |

---

## Structure du Projet

```
Eventia/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # Pipeline CI (lint, test, build)
│       └── cd.yml                  # Pipeline CD (Docker Hub deployment)
│
├── backend/                     # API NestJS
│   ├── src/
│   │   ├── auth/                   # Module d'authentification
│   │   │   ├── auth.controller.ts  # Endpoints: register, login, logout, refresh, profile
│   │   │   ├── auth.service.ts     # Logique métier auth
│   │   │   ├── dto/                # RegisterDto, LoginDto, UpdateProfileDto
│   │   │   ├── guards/             # JwtAuthGuard, RolesGuard, RefreshJwtAuthGuard
│   │   │   ├── strategies/         # JwtStrategy, RefreshJwtStrategy
│   │   │   └── decorators/         # @Roles() decorator
│   │   │
│   │   ├── events/                 # Module événements
│   │   │   ├── events.controller.ts # CRUD + filtrage par catégorie/statut
│   │   │   ├── events.service.ts    # Logique métier événements
│   │   │   ├── dto/                 # CreateEventDto, UpdateEventDto
│   │   │   └── schemas/            # Event Mongoose Schema
│   │   │
│   │   ├── reservations/           # Module réservations
│   │   │   ├── reservations.controller.ts # Create, confirm, reject, cancel, ticket
│   │   │   ├── reservations.service.ts    # Logique métier réservations
│   │   │   ├── pdf.service.ts       # Génération de billets PDF + QR Code
│   │   │   ├── dto/                 # CreateReservationDto
│   │   │   └── schemas/            # Reservation Mongoose Schema
│   │   │
│   │   ├── users/                  # Module utilisateurs
│   │   │   ├── users.controller.ts  # Gestion des profils & utilisateurs
│   │   │   ├── users.service.ts     # CRUD utilisateurs
│   │   │   ├── dto/                 # UpdateUserDto
│   │   │   └── schemas/            # User Mongoose Schema (roles: ADMIN, PARTICIPANT)
│   │   │
│   │   ├── mail/                   # Module d'envoi d'emails
│   │   │   ├── mail.service.ts      # Service d'envoi (welcome, pending, confirmed, etc.)
│   │   │   └── templates/          # Templates Handlebars (.hbs)
│   │   │       ├── welcome.hbs
│   │   │       ├── reservation-pending.hbs
│   │   │       ├── reservation-confirmed.hbs
│   │   │       ├── reservation-rejected.hbs
│   │   │       └── reservation-canceled.hbs
│   │   │
│   │   ├── stats/                  # Module statistiques
│   │   │   ├── stats.controller.ts  # GET /stats/admin
│   │   │   └── stats.service.ts     # Calculs: revenu, tendances, KPIs
│   │   │
│   │   ├── payments/               # Module paiements (préparé)
│   │   ├── config/                 # Configuration base de données
│   │   ├── database/               # Module Mongoose
│   │   ├── app.module.ts           # Module principal
│   │   ├── main.ts                 # Point d'entrée (CORS, Helmet, Pipes)
│   │   └── seed.ts                 # Script de seeding (création admin)
│   │
│   ├── test/                       # Tests E2E
│   ├── Dockerfile                  # Image Docker backend
│   └── package.json
│
├── frontend/                    # Application Next.js
│   ├── app/
│   │   ├── layout.tsx              # Layout racine (SSR, fonts, auth init)
│   │   ├── page.tsx                # Page d'accueil (landing page)
│   │   ├── login/                  # Page de connexion
│   │   ├── register/               # Page d'inscription
│   │   ├── events/                 # Liste & détails des événements
│   │   ├── my-reservations/        # Réservations de l'utilisateur
│   │   ├── profile/                # Page de profil utilisateur
│   │   ├── checkout/               # Page de paiement
│   │   ├── about/                  # Page À propos
│   │   ├── contact/                # Page de contact
│   │   ├── avis/                   # Page d'avis
│   │   ├── not-found.tsx           # Page 404 personnalisée
│   │   └── admin/                  # Espace administrateur
│   │       ├── dashboard/          # Tableau de bord avec KPIs & graphiques
│   │       ├── events/             # CRUD événements admin
│   │       ├── reservations/       # Gestion des réservations
│   │       └── users/              # Gestion des utilisateurs
│   │
│   ├── components/
│   │   ├── Header.tsx              # Navigation principale responsive
│   │   ├── Footer.tsx              # Pied de page
│   │   ├── ProtectedRoute.tsx      # HOC de protection des routes
│   │   ├── ConditionalLayout.tsx   # Layout conditionnel (public/admin)
│   │   ├── AuthInitializer.tsx     # Initialisation de l'état auth
│   │   ├── ProfileForm.tsx         # Formulaire de profil complet
│   │   ├── home/                   # Composants page d'accueil
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── EventsSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── admin/                  # Composants admin
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── DashboardCharts.tsx
│   │   │   ├── EventsList.tsx
│   │   │   ├── CreateEventForm.tsx
│   │   │   ├── EditEventForm.tsx
│   │   │   ├── EventDetailsView.tsx
│   │   │   ├── ReservationsList.tsx
│   │   │   └── UsersList.tsx
│   │   ├── ui/                     # Composants UI réutilisables
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── CustomSelect.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── ToastContainer.tsx
│   │   └── auth/                   # Composants d'authentification
│   │
│   ├── lib/
│   │   ├── api-client.ts           # Client Axios configuré (cookies, interceptors)
│   │   ├── types.ts                # Interfaces TypeScript partagées
│   │   ├── constants.ts            # Couleurs, données mock
│   │   ├── services/               # Services API
│   │   │   ├── authService.ts
│   │   │   ├── eventService.ts
│   │   │   ├── reservationService.ts
│   │   │   ├── statsService.ts
│   │   │   └── userService.ts
│   │   ├── validations/            # Schémas Zod
│   │   │   ├── auth.schemas.ts
│   │   │   ├── event.schemas.ts
│   │   │   ├── profile.schemas.ts
│   │   │   └── contact.schemas.ts
│   │   └── utils/                  # Fonctions utilitaires
│   │
│   ├── stores/                     # State management (Zustand)
│   │   ├── authStore.ts            # État d'authentification (persist)
│   │   ├── eventStore.ts           # État des événements
│   │   ├── reservationStore.ts     # État des réservations
│   │   ├── statsStore.ts           # État des statistiques
│   │   └── toastStore.ts           # Système de notifications
│   │
│   ├── __tests__/                  # Tests frontend
│   │   ├── components.test.tsx
│   │   ├── reservation.test.tsx
│   │   └── cancellation.test.tsx
│   │
│   ├── Dockerfile                  # Image Docker frontend
│   └── package.json
│
├── docker-compose.yml              # Orchestration: MongoDB, Backend, Frontend, Mongo Express
├── .env.example                    # Variables d'environnement (template)
└── .gitignore
```

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

| Outil | Version minimale | Téléchargement |
|---|---|---|
| **Node.js** | 20+ | [nodejs.org](https://nodejs.org/) |
| **npm** | 10+ | Inclus avec Node.js |
| **MongoDB** | 7+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Docker** *(optionnel)* | 24+ | [docker.com](https://www.docker.com/get-started) |
| **Git** | 2.40+ | [git-scm.com](https://git-scm.com/) |

---

## Installation & Configuration

### 1. Cloner le dépôt

```bash
git clone https://github.com/Mo7amed-Boukab/Eventia.git
cd Eventia
```

### 2. Configurer le Backend

```bash
# Accéder au répertoire backend
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

Modifier le fichier `backend/.env` avec vos propres valeurs :

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/eventia

# Application Configuration
PORT=4000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (optionnel)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@eventia.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Configurer le Frontend

```bash
# Accéder au répertoire frontend
cd ../frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

Modifier le fichier `frontend/.env` :

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Initialiser la Base de Données (Seeding)

```bash
# Depuis le répertoire backend
cd ../backend
npm run seed
```

Cela créera un compte administrateur par défaut :
| Champ | Valeur |
|---|---|
| **Email** | `admin@eventia.com` |
| **Mot de passe** | `Admin123!` |
| **Rôle** | `ADMIN` |

---

## Lancement du Projet

### Mode Développement (local)

#### Terminal 1 — Backend
```bash
cd backend
npm run start:dev
```
Le serveur API sera disponible sur : `http://localhost:4000`

#### Terminal 2 — Frontend
```bash
cd frontend
npm run dev
```
L'application web sera disponible sur : `http://localhost:3000`

### Mode Docker Compose (recommandé)

```bash
# À la racine du projet
cp .env.example .env

# Lancer tous les services
docker compose up -d
```

| Service | URL | Description |
|---|---|---|
| **Frontend** | `http://localhost:3000` | Application web |
| **Backend API** | `http://localhost:4000` | API REST |
| **MongoDB** | `localhost:27017` | Base de données |
| **Mongo Express** | `http://localhost:8081` | Interface de gestion MongoDB |

---

## Variables d'Environnement

### Racine du projet (`.env` — Docker Compose)

| Variable | Description | Exemple |
|---|---|---|
| `MONGO_URI` | URI de connexion MongoDB | `mongodb://mongo:27017/Eventia` |
| `PORT` | Port du serveur backend | `4000` |
| `NODE_ENV` | Environnement d'exécution | `development` |
| `JWT_SECRET` | Clé secrète JWT (access token) | `votre-clé-secrète` |
| `JWT_REFRESH_SECRET` | Clé secrète JWT (refresh token) | `votre-clé-refresh-secrète` |
| `JWT_EXPIRES_IN` | Durée de validité access token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Durée de validité refresh token | `7d` |
| `NEXT_PUBLIC_API_URL` | URL de l'API pour le frontend | `http://localhost:4000` |

---

## Documentation API

### Authentification — `/auth`

| Méthode | Endpoint | Description | Auth | Rate Limit |
|---|---|---|---|---|
| `POST` | `/auth/register` | Inscription d'un nouvel utilisateu | 5/min |
| `POST` | `/auth/login` | Connexion | 5/min |
| `POST` | `/auth/refresh` | Rafraîchir les tokens | 20/min |
| `POST` | `/auth/logout` | Déconnexion |
| `GET` | `/auth/profile` | Profil de l'utilisateur connecté |

### Événements — `/events`

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/events` | Lister tous les événements |
| `GET` | `/events?category=Formation` | Filtrer par catégorie |
| `GET` | `/events?status=PUBLISHED` | Filtrer par statut |
| `GET` | `/events/upcoming` | Événements à venir |
| `GET` | `/events/:id` | Détails d'un événement |
| `POST` | `/events` | Créer un événement |
| `PATCH` | `/events/:id` | Modifier un événement |
| `DELETE` | `/events/:id` | Supprimer un événement |

### Réservations — `/reservations`

| Méthode | Endpoint | Description | Auth | Rate Limit |
|---|---|---|---|---|
| `POST` | `/reservations` | Créer une réservation | 10/min |
| `GET` | `/reservations` | Lister toutes les réservations |
| `GET` | `/reservations/me` | Mes réservations |
| `GET` | `/reservations/status/:eventId` | Statut de réservation pour un événement |
| `PATCH` | `/reservations/:id/confirm` | Confirmer une réservation |
| `PATCH` | `/reservations/:id/reject` | Rejeter une réservation |
| `PATCH` | `/reservations/:id/cancel` | Annuler une réservation |
| `GET` | `/reservations/:id/ticket` | Télécharger le billet PDF | 10/min |

### Utilisateurs — `/users`

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/users` | Lister les utilisateurs |
| `GET` | `/users/:id` | Détails d'un utilisateur |
| `PATCH` | `/users/:id` | Modifier le profil |
| `PATCH` | `/users/:id/password` | Changer le mot de passe |
| `DELETE` | `/users/:id` | Supprimer un utilisateur |

### Statistiques — `/stats`

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/stats/admin` | KPIs du tableau de bord admin |

---

## Système d'Emails

L'application envoie des emails transactionnels à travers **5 templates Handlebars** :

| Template | Déclencheur | Contenu |
|---|---|---|
| `welcome.hbs` | Inscription d'un utilisateur | Message de bienvenue |
| `reservation-pending.hbs` | Nouvelle réservation créée | Confirmation de réception, détails de l'événement |
| `reservation-confirmed.hbs` | Admin confirme la réservation | Confirmation + billet PDF en pièce jointe |
| `reservation-rejected.hbs` | Admin rejette la réservation | Notification de rejet |
| `reservation-canceled.hbs` | Annulation de réservation | Notification d'annulation |

> **Note :** Pour activer les emails, configurez les variables `MAIL_*` dans le fichier `.env` du backend. L'envoi d'emails est en mode "fire-and-forget" — un échec n'empêche pas le fonctionnement de l'application.

---

## Tests

### Tests Backend (Jest)

```bash
cd backend

# Exécuter les tests unitaires
npm run test

# Exécuter les tests avec couverture
npm run test:cov

# Exécuter les tests en mode watch
npm run test:watch

# Exécuter les tests E2E
npm run test:e2e
```

**Suites de tests unitaires disponibles :**
- `auth.service.spec.ts` — Tests du service d'authentification
- `events.service.spec.ts` — Tests du service d'événements
- `reservations.service.spec.ts` — Tests du service de réservations

**Suite de tests E2E :**
- `app.e2e-spec.ts` — Tests d'intégration de l'API complète

### Tests Frontend (Jest + React Testing Library)

```bash
cd frontend

# Exécuter les tests
npm run test

# Exécuter les tests en mode watch
npm run test:watch
```

**Suites de tests disponibles :**
- `components.test.tsx` — Tests des composants UI
- `reservation.test.tsx` — Tests du flux de réservation
- `cancellation.test.tsx` — Tests du flux d'annulation

---

## Déploiement Docker

### Images Docker

Le projet contient deux Dockerfiles optimisés avec build multi-stage :

**Backend** (`backend/Dockerfile`) :
- Build stage : compilation TypeScript
- Production stage : `node:20-alpine` — image finale légère
- Port exposé : `4000`

**Frontend** (`frontend/Dockerfile`) :
- Build stage : compilation Next.js avec injection de variables d'environnement via `ARG`
- Production stage : `node:20-alpine`
- Port exposé : `3000`

### Docker Compose

Le fichier `docker-compose.yml` orchestre 4 services :

```bash
# Démarrer tous les services
docker compose up -d

# Arrêter tous les services
docker compose down

# Voir les logs
docker compose logs -f

# Reconstruire les images
docker compose up -d --build
```

---

## CI/CD Pipeline

### Pipeline CI (`.github/workflows/ci.yml`)

Déclenché sur chaque `push` et `pull_request` vers `main` :

```
Backend CI                      Frontend CI
├── Checkout code               ├── Checkout code
├── Setup Node.js 20            ├── Setup Node.js 20
├── npm ci                      ├── npm ci
├── npm run lint                ├── npm run lint
├── npm run test                ├── npm run test
└── npm run build               └── npm run build
```

### Pipeline CD (`.github/workflows/cd.yml`)

Déclenché sur chaque `push` vers `main` :

```
Deploy to Docker Hub
├── Checkout code
├── Login to Docker Hub
├── Setup Docker Buildx
├── Build & Push Backend → <username>/eventia-backend:latest
└── Build & Push Frontend → <username>/eventia-frontend:latest
```

> **Secrets GitHub requis :**
> - `DOCKER_HUB_USER_NAME` — Nom d'utilisateur Docker Hub
> - `DOCKER_HUB_PASSWORD` — Mot de passe ou token Docker Hub

---

## Sécurité

| Mesure | Implémentation |
|---|---|
| Hashage des mots de passe | **bcrypt** (10 salt rounds) |
| Tokens sécurisés | **httpOnly cookies** (non accessibles via JavaScript) |
| Protection XSS | **Helmet** (en-têtes HTTP sécurisés) |
| Rate Limiting | **@nestjs/throttler** (global + par endpoint) |
| Validation des entrées | **class-validator** (backend) + **Zod** (frontend) |
| CORS | Configuré avec `credentials: true` |
| Refresh Token | Hashé en base, comparé via bcrypt |
| Protection RBAC | Guards `JwtAuthGuard` + `RolesGuard` |
| Whitelist DTO | `ValidationPipe` avec `whitelist: true` et `forbidNonWhitelisted: true` |

---

## Scripts Disponibles

### Backend

| Script | Commande | Description |
|---|---|---|
| `npm run start:dev` | `nest start --watch` | Développement avec hot-reload |
| `npm run build` | `nest build` | Compilation TypeScript |
| `npm run start:prod` | `node dist/main` | Production |
| `npm run test` | `jest` | Tests unitaires |
| `npm run test:e2e` | `jest --config ./test/jest-e2e.json` | Tests E2E |
| `npm run test:cov` | `jest --coverage` | Couverture de tests |
| `npm run lint` | `eslint --fix` | Linting |
| `npm run seed` | `ts-node src/seed.ts` | Créer le compte admin |

### Frontend

| Script | Commande | Description |
|---|---|---|
| `npm run dev` | `next dev` | Développement avec hot-reload |
| `npm run build` | `next build` | Build de production |
| `npm run start` | `next start` | Serveur de production |
| `npm run lint` | `eslint` | Linting |
| `npm run test` | `jest` | Tests unitaires |

---

## Contributeurs

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Mo7amed-Boukab">
        <br />
        <sub><b>Mohamed Boukab</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## Licence

Ce projet est sous licence **Privée**. Tous droits réservés.

---

<p align="center">
  <strong>Eventia</strong> — L'Art de l'Événementiel Professionnel
</p>
