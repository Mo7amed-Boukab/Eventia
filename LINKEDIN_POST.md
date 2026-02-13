# Post LinkedIn - Eventia

Je vous présente Eventia, une plateforme moderne de gestion d'événements professionnels, conçue pour faciliter l'organisation, la gestion et la participation aux événements. Cette solution full-stack offre une expérience utilisateur premium avec des fonctionnalités avancées pour la consultation d'événements, la gestion des réservations et le contrôle administratif.

L'application prend en charge deux rôles principaux (Administrateur et Participant) avec un contrôle d'accès basé sur les rôles, offrant à chaque utilisateur une expérience personnalisée et sécurisée.

Fonctionnalités publiques :
- Navigation et consultation des événements à venir avec filtrage par catégorie (Formation, Workshop, Conférence, Networking)
- Visualisation détaillée des informations d'événement
- Inscription et authentification sécurisée des utilisateurs
- Design responsive optimisé pour tous les appareils

Fonctionnalités côté Participant :
- Réservation de places pour les événements
- Consultation des réservations personnelles avec leurs statuts (En attente, Confirmée, Annulée, Rejetée)
- Téléchargement de tickets PDF avec codes QR pour les réservations confirmées
- Annulation des réservations en attente
- Gestion du profil utilisateur avec modification des informations et mot de passe

Fonctionnalités côté Administrateur :
- Tableau de bord avec statistiques en temps réel : revenus mensuels, événements actifs, réservations confirmées, nombre total d'utilisateurs
- Graphiques analytiques : évolution des revenus, répartition des réservations par statut
- Gestion complète des événements : création, modification, publication et suppression
- Gestion des statuts d'événements (Brouillon, Publié, Annulé)
- Gestion centralisée de toutes les réservations : confirmation, rejet ou annulation
- Gestion des utilisateurs : visualisation et suppression
- Calcul automatique des tendances mensuelles avec pourcentages de croissance

Stack technique :
- Frontend : Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Framer Motion, Recharts, Zustand
- Backend : NestJS 11, TypeScript 5.7, Passport.js avec JWT
- Base de données : MongoDB 7 avec Mongoose 9
- Génération de documents : PDFKit pour les tickets avec codes QR
- DevOps : Docker avec builds multi-étapes, Docker Compose pour l'orchestration, GitHub Actions pour CI/CD

Sécurité :
- Authentification JWT avec access et refresh tokens gérés via cookies HTTP-only
- Contrôle d'accès basé sur les rôles (RBAC)
- Protection des routes et endpoints API
- Hachage sécurisé des mots de passe avec bcrypt
- Middleware Helmet pour la sécurité HTTP
- Limitation de taux (rate limiting) avec throttling sur les endpoints sensibles
- Validation des données avec class-validator et class-transformer

Architecture :
- Structure monorepo avec séparation frontend/backend
- Architecture modulaire NestJS avec séparation des responsabilités
- Containerisation complète avec Docker multi-stage builds
- Configuration des environnements via variables d'environnement
- Interface d'administration MongoDB avec Mongo Express

Tests et qualité :
- Tests unitaires et end-to-end avec Jest
- Pipeline CI/CD automatisé avec GitHub Actions
- Linting avec ESLint et formatage avec Prettier
- Tests frontend avec React Testing Library

Fonctionnalités avancées :
- Génération automatique de numéros de tickets uniques pour les réservations confirmées
- Système de gestion des catégories d'événements
- Limitation du nombre de participants par événement
- Calcul automatique des statistiques et tendances pour les administrateurs
- Système de filtrage avancé pour les événements (catégorie, statut, date)

Code source GitHub : https://github.com/Mo7amed-Boukab/Eventia

#TypeScript #React #NextJS #NestJS #MongoDB #Mongoose #Docker #DevOps #FullStack #WebDevelopment #TailwindCSS #JWT #EventManagement #GestionÉvénements #QRCode #PDF #CI/CD #GitHubActions
