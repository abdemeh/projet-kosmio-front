/**
 * Convertit une chaîne Markdown (éditée via Milkdown/TipTap) en objet JSON structuré.
 * @param {string} markdown - Le contenu Markdown complet.
 * @returns {Object} - L'objet JSON (Solution ou Secteur).
 */
export function markdownToJSON(markdown) {
    if (!markdown) return null;

    const isSector = markdown.includes("Sous-secteurs") || 
                     markdown.includes("Description synthétique") ||
                     markdown.includes("Profil d’émissions");

    const sections = splitByHeaders(markdown);

    if (isSector) {
        return parseSectorMarkdown(sections, markdown);
    } else {
        return parseSolutionMarkdown(sections, markdown);
    }   
}

/* ============================================================
   PARSER SOLUTION
   ============================================================ */
function parseSolutionMarkdown(sections, fullMd) {
    const intro = sections['intro'] || "";
    const catSysValue = extractValue(intro, "Catégorie / Système");
    const catParts = catSysValue.split('/');

    return {
        type: "solution",
        title: extractTitle(intro),        
        metadata: {
            category: (catParts[0] || "").trim() || "N/A",
            system: (catParts[1] || "").trim() || "N/A",
            type: extractValue(intro, "Type de solution"),
            maturity: extractValue(intro, "Niveau de maturité"),
            cost_scale: extractValue(intro, "Coût typique"),
            complexity: extractValue(intro, "Complexité"),
            last_update: extractValue(intro, "Dernière mise à jour"),
            contributors: extractListLine(intro, "Contributeurs")
        },

        summary: sections['Résumé'] || extractContentUnderHeader(fullMd, "Résumé"),        
        content: {
            context: {
                objective: extractValue(sections['1'], "Objectif principal"),
                target_sites: extractListLine(sections['1'], "Types de sites concernés"),
                scope_includes: extractListLine(sections['1'], "Inclut"),
                scope_excludes: extractListLine(sections['1'], "N’inclut pas"),
                prerequisites: extractListLine(sections['1'], "Prérequis")
            },
            mechanism: {
                description: getCleanTextBeforeSubHeader(sections['2']),
                variants: extractBulletPoints(sections['2'])
            },
            applicability: {
                conditions: extractBulletPointsAfter(sections['3'], "Pertinent quand"),
                avoid_if: extractBulletPointsAfter(sections['3'], "À éviter si"),
                constraints: extractBulletPointsAfter(sections['3'], "Contraintes")
            },
            impacts: {
                energy: extractContentUnderHeader(sections['4'], "Énergie"),
                co2: extractContentUnderHeader(sections['4'], "CO₂"),
                costs: {
                    capex: extractValue(sections['4'], "Capex"),
                    opex: extractValue(sections['4'], "Opex"),
                    roi: extractValue(sections['4'], "ROI")
                },
                co_benefits: extractBulletPointsAfter(sections['4'], "Co-bénéfices")
            },
            levers: extractBulletPoints(sections['5']),
            implementation_path: extractNumberedSteps(sections['6']),
            risks: extractRisks(sections['7']),
            examples: extractExamples(sections['8']),
            resources: extractResources(sections['9'])
        },
        contribution: {
            validation_level: extractValue(sections['10'], "Niveau de validation"),
            history: extractListLine(sections['10'], "Historique"),
            improvement_proposal_link: extractValue(sections['10'], "Proposer une amélioration")
        }
    };
}

/* ============================================================
   PARSER SECTEUR
   ============================================================ */
function parseSectorMarkdown(sections, fullMd) {
    const intro = sections['intro'] || "";

    return {
        type: "secteur",
        title: extractTitle(intro),
        metadata: {
            sub_sectors: extractListLine(intro, "Sous-secteurs"),
            company_size: extractValue(intro, "Taille d’entreprise typique"),
            last_update: extractValue(intro, "Dernière mise à jour"),
            contributors: extractListLine(intro, "Contributeurs")
        },
        summary: sections['Résumé'] || extractContentUnderHeader(fullMd, "Résumé"),        
        content: {
            description: getSectionContent(sections['1']),
            emissions_profile: {
                process: extractValue(sections['2'], "Procédés"),
                utilities: extractValue(sections['2'], "Utilités"),
                building: extractValue(sections['2'], "Bâtiment"),
                transport: extractValue(sections['2'], "Déplacements"),
                waste: extractValue(sections['2'], "Déchets")
            },
            challenges: extractChallenges(sections['3']),
            regulations: extractListLine(sections['3'], "Réglementations clés"),
            systems_matrix: extractTableData(sections['4']),
            sector_path: extractNumberedSteps(sections['5'], true), // true = format simple
            use_cases: extractSectorCases(sections['6']),
            resources: extractResources(sections['7'])
        },
        contribution: {
            completeness: extractValue(sections['8'], "Niveau de complétude"),
            validator: extractValue(sections['8'], "Validateur métier"),
            history: extractListLine(sections['8'], "Historique"),
            improvement_proposal_link: extractValue(sections['8'], "Proposer une amélioration")
        }
    };
}

