import { useEffect, useState } from "react";
import { useMarkdownApi } from "../hooks/useMarkdownApi";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

const Solution = () => {

    const { error, loading, getAllSolution } = useMarkdownApi();

    const [solutions, setSolutions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSolution();

                if (data) {
                    setSolutions(data);
                }
            } catch (err) {
                console.error("Erreur chargement solutions:", err);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cette solution ?")) {
            console.log("Suppression de l'ID :", id);
        }
    };

    if (loading) return <div className="text-center py-10"><p className="text-gray-500 dark:text-gray-400">Chargement des solutions...</p></div>;
    if (error) return <div className="text-center py-10 text-red-500"><p>Erreur : {error.message}</p></div>;

    return (
        <div className="flex flex-col items-center py-20 text-gray-500 dark:text-gray-400">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mb-2">Solutions</h1>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Retrouvez ici toutes les solutions enregistrées.</p>
            </div>

            {solutions.length === 0 ? (
                <div className="flex flex-col items-center">
                    <p className="mb-4">Aucune solution trouvée.</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        (Les solutions apparaîtront ici une fois enregistrées en base de données)
                    </p>
                </div>
            ) : (
                <ul className="space-y-2 w-full max-w-3xl px-4">
                    {solutions.map(solution => (
                        <li key={solution.id} className="p-3 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 shadow-sm transition-colors">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{solution.title || "Solution sans titre"}</span>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handleEditClick(solution.id)}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <Pencil size={16} />
                                    Éditer
                                </button>

                                <button
                                    onClick={() => handleDeleteClick(solution.id)}
                                    className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 text-gray-900 dark:text-gray-100 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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

export default Solution