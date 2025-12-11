# WikiCO2 – Module CEMET (Frontend)

**CEMET : Chargement – Extraction – Mise en Template**

Ce dépôt contient le code source **Frontend** du module CEMET pour WikiCO2.
Ce module a pour but d'accélérer la structuration des contenus bas-carbone via l'extraction automatique d'informations à partir de documents PDF.

## 📋 À propos

Le module **CEMET** est une brique fonctionnelle permettant l'**extraction automatique d’informations structurées** (titres, tableaux, données chiffrées) depuis des rapports ou fiches techniques (PDF), pour générer des fiches **Solutions** et **Secteurs** conformes aux standards WikiCO2.

### Objectifs principaux (Phase 1)

- **Interface d'upload** de documents PDF.
- **Visualisation côte-à-côte** : PDF source vs Données extraites.
- **Édition et correction** via une interface riche (Markdown).
- **Export** vers le format WikiCO2.

## 🛠 Stack Technique

Ce projet est initialisé avec **Vite + React**.

Conformément aux spécifications techniques (Phase 1) :

- **Framework** : React 19
- **Build Tool** : Vite
- **Langage** : JavaScript / JSX
- **Styles** : CSS (Transition vers Tailwind CSS planifiée)

## 🚀 Installation et Démarrage

1. **Cloner le projet**

    ```bash
    git clone https://github.com/votre-org/cemet-frontend.git
    cd cemet-frontend
    ```

2. **Installer les dépendances**

    ```bash
    npm install
    ```

3. **Lancer le serveur de développement**

    ```bash
    npm run dev
    ```

## 📅 Roadmap (Frontend)

- [x] Initialisation du projet (Vite + React)
- [ ] Intégration de l'interface d'upload (Drag & Drop)
- [ ] Module de visualisation PDF
- [ ] Intégration de l'éditeur Markdown (ex: Milkdown/TipTap)
- [ ] Connexion API (Backend Python/FastAPI)

## 📄 Licence

Projet Open-Source - Voir le fichier LICENSE pour plus de détails.
