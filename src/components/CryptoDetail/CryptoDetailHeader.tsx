import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CryptoDetailHeaderProps {
    theme: 'dark' | 'light';
    themeClasses: {
        background: string;
        text: string;
        card: string;
        cardHover: string;
        border: string;
        button: string;
        buttonText: string;
        input: string;
        secondaryText: string;
    };
    data: {
        name: string;
        symbol: string;
        rank: number;
        price: number;
        priceChangePercent24h: number;
        image: string;
        fallbackImage: string;
    };
}

export default function CryptoDetailHeader({ theme, themeClasses, data }: CryptoDetailHeaderProps) {
    const router = useRouter();
    const [imgSrc, setImgSrc] = useState(data.image);

    const formatPrice = (price: number): string => {
        if (price < 1) {
            return price.toFixed(6);
        }
        return price.toFixed(2);
    };

    const formatPercent = (percent: number): string => {
        return percent.toFixed(2);
    };

    const handleImageError = () => {
        // Try the fallback image if available, otherwise use a default placeholder
        setImgSrc(data.fallbackImage || '/placeholder.png');
    };

    return (
        <div className={`${themeClasses.card} rounded-lg p-6`}>
            <div className="flex flex-wrap items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className={`${themeClasses.card} p-2 rounded-full hover:bg-opacity-80 transition-colors duration-200`}
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-700 rounded-full overflow-hidden">
                        <Image
                            src={imgSrc}
                            alt={data.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                            onError={handleImageError}
                            priority
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            {data.name}
                            <span className={`text-sm ${themeClasses.secondaryText} font-normal`}>
                                {data.symbol.toUpperCase()}
                            </span>
                        </h1>
                        <div className={`${themeClasses.secondaryText} text-sm`}>
                            Rank #{data.rank}
                        </div>
                    </div>
                </div>

                <div className="ml-auto">
                    <div className="text-3xl font-bold">
                        ${formatPrice(data.price)}
                    </div>
                    <div className={`text-sm ${data.priceChangePercent24h >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                        {data.priceChangePercent24h >= 0 ? '↑' : '↓'}
                        <span>{formatPercent(Math.abs(data.priceChangePercent24h))}%</span>
                        <span className={themeClasses.secondaryText}>24h</span>
                    </div>
                </div>
            </div>
        </div>
    );
} 