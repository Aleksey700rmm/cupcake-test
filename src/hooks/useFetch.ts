import { BASE_URL } from 'app/config/globals';
import { useState, useEffect } from 'react'

type FetchResponse<T> = {
    isLoading: boolean;
    response: T | null;
    error: Error | null;
};

export function useFetch<T>(
    url: string, 
    method = "GET", 
    body: any = null, 
    headers = { "Content-Type": "application/json" }
): FetchResponse<T> {
    const [isLoading, setLoading] = useState(true)
    const [response, setResponse] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchData() {
            try {
                const fullUrl = `${BASE_URL}${url}`;

                const response = await fetch(fullUrl, {method, body, headers})
                const data = await response.json()

                setResponse(data)
            } catch (error) {
                setError(error)
            }
        
            setLoading(false)
        }

        fetchData()
    }, [url])

    return { isLoading, response, error }
}