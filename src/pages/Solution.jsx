import { useEffect, useState } from "react";
import { useMarkdownApi } from "../hooks/useMarkdownApi"

const Solution = () => {
    const {error, loading, getAllSolution} = useMarkdownApi();
    const [solutions, setSolutions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllSolution();
                setSolutions(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Chargement des solutions...</p>;
    if (error) return <p className="text-red-500">Erreur : {error.message}</p>;

    return (
        <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-bold mb-4">Solutions</h2>
                {solutions.length === 0 ? (
                    <p>Aucune solution trouvé.</p>
                ):(
                    <ul className="space-y-2">
                        {solutions.map(solution => (
                            <li key={solution.id} className="p-2 border rounded hover:bg-gray-50">
                                {solution.title}
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    )
}

export default Solution
    