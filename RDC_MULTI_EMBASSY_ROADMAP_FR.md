# Feuille De Route Multi-Ambassades RDC

## Resume Executif

Oui, le projet E-Ambassade actuel peut etre etendu pour servir plusieurs ambassades de la RDC a l'etranger.

A ce stade, l'application constitue une base solide pour une seule ambassade. Elle propose deja les capacites essentielles d'une plateforme consulaire moderne :

- authentification des utilisateurs
- gestion des reservations
- espace utilisateur
- espace administrateur
- notifications
- support multilingue

En revanche, elle n'est pas encore concue comme une plateforme multi-ambassades. Pour servir plusieurs ambassades de la RDC a l'etranger, il faut la faire evoluer d'une application unique vers une plateforme consulaire multi-tenant et configurable.

L'objectif recommande n'est pas de cloner l'application pour chaque ambassade. L'objectif recommande est de maintenir une seule base de code capable de servir plusieurs ambassades via la configuration, les permissions et les donnees propres a chaque mission.

## Position Actuelle

Le projet dispose deja d'une base interessante car il contient :

- l'authentification et la gestion de session
- les API de reservation et les workflows administratifs
- les profils utilisateurs et les notifications
- le support du francais, du suedois et de l'anglais
- une base de deploiement avec Next.js, Supabase, NextAuth et Resend

Cela rend le projet pertinent pour un pilote immediate et credible pour une future plateforme multi-ambassades apres des evolutions ciblees.

## Limite Principale Aujourd'hui

L'application actuelle reste organisee autour d'un seul contexte d'ambassade.

Quelques signes concrets :

- une seule identite visuelle et applicative
- une seule identite d'envoi pour les e-mails
- aucune separation d'ambassade dans le modele des reservations
- aucun service, calendrier ou regle specifique par ambassade
- aucune permission d'administration scopee par ambassade

Dans cet etat, la plateforme ne peut pas encore servir correctement plusieurs ambassades de la RDC depuis un systeme partage.

## Vision Cible

La vision cible devrait etre la suivante :

Une plateforme consulaire centralisee de la RDC, utilisable par plusieurs ambassades a l'etranger, ou chaque ambassade dispose de :

- ses propres informations publiques
- ses propres services
- son propre calendrier de rendez-vous
- ses propres administrateurs et agents
- sa propre identite visuelle et ses coordonnees
- ses propres rapports et journaux d'audit

Sur le plan technique, il s'agit d'une plateforme multi-tenant ou chaque ambassade represente un tenant.

## Ce Qui Sera Necessaire

### 1. Modele De Donnees Multi-Ambassades

Le premier chantier indispensable est la restructuration de la base de donnees.

Il faut ajouter une table `embassies` avec des champs de type :

- id
- official_name
- country
- city
- address
- phone
- email
- timezone
- logo_url
- primary_domain ou subdomain
- status

Ensuite, il faut rattacher `embassy_id` a toutes les donnees possedees par une ambassade, en particulier :

- reservations
- profils des agents et administrateurs
- notifications
- services disponibles
- horaires et jours de fermeture
- modeles d'e-mails ou surcharges de contenu
- pages publiques

Ce changement est le coeur de la capacite multi-ambassades.

### 2. Controle D'Acces Par Ambassade

Le modele d'administration actuel doit evoluer vers des roles scopes.

Roles recommandes :

- super_admin : gere toute la plateforme
- embassy_admin : gere une ambassade
- embassy_staff : traite les reservations et operations d'une ambassade
- citizen_user : utilisateur public

Chaque requete d'administration et chaque action back-office doit etre limitee par `embassy_id`.

Ainsi, un agent de Stockholm ne pourra pas consulter les dossiers de Paris, Bruxelles ou Londres sans autorisation explicite.

### 3. Couche De Configuration Par Ambassade

Chaque ambassade doit etre configurable sans changement de code.

La configuration doit couvrir :

- nom et logo de l'ambassade
- coordonnees
- langues prioritaires
- horaires d'ouverture
- regles de prise de rendez-vous
- jours feries et fermetures
- services proposes
- documents requis par service
- identite d'envoi e-mail
- textes de confirmation et de notification

L'objectif est de faire de l'integration d'une nouvelle ambassade un travail de configuration, et non un nouveau projet de developpement.

### 4. Refonte Du Catalogue De Services

La couche de reservation doit passer d'une liste essentiellement statique a un catalogue structure de services consulaires.

Exemples de services :

- demande de visa
- renouvellement de passeport
- document de voyage d'urgence
- carte consulaire
- enregistrement de naissance
- enregistrement de mariage
- legalisation de documents
- procuration
- demandes de nationalite ou d'etat civil

