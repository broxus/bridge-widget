import * as React from 'react'
import { createRoot } from 'react-dom/client'

import { Root } from '@/components/Root'
import './index.scss'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
)
