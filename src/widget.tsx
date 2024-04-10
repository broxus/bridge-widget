import * as React from 'react'
import { createRoot } from 'react-dom/client'

import './widget.scss'
import { Widget } from '@/components/Widget'

const url = new URL(window.location.href)
const searchParams3 = new URLSearchParams(url.search)
const token = searchParams3.get('token') ?? undefined
const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <React.StrictMode>
        <Widget
            outputTokenAddress={token}
        />
    </React.StrictMode>,
)
