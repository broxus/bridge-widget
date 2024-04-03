import * as React from 'react'

import classNames from 'classnames'
import styles from './index.module.scss'

type Props = {
    placeholder?: string
    className?: string
    value?: string
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    disabled?: boolean
    readOnly?: boolean
    postfix?: React.ReactNode
}

export const Input: React.FC<Props> = ({
    placeholder,
    className,
    onChange,
    onBlur,
    value = '',
    disabled,
    readOnly,
    postfix,
}) => {
    const [focus, setFocus] = React.useState(false)
    return (
        <div className={classNames(styles.root, focus ? styles.focus : null, className)}>
            <input
                type='text'
                readOnly={readOnly}
                className={styles.input}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                onChange={onChange}
                onFocus={() => setFocus(true)}
                onBlur={e => {
                    setFocus(false)
                    onBlur?.(e)
                }}
            />
            {postfix && (
                <div className={styles.postfix}>
                    {postfix}
                </div>
            )}
        </div>
    )
}
