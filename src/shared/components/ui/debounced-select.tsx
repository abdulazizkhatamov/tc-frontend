import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { IconCheck, IconPlus } from '@tabler/icons-react'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command'
import type { Updater } from '@tanstack/form-core'
import { cn } from '@/shared/lib/utils.ts'

interface Option<T extends string> {
  label: string
  value: T
}

interface DebouncedSelectProps<T extends string> {
  value: string | Array<string>
  onChange: (value: Updater<string | Array<string>>) => void
  onBlur?: () => void
  options?: ReadonlyArray<Option<T>> // static options
  loadOptions?: (query: string) => Promise<ReadonlyArray<Option<T>>> // dynamic options
  debounce?: number
  multiple?: boolean
  placeholder?: string
  debounceSearch?: boolean
}

export function DebouncedSelect<T extends string>({
  value: initialValue,
  onChange,
  onBlur,
  options = [],
  loadOptions,
  debounce = 200,
  multiple = false,
  placeholder = 'Select...',
  debounceSearch = true,
}: DebouncedSelectProps<T>) {
  const [value, setValue] = useState<string | Array<string>>(initialValue)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  // Debounce search input
  useEffect(() => {
    if (debounce && debounceSearch) {
      const timeout = setTimeout(() => setDebouncedSearch(search), debounce)
      return () => clearTimeout(timeout)
    } else {
      setDebouncedSearch(search)
    }
  }, [search, debounce, debounceSearch])

  // Update value when initialValue changes
  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  // Debounced onChange
  useEffect(() => {
    if (debounce) {
      const timeout = setTimeout(() => onChange(value), debounce)
      return () => clearTimeout(timeout)
    } else {
      onChange(value)
    }
  }, [value, debounce, onChange])

  // Load dynamic options with React Query if loadOptions exists
  const { data: dynamicOptions = [], isLoading } = useQuery({
    queryKey: ['debounced-select', debouncedSearch],
    queryFn: () =>
      loadOptions ? loadOptions(debouncedSearch) : Promise.resolve([]),
    enabled: !!loadOptions,
  })

  // Filter static options if no loadOptions
  const filteredOptions = loadOptions
    ? dynamicOptions
    : options.filter((o) =>
        o.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )

  const selectedValues = new Set(
    Array.isArray(value) ? value : value ? [value] : [],
  )

  const toggleValue = (val: string) => {
    if (multiple) {
      const newSet = new Set(selectedValues)
      if (newSet.has(val)) newSet.delete(val)
      else newSet.add(val)
      setValue(Array.from(newSet))
    } else {
      setValue(val === value ? '' : val)
    }
  }

  return (
    <Popover onOpenChange={(open) => !open && onBlur?.()}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <IconPlus />
          {selectedValues.size > 0
            ? multiple
              ? selectedValues.size > 2
                ? `${selectedValues.size} selected`
                : filteredOptions
                    .filter((o) => selectedValues.has(o.value))
                    .map((o) => o.label)
                    .join(', ')
              : filteredOptions.find((o) => o.value === value)?.label
            : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        key={filteredOptions.length}
        className="w-[200px] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Search..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && <CommandEmpty>Loading...</CommandEmpty>}
            {!isLoading && filteredOptions.length === 0 && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleValue(option.value)}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <IconCheck />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {selectedValues.size > 0 && multiple && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setValue([])}
                    className="justify-center text-center"
                  >
                    Clear selections
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
