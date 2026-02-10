import { useEffect, useState } from "react";
import { useMarkdownApi } from "../hooks/useMarkdownApi";

const Sector = () => {
    const {error, loading, getAllSector} = useMarkdownApi();
    const [sectors, setSectors] = useState([])

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
        <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-bold mb-4">Secteurs</h2>
                {sectors.length === 0 ? (
                    <p>Aucun secteur trouvé.</p>
                ) : (
                    <ul className="space-y-2">
                    {sectors.map(sector => (
                        <li key={sector.id} className="p-2 border rounded hover:bg-gray-50">
                            {sector.title}
                        </li>
                    ))}
                    </ul>
                )}
        </div>
    )
}

export default Sector