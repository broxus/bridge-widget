import * as React from 'react'

import { Button } from '@/components/Button'
import useClipboard from 'react-use-clipboard'
import styles from './index.module.scss'

type Props = {
    value?: string
}

export const Code: React.FC<Props> = ({
    value = '',
}) => {
    const [isCopied, setCopied] = useClipboard(value, { successDuration: 1000 })

    return (
        <pre className={styles.root}>
            <Button
                size="s"
                onClick={setCopied}
                className={styles.copy}
            >
                {isCopied ? 'Copied' : 'Copy'}
            </Button>
            <code>
                {value}
            </code>
        </pre>
    )
}
