import * as React from 'react'

import { Loader } from '@/components/Loader'
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
    loading?: boolean
    invalid?: boolean
    prefix?: React.ReactNode
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
    loading,
    invalid,
    prefix,
}) => {
    const [focus, setFocus] = React.useState(false)
    return (
        <div
            className={classNames(
                styles.root,
                focus ? styles.focus : null,
                invalid ? styles.invalid : null,
                prefix ? styles.withPrefix : null,
                className,
            )}
        >
            {prefix && (
                <div className={styles.prefix}>
                    {prefix}
                </div>
            )}
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
            {(postfix || loading) && (
                <div className={styles.postfix}>
                    {loading && <Loader size={16} />}
                    {postfix}
                </div>
            )}
        </div>
    )
}
