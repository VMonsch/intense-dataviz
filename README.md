# intense-dataviz

## Intro

Ce projet a été effectué dans le cadre du Master MIAGE spécialité INTENSE pour le cours de M. Buffa.

Une version live est accessible à l'adresse https://intense-dataviz.web.app/.

## Tech stack

### Framework

Nous n'avons pas de réelle expérience dans le front-end (deux développeurs back-end), et avons donc choisi Angular pour son implémentation out-of-the-box de certains patterns et bonnes pratiques de développements, ainsi que pour sa structure précisément décomposée. Sa facilitation de l'injection (velocity-like) a également été un facteur déterminant dans notre choix.

### Datasource

Notre unique source de données est la database Wasabi de l'i3s (https://wasabi.i3s.unice.fr/apidoc/). Nous avons cherché à exploiter au mieux certaines des APIs qui sortaient un tant soit peu de l'ordinaire "get X by ID/Name", i.e. "artists with most albums" or "members with the most bands" (cf homepage). 

### Persistance

Nous avons opté pour Firebase (Cloud Firestore) pour le stockage de données et notre hébergement. Les fonctionnalités de Firebase nous ont malheureusement vite bloqués, ne permettant pas la sauvegarde de données comprenant des tableaux imbriqués (nested arrays) de type [[1, 2, 3], ['a', 'b', 'c']].

Nous avons donc choisi de ne pas modifier nos données (celles fournies par Wasabi) pour correspondre à la solution de stockage et n'avons pas donné suite à la feature de gestion de l'historique initialement prévue. Pour l'implémenter proprement, il serait nécessaire de changer de database provider, ce qui n'est pas notre priorité dans l'immédiat.

### Affichage avancé (graphes, ...)

Nous avons choisi d'utiliser amCharts pour la data visualization, puisque leur librairie est fournie, manipulable à un niveau de détail élevé, et de nombreux exemples sont fournis.

Dans l'ensemble, la librairie est très satisfaisante et permet de partir facilement d'un exemple pour customiser n'importe quel aspect puisque l'ensemble de leurs implémentations sont très verbeuses.
Leur support de TypeScript n'est cependant pas optimal et présente plusieurs erreurs syntaxiques qu'il faut conserver et ignorer avec @ts-ignore.

### Intégration continue et déploiement continu (CI/CD)

Nous avions initiallement opté pour Travis CI, mais cet outil n'inclut pas la gestion des private repositories dans sa version gratuite. C'est donc CircleCI qui a pris le pas.

Notre implémentation de CircleCI est liée à la branche master uniquement : dès qu'un commit est poussé sur cette branche (considérée de production), un webhook déclenche un job qui commence par le build/CI (dépendences npm & angular CLI), et enchaîne sur le déploiement/CD de l'output du build (./dist & firebase CLI) vers notre hosting.

## Structure

### Modèle

Nous manipulons un unique modèle représentant un artiste (ArtistModel). Il est particulièrement utile puisqu'il permet de manipuler la plupart des informations traitées dans le cadre de ce projet.

### Services

Nous exploitons trois services : deux pour l'échange de données (Wasabi, Firebase) et un pour l'affichage de nos graphes (AmCharts).
Cette utilisation de singletons injectés automatiquements nous permet de regrouper par catégories l'ensemble de nos fonctions externalisées par APIs REST ou librairies.

### Composants

Nous avons un composant par route/page (Homepage, Artist, Album, Comparison) ainsi qu'un composant constamment on-screen (Navbar) et des composants spécifiques destinés à être réutilisés (Chart).

Dans l'idéal, nous aurions créé un composant pour chaque graphe que nous avons implémenté, mais la nature de ce projet fait qu'il ne sont utilisés qu'une fois et le volume de graphes nous aurait fait perdre du temps sur l'implémentation de fonctionnalités à forte valeur.