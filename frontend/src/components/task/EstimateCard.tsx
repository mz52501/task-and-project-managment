import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EstimateCardProps {
  estimate: string;
  totalTimeTracked: string;
  editingEstimate: boolean;
  estimateDraft: string;
  setEstimateDraft: (v: string) => void;
  setEditingEstimate: (v: boolean) => void;
  saveEstimate: () => void;
}

export function EstimateCard({
  estimate,
  totalTimeTracked,
  editingEstimate,
  estimateDraft,
  setEstimateDraft,
  setEditingEstimate,
  saveEstimate,
}: EstimateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Estimate</CardTitle>
          {!editingEstimate && (
            <button
              onClick={() => {
                setEstimateDraft(estimate);
                setEditingEstimate(true);
              }}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editingEstimate ? (
          <div className="space-y-2">
            <Label className="text-xs text-gray-500">Planned time</Label>
            <Input
              placeholder="e.g. 12h 0m"
              value={estimateDraft}
              onChange={(e) => setEstimateDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && saveEstimate()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEstimate} className="cursor-pointer">
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingEstimate(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs text-gray-500 mb-1">Planned time</p>
              <p className="text-lg font-semibold text-gray-900">
                {estimate || <span className="text-gray-400 font-normal text-sm">Not set</span>}
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Logged: <span className="font-semibold text-gray-900">{totalTimeTracked}</span>
              {estimate && <span className="text-gray-400"> / {estimate}</span>}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
