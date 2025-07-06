import { NextResponse } from 'next/server';

// Cache duration in seconds
const CACHE_DURATION = 60;
let cachedData: any = null;
let lastFetchTime = 0;

async function fetchWithTimeout(url: string, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
}

export async function GET() {
    try {
        const currentTime = Date.now();

        // Return cached data if available and not expired
        if (cachedData && (currentTime - lastFetchTime) < (CACHE_DURATION * 1000)) {
            return NextResponse.json(cachedData);
        }

        // Fetch new data from CoinGecko
        const response = await fetchWithTimeout('https://api.coingecko.com/api/v3/global');

        if (!response.ok) {
            if (response.status === 429) {
                // If we have cached data, return it even if expired
                if (cachedData) {
                    return NextResponse.json(cachedData);
                }
                return NextResponse.json(
                    { error: 'Rate limit exceeded. Please try again later.' },
                    { status: 429 }
                );
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update cache
        cachedData = data;
        lastFetchTime = currentTime;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching global market data:', error);
        
        // If we have cached data, return it as fallback
        if (cachedData) {
            return NextResponse.json(cachedData);
        }

        return NextResponse.json(
            { error: 'Failed to fetch market data' },
            { status: 500 }
        );
    }
} 