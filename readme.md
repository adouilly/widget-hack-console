# Hack Console Widget

Console virtuelle type "Matrix" autonome, par Antoine Douilly.

## Présentation

Ce widget ajoute une console virtuelle stylisée façon Matrix en haut de votre page web. Il capture les appels à `console.log` et les affiche dans une zone dédiée, avec un effet visuel animé.

## Installation

1. **Téléchargez** le fichier `hack-console-widget.js`.
2. **Ajoutez** le script à votre projet, par exemple dans votre dossier `public` ou à la racine de votre projet web.

## Utilisation

### 1. Ajout du script dans votre page HTML

Ajoutez la ligne suivante juste avant la balise `</body>` de votre fichier HTML :

```html
<script src="hack-console-widget.js"></script>
```

> Remplacez le chemin si besoin selon l'emplacement du fichier.

### 2. Initialiser la console virtuelle

Dans votre code JavaScript, appelez simplement :

```js
initHackConsole();
```

Cela affichera la console virtuelle en haut de la page et redirigera tous les `console.log` vers cette console.

### 3. Retirer la console virtuelle

Pour retirer la console et restaurer le comportement normal de `console.log` :

```js
removeHackConsole();
```

## Personnalisation

- Le widget s'affiche en haut de la page, prend toute la largeur, et peut être redimensionné verticalement.
- Les logs sont affichés en temps réel.
- L'effet Matrix est animé en arrière-plan.
- Le style peut être modifié en éditant le fichier `hack-console-widget.js` (section CSS dans `injectStyles()`).

## Exemples

```js
initHackConsole();
console.log("Bienvenue dans la console Matrix !");
setTimeout(() => {
  console.log("Vous pouvez retirer la console à tout moment.");
  removeHackConsole();
}, 10000);
```

## Compatibilité

- Fonctionne sur tous les navigateurs modernes.
- Ne nécessite aucune dépendance externe.

## Auteur

Antoine Douilly

---
"# widget-hack-console" 