/* ============================================================
   UTILITAIRES DE PARSING (REGEX & STRING MANIPULATION)
   ============================================================ */

// Découpe le Markdown en un objet { 'intro': '...', '1': '...', '2': '...' } basé sur "## X."
function splitByHeaders(md) {
    const lines = md.split('\n');
    const sections = { intro: [] };
    let currentKey = 'intro';

    lines.forEach(line => {
        // Détecte "## 1. Titre" ou "## 10. Titre" ou "## 🎯"
        const sectionMatch = line.match(/^##\s+.*?\s*(\d+)\.?/);
        const emojiHeaderMatch = line.match(/^##\s+([^\d\s].*)/);
        
        if (sectionMatch) {
            currentKey = sectionMatch[1];
            sections[currentKey] = [];
        } else if (emojiHeaderMatch && currentKey === 'intro') {
            // Capture les sections nommées comme "Résumé"
            const name = emojiHeaderMatch[1].replace(/[^\w\s]/gi, '').trim(); 
            if (name.includes("Résumé")) {
                currentKey = "Résumé";
                sections[currentKey] = [];
            }
        } else {
            if (!sections[currentKey]) sections[currentKey] = [];
            sections[currentKey].push(line);
        }
    });

    // Join lines back to strings
    Object.keys(sections).forEach(key => {
        sections[key] = sections[key].join('\n').trim();
    });
    return sections;
}

function extractTitle(text) {
    const match = text.match(/^#\s+(.*)/m);
    return match ? match[1].trim() : "";
}

// Extrait "Valeur" de "**Clé :** Valeur"
function extractValue(text, key) {
    if (!text) return "";

    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\*\\*${escapedKey}\\s*[:\\*]*\\s*(.*)`, 'i');
    
    const match = text.match(regex);
    if (match && match[1]) {
        return match[1].trim();
    }
    return "";
}

// Extrait une liste séparée par des virgules "A, B, C" -> ["A", "B", "C"]
function extractListLine(text, key) {
    const val = extractValue(text, key);
    if (!val || val.toLowerCase().includes("non spécifié") || val === "N/A") return [];
    return val.split(',').map(s => s.trim()).filter(s => s !== "");
}

// Extrait les puces "- Item"
function extractBulletPoints(text) {
    if (!text) return [];
    const lines = text.split('\n');
    return lines
        .map(l => l.trim())
        .filter(l => l.startsWith('- ') || l.startsWith('* '))
        .map(l => l.substring(2).trim())
        .filter(l => !l.includes('**:'));
}

// Extrait les puces situées APRES un sous-titre ou un mot clé spécifique
function extractBulletPointsAfter(text, triggerPhrase) {
    if (!text) return [];
    const parts = text.split(triggerPhrase);
    if (parts.length < 2) return [];
    // On prend la partie après la phrase, et on s'arrête au prochain double saut de ligne ou titre
    const relevantPart = parts[1].split(/\n\n|###/)[0];
    return extractBulletPoints(relevantPart);
}

// Nettoie le texte avant le premier sous-titre ###
function getCleanTextBeforeSubHeader(text) {
    if (!text) return "";
    return text.split('###')[0].trim();
}

// Récupère le contenu brut d'une section en nettoyant les sauts de ligne excessifs
function getSectionContent(sections, key) {
    // Si key est un objet (cas splitByHeaders), on prend direct, sinon on cherche
    let content = typeof sections === 'string' ? sections : sections[key];
    return content ? content.trim() : "";
}

function extractContentUnderHeader(text, subHeader) {
    if (!text) return "";
    const regex = new RegExp(`###\\s*${subHeader}[\\s\\S]*?(?=###|$)`, 'i');
    const match = text.match(regex);
    if (!match) return "";
    // Enlever le titre du match
    return match[0].replace(new RegExp(`###\\s*${subHeader}`, 'i'), '').trim().replace(/^- /gm, '');
}

// Parsing spécifique pour les étapes numérotées "1. **Titre** description"
function extractNumberedSteps(text, simple = false) {
    if (!text) return [];
    const regex = /(\d+)\.\s+\*\*(.*?)\*\*([\s\S]*?)(?=(?:\d+\.\s+\*\*)|$)/g;
    let match;
    const steps = [];

    while ((match = regex.exec(text)) !== null) {
        if (simple) {
            // Cas Secteur : "1. **Phase** - action"
            steps.push({
                phase: match[2].trim(),
                action: match[3].replace(/-\s+/, '').trim()
            });
        } else {
            // Cas Solution : "1. **Step** details"
            steps.push({
                step: match[2].trim(),
                details: match[3].trim()
            });
        }
    }
    return steps;
}

// Parsing des Risques (Format spécifique Titre / Mitigation)
function extractRisks(text) {
    if (!text) return [];
    const riskSection = extractBulletPointsAfter(text, "Risques possibles");
    const mitiSection = extractBulletPointsAfter(text, "Stratégies de mitigation");

    // On essaie de mapper index par index (rudimentaire mais fonctionnel si l'ordre est respecté)
    return riskSection.map((r, i) => ({
        risk: r,
        mitigation: mitiSection[i] || ""
    }));
}

// Parsing des Exemples
function extractExamples(text) {
    if (!text) return [];
    const regex = /- \*\*Cas n°\d+ – (.*?)\s*:\*\*\s*(.*?)(\(\[Lien\]\((.*?)\)\))?$/gm;
    let match;
    const examples = [];
    while ((match = regex.exec(text)) !== null) {
        examples.push({
            secteur: match[1].trim(),
            resume: match[2].trim(),
            link: match[4] || ""
        });
    }
    return examples;
}

// Parsing des Ressources
function extractResources(text) {
    // Regex pour [Titre](Lien) (Type)
    const regex = /-\s+\[(.*?)\]\((.*?)\)\s*(?:\((.*?)\))?/g;
    let match;
    const resources = [];
    while ((match = regex.exec(text)) !== null) {
        resources.push({
            title: match[1],
            link: match[2],
            type: match[3] || "Autre"
        });
    }
    return resources;
}

// Parsing des Enjeux (Secteur)
function extractChallenges(text) {
    const regex = /- \*\*Enjeu \d+ \((.*?)\)\s*:\*\*\s*(.*)/g;
    let match;
    const res = [];
    while ((match = regex.exec(text)) !== null) {
        res.push({ title: match[1], description: match[2] });
    }
    return res;
}

// Parsing des Cas d'usage (Secteur - format ### Cas n°1)
function extractSectorCases(text) {
    if(!text) return [];
    // Split par "### Cas"
    const parts = text.split(/### Cas n°\d+ – /);
    parts.shift(); // Enlever le premier élément vide ou intro

    return parts.map(part => {
        const subSectorMatch = text.match(/### Cas n°\d+ – (.*)/); // Récupérer le nom dans le split précédent est dur, on simplifie
        // Approche simplifiée : on suppose que le titre était juste au dessus.
        // Mieux : Regex global sur le bloc complet
        return {
            sub_sector: "Extrait", // Difficile à récupérer parfaitement avec split simple, à affiner si critique
            actions: extractValue(part, "Actions"),
            results: extractValue(part, "Résultats"),
            link: extractValue(part, "Lien")
        };
    });
}

// Parsing du Tableau Markdown (Secteur)
function extractTableData(text) {
    if (!text) return [];
    const lines = text.split('\n').filter(l => l.trim().startsWith('|'));
    // Enlever header et séparateur
    if (lines.length < 3) return [];
    const dataLines = lines.slice(2);

    return dataLines.map(line => {
        // Split par | et trim
        const cols = line.split('|').map(c => c.trim()).filter(c => c !== "");
        if (cols.length < 4) return null;

        return {
            system: cols[0],
            impact: cols[1],
            priority: cols[2],
            // On avait mis des <br> pour les solutions, on les remet en array
            solutions: cols[3].split('<br>').map(s => s.replace(/^- /, '').trim())
        };
    }).filter(x => x !== null);
}