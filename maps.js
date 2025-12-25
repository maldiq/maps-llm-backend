import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "./config.js";
import { normalizeQuery } from "./normalizeQuery.js";

const cache = new Map(); // key: searchQuery, value: { data, timestamp }
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function cleanExpiredCache() {
    const now = Date.now();

    for (const [key, value] of cache.entries()) {
        if (now - value.timestamp >= CACHE_TTL) {
            cache.delete(key);
        }
    }
}

// Async function to search places using a text query
export async function searchPlaces(searchQuery) {
    // Normalize query
    const normalizedKey = normalizeQuery(searchQuery);
    const now = Date.now();

    // Cleanup cache
    cleanExpiredCache();

    // Check cache first
    if (cache.has(normalizedKey)) {
        const cached = cache.get(normalizedKey);
        if (now - cached.timestamp < CACHE_TTL) {
            console.log("MAPS CACHE HIT:", searchQuery);
            return cached.data;
        }
        cache.delete(normalizedKey);
    }

    console.log("MAPS API CALL:", normalizedKey);

    // Encode the search query to make it safe for use in a URL
    const query = encodeURIComponent(searchQuery);

    // Google Places Text Search API endpoint
    // API key is loaded from environment variables
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${GOOGLE_MAPS_API_KEY}`;

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
    cache.set(normalizedKey, {
        data: places,
        timestamp: now,
    });

    return places;
}
