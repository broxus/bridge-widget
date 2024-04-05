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
            {(postfix || loading) && (
                <div className={styles.postfix}>
                    {loading && <Loader size={16} />}
                    {postfix}
                </div>
            )}
        </div>
    )
}
