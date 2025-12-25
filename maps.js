import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "./config.js";

const cache = new Map(); // key: searchQuery, value: { data, timestamp }
const CACHE_TTL = 1000 * 60 * 30; // 30 menit

// Async function to search places using a text query
export async function searchPlaces(searchQuery) {
    const now = Date.now();

    // Check cache first
    if (cache.has(searchQuery)) {
        const cached = cache.get(searchQuery);
        if (now - cached.timestamp < CACHE_TTL) {
            console.log("MAPS CACHE HIT:", searchQuery);
            return cached.data;
        }
        cache.delete(searchQuery);
    }

    console.log("MAPS API CALL:", searchQuery);

    // Encode the search query to make it safe for use in a URL
    const query = encodeURIComponent(searchQuery);

    // Google Places Text Search API endpoint
    // API key is loaded from environment variables
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const res = await axios.get(url);

    // Check API response status
    // If status is not "OK", log the error and return an empty array
    if (res.data.status !== "OK") {
        console.error("MAPS ERROR:", res.data.status, res.data.error_message);
        return [];
    }

    // Take only the first 5 results
    // Map the response to return only required fields
    const places = res.data.results.slice(0, 5).map((p) => ({
        name: p.name,
        address: p.formatted_address,
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
        maps_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            p.name
        )}`,
    }));

    // Save searchQuery to cache
    cache.set(searchQuery, {
        data: places,
        timestamp: now,
    });

    return places;
}
