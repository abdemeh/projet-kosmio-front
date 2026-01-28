/**
 * Convertit un objet JSON (Solution ou Secteur) en chaîne Markdown.
 * @param {Object} data - L'objet JSON reçu du backend.
 * @returns {string} - Le contenu Markdown formaté.
 */
export function jsonToMarkdown(data) {
    if (!data || !data.type) {
        console.error("Format JSON invalide ou type manquant");
        return "";
    }

    switch (data.type) {
        case "solution":
            return generateSolutionMarkdown(data);
        case "secteur":
            return generateSectorMarkdown(data);
        default:
            return `> ⚠️ Type de fiche inconnu : ${data.type}`;
    }
}

function generateSolutionMarkdown(data) {
    const meta = data.metadata || {};
    const content = data.content || {};
    const ctx = content.context || {};
    const impact = content.impacts || {};

    return `
# ${data.title || "Titre de la Solution"}

**Catégorie / Système :** ${meta.category || "N/A"} / ${meta.system || "N/A"}  
**Type de solution :** ${meta.type || "N/A"}  
**Niveau de maturité :** ${meta.maturity || "N/A"}  
**Coût typique :** ${meta.cost_scale || "N/A"}  
**Complexité :** ${meta.complexity || "N/A"}  
**Dernière mise à jour :** ${meta.last_update || "N/A"}  
**Contributeurs :** ${formatListLine(meta.contributors)}

---

## 🎯 Résumé (10 secondes)

${data.summary || "Pas de résumé disponible."}

---

## 🧭 1. Contexte & périmètre

- **Objectif principal :** ${ctx.objective || ""}
- **Types de sites concernés :** ${formatListLine(ctx.target_sites)}
- **Inclut :** ${formatListLine(ctx.scope_includes)}
- **N’inclut pas :** ${formatListLine(ctx.scope_excludes)}
- **Prérequis :** ${formatListLine(ctx.prerequisites)}

---

## ⚙️ 2. Fonctionnement

${content.mechanism?.description || ""}

### Variantes possibles
${formatListCheck(content.mechanism?.variants)}

---

## 📌 3. Conditions d’applicabilité

- **Pertinent quand :**
${formatListBullet(content.applicability?.conditions, 2)}

- **À éviter si :**
${formatListBullet(content.applicability?.avoid_if, 2)}

- **Contraintes :**
${formatListBullet(content.applicability?.constraints, 2)}

---

## 📊 4. Impacts attendus

### Énergie
- ${impact.energy || "Non spécifié"}

### CO₂
- ${impact.co2 || "Non spécifié"}

### Coûts (Capex / Opex)
- **Capex :** ${impact.costs?.capex || "N/A"}
- **Opex :** ${impact.costs?.opex || "N/A"}
- **ROI :** ${impact.costs?.roi || "N/A"}

### Co-bénéfices
${formatListBullet(impact.co_benefits)}

---

## 🛠️ 5. Leviers associés

${formatListBullet(content.levers)}

---

## 🚀 6. Parcours de mise en œuvre

${formatSteps(content.implementation_path)}

---

## ⚠️ 7. Risques / freins & solutions

${formatRisks(content.risks)}

---

## 📚 8. Exemples & cas d’usage

${formatExamples(content.examples)}

---

## 🧰 9. Ressources & outils

${formatResources(content.resources)}

---

## 🏷️ 10. Métadonnées & contribution

- **Niveau de validation :** ${data.contribution?.validation_level || "Brouillon"}  
- **Historique :** ${formatListLine(data.contribution?.history)}  
- **Proposer une amélioration :** ${data.contribution?.improvement_proposal_link || "#"}
`.trim();
}


