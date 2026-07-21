# Architecture Technique Multi-Ambassades RDC

## Objet

Ce document decrit l'evolution technique necessaire pour faire passer l'application E-Ambassade d'un systeme de reservation pour une seule ambassade a une plateforme consulaire multi-ambassades pour la RDC.

L'objectif principal est de supporter plusieurs ambassades a l'etranger depuis une seule base de code, avec une separation forte des donnees, des permissions claires et une configuration locale par ambassade.

## Objectif D'Architecture

La plateforme cible doit permettre :

- une base de code partagee
- un modele d'administration centralise
- plusieurs ambassades comme tenants isoles
- une personnalisation par ambassade de la marque, des services, des horaires et des communications
- une isolation securisee des donnees et des operations

## Modele D'Exploitation Recommande

Modele recommande : plateforme multi-tenant partagee.

Chaque ambassade est un tenant. Toutes les donnees liees a une ambassade sont rattachees a `embassy_id`. La logique applicative, les requetes administratives, les notifications, le reporting et le contenu public doivent respecter cette frontiere.

Ce modele est preferable a une duplication par ambassade car il :

- reduit les couts de maintenance
- simplifie les mises a jour
- standardise les operations
- accelere l'integration de nouvelles ambassades

## Principes Structurants

### 1. Isolation Des Tenants

Toute donnee appartenant a une ambassade doit porter `embassy_id`.

Cela inclut au minimum :

- les utilisateurs en role ambassade
- les profils lorsque le contexte metier en depend
- les reservations
- les notifications
- les services
- les regles de calendrier
- les contenus publics
- les journaux d'audit

### 2. Configuration Plutot Que Fork

Les differences entre ambassades doivent etre gerees par configuration et non par variantes de code.

Exemples :

- identite visuelle
- horaires
- services disponibles
- expediteurs e-mail
- textes de confirmation
- langues actives

### 3. Autorisation Centralisee

Les permissions ne doivent pas etre dispersees de facon informelle dans les pages et API. Les regles d'autorisation doivent etre explicites et reutilisables.

### 4. Securite Imposée Par Le Serveur

Les controles front-end ne suffisent pas. L'isolation et les roles doivent etre imposes au niveau des API et de la base de donnees.

## Domaines Fonctionnels Cibles

La plateforme devrait etre organisee autour de ces domaines :

- identite et acces
- gestion des ambassades
- catalogue de services
- reservation et planification
- notifications et communications
- contenu et informations publiques
- reporting et audit

## Modele De Tenant

### Entite Principale

L'entite principale de tenant est `embassies`.

Champs suggérés :

| Champ | Type | Role |
| --- | --- | --- |
| id | uuid | Cle primaire |
| code | text unique | Identifiant stable tel que `stockholm` |
| official_name | text | Nom officiel |
| country | text | Pays d'accueil |
| city | text | Ville |
| address | text | Adresse publique |
| phone | text | Telephone public |
| email | text | E-mail public |
| timezone | text | Fuseau horaire |
| primary_locale | text | Langue par defaut |
| supported_locales | jsonb | Langues actives |
| logo_url | text | Ressource visuelle |
| domain | text | Domaine dedie optionnel |
| subdomain | text | Sous-domaine optionnel |
| status | text | `active`, `inactive`, `setup` |
| created_at | timestamptz | Horodatage |
| updated_at | timestamptz | Horodatage |

### Resolution Du Tenant

Le contexte ambassade peut etre determine via :

1. sous-domaine
2. domaine dedie
3. segment d'URL comme `/embassy/stockholm`
4. selection explicite pour les super administrateurs

Recommandation :

- site public : sous-domaine ou domaine
- back-office : contexte explicite pour les administrateurs scopes

## Identite Et Controle D'Acces

### Roles Recommandes

| Role | Portee | Description |
| --- | --- | --- |
| super_admin | plateforme | Acces total a toutes les ambassades |
| embassy_admin | ambassade | Gestion complete d'une ambassade |
| embassy_staff | ambassade | Traitement operationnel des dossiers |
| citizen_user | soi-meme | Demandeur public |

### Stockage Des Roles

Il ne faut pas s'appuyer uniquement sur les metadonnees utilisateur du fournisseur d'authentification.

Il est recommande d'introduire une table `user_embassy_roles` :

| Champ | Type | Role |
| --- | --- | --- |
| id | uuid | Cle primaire |
| user_id | uuid | Identifiant auth |
| embassy_id | uuid nullable | Null uniquement pour un role global |
| role | text | Nom du role |
| status | text | `active`, `revoked` |
| created_at | timestamptz | Horodatage |
| updated_at | timestamptz | Horodatage |

Cela permet qu'un meme utilisateur puisse :

- etre super administrateur global
- administrer une seule ambassade
- travailler sur plusieurs ambassades si necessaire

### Regles D'Autorisation

Regles principales :

- `super_admin` peut acceder a tous les tenants
- `embassy_admin` ne peut acceder qu'aux donnees de son ambassade
- `embassy_staff` agit dans les limites de son ambassade et de ses actions autorisees
- `citizen_user` n'accede qu'a ses propres donnees

### Mise En Oeuvre

Introduire des helpers serveurs reutilisables, par exemple :

