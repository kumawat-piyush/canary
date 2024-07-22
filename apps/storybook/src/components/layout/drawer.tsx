import React, { ReactNode } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@harnessio/canary'

interface drawerProps {
  children: ReactNode
}

export default function Drawer({ children }: drawerProps) {
  return (
    <Sheet>
      <SheetTrigger>Click to open drawer</SheetTrigger>
      <SheetContent className="w-[500px]">
        <SheetHeader>
          <SheetTitle>Sample drawer content</SheetTitle>
          <SheetDescription>{children}</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
