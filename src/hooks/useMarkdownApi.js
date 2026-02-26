import { useCallback, useState } from "react";
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
    let type = useSelector(state => state.pdf.type)
    const url = env.apiUrl;
    const baseUrl = `${url}/v1/process/${type}`;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleResponse = useCallback(async (response) => {
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
            throw new Error(data.message || "Erreur API");
        }
        return data;
    }, []);

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

            const response = await fetch(`${url}/v1/update/${id}`, {
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

    const getAllSolution = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${url}/v1/get/solution`)

            return handleResponse(response);
        }catch (err) {
            setError(err);
            throw err
        }finally {
            setLoading(false)
        }
    }

    const getAllSector = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${url}/v1/get/sector`)

            return handleResponse(response);
        }catch (err) {
            setError(err);
            throw err
        }finally {
            setLoading(false)
        }
    }

    const getHistoryById = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${url}/v1/get/${id}/history`);
            return handleResponse(response);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [url, handleResponse]);

    const getFileById = useCallback(async (id) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${url}/v1/get/${id}`);
            return handleResponse(response);
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [url, handleResponse]);

    return {loading, error, getFileById, getHistoryById, getAllSector, getAllSolution, generateInfo, update, validate, publish, deleteAction};
};