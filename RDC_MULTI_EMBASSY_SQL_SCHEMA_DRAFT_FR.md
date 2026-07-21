# Brouillon De Schema SQL Multi-Ambassades RDC

## Objet

Ce document fournit une version en francais du brouillon de schema SQL destine a faire evoluer la base de donnees E-Ambassade vers une plateforme multi-ambassades pour la RDC.

Il s'appuie sur Supabase Postgres et sur les tables actuellement presentes dans le projet :

- `profiles`
- `bookings`
- `notifications`

L'objectif est de conserver la base existante tout en introduisant une vraie separation par ambassade, des roles scopes, un catalogue de services configurable et une meilleure auditabilite.

## Objectifs De Conception

Ce schema s'appuie sur les principes suivants :

- chaque ambassade est un tenant
- les donnees d'une ambassade portent `embassy_id`
- les roles de plateforme et les roles d'ambassade sont distingues
- les operations de reservation sont tracables
- le schema reste pragmatique vis-a-vis de la base actuelle

## Strategie De Migration

Ordre recommande :

1. creer les nouvelles tables multi-ambassades
2. ajouter `embassy_id` aux tables operationnelles existantes
3. creer Stockholm comme premier tenant
4. rattacher les donnees existantes a Stockholm
5. faire evoluer la gestion des roles hors de `profiles.role`
6. ajouter progressivement les politiques RLS une fois la logique applicative en place

## Tables Et Evolutions Principales

Le schema cible comprend notamment :

- `embassies`
- `user_embassy_roles`
- `embassy_settings`
- `embassy_services`
- `embassy_schedules`
- `embassy_closures`
- extension de `bookings`
- extension de `notifications`
- `booking_status_history`
- `embassy_content_pages`
- `audit_logs`

## Contenu Du Brouillon SQL

Le script SQL correspondant est documente dans la version anglaise et couvre :

- la creation des tenants ambassade
- la table d'affectation des roles
- la configuration par ambassade
- les services et calendriers
- l'extension des tables existantes
- l'historique des statuts de reservation
- les contenus publics par ambassade
- les journaux d'audit
- les triggers `updated_at`
- l'initialisation de Stockholm
- les exemples de backfill

## Points Importants Pour Le Projet Actuel

### 1. Compatibilite Progressive

Le brouillon a ete concu pour permettre une transition progressive.

Exemples :

- conserver temporairement `bookings.service_type`
- conserver temporairement `profiles.role`
- ajouter `service_id` et `embassy_id` sans casser immediatement le fonctionnement existant

### 2. Backfill De Stockholm

Le premier tenant recommande est Stockholm.

Les donnees historiques existantes seraient rattachees a cette ambassade afin de convertir le mode mono-ambassade actuel en base multi-ambassades.

### 3. Orientation RLS

Le projet actuel repose surtout sur le service role Supabase cote serveur. La RLS doit donc etre introduite par etapes :

1. d'abord imposer `embassy_id` dans la logique applicative
2. ensuite ajouter des politiques RLS pour les acces utilisateurs
3. enfin renforcer les acces admin avec des politiques plus fines si necessaire

### 4. Donnees Sensibles

Le champ `passport_number` merite une revue specifique de securite. Selon les exigences finales, il pourra rester en texte simple au debut ou etre protege davantage par chiffrement ou restrictions d'acces plus fortes.

## Recommandation Finale

La version anglaise du brouillon SQL sert de support technique principal, tandis que ce document en francais permet la revue fonctionnelle et institutionnelle.

La prochaine etape logique apres validation de ce brouillon serait :

1. formaliser les migrations SQL definitives
2. creer Stockholm comme premier tenant
3. refactoriser progressivement les requetes applicatives autour de `embassy_id`
4. remplacer les roles simples par des affectations scopes
5. externaliser l'identite visuelle et les reglages par ambassade