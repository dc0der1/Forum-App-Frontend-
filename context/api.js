import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://10.0.2.2:8080";

export async function authenticatedFetch(endpoint, options ={}) {
    try {
        const token = await SecureStore.getItemAsync("userToken");

        const headers = {
            "Content-Type": "application/json", 
            ...(token ? { "Authorization": `Bearer ${token}` } : {}), 
            ...options.headers, 
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options, 
            headers, 
        });

        if (response.status === 401) {
            console.log("Unauthorized! Token may have expired.");
        }

        return response;
    } catch (error) {
        console.error("API Error: ", error);
    }
}