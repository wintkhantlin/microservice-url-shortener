import { useState } from "react";
import { useCreateAlias } from "@/hooks/useAliases";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Loader2 } from "lucide-react";

interface CreateAliasDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateAliasDialog({ open, onOpenChange }: CreateAliasDialogProps) {
    const [target, setTarget] = useState("");
    const [error, setError] = useState("");
    const createAlias = useCreateAlias();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");

        if (!target) {
            setError("URL is required");
            return;
        }

        try {
            await createAlias.mutateAsync({
                target,
            });
            onOpenChange(false);
            setTarget("");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred");
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create URL Alias</DialogTitle>
                    <DialogDescription>
                        Create a new short link for your long URL.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="target" className="block">
                            URL to Shorten
                        </Label>
                        <Input
                            id="target"
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="https://example.com"
                            className="col-span-3"
                            autoFocus
                        />
                    </div>
                    {error && (
                        <div className="text-sm text-red-500 mt-1">
                            {error}
                        </div>
                    )}
                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={createAlias.isPending}>
                            {createAlias.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Create Alias
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
