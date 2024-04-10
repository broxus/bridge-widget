import * as React from 'react'
import { createRoot } from 'react-dom/client'

import './index.scss'
import { Constructor } from '@/components/Constructor'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Constructor />
    </React.StrictMode>,
)
