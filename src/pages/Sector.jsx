import { useEffect, useState } from "react";
import { useMarkdownApi } from "../hooks/useMarkdownApi";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const Sector = () => {
    const { error, loading, getAllSector } = useMarkdownApi();
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
    if (error) return <p className="text-red-500">Erreur : {error.message}</p>;

    return (
        <div className="flex flex-col items-center py-20 text-gray-500">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Secteurs</h1>
                <p className="text-gray-500 text-lg">Retrouvez ici tous les secteurs enregistrés.</p>
            </div>

            {sectors.length === 0 ? (
                <div className="flex flex-col items-center">
                    <p className="mb-4">Aucun secteur trouvé.</p>
                    <p className="text-sm text-gray-400">
                        (Les secteurs apparaîtront ici une fois enregistrés en base de données)
                    </p>
                </div>
            ) : (
                <ul className="space-y-2 w-full max-w-3xl px-4">
                    {sectors.map(sector => (
                        <li key={sector.id} className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 flex justify-between items-center bg-white shadow-sm">
                            <span className="font-medium text-gray-800">{sector.title || "Secteur sans titre"}</span>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleEditClick(sector.id)}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 text-gray-900 hover:text-gray-600 hover:bg-gray-100"
                                >
                                    <Pencil size={16} />
                                    Éditer
                                </button>

                                <button
                                    onClick={() => handleDeleteClick(sector.id)}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 text-gray-900 hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Sector