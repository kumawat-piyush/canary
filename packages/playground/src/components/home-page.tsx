import { Badge, Icon } from '@harnessio/canary'
import React from 'react'

export default function HomePage() {
  return (
    <div>
      <p className="text-destructive">Home page</p>
      <Badge>Badge</Badge>
      <Icon name="chevron-down" />
    </div>
  )
}
