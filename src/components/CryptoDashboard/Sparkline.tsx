interface SparklineProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
}

export default function Sparkline({ data, width = 160, height = 40, color = '#22c55e' }: SparklineProps) {
    if (!data || data.length === 0) return null;

    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue;

    // Avoid division by zero
    const normalizeY = (y: number) => {
        if (range === 0) return height / 2;
        return height - ((y - minValue) / range) * height;
    };

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = normalizeY(value);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg width={width} height={height} className="overflow-visible">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
} 