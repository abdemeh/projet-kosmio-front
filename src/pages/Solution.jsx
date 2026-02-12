import { useEffect, useState } from "react";
import { useMarkdownApi } from "../hooks/useMarkdownApi";
import { useNavigate } from "react-router-dom"; 

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

   
    if (loading) return <div className="text-center py-10"><p>Chargement des solutions...</p></div>;
    if (error) return <div className="text-center py-10 text-red-500"><p>Erreur : {error.message}</p></div>;

    return (
        <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-bold mb-4">Solutions</h2>
                {solutions.length === 0 ? (
                    <div className="flex flex-col items-center">
                        <p className="mb-4">Aucune solution trouvée.</p>
                        <p className="text-sm text-gray-400">
                            (Les solutions apparaîtront ici une fois enregistrées en base de données)
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-2 max-w-3xl mx-auto px-4">
                        {solutions.map(solution => (
                            <li key={solution.id} className="p-3 border rounded hover:bg-gray-50 flex justify-between items-center bg-white shadow-sm">
                                <span className="font-medium text-gray-800">{solution.title || "Solution sans titre"}</span>
                                
                                <button 
                                    onClick={() => handleEditClick(solution.id)}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Éditer
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    )
}

export default Solution