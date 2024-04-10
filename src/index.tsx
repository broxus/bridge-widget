import * as React from 'react'
import { createRoot } from 'react-dom/client'

import './index.scss'

const url = new URL(window.location.href)
const searchParams3 = new URLSearchParams(url.search)
const view = searchParams3.get('view') ?? undefined
const token = searchParams3.get('token') ?? undefined
const root = createRoot(document.getElementById('root') as HTMLElement)

if (view === 'widget') {
    import('@/components/Widget').then(({ Widget }) => {
        root.render(
            <React.StrictMode>
                <Widget
                    outputTokenAddress={token}
                />
            </React.StrictMode>,
        )
    })
} else {
    import('@/components/Root').then(({ Root }) => {
        root.render(
            <React.StrictMode>
                <Root />
            </React.StrictMode>,
        )
    })
}
