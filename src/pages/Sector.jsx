import { useEffect, useState } from "react";
import { useMarkdownApi } from "../hooks/useMarkdownApi";
import { useNavigate } from "react-router-dom";

const Sector = () => {
    const {error, loading, getAllSector} = useMarkdownApi();
    const [sectors, setSectors] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSector();
                setSectors(data);
            } catch (err) {
                console.error("Erreur chargement secteurs: ", err);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDeleteClick = (id) => {

        if (window.confirm("Voulez-vous vraiment supprimer ce secteur ?")) {
            console.log("Suppression de l'ID :", id);
        }
    };

    if (loading) return <p>Chargement des secteurs...</p>;
    if (loading) return <p className="text-red-500">Erreur : {error.message}</p>;

    return (
        <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-bold mb-4">Secteurs</h2>
                {sectors.length === 0 ? (
                    <div className="flex flex-col items-center">
                        <p className="mb-4">Aunc secteur trouvé.</p>
                        <p className="text-sm text-gray-400">
                            (Les secteurs apparaîtront ici une fois enregistrées en base de données)
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-2 max-w-3xl mx-auto px-4">
                        {sectors.map(sector => (
                            <li key={sector.id} className="p-3 border rounded hover:bg-gray-50 flex justify-between items-center bg-white shadow-sm">
                                <span className="font-medium text-gray-800">{sector.title || "Secteur sans titre"}</span>

                                <button 
                                    onClick={() => handleEditClick(sector.id)}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Éditer
                                </button>

                                <button
                                    onClick={() => handleDeleteClick(sector.id)}
                                    className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    Supprimer
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    )
}

export default Sector