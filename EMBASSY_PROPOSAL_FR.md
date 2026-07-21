# Proposition de projet - Application de l'Ambassade

## Résumé exécutif

Cette application constitue une base solide pour un service consulaire moderne destiné à l'Ambassade de la RDC en Suède et, plus largement, à la communauté de la Scandinavie. Elle permet déjà la prise de rendez-vous, l'authentification des utilisateurs, la gestion admin, les notifications et un fonctionnement multilingue en français, suédois et anglais.

Pour un usage en production au sein d'une ambassade, je recommande toutefois une phase de durcissement avant la mise en service officielle. Les priorités sont la sécurité, l'intégrité des données, la disponibilité du service et l'optimisation des performances.

## Valeur du projet

- Interface multilingue adaptée à un public francophone
- Parcours de réservation simple et rapide
- Espace utilisateur pour le suivi des dossiers et des notifications
- Espace admin pour gérer les réservations et les utilisateurs
- Architecture moderne basée sur Next.js, Supabase, NextAuth et Resend

## Recommandation technique

### Confidentialité

- Renforcer la protection des routes sensibles
- Vérifier les contrôles de rôle côté serveur
- Limiter les données personnelles stockées au strict nécessaire
- Éviter d'exposer des informations sensibles dans les journaux et les e-mails

### Intégrité

- Valider toutes les écritures côté serveur
- Ajouter un journal d'audit pour les actions administratives
- Uniformiser les règles d'autorisation sur les API
- Sécuriser les mises à jour de statut et de profil

### Disponibilité

- Mettre en place des sauvegardes et un plan de reprise
- Surveiller les erreurs et la santé applicative
- Gérer proprement les défaillances de Supabase et Resend
- Tester le comportement sur réseau lent et appareil mobile

### Performance

- Réduire les rendus inutiles côté client
- Ajouter les index nécessaires en base de données
- Cacher les lectures non sensibles lorsque c'est possible
- Déporter les tâches lourdes hors du chemin critique des requêtes

## Estimation commerciale

Le prix dépend du niveau de responsabilité et du périmètre final.

- Pilote / démonstration: 2 000 à 5 000 USD
- Durcissement production pour une ambassade: 8 000 à 20 000 USD
- Livraison complète avec support, formation et déploiement: 20 000 à 45 000 USD+

Si la facturation est horaire, une fourchette réaliste est souvent de 60 à 120 USD / heure selon le marché et le niveau de support attendu.

## Conclusion

L'application n'a pas besoin d'être réécrite. En revanche, elle ne devrait pas être livrée en production "telle quelle" pour un environnement diplomatique. La bonne approche est de conserver la base actuelle et d'ajouter une phase ciblée de sécurité, d'audit, de fiabilité et de performance avant le déploiement officiel.
