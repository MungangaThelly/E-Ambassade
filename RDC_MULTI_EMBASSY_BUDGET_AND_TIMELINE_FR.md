# Budget Et Calendrier Pour La Plateforme Multi-Ambassades RDC

## Objet

Ce document propose une estimation phasée du budget et du calendrier necessaires pour faire evoluer le projet E-Ambassade actuel vers une plateforme consulaire multi-ambassades de la RDC.

Les montants ci-dessous sont des estimations de planification et non des prix contractuels definitifs. Le cout final dependra du perimetre retenu, des exigences de securite, du mode de deploiement et du niveau de support attendu.

## Hypotheses De Travail

Ces estimations supposent :

- une base de code partagee
- une plateforme appuyee sur Supabase
- un deploiement progressif
- la reutilisation du noyau actuel de reservation et d'administration
- une amelioration moderee de l'interface plutot qu'une refonte complete
- la prise en charge de plusieurs ambassades via la configuration

Ces estimations n'incluent pas par defaut :

- des applications mobiles natives
- une passerelle de paiement
- des fonctions OCR ou d'automatisation documentaire
- une integration centre d'appel
- une migration lourde de donnees historiques externes

## Modele De Livraison Recommande

Le mode de livraison recommande est progressif. Cela reduit le risque, facilite le controle budgetaire et permet de valider le modele dans des conditions reelles avant un deploiement plus large.

## Fourchettes Budgetaires

### Option A : Upgrade Pilote

Perimetre :

- renforcer le deploiement Stockholm actuel
- preparer l'architecture multi-ambassades
- poser les premiers elements du modele tenant
- ameliorer la securite et les controles administratifs

Estimation :

- 6 000 a 12 000 USD

Adapté a :

- valider la direction du projet
- presenter un pilote concret aux parties prenantes
- preparer la transition sans deploiement complet

### Option B : Noyau De Plateforme Multi-Ambassades

Perimetre :

- mise en place de l'architecture multi-tenant partagee
- configuration propre a chaque ambassade
- roles scopes et controle d'acces
- refonte du catalogue de services et du modele de calendrier
- support d'au moins deux ambassades

Estimation :

- 15 000 a 30 000 USD

Adapté a :

- construire la plateforme reutilisable
- supporter Stockholm et une ou deux autres ambassades
- etablir un modele d'onboarding repetable

### Option C : Livraison Institutionnelle Complete

Perimetre :

- tout le contenu de l'Option B
- audit et reporting
- renforcement production et supervision
- procedures d'onboarding et supports de formation
- accompagnement au deploiement plus large
- periode de support post-lancement

Estimation :

- 30 000 a 55 000 USD et plus

Adapté a :

- une adoption officielle de long terme
- un deploiement multi-ambassades reel
- un cadre institutionnel plus mature

## Decoupage Par Phases

### Phase 1 : Architecture Et Fondations

Objectif : convertir l'application actuelle vers un modele compatible multi-ambassades.

Travaux principaux :

- creation du modele tenant ambassade
- refonte des roles et permissions
- adaptation de la base de donnees
- refactorisation des acces administratifs
- centralisation de la configuration et de la marque

Duree estimee :

- 2 a 4 semaines

Budget estime :

- 5 000 a 10 000 USD

### Phase 2 : Services Et Planification

Objectif : rendre la plateforme operationnelle pour des ambassades aux besoins differents.

Travaux principaux :

- catalogue de services par ambassade
- gestion des horaires et fermetures
- regles de creneaux
- consignes de reservation par ambassade
- contenus publics par ambassade

Duree estimee :

- 2 a 4 semaines

Budget estime :

- 4 000 a 9 000 USD

### Phase 3 : Communications Et Operations Admin

Objectif : ameliorer l'usage quotidien pour les equipes consulaires et les demandeurs.

Travaux principaux :

- modeles d'e-mails par ambassade
- rappels et notifications de statut
- workflows administratifs enrichis
- vues de reporting plus utiles
- dashboards ameliores

Duree estimee :

- 2 a 3 semaines

Budget estime :

- 3 000 a 7 000 USD

### Phase 4 : Securite Et Renforcement Production

Objectif : rendre la plateforme compatible avec un usage officiel multi-ambassades.

Travaux principaux :

- renforcement des validations serveur
- journaux d'audit
- rate limiting
- monitoring et alertes
- plan de sauvegarde et de reprise
- revue de securite et de protection des donnees

Duree estimee :

- 2 a 4 semaines

Budget estime :

- 4 000 a 10 000 USD

### Phase 5 : Deploiement Et Support

Objectif : mettre la plateforme en service au-dela de la premiere ambassade.

Travaux principaux :

- onboarding d'une deuxieme ambassade
- validation du modele de configuration
- formation et remise
- support initial d'exploitation

Duree estimee :

- 1 a 3 semaines

Budget estime :

- 2 000 a 6 000 USD

## Scenarios De Calendrier

### Scenario 1 : Trajectoire Pilote Legere

Le plus adapte pour :

- l'aide a la decision
- une demonstration aux parties prenantes
- une premiere validation institutionnelle

Calendrier :

- 4 a 6 semaines

Budget estime :

- 6 000 a 12 000 USD

### Scenario 2 : Lancement Pragmatique Multi-Ambassades

Le plus adapte pour :

- construire la vraie plateforme reutilisable
- integrer Stockholm et une autre ambassade

Calendrier :

- 8 a 12 semaines

Budget estime :

- 15 000 a 30 000 USD

### Scenario 3 : Deploiement Institutionnel

Le plus adapte pour :

- un usage officiel de long terme
- une meilleure maturite securite et operations
- un deploiement plus large

Calendrier :

- 12 a 20 semaines

Budget estime :

- 30 000 a 55 000 USD et plus

## Recommandation Finale

Le meilleur rapport valeur / effort est generalement l'Option B : construire le noyau multi-ambassades et le valider avec Stockholm plus une autre ambassade.

Cette approche permet de creer une base institutionnelle reusable sans engager trop tot un deploiement a grande echelle.

Si la priorite est simplement de prouver le concept, l'Option A suffit. Si l'objectif est une adoption officielle multi-ambassades a long terme, l'Option C devient la bonne cible strategique.