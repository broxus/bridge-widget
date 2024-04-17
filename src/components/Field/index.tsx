import * as React from 'react'

import styles from './index.module.scss'

type Props = {
    label?: React.ReactNode
    error?: string
} & React.PropsWithChildren

export const Field: React.FC<Props> = ({
    children,
    label,
    error,
}) => (
    <div className={styles.root}>
        {label && (
            <div className={styles.label}>
                {label}
            </div>
        )}
        {children}
        {error && (
            <div className={styles.error}>
                {error}
            </div>
        )}
    </div>
)
