// src/data/samples.js

export const sampleSolution = {
    "type": "solution",
    "title": "Récupération de chaleur fatale",
    "metadata": {
        "category": "Industrie",
        "system": "Air Comprimé",
        "type": "Technique",
        "maturity": "Élevé",
        "contributors": ["ADEME", "Expert CO2"]
    },
    "summary": "Récupérer l'énergie thermique dissipée par les compresseurs.",
    "content": {
        "context": { "objective": "Réduire conso gaz" },
        "mechanism": { "description": "Échangeur thermique sur circuit d'huile." },
        "impacts": { "energy": "70 à 94% récupérable", "co2": "Baisse directe" },
        "implementation_path": [
            { "step": "Audit", "details": "Mesure des puissances" },
            { "step": "Travaux", "details": "Pose échangeur" }
        ]
    }
};

export const sampleSecteur = {
    "type": "secteur",
    "title": "Industrie Agroalimentaire",
    "metadata": {
        "sub_sectors": ["Laiterie", "Boissons"],
        "contributors": ["Groupe IAA"]
    },
    "summary": "Secteur caractérisé par des besoins en chaud et froid.",
    "content": {
        "description": "Premier secteur industriel français.",
        "challenges": [
            { "title": "Chaleur", "description": "Sortir du gaz" }
        ],
        "systems_matrix": [
            { "system": "Froid", "impact": "Fort", "priority": "⭐⭐⭐", "solutions": ["HP Flottante"] }
        ]
    }
};