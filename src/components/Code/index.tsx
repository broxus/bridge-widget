import * as React from 'react'

import styles from './index.module.scss'

type Props = {
    value?: string
}

export const Code: React.FC<Props> = ({
    value = '',
}) => {
    return (
        <pre className={styles.root}>
            <code>
                {value}
            </code>
        </pre>
    )
}