function generateSectorMarkdown(data) {
    const meta = data.metadata || {};
    const content = data.content || {};
    const profile = content.emissions_profile || {};

    return `
# ${data.title || "Titre du Secteur"}

**Sous-secteurs :** ${formatListLine(meta.sub_sectors)}  
**Taille d’entreprise typique :** ${meta.company_size || "N/A"}  
**Dernière mise à jour :** ${meta.last_update || "N/A"}  
**Contributeurs :** ${formatListLine(meta.contributors)}

---

## 🧭 1. Description synthétique du secteur

${data.summary || ""}

${content.description || ""}

---

## 📊 2. Profil d’émissions & consommations

### Répartition typique des postes d’émissions
- **Procédés :** ${profile.process || "N/A"}
- **Utilités :** ${profile.utilities || "N/A"}
- **Bâtiment :** ${profile.building || "N/A"}
- **Déplacements :** ${profile.transport || "N/A"}
- **Déchets :** ${profile.waste || "N/A"}

---

## 🎯 3. Enjeux & priorités climatiques

${formatChallenges(content.challenges)}

- **Réglementations clés :** ${formatListLine(content.regulations)}

---

## 🧩 4. Systèmes & solutions clés pour ce secteur

${formatSystemTable(content.systems_matrix)}

---

## 🚀 5. Parcours sectoriel recommandé

${formatSectorPath(content.sector_path)}

---

## 📚 6. Cas d’usage sectoriels

${formatSectorCases(content.use_cases)}

---

## 🧰 7. Ressources sectorielles

${formatResources(content.resources)}

---

## 🏷️ 8. Métadonnées

- **Niveau de complétude :** ${data.contribution?.completeness || "Partielle"}  
- **Validateur métier :** ${data.contribution?.validator || "N/A"}  
- **Historique :** ${formatListLine(data.contribution?.history)}  
- **Proposer une amélioration :** ${data.contribution?.improvement_proposal_link || "#"}
`.trim();
}

/* ============================================================
   UTILITAIRES DE FORMATAGE
   ============================================================ */

// Transforme un tableau ["a", "b"] en "a, b"
function formatListLine(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "Non spécifié";
    return arr.join(", ");
}

// Transforme un tableau en liste à puces "- item"
function formatListBullet(arr, indentLevel = 0) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    const indent = "  ".repeat(indentLevel);
    return arr.map((item) => `${indent}- ${item}`).join("\n");
}

// Transforme un tableau en liste de variantes
function formatListCheck(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return "";
    return arr.map((item) => `- ${item}`).join("\n");
}

// Formate les étapes numérotées (Solution)
function formatSteps(steps) {
    if (!Array.isArray(steps)) return "";
    return steps
        .map((s, index) => `${index + 1}. **${s.step}**\n   ${s.details}`)
        .join("\n\n");
}

// Formate les risques et solutions
function formatRisks(risks) {
    if (!Array.isArray(risks)) return "";
    return `**Risques possibles :**\n${risks
        .map((r) => `- ${r.risk}`)
        .join("\n")}\n\n**Stratégies de mitigation :**\n${risks
        .map((r) => `- ${r.mitigation}`)
        .join("\n")}`;
}

// Formate les exemples (Solution)
function formatExamples(examples) {
    if (!Array.isArray(examples)) return "";
    return examples
        .map(
            (ex, i) =>
                `- **Cas n°${i + 1} – ${ex.secteur} :** ${ex.resume} ${
                    ex.link ? `([Lien](${ex.link}))` : ""
                }`
        )
        .join("\n");
}

// Formate les ressources
function formatResources(resources) {
    if (!Array.isArray(resources)) return "";
    return resources
        .map(
            (res) =>
                `- [${res.title}](${res.link}) (${res.type || "Lien"})`
        )
        .join("\n");
}

// SECTEUR : Formate les enjeux
function formatChallenges(challenges) {
    if (!Array.isArray(challenges)) return "";
    return challenges
        .map((c, i) => `- **Enjeu ${i + 1} (${c.title}) :** ${c.description}`)
        .join("\n");
}

// SECTEUR : Tableau des systèmes
function formatSystemTable(matrix) {
    if (!Array.isArray(matrix) || matrix.length === 0) return "";

    const header = `| Système | Impact | Priorité | Solutions associées |\n|---|---|---|---|`;
    const rows = matrix.map((row) => {
        // On transforme le tableau de solutions en liste HTML-friendly pour le tableau Markdown
        const solutionsList = Array.isArray(row.solutions)
            ? row.solutions.map(s => `- ${s}`).join('<br>')
            : row.solutions;

        return `| ${row.system} | ${row.impact} | ${row.priority} | ${solutionsList} |`;
    }).join("\n");

    return `${header}\n${rows}`;
}

// SECTEUR : Parcours
function formatSectorPath(path) {
    if (!Array.isArray(path)) return "";
    return path.map((p, i) => `${i + 1}. **${p.phase}**\n   - ${p.action}`).join("\n\n");
}

// SECTEUR : Cas d'usage
function formatSectorCases(cases) {
    if (!Array.isArray(cases)) return "";
    return cases.map((c, i) =>
        `### Cas n°${i + 1} – ${c.sub_sector}\n- **Actions :** ${c.actions}\n- **Résultats :** ${c.results}\n- **Lien :** ${c.link || "N/A"}`
    ).join("\n\n");
}