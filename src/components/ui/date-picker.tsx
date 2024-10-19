import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerDemoProps {
  onSelectDate?: (date: Date | undefined) => void
  today?: boolean
}

export function DatePicker({ onSelectDate, today }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>()

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (onSelectDate) {
      onSelectDate(selectedDate)
    }
  }

  React.useEffect(() => {
    if (today) {
      setDate(new Date())
    }
  }, [today])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd/MM/yyyy') : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
