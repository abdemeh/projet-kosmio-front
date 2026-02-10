import { useState } from "react";
import { useSelector } from "react-redux";
import {env} from "../config/env";

/*
Hook générique API markdown (solutions/secteurs)
    # - generateInfo()
    # - update()
    # - validate()
    # - publish()
    # - deleteAction()     
*/

export const useMarkdownApi = () => {
    let {type} = useSelector(state => state.pdf);
    const url = env.apiUrl;
    const baseUrl = `${url}/v1/process/${type}`;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleResponse = async (response) => {
        const data = await response.json();
        console.log(data);
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
            formData.append('pdf', pdfFile);

            const response = await fetch(baseUrl, {
                method: "POST",
                body: formData,
            });

            return handleResponse(response)        ;  
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

    return {loading, error, generateInfo, update, validate, publish, deleteAction};
};