import React from 'react'

import { Button } from '../components/ui/button'

function HomePage() {
  return (
    <div>
        HomePage 
        <Button>
            <a href="/dashboard">Dashboard</a>
        </Button>
        <Button>
            <a href="/authentication">authentication</a>
        </Button>
    </div>
  )
}

export default HomePage