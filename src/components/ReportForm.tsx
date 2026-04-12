import { useState } from "react";
import { useIssueStore } from "@/store/issueStore";
import { ISSUE_TYPES, BLOCKS, FLOORS } from "@/types/issue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Send } from "lucide-react";
import { toast } from "sonner";

export function ReportForm({ onSuccess }: { onSuccess?: () => void }) {
  const addIssue = useIssueStore((s) => s.addIssue);
  const [type, setType] = useState("");
  const [block, setBlock] = useState("");
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !block || !floor) {
      toast.error("Please fill in all required fields");
      return;
    }

    addIssue({
      type: type as any,
      block,
      floor,
      location: `${block} - ${floor}`,
      description,
      imageUrl: imagePreview || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    });

    toast.success("Issue reported successfully! 🎉");
    setType("");
    setBlock("");
    setFloor("");
    setDescription("");
    setImagePreview(null);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Upload Photo</label>
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Camera className="w-8 h-8" />
              <span className="text-sm">Click to upload image</span>
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </label>
      </div>

      {/* Issue Type */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Issue Type *</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue placeholder="Select issue type" /></SelectTrigger>
          <SelectContent>
            {ISSUE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Block *</label>
          <Select value={block} onValueChange={setBlock}>
            <SelectTrigger><SelectValue placeholder="Block" /></SelectTrigger>
            <SelectContent>
              {BLOCKS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Floor *</label>
          <Select value={floor} onValueChange={setFloor}>
            <SelectTrigger><SelectValue placeholder="Floor" /></SelectTrigger>
            <SelectContent>
              {FLOORS.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Description (optional)</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue..."
          className="resize-none"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full gap-2" size="lg">
        <Send className="w-4 h-4" />
        Submit Report
      </Button>
    </form>
  );
}
