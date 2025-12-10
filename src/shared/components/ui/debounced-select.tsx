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

interface Option<TData> {
  label: string
  value: TData
}

interface DebouncedSelectProps<TData> {
  value: TData | Array<TData>
  onChange: (value: Updater<TData | Array<TData>>) => void
  onBlur?: () => void
  options?: ReadonlyArray<Option<TData>> // static options
  loadOptions?: (query: string) => Promise<ReadonlyArray<Option<TData>>> // dynamic options
  debounce?: number
  multiple?: boolean
  placeholder?: string
  debounceSearch?: boolean
  getKey?: (value: TData) => string
}

export function DebouncedSelect<TData>({
  value: initialValue,
  onChange,
  onBlur,
  options = [],
  loadOptions,
  debounce = 200,
  multiple = false,
  placeholder = 'Select...',
  debounceSearch = true,
  getKey = (v) => String(v), // default: string coercion for primitives
}: DebouncedSelectProps<TData>) {
  const [value, setValue] = useState<TData | Array<TData>>(initialValue)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search)

  // Debounce search
  useEffect(() => {
    if (debounce && debounceSearch) {
      const timeout = setTimeout(() => setDebouncedSearch(search), debounce)
      return () => clearTimeout(timeout)
    } else {
      setDebouncedSearch(search)
    }
  }, [search, debounce, debounceSearch])

  useEffect(() => setValue(initialValue), [initialValue])

  // Debounced propagate onChange
  useEffect(() => {
    if (debounce) {
      const timeout = setTimeout(() => onChange(value), debounce)
      return () => clearTimeout(timeout)
    } else {
      onChange(value)
    }
  }, [value, debounce, onChange])

  // Load dynamic options
  const { data: dynamicOptions = [], isLoading } = useQuery({
    queryKey: ['debounced-select', debouncedSearch],
    queryFn: () =>
      loadOptions ? loadOptions(debouncedSearch) : Promise.resolve([]),
    enabled: !!loadOptions,
  })

  const filteredOptions = loadOptions
    ? dynamicOptions
    : options.filter((o) =>
        o.label.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )

  // Create a Set of selected keys for fast lookup
  const selectedKeys = new Set(
    (Array.isArray(value) ? value : value ? [value] : []).map(getKey),
  )

  const toggleValue = (val: TData) => {
    if (multiple) {
      const current = Array.isArray(value) ? [...value] : []
      const key = getKey(val)

      if (selectedKeys.has(key)) {
        setValue(current.filter((v) => getKey(v) !== key))
      } else {
        setValue([...current, val])
      }
    } else {
      const key = getKey(val)
      const currentKey = value ? getKey(value as TData) : null
      setValue(key === currentKey ? ('' as any) : val)
    }
  }

  const selectedLabels = filteredOptions
    .filter((o) => selectedKeys.has(getKey(o.value)))
    .map((o) => o.label)

  return (
    <Popover onOpenChange={(open) => !open && onBlur?.()}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <IconPlus />
          {selectedLabels.length > 0
            ? multiple
              ? selectedLabels.length > 2
                ? `${selectedLabels.length} selected`
                : selectedLabels.join(', ')
              : selectedLabels[0]
            : placeholder}
        </Button>
      </PopoverTrigger>

      <PopoverContent key={filteredOptions.length} className="w-[200px] p-0">
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
                const key = getKey(option.value)
                const isSelected = selectedKeys.has(key)

                return (
                  <CommandItem
                    key={key}
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

            {multiple && selectedKeys.size > 0 && (
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
