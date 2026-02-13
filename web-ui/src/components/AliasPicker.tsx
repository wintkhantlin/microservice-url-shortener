import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { ChevronsUpDown, PlusIcon } from "lucide-react";
import { Separator } from "./ui/separator";

export default function AliasPicker() {
    const aliases = [
        { name: "Google | Chrome", domain: "google.com" },
        { name: "Facebook | 1 Group", domain: "facebook.com" },
        { name: "GitHub | Microservice Project", domain: "github.com" },
        { name: "Checkly | Homepage", domain: "checklyhq.com" },
        { name: "Portfolio", domain: "example.com" }
    ];

    const [selected, setSelected] = useState(aliases[0]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full">
                <div className="flex items-center gap-2 w-full justify-start px-4 py-2 rounded-lg cursor-pointer hover:bg-accent">
                    <div className="flex items-center gap-2">
                        <img
                            src={`https://www.google.com/s2/favicons?domain=${selected.domain}&sz=64`}
                            className="w-4 h-4 rounded-sm"
                        />
                        <div className="text-left">
                            <span className="text-sm font-medium line-clamp-1">{selected.name}</span>
                            <p className="text-xs font-mono text-muted-foreground font-light line-clamp-1">{selected.domain}</p>
                        </div>
                    </div>
                    <ChevronsUpDown className="ml-auto" size={16} />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="end" sideOffset={4} className="mt-2 w-72">
                <DropdownMenuGroup>
                    <DropdownMenuItem className="h-10 mb-1">
                        <PlusIcon />
                        Create URL Alias
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <Separator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                        URL Aliases
                    </DropdownMenuLabel>

                    {aliases.map((a, i) => (
                        <DropdownMenuItem
                            key={i}
                            onClick={() => setSelected(a)}
                            className="flex items-center gap-3"
                        >
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${a.domain}&sz=64`}
                                className="w-4 h-4 rounded-sm"
                            />

                            <div className="flex flex-col flex-1">
                                <span className="text-sm">{a.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    {a.domain}
                                </span>
                            </div>

                            <DropdownMenuShortcut>⌘{i}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
