import * as React from 'react'

import classNames from 'classnames'
import styles from './index.module.scss'

type Props = {
    onClick?: () => void
    disabled?: boolean
    className?: string
    size?: 's' | 'm'
} & React.PropsWithChildren

export const Button: React.FC<Props> = ({
    onClick,
    children,
    disabled,
    className,
    size = 'm',
}) => (
    <button
        className={classNames(styles.btn, className, styles[size])}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
)
