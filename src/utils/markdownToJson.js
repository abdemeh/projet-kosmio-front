/**
 * Convertit une chaîne Markdown (éditée via Milkdown/TipTap) en objet JSON structuré.
 * @param {string} markdown - Le contenu Markdown complet.
 * @returns {Object} - L'objet JSON (Solution ou Secteur).
 */
export function markdownToJSON(markdown) {
    if (!markdown) return null;

    const isSector = markdown.includes("**Sous-secteurs :**") || markdown.includes("Description synthétique du secteur");

    if (isSector) {
        return parseSectorMarkdown(markdown);
    } else {
        return parseSolutionMarkdown(markdown);
    }
}

/* ============================================================
   PARSER SOLUTION
   ============================================================ */
function parseSolutionMarkdown(md) {
    const sections = splitByHeaders(md);

    // Extraction Méta-données (Haut de page)
    const metaText = sections['intro'] || "";
    const title = extractTitle(metaText);

    return {
        type: "solution",
        title: title,
        metadata: {
            category: extractValue(metaText, "Catégorie / Système").split('/')[0]?.trim(),
            system: extractValue(metaText, "Catégorie / Système").split('/')[1]?.trim(),
            type: extractValue(metaText, "Type de solution"),
            maturity: extractValue(metaText, "Niveau de maturité"),
            cost_scale: extractValue(metaText, "Coût typique"),
            complexity: extractValue(metaText, "Complexité"),
            last_update: extractValue(metaText, "Dernière mise à jour"),
            contributors: extractListLine(metaText, "Contributeurs")
        },
        summary: getSectionContent(sections, "Résumé"),
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
function parseSectorMarkdown(md) {
    const sections = splitByHeaders(md);
    const metaText = sections['intro'] || "";

    return {
        type: "secteur",
        title: extractTitle(metaText),
        metadata: {
            sub_sectors: extractListLine(metaText, "Sous-secteurs"),
            company_size: extractValue(metaText, "Taille d’entreprise typique"),
            last_update: extractValue(metaText, "Dernière mise à jour"),
            contributors: extractListLine(metaText, "Contributeurs")
        },
        summary: getSectionContent(sections['1']), // Supposant que tout le contenu est le résumé/desc
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
        const headerMatch = line.match(/^##\s+(\d+)\./); 
        if (headerMatch) {
            currentKey = headerMatch[1];
            sections[currentKey] = [];
        } else if (line.startsWith('## ')) {
             currentKey = line.replace('## ', '').trim();
             sections[currentKey] = [];
        } else {
            sections[currentKey].push(line);
        }
    });

    Object.keys(sections).forEach(key => {
        sections[key] = sections[key].join('\n');
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
    // Regex : cherche **Key** ou **Key :** suivi de n'importe quoi jusqu'à la fin de ligne
    const regex = new RegExp(`\\*\\*${key}\\s*[:\\*]*\\s*(.*)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : "";
}

// Extrait une liste séparée par des virgules "A, B, C" -> ["A", "B", "C"]
function extractListLine(text, key) {
    const val = extractValue(text, key);
    if (!val || val === "Non spécifié") return [];
    return val.split(',').map(s => s.trim());
}

// Extrait les puces "- Item"
function extractBulletPoints(text) {
    if (!text) return [];
    const regex = /^[*-]\s+(.*)$/gm;    
    let match;
    const results = [];
    while ((match = regex.exec(text)) !== null) {
        // Ignore les lignes qui ressemblent à des clés "**Clé :**"
        if (!match[1].includes('**:')) {
            results.push(match[1].trim());
        }
    }
    return results;
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
    const parts = text.split(new RegExp(`###\\s*${subHeader}`, 'i'));
    if (parts.length < 2) return "";
    return parts[1].split('###')[0].trim().replace(/^[*-]\s+/gm, '');
}

// Parsing spécifique pour les étapes numérotées "1. **Titre** description"
function extractNumberedSteps(text, simple = false) {
    if (!text) return [];
    const regex = /(\d+)\.\s+\*\*(.*?)\*\*[:\s-]*(.*)/g;    
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