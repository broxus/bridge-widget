import classNames from 'classnames'
import * as React from 'react'

import styles from './index.module.scss'

type Props = {
    size?: number
    className?: string
    color?: string
}

export function Loader({
    size = 16,
    className,
    color,
}: Props): JSX.Element {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 22 22'
            className={classNames(styles.loader, className)}
            style={{
                color,
                width: size,
                height: size,
            }}
        >
            <path
                d='M11 22C17.0959 22 22 17.0959 22 11C22 7.12134 20.0146 3.72514 17 1.76773L16 3.45543C18.4345 5.04268 20 7.78975 20 11C20 16.0799 16.0799 20 11 20C5.92011 20 2 16.0799 2 11C2 5.92011 5.92011 2 11 2V0C4.90413 0 0 4.90413 0 11C0 17.0959 4.90413 22 11 22Z'
                fill='currentColor'
            />
        </svg>
    )
}
