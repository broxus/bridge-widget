import * as React from 'react'

import classNames from 'classnames'
import styles from './index.module.scss'

type Props = {
    onClick?: () => void
    disabled?: boolean
    className?: string
    size?: 's' | 'm'
    submit?: boolean
    href?: string
    width?: number
} & React.PropsWithChildren

export const Button: React.FC<Props> = ({
    onClick,
    children,
    disabled,
    className,
    size = 'm',
    submit,
    href,
    width,
}) => {
    if (href) {
        return (
            <a
                href={href}
                onClick={onClick}
                target='_blank'
                rel='noopener noreferrer'
                className={classNames(styles.btn, className, styles[size])}
                style={{
                    minWidth: width !== undefined ? `${width}px` : undefined,
                }}
            >
                {children}
            </a>
        )
    }
    return (
        <button
            type={submit ? 'submit' : 'button'}
            onClick={onClick}
            disabled={disabled}
            className={classNames(styles.btn, className, styles[size])}
            style={{
                minWidth: width !== undefined ? `${width}px` : undefined,
            }}
        >
            {children}
        </button>
    )
}
