import { useState, useEffect, useRef } from 'react';
import { BASE_URL } from 'app/config/globals';

type FetchResponse<T> = {
    isLoading: boolean;
    response: T | null;
    error: Error | null;
};

export function useFetchWithPolling<T>(
    url: string, 
    pollInterval: number = 5000,
    method = "GET", 
    body: any = null, 
    headers = { "Content-Type": "application/json" }
): FetchResponse<T> {
    const [isLoading, setLoading] = useState(false);
    const [response, setResponse] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const isMountedRef = useRef<boolean>(true);

    useEffect(() => {
        if (isMountedRef) {
            const fetchData = async (isPoll?: boolean) => {
                try {
                    let fullUrl = `${BASE_URL}${url}`;
                    if (isPoll) {
                        fullUrl += '/poll'
                    }
                    const res = await fetch(fullUrl, { method, body, headers });
                    const data = await res.json();
                    setResponse(data)
                    await fetchData(true)
                } catch (err) {
                    if (isPoll) {
                        setTimeout(() => {
                            fetchData(true);
                        }, pollInterval);
                    } else {
                        setError(err as Error);
                        setLoading(false);
                    }
                }
            };
    
            fetchData();
        }

        return () => {
            isMountedRef.current = false;
        };
    }, [url]);

    return { isLoading, response, error };
}