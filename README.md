# 🌐 ProjetKosmio — Frontend

> Interface web React permettant d'uploader des documents PDF, de déclencher la génération de fiches **solutions** et **secteurs** via le pipeline RAG du backend, puis de visualiser, éditer et gérer ces fiches au format Markdown.

---

## 📖 Introduction

ProjetKosmio Frontend est une **Single Page Application (SPA)** développée avec **React 19 + Vite**, stylisée avec **Tailwind CSS v3** et connectée à l'API FastAPI du backend.

Elle offre :

- 📄 **Upload de PDF** avec drag & drop
- 🤖 **Génération IA** de fiches Solutions ou Secteurs (via le backend RAG)
- ✏️ **Éditeur Markdown** intégré (Milkdown) avec prévisualisation
- 🕓 **Historique des versions** avec restauration
- 🌗 **Mode sombre / clair** avec persistance `localStorage`
- 🔐 **Gestion des rôles** (Super Admin, Admin, Lecteur…)
- 🔔 **Modales personnalisées** (succès, erreur, confirmation)

---

## �️ Stack technique

| Composant | Technologie | Version |
|---|---|---|
| **Langage** | JavaScript (ESM) | — |
| **Framework UI** | React | 19 |
| **Bundler** | Vite | 7 |
| **CSS** | Tailwind CSS | 3.4 |
| **Routing** | React Router DOM | 7 |
| **État global** | Redux Toolkit | 2 |
| **Éditeur Markdown** | Milkdown | 7.18 |
| **Icônes** | Lucide React | 0.563 |
| **Drag & Drop** | react-dropzone | 14 |
| **Diff Markdown** | react-diff-viewer-continued | 4 |

---

## 📁 Structure du projet

```
frontend/
├── index.html                    # Point d'entrée HTML (script init dark mode)
├── vite.config.js                # Configuration Vite
├── tailwind.config.js            # Tailwind (darkMode: 'class', couleurs custom)
├── postcss.config.js             # PostCSS (autoprefixer)
├── package.json
│
└── src/
    ├── main.jsx                  # Point d'entrée React (ThemeProvider, ModalProvider)
    ├── App.jsx                   # Routeur principal
    ├── App.css / index.css       # Styles globaux
    │
    ├── pages/
    │   ├── UploadPage.jsx        # Accueil — upload PDF + sélection type fiche + génération IA
    │   ├── EditPage.jsx          # Éditeur de fiche après génération (PDF + Markdown côte à côte)
    │   ├── MarkdownPage.jsx      # Éditeur de fiche existante (par ID, avec historique)
    │   ├── Solution.jsx          # Liste de toutes les fiches Solutions
    │   ├── Sector.jsx            # Liste de toutes les fiches Secteurs
    │   ├── ErrorPage.jsx         # Page permission refusée / accordée
    │   └── PDFPage.jsx           # Visionneuse PDF standalone
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx        # En-tête : nav, rôle utilisateur, toggle dark/light
    │   │   └── Footer.jsx        # Pied de page
    │   ├── markdown/
    │   │   ├── MarkdownEditor.jsx        # Éditeur Milkdown (WYSIWYG Markdown)
    │   │   ├── MarkdownVisualizer.jsx    # Rendu Markdown stylisé (lecture)
    │   │   ├── MarkdownToolbar.jsx       # Barre d'outils (Éditer / Sauvegarder / Valider / Image)
    │   │   ├── FicheTypeSelector.jsx     # Sélecteur Solution / Secteur
    │   │   ├── DropDownAddImage.jsx      # Modale d'upload d'image (portal React)
    │   │   ├── VersionHistory.jsx        # Panneau historique des versions avec restauration
    │   │   └── MarkdownDiff.jsx          # Comparaison visuelle entre deux versions Markdown
    │   ├── pdf/
    │   │   ├── UploadArea.jsx            # Zone drag & drop PDF
    │   │   └── PDF.jsx                   # Composant visionneuse PDF
    │   └── ui/
    │       └── AppModal.jsx              # Modale générique (succès / erreur / confirmation)
    │
    ├── context/
    │   ├── AuthContext.jsx       # Contexte d'authentification + rôle utilisateur
    │   ├── ThemeContext.jsx      # Contexte dark/light mode + persistance localStorage
    │   └── ModalContext.jsx      # Contexte modales globales (showAlert / showConfirm)
    │
    ├── hooks/
    │   ├── useAuth.js            # Hook d'accès au contexte d'authentification
    │   └── useMarkdownApi.js     # Hook d'appels API (generate, get, update, history...)
    │
    ├── store/
    │   ├── store.js              # Configuration Redux store
    │   ├── pdfSlice.js           # Slice : état PDF (fichier, markdown, chargement, id)
    │   └── ficheSlice.js         # Slice : état fiche (image, section)
    │
    └── utils/
        ├── permissions.js        # Gestion des droits par rôle
        ├── markdownToJson.js     # Convertit Markdown → JSON structuré (pour le backend)
        ├── jsonToMarkdown.js     # Convertit JSON backend → Markdown lisible
        └── i18n.js               # Utilitaire de traductions
```

