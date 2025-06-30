interface CryptoStatsProps {
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
        marketCap: number;
        volume24h: number;
        circulatingSupply: number;
        totalSupply: number;
        maxSupply: number;
        high24h: number;
        low24h: number;
        symbol: string;
    };
}

export default function CryptoStats({ theme, themeClasses, data }: CryptoStatsProps) {
    const formatNumber = (num: number, decimals: number = 2): string => {
        if (num >= 1e9) {
            return `$${(num / 1e9).toFixed(decimals)}B`;
        }
        if (num >= 1e6) {
            return `$${(num / 1e6).toFixed(decimals)}M`;
        }
        if (num >= 1e3) {
            return `$${(num / 1e3).toFixed(decimals)}K`;
        }
        return `$${num.toFixed(decimals)}`;
    };

    const formatSupply = (supply: number): string => {
        if (supply >= 1e9) {
            return `${(supply / 1e9).toFixed(2)}B ${data.symbol}`;
        }
        if (supply >= 1e6) {
            return `${(supply / 1e6).toFixed(2)}M ${data.symbol}`;
        }
        if (supply >= 1e3) {
            return `${(supply / 1e3).toFixed(2)}K ${data.symbol}`;
        }
        return `${supply.toFixed(2)} ${data.symbol}`;
    };

    return (
        <div className={`${themeClasses.card} rounded-lg p-6`}>
            <h2 className="text-xl font-bold mb-4">Market Stats</h2>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <span className={themeClasses.secondaryText}>Market Cap</span>
                    <span className="font-medium">{formatNumber(data.marketCap)}</span>
                </div>

                <div className="flex justify-between">
                    <span className={themeClasses.secondaryText}>24h Volume</span>
                    <span className="font-medium">{formatNumber(data.volume24h)}</span>
                </div>

                <div className="flex justify-between">
                    <span className={themeClasses.secondaryText}>24h High</span>
                    <span className="font-medium">{formatNumber(data.high24h)}</span>
                </div>

                <div className="flex justify-between">
                    <span className={themeClasses.secondaryText}>24h Low</span>
                    <span className="font-medium">{formatNumber(data.low24h)}</span>
                </div>

                <div className={`h-px ${themeClasses.border} my-4`} />

                <div className="flex justify-between">
                    <span className={themeClasses.secondaryText}>Circulating Supply</span>
                    <span className="font-medium">{formatSupply(data.circulatingSupply)}</span>
                </div>

                <div className="flex justify-between">
                    <span className={themeClasses.secondaryText}>Total Supply</span>
                    <span className="font-medium">{formatSupply(data.totalSupply)}</span>
                </div>

                <div className="flex justify-between">
                    <span className={themeClasses.secondaryText}>Max Supply</span>
                    <span className="font-medium">
                        {data.maxSupply ? formatSupply(data.maxSupply) : '∞'}
                    </span>
                </div>
            </div>
        </div>
    );
} 