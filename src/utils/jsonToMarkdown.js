// Transformation JSON → Markdown

const mdList = (val) => {
  if (!val) return "_Non renseigné_";
  if (Array.isArray(val)) return val.length ? val.map(v => `- ${v}`).join("\n") : "_Non renseigné_";
  if (typeof val === "string") return val.trim() ? val : "_Non renseigné_";
  return "_Non renseigné_";
};

const mdSection = (title, content) =>
  content ? `\n## ${title}\n\n${content}\n` : "";

const safe = (v, fallback = "_Non renseigné_") =>
  v !== undefined && v !== null && v !== "" ? v : fallback;


export const jsonToMarkdown = (data) => {
  return `
---
type: ${safe(data.type)}
id: ${safe(data.id)}
title: "${safe(data.title)}"
category: "${safe(data.metadata?.category)}"
system: "${safe(data.metadata?.system)}"
solution_type: "${safe(data.metadata?.type)}"
maturity: "${safe(data.metadata?.maturity)}"
cost_scale: "${safe(data.metadata?.cost_scale)}"
complexity: "${safe(data.metadata?.complexity)}"
last_update: "${safe(data.metadata?.last_update)}"
contributors:
${(data.metadata?.contributors || []).map(c => `  - ${c}`).join("\n")}
---

# ${safe(data.title)}

## 🧠 Résumé
${safe(data.summary)}

## 🎯 Contexte & Objectifs

**Objectif :**
${safe(data.content?.context?.objective)}

**Sites cibles :**
${mdList(data.content?.context?.target_sites)}

**Inclus :**
${mdList(data.content?.context?.scope_includes)}

**Exclus :**
${mdList(data.content?.context?.scope_excludes)}

**Prérequis :**
${mdList(data.content?.context?.prerequisites)}

## ⚙️ Principe de fonctionnement
${safe(data.content?.mechanism?.description)}

**Variantes :**
${mdList(data.content?.mechanism?.variants)}

## 📍 Conditions d’application

**Conditions favorables :**
${mdList(data.content?.applicability?.conditions)}

**Contraintes :**
${mdList(data.content?.applicability?.constraints)}

## 📊 Impacts

### 🔋 Énergie
${safe(data.content?.impacts?.energy)}

### 🌍 CO₂
${safe(data.content?.impacts?.co2)}

### 💰 Coûts
- **CAPEX :** ${safe(data.content?.impacts?.costs?.capex)}
- **OPEX :** ${safe(data.content?.impacts?.costs?.opex)}
- **ROI :** ${safe(data.content?.impacts?.costs?.roi)}

### ➕ Co-bénéfices
${mdList(data.content?.impacts?.co_benefits)}

## 🧩 Leviers complémentaires
${mdList(data.content?.levers)}

## 🛠️ Parcours de mise en œuvre
${(data.content?.implementation_path || [])
  .map((s, i) => `${i + 1}. **${s.step}**\n   ${s.details}`)
  .join("\n\n")}

## ⚠️ Risques & vigilances
${(data.content?.risks || [])
  .map(r => `- **${r.risk}**\n  _Mitigation :_ ${r.mitigation}`)
  .join("\n")}

## 🧪 Exemples
${(data.content?.examples || [])
  .map(e => `### ${e.title}\n${e.description}${e.link ? `\n[Voir le projet](${e.link})` : ""}`)
  .join("\n\n")}

## 📚 Ressources
${(data.content?.resources || [])
  .map(r => `- **${r.title}** – ${r.type}`)
  .join("\n")}

## 🔎 Traçabilité
- **Source PDF :** ${safe(data.traceability?.source_pdf)}
- **Confiance extraction :** ${safe(data.traceability?.extraction_confidence)}
- **Chunks utilisés :** ${(data.traceability?.chunks_used || []).join(", ")}
`;
};