---

## � Routes de l'application

| Route | Page | Description |
|---|---|---|
| `/` | `UploadPage` | Accueil — upload PDF + génération IA |
| `/upload` | `UploadPage` | Alias de l'accueil |
| `/edit` | `EditPage` | Éditeur après génération (vue PDF + Markdown) |
| `/edit/:id` | `MarkdownPage` | Éditeur d'une fiche existante par ID |
| `/solution` | `Solution` | Liste des fiches Solutions |
| `/secteur` | `Sector` | Liste des fiches Secteurs |
| `/error` | `ErrorPage` | Page de permission refusée / accordée |

---

## 🔐 Gestion des rôles

L'accès aux actions est contrôlé par le fichier `utils/permissions.js`. Les rôles actuellement supportés sont :

| Rôle | Actions autorisées |
|---|---|
| **SUPER_ADMIN** | Toutes les actions (upload, generate, update, validate, delete) |
| **ADMIN** | upload, generate, update |
| **LECTEUR** | Lecture seule |

Le rôle est récupéré depuis le backend via le contexte `AuthContext`.

---

## 🌗 Thème Dark / Light

Le mode sombre repose sur la stratégie **class** de Tailwind CSS (`darkMode: 'class'`).

- Un script inline dans `index.html` applique la classe `dark` sur `<html>` **avant** le chargement de React (évite le flash)
- Le `ThemeContext` gère l'état React et persiste le choix dans `localStorage`
- Le toggle est accessible depuis le `Header` (icône Soleil / Lune)

---

## � Système de modales

Toutes les `alert()` et `window.confirm()` natives ont été remplacées par des modales personnalisées via le `ModalContext` :

```jsx
const { showAlert, showConfirm } = useModal();

// Alerte de succès
showAlert('Mise à jour réussie !', 'success');

// Alerte d'erreur
showAlert(err.message, 'error');

// Confirmation avec callback
showConfirm('Supprimer cette fiche ?', () => { /* callback */ });
```

| Variante | Couleur | Icône |
|---|---|---|
| `success` | Vert | ✅ |
| `error` | Rouge | ❌ |
| `warning` | Jaune | ⚠️ |
| `info` | Bleu | ℹ️ |
| `confirm` | Jaune | ❗ + Annuler / Confirmer |

---

## 🚀 Lancement en développement

### Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- Le **backend** en cours d'exécution (voir [README Backend](../backend/README.md))

### Installation

```bash
# À la racine du dossier frontend
npm install
```

### Configuration

Vérifiez l'URL de l'API dans `src/config/` ou `src/hooks/useMarkdownApi.js` pour pointer vers le backend :

```
http://localhost:8000
```

### Démarrage

```bash
npm run dev
```

L'application sera disponible sur : **<http://localhost:5173>**

---

## 📦 Commandes disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement Vite (HMR activé) |
| `npm run build` | Compile le projet pour la production (dossier `dist/`) |
| `npm run preview` | Prévisualise le build de production en local |
| `npm run lint` | Vérifie le code avec ESLint |

---

## 🔗 Connexion avec le backend

Le frontend communique avec l'API FastAPI via le hook `useMarkdownApi` qui expose les méthodes suivantes :

| Méthode hook | Endpoint backend | Description |
|---|---|---|
| `generateInfo(pdf, type)` | `POST /process_solution` ou `POST /process_sector` | Génère une fiche depuis un PDF |
| `getFileById(id)` | `GET /fiche/{id}` | Récupère une fiche par ID |
| `getAllSolution()` | `GET /fiche/solution` | Liste toutes les solutions |
| `getAllSector()` | `GET /fiche/sector` | Liste tous les secteurs |
| `update(id, data)` | `PUT /fiche/{id}` | Met à jour une fiche |
| `getHistoryById(id)` | `GET /fiche/{id}/history` | Historique des versions |

---

## 📄 Licence

Projet interne — Usage restreint.