- `getCurrentActor()`
- `requireAuthenticatedUser()`
- `requirePlatformRole()`
- `requireEmbassyRole(embassyId, role)`
- `assertTenantAccess(record.embassy_id)`

## Schema De Base De Donnees Cible

### Tables Principales

- `embassies`
- `profiles`
- `user_embassy_roles`
- `embassy_services`
- `embassy_schedules`
- `embassy_closures`
- `bookings`
- `booking_status_history`
- `notifications`
- `embassy_content_pages`
- `embassy_settings`
- `audit_logs`

### Orientations Essentielles

- les reservations deviennent dependantes de `embassy_id`
- les services sont configures par ambassade
- l'historique des statuts doit etre conserve
- les notifications doivent aussi etre scopees par ambassade
- les contenus publics doivent etre localisables par ambassade et par langue

## Strategie D'Isolation Des Donnees

### Couche Applicative

Toutes les fonctions serveur et toutes les API doivent recevoir ou deriver `embassy_id` puis l'utiliser dans les filtres de lecture et d'ecriture.

Exemples :

- lister les reservations par `embassy_id`
- creer les notifications avec `embassy_id`
- limiter les statistiques admin a l'ambassade active

### Couche Base De Donnees

Mesures recommandees :

- indexer `embassy_id`
- mettre en place Row Level Security quand c'est pertinent
- limiter l'usage du service role aux zones serveur controlees

Si la plateforme reste sur Supabase, la RLS devrait devenir une partie importante de la cible de securite.

## Architecture Du Workflow De Reservation

### Flux Public

1. le visiteur arrive sur le site d'une ambassade
2. le contexte ambassade est resolu
3. les services disponibles sont charges pour cette ambassade
4. l'utilisateur s'authentifie ou s'inscrit
5. il choisit un service et un creneau
6. la reservation est creee avec `embassy_id`
7. la confirmation et les notifications sont envoyees selon les regles de cette ambassade

### Flux Administratif

1. l'agent se connecte
2. son contexte et ses permissions sont verifies
3. il ne voit que les reservations de son ambassade
4. chaque changement de statut cree un historique et un audit
5. l'utilisateur recoit une communication adaptee a l'ambassade

## Modele De Configuration Par Ambassade

La configuration devrait etre resolue via des fonctions centrales comme :

- `getEmbassyByHost(host)`
- `getEmbassySettings(embassyId)`
- `getEmbassyBranding(embassyId)`
- `getEmbassyLocales(embassyId)`

Sections recommandees :

- branding
- regles de langue
- regles de calendrier
- regles de reservation
- identite d'envoi e-mail
- modeles de notification
- options de contenu public

## Internationalisation

Le support multilingue actuel est une bonne base mais doit etre etendu.

Approche recommandee :

- conserver des traductions plateforme pour l'interface commune
- permettre des surcharges de contenu et de services par ambassade
- supporter une langue par defaut par ambassade
- activer la langue du pays d'accueil par ambassade

Exemples :

- Stockholm : francais, suedois, anglais
- Paris : francais, anglais
- Berlin : francais, allemand, anglais

## Communications

### E-mail

La couche e-mail doit supporter :

- un expediteur par ambassade
- des variables de template provenant de la configuration
- des messages de statut multilingues
- des rappels planifies

### Notifications

Les notifications doivent couvrir :

- la livraison in-app
- la livraison par e-mail
- eventuellement le SMS plus tard
- un contenu template par type d'evenement

## Direction API

Caracteristiques recommandees :

- traitement explicite du tenant
- helpers communs d'autorisation
- validation d'entree par schemas
- reponses d'erreur coherentes
- contexte acteur et ambassade attache a la requete

## Controles De Securite

Minimum necessaire pour un deploiement multi-ambassades :

- validation stricte de chaque endpoint d'ecriture
- verification des roles sur chaque endpoint admin
- verification du tenant sur chaque lecture et ecriture
- limitation de debit sur la connexion et la creation de reservation
- moindre privilege pour l'acces base
- reduction des donnees personnelles dans les logs
- traitement prudent des numeros de passeport
- audit des actions administratives

## Strategie De Migration

### Phase 1

- creer les nouvelles tables de tenant
- ajouter `embassy_id` aux tables existantes
- preparer la configuration et les roles

### Phase 2

- creer l'ambassade Stockholm
- rattacher les donnees existantes a ce tenant
- affecter les administrateurs actuels a Stockholm

### Phase 3

- refactoriser les requetes serveur
- integrer la logique de resolution du tenant
- supprimer les identites hardcodees

### Phase 4

- integrer une deuxieme ambassade
- verifier l'isolation et le modele d'onboarding

## Recommandation Finale

Le projet actuel constitue une base realiste pour une plateforme multi-ambassades de la RDC, mais cette evolution doit etre menee comme une veritable refonte d'architecture et non comme une simple extension fonctionnelle.

La decision technique la plus importante est de faire du contexte ambassade une notion centrale dans :

- le modele de donnees
- les permissions
- la configuration
- la logique de reservation
- la communication
- le reporting

Une fois cela fait, l'ajout de nouvelles ambassades devient un processus de configuration et d'exploitation, plutot qu'un nouveau cycle de developpement complet.