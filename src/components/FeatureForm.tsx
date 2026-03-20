import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Feature, CreateFeatureDTO, FeatureStatus, FeaturePriority } from "@/types/feature";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const featureSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be under 1000 characters"),
  priority: z.enum(["Low", "Medium", "High"] as const),
  status: z.enum(["Open", "In Progress", "Completed"] as const),
});

type FeatureFormValues = z.infer<typeof featureSchema>;

const PRIORITY_OPTIONS: FeaturePriority[] = ["Low", "Medium", "High"];
const STATUS_OPTIONS: FeatureStatus[] = ["Open", "In Progress", "Completed"];

interface FeatureFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFeatureDTO) => void;
  onUpdate?: (id: string, data: Partial<CreateFeatureDTO>) => void;
  feature?: Feature | null;
  isSubmitting?: boolean;
}

export function FeatureForm({
  open,
  onClose,
  onSubmit,
  onUpdate,
  feature,
  isSubmitting = false,
}: FeatureFormProps) {
  const isEditing = !!feature;

  const form = useForm<FeatureFormValues>({
    resolver: zodResolver(featureSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      status: "Open",
    },
  });

  useEffect(() => {
    if (open) {
      if (feature) {
        form.reset({
          title: feature.title,
          description: feature.description,
          priority: feature.priority,
          status: feature.status,
        });
      } else {
        form.reset({ title: "", description: "", priority: "Medium", status: "Open" });
      }
    }
  }, [open, feature, form]);

  function handleSubmit(values: FeatureFormValues) {
    if (isEditing && onUpdate && feature) {
      onUpdate(feature.id, values);
    } else {
      onSubmit(values);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg" aria-describedby="feature-form-desc">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEditing ? "Edit Feature Request" : "New Feature Request"}
          </DialogTitle>
          <DialogDescription id="feature-form-desc" className="text-sm text-muted-foreground">
            {isEditing
              ? "Update the details of this feature request."
              : "Fill in the details to submit a new feature request."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Add dark mode support"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the feature in detail…"
                      rows={4}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Save Changes" : "Create Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
