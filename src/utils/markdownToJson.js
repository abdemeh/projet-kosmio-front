/**
 * Convertit une chaîne Markdown (éditée via Milkdown/TipTap) en objet JSON structuré.
 * @param {string} markdown - Le contenu Markdown complet.
 * @returns {Object} - L'objet JSON (Solution ou Secteur).
 */
export function markdownToJSON(markdown) {
    if (!markdown) return null;

    const isSector = markdown.includes("Sous-secteurs") || 
                     markdown.includes("Description synthétique") ||
                     markdown.includes("Profil d'émissions");

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
                objective: extractListLine(sections['1'], "Objectif principal"),
                target_sites: extractListLine(sections['1'], "Types de sites concernés"),
                scope_includes: extractListLine(sections['1'], "Inclut"),
                scope_excludes: extractListLine(sections['1'], "N'inclut pas"),
                prerequisites: extractListLine(sections['1'], "Prérequis")
            },
            mecanism: {
                description: getCleanTextBeforeSubHeader(sections['2']),
                variants: extractBulletPoints(sections['2'])
            },
            applicability: {
                conditions: extractBulletPointsAfter(sections['3'], "Pertinent quand"),
                avoid_if: extractBulletPointsAfter(sections['3'], "À éviter si"),
                constraints: extractBulletPointsAfter(sections['3'], "Contraintes")
            },
            impacts: {
                energy: { description: extractBulletPointsAfter(sections['4'], "Énergie") },
                co2: { description: extractBulletPointsAfter(sections['4'], "CO₂") },
                costs: {
                    capex: extractBulletPointsAfter(sections['4'], "Capex"),
                    opex: extractBulletPointsAfter(sections['4'], "Opex"),
                },
                co_benefits: extractBulletPointsAfter(sections['4'], "Co-bénéfices")
            },
            levers: extractBulletPoints(sections['5']),
            implementation_path: extractNumberedSteps(sections['6']),
            risks: extractRisks(sections['7']),
            exemples: extractExamples(sections['8']),
            resources: extractResources(sections['9'])
        },
        contribution: {
            validation: extractValue(sections['10'], "Niveau de validation"),
            completeness: extractValue(sections['10'], "Niveau de complétude"),
            validator: extractValue(sections['10'], "Validateur métier"),
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
            company_size: extractValue(intro, "Taille d'entreprise typique"),
            last_update: extractValue(intro, "Dernière mise à jour"),
            contributors: extractListLine(intro, "Contributeurs")
        },
        summary: sections['Résumé'] || extractContentUnderHeader(fullMd, "Résumé"),        
        content: {
            description: getSectionContent(sections['1']),
            "emissions-profile": {
                process: extractValue(sections['2'], "Procédés"),
                utilities: extractValue(sections['2'], "Utilités"),
                building: extractValue(sections['2'], "Bâtiment"),
                transport: extractValue(sections['2'], "Déplacements"),
                waste: extractValue(sections['2'], "Déchets")
            },
            challenges: extractChallenges(sections['3']),
            regulations: extractBulletPointsAfter(sections['3'], "Réglementations clés"),
            "systems-matrix": extractTableData(sections['4']),
            sector_path: extractNumberedSteps(sections['5'], true),
            use_case: extractSectorCases(sections['6']),
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

function splitByHeaders(md) {
    const lines = md.split('\n');
    const sections = { intro: [] };
    let currentKey = 'intro';

    const SECTION_NUMBER_REGEX = /^##\s+(?:[^\w\d]*)?(\d+)\.\s/;

    lines.forEach(line => {
        const sectionMatch = line.match(SECTION_NUMBER_REGEX);
        const emojiHeaderMatch = line.match(/^##\s+([^\d\s].*)/);
        
        if (sectionMatch) {
            currentKey = sectionMatch[1];
            sections[currentKey] = [];
        } else if (emojiHeaderMatch && currentKey === 'intro') {
            const cleanName = line
                .replace(/^##\s+/, '')
                .replace(/\p{Emoji}/gu, '')
                .trim();
            if (cleanName.startsWith("Résumé")) {
                currentKey = "Résumé";
                sections[currentKey] = [];
            }
        } else {
            if (!sections[currentKey]) sections[currentKey] = [];
            sections[currentKey].push(line);
        }
    });

    Object.keys(sections).forEach(key => {
        sections[key] = sections[key].join('\n').trim();
    });
    return sections;
}

//Extrait le titre H1 en supprimant les accolades JSON parasites.

function extractTitle(text) {
    const match = text.match(/^#\s+(.*)/m);
    if (!match) return "";
    // ✅ FIX : supprime les accolades et guillemets JSON parasites autour du titre
    return match[1].trim().replace(/^\{["']?|["']?\}$/g, '');
}

// Extrait "Valeur" de "**Clé :** Valeur"
function extractValue(text, key) {
    if (!text) return "";
    const NORMALIZE_APOSTROPHES = (s) => s.replace(/[\u2018\u2019\u201A\u201B]/g, "'");
    const normalizedText = NORMALIZE_APOSTROPHES(text);
    const normalizedKey  = NORMALIZE_APOSTROPHES(key);
    const escapedKey = normalizedKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!\\w)\\*\\*${escapedKey}\\s*[:\\*]*\\s*(.*)`, 'im');
    const match = normalizedText.match(regex);
    return match?.[1]?.trim() || "";
}

// Extrait une liste séparée par des virgules "A, B, C" -> ["A", "B", "C"]
function extractListLine(text, key) {
    const val = extractValue(text, key);
    if (!val || val.toLowerCase().includes("non spécifié") || val === "N/A") return [];
    return val.split(',').map(s => s.trim()).filter(s => s !== "");
}

// Extrait les puces "- Item" en filtrant les lignes "**Label :**" seules
function extractBulletPoints(text) {
    if (!text) return [];
    return text.split('\n')
        .map(l => l.trim())
        .filter(l => l.startsWith('- ') || l.startsWith('* '))
        .map(l => l.substring(2).trim())
        // ✅ FIX : filtre les lignes qui ne sont que des labels "**Capex :**" sans contenu
        .filter(l => !/^\*\*[^*]+\*\*\s*:?\s*$/.test(l));
}

//Extrait les puces situées APRÈS un déclencheur (phrase ou header).
function extractBulletPointsAfter(text, triggerPhrase) {
    if (!text) return [];
    const escaped = triggerPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let regex = new RegExp(`\\*\\*${escaped}[^\\n]*\\n((?:[ \\t]+-[^\\n]*\\n?)+)`);
    let match = text.match(regex);
    if (match) {
        return match[1].split('\n')
            .map(l => l.trim())
            .filter(l => l.startsWith('- '))
            .map(l => l.substring(2).trim());
    }

    regex = new RegExp(`-\\s*\\*\\*${escaped}[^\\n]*\\n([\\s\\S]*?)(?=\\n-\\s*\\*\\*|\\n###|$)`);
    match = text.match(regex);
    if (match) return extractBulletPoints(match[1]);

    regex = new RegExp(`###\\s+${escaped}[^\\n]*\\n([\\s\\S]*?)(?=\\n###|$)`);
    match = text.match(regex);
    if (match) return extractBulletPoints(match[1]);

    regex = new RegExp(`^\\*\\*${escaped}[^\\n]*\\n((?:-[^\\n]*\\n?)+)`, 'm');
    match = text.match(regex);
    if (match) return extractBulletPoints(match[1]);

    return [];
}

// Nettoie le texte avant le premier sous-titre ###
function getCleanTextBeforeSubHeader(text) {
    if (!text) return "";
    return text.split('###')[0].trim();
}

// Récupère le contenu brut d'une section
function getSectionContent(sections, key) {
    let content = typeof sections === 'string' ? sections : sections[key];
    return content ? content.trim() : "";
}

function extractContentUnderHeader(text, subHeader) {
    if (!text) return "";
    const regex = new RegExp(`###\\s*${subHeader}[\\s\\S]*?(?=###|$)`, 'i');
    const match = text.match(regex);
    if (!match) return "";
    return match[0].replace(new RegExp(`###\\s*${subHeader}`, 'i'), '').trim().replace(/^- /gm, '');
}

// Parsing des étapes numérotées "1. **Titre**\n   details"
function extractNumberedSteps(text, simple = false) {
    if (!text) return [];
    const regex = /(\d+)\.\s+\*\*(.*?)\*\*([\s\S]*?)(?=(?:\d+\.\s+\*\*)|$)/g;
    let match;
    const steps = [];

    while ((match = regex.exec(text)) !== null) {
        if (simple) {
            steps.push({
                phase: match[2].trim(),
                action: match[3].replace(/-\s+/, '').trim()
            });
        } else {
            steps.push({
                step: match[2].trim(),
                details: match[3].trim()
            });
        }
    }
    return steps;
}

// Parsing des Risques {risk, mitigation}
function extractRisks(text) {
    if (!text) return [];
    const risks = extractBulletPointsAfter(text, "Risques possibles");
    const mitigations = extractBulletPointsAfter(text, "Stratégies de mitigation");

    const hasMitigations = mitigations.some(m => m.trim() !== "");
    if (!hasMitigations) {
        return risks; 
    }

    return risks.map((r, i) => ({
        risk: r,
        mitigation: mitigations[i] || ""
    }));
}

// Parsing des Exemples
function extractExamples(text) {
    if (!text) return [];
    const regex = /- \*\*Cas n[°º]?\d+\s*[\u2013\u2014-]\s*(.*?)\s*:\*\*\s*(.*?)(?:\(\[Lien\]\((.*?)\)\))?\s*$/gm;
    let match;
    const examples = [];
    while ((match = regex.exec(text)) !== null) {
        examples.push({
            secteur: match[1].trim(),
            resume: match[2].trim(),
            link: match[3] || ""
        });
    }
    return examples;
}

//Parsing des Ressources.

function extractResources(text) {
    if (!text) return [];
    // Normalise <http://...> → http://... dans les URLs Markdown
    const normalized = text.replace(/\(<(https?:\/\/[^>]+)>\)/g, '($1)');
    const regex = /-\s+\[(.*?)\]\((.*?)\)\s*(?:\((.*?)\))?/g;
    let match;
    const resources = [];
    while ((match = regex.exec(normalized)) !== null) {
        resources.push({
            // Normalise aussi le titre si l'URL y apparaît entre <>
            title: match[1].replace(/<(https?:\/\/[^>]+)>/g, '$1'),
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

// Parsing des Cas d'usage (Secteur)
function extractSectorCases(text) {
    if (!text) return [];
    const regex = /### Cas n°\d+ – (.*)\n([\s\S]*?)(?=### Cas n°|$)/g;
    let match;
    const cases = [];
    while ((match = regex.exec(text)) !== null) {
        cases.push({
            sub_sector: match[1].trim(),
            actions: extractValue(match[2], "Actions"),
            results: extractValue(match[2], "Résultats"),
            link: extractValue(match[2], "Lien")
        });
    }
    return cases;
}

// Parsing du Tableau Markdown (Secteur)
function extractTableData(text) {
    if (!text) return [];
    const lines = text.split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 3) return [];
    const dataLines = lines.slice(2);

    return dataLines.map(line => {
        const cols = line.split('|').map(c => c.trim()).filter(c => c !== "");
        if (cols.length < 4) return null;
        return {
            system: cols[0],
            impact: cols[1],
            priority: cols[2],
            solutions: cols[3].split('<br>').map(s => s.replace(/^- /, '').trim())
        };
    }).filter(x => x !== null);
}