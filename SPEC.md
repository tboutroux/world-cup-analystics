# Spécifications : Page Détail du Match

Cette page affiche les informations détaillées d'un match de la Coupe du Monde 2026.

## Structure de la page
La page est accessible via la route `/match/[id]`.
Elle comporte un en-tête avec :
- Le score en direct (si applicable).
- Les drapeaux des deux pays (utilisant les logos officiels de l'équipe).
- Quatre onglets principaux.

## Onglets

### 1. Derniers Matchs (Toujours visible)
Affiche les résultats des 5 derniers matchs de chaque équipe.
- Données sources : `boxscore.form` dans l'API de résumé.
- Affichage : Liste chronologique avec le score et l'adversaire.

### 2. Compositions (Si le match a démarré)
Affiche les compositions des deux équipes sur un terrain de football virtuel.
- Données sources : `rosters` dans l'API de résumé.
- Affichage :
    - Terrain vert (représentation visuelle).
    - Joueurs (titulaires uniquement : `starter === true`).
    - Chaque joueur est représenté par un cercle contenant son numéro (`jersey`) et son nom en dessous.
    - Utiliser `formationPlace` pour positionner les joueurs sur le terrain.

### 3. Statistiques (Si le match a démarré)
Affiche les statistiques détaillées des deux équipes.
- Données sources : `boxscore.teams[].statistics`.
- Statistiques à inclure : Possession, Tirs, Tirs Cadrés, Corners, Hors-jeu, Fautes, Cartons, Passes, Arrêts.

### 4. Highlights (Fil du match) (Si le match a démarré ou est terminé)
Affiche la chronologie complète des événements du match.
- Données sources : `keyEvents` dans l'API de résumé.
- Événements à inclure :
    - Buts (avec nom du buteur).
    - Cartons jaunes et rouges.
    - Remplacements (joueur sortant et entrant).
    - Début et fin de mi-temps.
    - Pauses fraîcheur (Start/End Delay).
    - Notes importantes.
- Affichage : Timeline verticale avec icônes spécifiques pour chaque type d'événement et le temps (`clock.displayValue`).

## Comportement conditionnel
- Si le match est en état "pre" (non démarré), seuls l'onglet "Derniers Matchs" est visible par défaut.
- Si le match est en état "in" ou "post", les onglets "Compositions", "Statistiques" et "Highlights" deviennent accessibles.
