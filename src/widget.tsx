import * as React from 'react'
import { createRoot } from 'react-dom/client'

import { Widget } from '@/components/Widget'
import './widget.scss'

const url = new URL(window.location.href)
const searchParams3 = new URLSearchParams(url.search)
const token = searchParams3.get('token') ?? undefined
const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <Widget
        outputTokenAddress={token}
    />,
)
