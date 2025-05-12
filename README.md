# Discord Raid Bot

Un bot Discord avancé avec des fonctionnalités de raid.

## Installation

1. Installez Node.js si ce n'est pas déjà fait
2. Clonez ce dépôt
3. Exécutez `npm install` pour installer les dépendances
4. Configurez le fichier `config.js` avec votre token et votre ID Discord

## Configuration

1. Créez une application sur le [Portail Développeur Discord](https://discord.com/developers/applications)
2. Créez un bot et copiez son token
3. Activez tous les "Privileged Gateway Intents" dans la section "Bot" du portail développeur
4. Invitez le bot sur votre serveur avec les permissions administrateur
5. Modifiez le fichier `config.js` :
   - Remplacez `VOTRE_TOKEN_DE_BOT_ICI` par le token de votre bot
   - Remplacez `VOTRE_ID_DISCORD_ICI` par votre ID Discord

## Commandes

Le bot répond aux commandes suivantes (uniquement pour le propriétaire) :

### Commandes de base
- `!help` - Affiche la liste de toutes les commandes disponibles
- `!stop` - Arrête proprement le bot
- `!spam [nombre] [message]` - Spam un message dans le canal actuel
- `!nuke` - Supprime tous les salons et en crée de nouveaux
- `!rename [nouveau nom]` - Renomme le serveur
- `!banall` - Bannit tous les membres du serveur
- `!adminall` - Donne les permissions administrateur à tous les rôles

### Commandes avancées
- `!massrole [nom]` - Crée un rôle admin et l'attribue à tous les membres
- `!masschannel [nom] [nombre]` - Crée un grand nombre de salons
- `!webhookspam [message]` - Crée un webhook et spam des messages
- `!massnick [pseudo]` - Change le pseudo de tous les membres
- `!massemoji [nombre]` - Ajoute un nombre aléatoire d'emojis de raid au serveur

## Démarrage

Pour démarrer le bot, exécutez :
```bash
npm start
```

## Avertissement

Ce bot est conçu à des fins éducatives uniquement. L'utilisation de ce bot pour des raids non autorisés peut entraîner la suspension de votre compte Discord. 
