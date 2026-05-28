import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface EstimateCardProps {
  estimate: string;
  totalTimeTracked: string;
  setEstimate: (v: string) => void;
  onSave: (v: string) => void;
}

export function EstimateCard({
  estimate,
  totalTimeTracked,
  setEstimate,
  onSave,
}: EstimateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Estimate</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Planned time</p>
          <Input
            placeholder="e.g. 2h 30m"
            value={estimate}
            onChange={(e) => setEstimate(e.target.value)}
            onBlur={(e) => onSave(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSave((e.target as HTMLInputElement).value);
                (e.target as HTMLInputElement).blur();
              }
              if (e.key === "Escape") (e.target as HTMLInputElement).blur();
            }}
            className="text-sm"
          />
        </div>
        <p className="text-sm text-gray-600">
          Logged: <span className="font-semibold text-gray-900">{totalTimeTracked}</span>
          {estimate && <span className="text-gray-400"> / {estimate}</span>}
        </p>
      </CardContent>
    </Card>
  );
}
