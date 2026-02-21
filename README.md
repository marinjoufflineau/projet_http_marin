# Serveur Express (TP WebServer)

## Installation

Exécuter la commande suivante à la racine du projet :

    npm install

## Lancer le serveur

    npm start

Puis ouvrir dans votre navigateur :

    http://localhost:8080

## Mode développement (rechargement automatique avec nodemon)

    npm run dev

## Connexion administrateur

Identifiants :

- Login : admin  
- Password : admin  

Une fois connecté, le mode admin active un thème vert sur l’ensemble du site.

## Routes disponibles

- /                → Accueil  
- /about           → Page à propos  
- /contact         → Page contact  
- /login           → Connexion administrateur  
- /dab             → Formulaire du distributeur de billets  
- /dab/:amount     → Calcul dynamique des coupures (exemple : /dab/137.45)  
- /error           → Page d’erreur volontaire  
- Toute autre URL  → Page 404  

## Fonctionnalités principales

- Serveur Express sur le port 8080  
- Templates dynamiques avec EJS  
- Includes header / footer  
- Titre dynamique sur chaque page  
- Gestion de session avec express-session  
- Mode admin persistant via session  
- Page 404 personnalisée  
- Route dynamique pour le DAB avec gestion des centimes  
- Design adaptatif avec thème normal et thème admin  

## Structure du projet

- app.js                → Fichier principal du serveur  
- dab.js                → Module de calcul du distributeur  
- views/                → Templates EJS  
- public/styles.css     → Feuille de style  
- package.json          → Dépendances et scripts  

## Remarques

Toutes les dépendances sont installées en local.  
Le projet doit être installé uniquement via la commande `npm install`.  
Le dossier node_modules ne doit pas être inclus dans l’archive de rendu.
