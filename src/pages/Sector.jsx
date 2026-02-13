import { useEffect, useState } from "react";
import { useMarkdownApi } from "../hooks/useMarkdownApi";
import { useNavigate } from "react-router-dom";
import SimpleButton from "../components/ui/SimpleButton";
import { Pencil, Trash2 } from "lucide-react";

const Sector = () => {
    const { error, loading, getAllSector } = useMarkdownApi();
    const [sectors, setSectors] = useState([])


    const navigate = useNavigate();

    // Handler pour le bouton "Éditer"
    const handleEditClick = (id) => {
        navigate(`/edit/${id}`);
    };

    // Handler pour le bouton "Supprimer"
    const handleDeleteClick = (id) => {

        if (window.confirm("Voulez-vous vraiment supprimer ce secteur ?")) {
            console.log("Suppression de l'ID :", id);
            setSectors(prevSectors => prevSectors.filter(sec => sec.id !== id));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSector();
                setSectors(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Chargement des secteurs...</p>;
    if (loading) return <p className="text-red-500">Erreur : {error.message}</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-10">Secteurs</h1>
            {sectors.length === 0 ? (
                <p>Aucun secteur trouvé.</p>
            ) : (
                <ul className="space-y-2">
                    {sectors.map(sector => (
                        <li key={sector.id} className="p-3 border rounded hover:bg-gray-50 flex justify-between items-center bg-white shadow-sm">
                            <span className="font-medium text-gray-800">{sector.title || "Secteur sans titre"}</span>

                            <div className="flex gap-2">
                                <SimpleButton
                                    onClick={() => handleEditClick(sector.id)}
                                    className="text-gray-900 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                                    icon={Pencil}
                                >
                                    Éditer
                                </SimpleButton>

                                <SimpleButton
                                    onClick={() => handleDeleteClick(sector.id)}
                                    className="text-gray-900 hover:text-red-600 hover:bg-red-50 rounded-full"
                                    icon={Trash2}
                                >
                                    Supprimer
                                </SimpleButton>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Sector