Chaque service devrait pouvoir definir :

- la duree
- la capacite par plage
- les documents requis
- les conditions d'eligibilite
- une reference de frais
- les instructions de rendez-vous
- la disponibilite par ambassade

### 5. Gestion Des Calendriers Et Des Creneaux

La logique de reservation doit devenir specifique a chaque ambassade.

Il faut ajouter le support de :

- fuseaux horaires par ambassade
- jours et heures ouvrables
- capacite par service et par plage
- jours feries et dates indisponibles
- temps tampon entre rendez-vous
- regles de reprogrammation
- regles d'annulation

Ce point est important car chaque ambassade opere dans un contexte local different.

### 6. Pages Publiques Par Ambassade

Chaque ambassade doit disposer de son propre contenu public.

Sections recommandees :

- presentation de l'ambassade
- services consulaires
- documents requis
- guides de procedure
- horaires
- coordonnees
- annonces
- contacts d'urgence
- FAQ

### 7. Couche De Communication

Les e-mails et notifications doivent devenir dependants de l'ambassade.

Evolutions necessaires :

- noms d'expediteur et domaines propres a chaque ambassade
- modeles d'e-mails par ambassade
- contenus multilingues par ambassade
- rappels avant rendez-vous
- avis d'annulation ou de reprogrammation
- option SMS ou WhatsApp si besoin operationnel

### 8. Reporting Et Audit

Pour un usage institutionnel, la plateforme doit proposer des controles operationnels plus solides.

Ajouts requis :

- journal d'audit des actions administratives
- historique des changements de statut
- visibilite sur l'auteur et la date des modifications
- exports par ambassade et par service
- rapports quotidiens et mensuels
- suivi d'activite des agents

### 9. Securite Et Renforcement

Avant un deploiement plus large, il faudra renforcer la plateforme.

Principaux chantiers :

- validation serveur stricte sur toutes les routes d'ecriture
- verification systematique des roles
- limitation de debit sur l'authentification et les reservations
- revue des donnees sensibles, notamment les numeros de passeport
- reduction des donnees personnelles dans les logs
- procedures de sauvegarde et de reprise
- supervision et alertes
- tests d'isolation entre tenants

### 10. Modele De Deploiement

Deux options sont realistement possibles.

Option A : une plateforme partagee

- une seule base de code
- une seule base de donnees avec separation par tenant
- un modele d'exploitation centralise
- cout de maintenance plus bas

Option B : un deploiement par ambassade

- isolation plus forte par defaut
- duplication d'infrastructure
- cout de maintenance plus eleve
- deploiement plus lent

Pour la vision exprimee, l'Option A est generalement la meilleure strategie de long terme, a condition de bien concevoir l'isolation.

## Parcours D'Evolution Recommande

### Phase 1 : Refactorisation De Base

Objectif : transformer l'application actuelle en noyau compatible multi-ambassades.

Livrables :

- creation de `embassies`
- ajout de `embassy_id` sur les donnees principales
- filtrage par ambassade dans les requetes
- introduction de roles scopes
- centralisation de la configuration d'ambassade
- suppression des identites d'ambassade hardcodees dans l'UI et les e-mails

### Phase 2 : Couche Operationnelle Par Ambassade

Objectif : supporter des workflows differents sans multiplier les bases de code.

Livrables :

- catalogue de services par ambassade
- regles de calendrier et de creneaux par ambassade
- pages et contenus propres a chaque ambassade
- communications par ambassade
- workflows administratifs ameliores

### Phase 3 : Renforcement Production

Objectif : rendre la plateforme compatible avec un usage officiel multi-ambassades.

Livrables :

- journal d'audit
- validation plus stricte
- rate limiting
- monitoring et alertes
- plan de sauvegarde et de restauration
- revue securite
- revue protection des donnees

### Phase 4 : Deploiement Progressif

Objectif : integrer de nouvelles ambassades progressivement.

Ordre recommande :

1. Stockholm comme deploiement de reference
2. une deuxieme ambassade avec des besoins differents, comme Bruxelles ou Paris
3. validation du modele de configuration
4. extension a d'autres ambassades via un onboarding standardise

## Recommandation Finale

Oui, ce projet peut clairement etre etendu a d'autres ambassades de la RDC a l'etranger.

Mais la bonne strategie consiste a le faire evoluer vers une plateforme multi-tenant, et non a dupliquer la version Stockholm ambassade par ambassade.

Le premier pivot a realiser est la separation par ambassade dans :

- les donnees
- les permissions
- la configuration
- la logique de reservation
- la communication
- le reporting

Une fois cette base posee, l'integration d'autres ambassades devient beaucoup plus simple, plus sure et plus rentable.