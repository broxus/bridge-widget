import * as React from 'react'

import classNames from 'classnames'
import styles from './index.module.scss'

type Props = {
    value?: string
    className?: string
}

export const Code: React.FC<Props> = ({
    value = '',
    className,
}) => {
    return (
        <pre className={classNames(styles.root, className)}>
            <code>
                {value}
            </code>
        </pre>
    )
}
