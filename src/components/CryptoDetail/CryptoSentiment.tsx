interface CryptoSentimentProps {
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
    sentiment: {
        positive: number;
        negative: number;
    };
}

export default function CryptoSentiment({ theme, themeClasses, sentiment }: CryptoSentimentProps) {
    const total = sentiment.positive + sentiment.negative;
    const positivePercent = (sentiment.positive / total) * 100;
    const negativePercent = (sentiment.negative / total) * 100;

    return (
        <div className={`${themeClasses.card} rounded-lg p-6`}>
            <h2 className="text-xl font-bold mb-4">Market Sentiment</h2>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-green-500">Bullish</span>
                        <span className="text-green-500">{positivePercent.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500"
                            style={{ width: `${positivePercent}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-red-500">Bearish</span>
                        <span className="text-red-500">{negativePercent.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-500"
                            style={{ width: `${negativePercent}%` }}
                        />
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <div className={themeClasses.secondaryText}>
                        Based on {total.toLocaleString()} votes
                    </div>
                </div>
            </div>
        </div>
    );
} 