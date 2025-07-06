import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=popular');
        const data = await response.json();
        
        const newsItems = data.Data.slice(0, 3).map((item: any) => ({
            id: item.id,
            title: item.title,
            body: item.body,
            source: item.source,
            url: item.url,
            imageUrl: item.imageurl,
            publishedAt: item.published_on,
            categories: item.categories
        }));

        return NextResponse.json({ data: newsItems });
    } catch (error) {
        console.error('Error fetching crypto news:', error);
        return NextResponse.json({ error: 'Failed to fetch crypto news' }, { status: 500 });
    }
} 