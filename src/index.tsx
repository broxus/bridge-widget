import * as React from 'react'
import { createRoot } from 'react-dom/client'

import './index.scss'
import { Root } from '@/components/Root'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Root />
    </React.StrictMode>,
)
