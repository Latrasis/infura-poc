"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface ComboBoxProps {
    setValue: (value: string) => void,
    value?: string,
    values: {value: string, label?: string}[],
    placeholder?: string,
}

export function ComboBox({ values, value, setValue, placeholder }: ComboBoxProps ) {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? values.find((item) => item.value === value)?.label
                        : `Select ${placeholder ?? ""}`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={placeholder ? `Search ${placeholder}...` : "Search..."} />
                    <CommandEmpty>{placeholder ?? ""} Not found.</CommandEmpty>
                    <CommandGroup>
                        {values.map(option => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue: string) => {
                                    if (currentValue !== value) {
                                        console.log(currentValue, value)
                                        setValue(currentValue)
                                    }
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
