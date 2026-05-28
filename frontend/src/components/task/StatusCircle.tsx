import { stageStrokeColor } from "@/constants/task";

interface Props {
  position: number;
  totalStages: number;
}

export function StatusCircle({ position, totalStages }: Props) {
  const fraction = totalStages <= 1 ? 1 : (position - 1) / (totalStages - 1);
  const color = stageStrokeColor(fraction);
  const cx = 10,
    cy = 10;
  const outerR = 9;
  const innerR = 6.5;

  const pieSlice = () => {
    if (fraction <= 0) return null;
    if (fraction >= 1) return <circle cx={cx} cy={cy} r={innerR} fill={color} />;
    const angle = fraction * 2 * Math.PI - Math.PI / 2;
    const x = cx + innerR * Math.cos(angle);
    const y = cy + innerR * Math.sin(angle);
    const largeArc = fraction > 0.5 ? 1 : 0;
    return (
      <path
        d={`M ${cx} ${cy} L ${cx} ${cy - innerR} A ${innerR} ${innerR} 0 ${largeArc} 1 ${x} ${y} Z`}
        fill={color}
      />
    );
  };

  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="flex-none">
      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={color} strokeWidth="1.5" />
      {pieSlice()}
    </svg>
  );
}
