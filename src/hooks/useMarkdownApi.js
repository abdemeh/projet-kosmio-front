import { useState } from "react";

/*
Hook générique API markdown (solutions/secteurs)
    # - generateInfo()
    # - create()
    # - update()
    # - validate()
    # - publish()     
*/

export const useMarkdownApi = (type) => {
    const baseUrl = `/api/${type}`;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleResponse = async (response) => {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Erreur API");
        }
        return data;
    };

    const generateInfo = async (pdfFile) =>  {
        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', pdfFile);

            const response = await fetch(`${baseUrl}/generate`, {
                method: "POST",
                body2: formData,
            });

            return await handleResponse(response);            
        } catch (err){
            setError(err);
            throw err
        } finally {
            setLoading(false);
        }
    };

    const create = async (markdownData) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(baseUrl, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(markdownData),
            });
            
            return await handleResponse(response);            
        } catch (err){
            setError(err);
            throw err
        } finally {
            setLoading(false);
        }
    };

    const update = async (id, markdownData ) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${baseUrl}/${id}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(markdownData),
            });
            
            return await handleResponse(response);            
        } catch (err){
            setError(err);
            throw err
        } finally {
            setLoading(false);
        }
    };

    const validate = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${baseUrl}/${id}/validate`, {
                method: "POST",
            });
            
            return await handleResponse(response);            
        } catch (err){
            setError(err);
            throw err
        } finally {
            setLoading(false);
        }
    };

    const publish = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${baseUrl}/${id}/publish`, {
                method: "POST",
            });
            
            return await handleResponse(response);            
        } catch (err){
            setError(err);
            throw err
        } finally {
            setLoading(false);
        }
    };

    const deleteAction = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`${baseUrl}/${id}/delete`, {
                method: "DELETE",
            });
            
            return await handleResponse(response);            
        } catch (err){
            setError(err);
            throw err
        } finally {
            setLoading(false);
        }
    };

    return {loading, error, generateInfo, create, update, validate, publish, deleteAction};
};