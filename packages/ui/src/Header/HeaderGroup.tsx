import * as Popover from '@radix-ui/react-popover'
import { useEffect, useState } from 'react'
import './HeaderGroup.css'

interface HeaderGroupProps {
  group: string
  children: string
}

export default function HeaderItem({ group, children }: HeaderGroupProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setIsMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    setIsMounted(true)
  }, [])

  return mounted ? (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger className="trigger hidden w-32 border-l border-l-black text-center text-lg data-[state=open]:border-l-transparent data-[state=open]:bg-black data-[state=open]:text-white md:block">
        {group}
      </Popover.Trigger>
      <Popover.Portal className="">
        <Popover.Content className="content z-10 flex w-32 flex-col bg-white">
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ) : (
    <div></div>
  )
}
