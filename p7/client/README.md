P7-Groupomania : un projet React.js Ce projet constitue un réseau social de l'entreprise Groupomania. Il permet à chaque utilisateur disposant d'un compte de poster des messages avec support multimédia. Chaque utilisateur visualise tous les posts. Les utilisateurs peuvent liker les posts, modifier leurs posts et supprimer leurs posts. L'admin peux faire toutes ces actions sur tous les posts.

La structure Le projet est constitué de deux dossiers : -backend  et client (frontend).

La base de données est une base de données relationnelles Sql et son logiciel de gestion d'administration de base de données est workbench.

Le frontend Utilisation du framework React.js. Le projet fonctionne avec React-router pour la navigation

Installation Clôner le dépôt git

Installation de la base de données Connexion avec ces paramètres: host: 'localhost', user: 'root', database: 'groupomania'

Télécharger, installer et configurer un serveur mysql (Utilisation de Workbench pour ma part)

Installation du backend Dans le dossier backend, installer npm et les dépendences avec la commande :

npm install

Puis, installer le serveur nodemon avec :

npm install nodemon

Créer un base de données sql :

Ajouter le fichier .sql à votre BDD

Installation du frontend Dans le dossier client, installer les dependances avec la commande :

npm install

Lancement de l'application

Démarrer le frontend(client) dans le dossier p7, saisir la commande :

npm start

Cliquer sur ce lien  pour accéder à l'application

Local: http://localhost:3000/

Pour démarrer le backend saisir la commande nodemon server

affichage de listening on port 5000

Il faut évetuellement installer certaines dépendances côtés backend