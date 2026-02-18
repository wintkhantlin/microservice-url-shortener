import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { ChevronsUpDown, PlusIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { type Alias } from "@/hooks/useAliases";
import CreateAliasDialog from "./CreateAliasDialog";
import { useNavigate } from "@tanstack/react-router";

interface AliasPickerProps {
    aliases: Alias[];
    selectedAliasId?: string;
}

export default function AliasPicker({ aliases, selectedAliasId }: AliasPickerProps) {
    const navigate = useNavigate();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const activeAlias = aliases?.find(a => a.code === selectedAliasId) || (aliases && aliases.length > 0 ? aliases[0] : null);

    const handleSelect = (alias: Alias) => {
        navigate({ to: '/$aliasId', params: { aliasId: alias.code } });
    };

    const getDomain = (url: string) => {
        try {
            return new URL(url).hostname;
        } catch {
            return "unknown";
        }
    };

    const currentDomain = activeAlias ? getDomain(activeAlias.target) : "";

    return (
        <>
            <CreateAliasDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-full">
                    <div className="flex items-center gap-2 w-full justify-start px-4 py-2 rounded-lg cursor-pointer hover:bg-accent">
                        {activeAlias ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${currentDomain}&sz=64`}
                                        className="w-4 h-4 rounded-sm"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="text-left">
                                        <span className="text-sm font-medium line-clamp-1">{activeAlias.code}</span>
                                        <p className="text-xs font-mono text-muted-foreground font-light line-clamp-1">{currentDomain}</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <span className="text-sm text-muted-foreground">Select an alias</span>
                        )}
                        <ChevronsUpDown className="ml-auto" size={16} />
                    </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="right" align="end" sideOffset={4} className="mt-2 w-72">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="h-10 mb-1" onSelect={() => setIsCreateDialogOpen(true)}>
                            <PlusIcon />
                            Create URL Alias
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <Separator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            URL Aliases
                        </DropdownMenuLabel>

                        {aliases?.map((a) => {
                            const domain = getDomain(a.target);
                            return (
                                <DropdownMenuItem
                                    key={a.code}
                                    onClick={() => handleSelect(a)}
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                                        className="w-4 h-4 rounded-sm"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{a.code}</span>
                                        <span className="text-xs text-muted-foreground">{domain}</span>
                                    </div>
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
