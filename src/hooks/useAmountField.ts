import { truncateDecimals } from '@broxus/js-utils'
import BigNumber from 'bignumber.js'
import * as React from 'react'

type FieldShape = {
    onBlur?: React.FocusEventHandler<HTMLInputElement>
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}

type Props = {
    max?: string
    min?: string
    defaultValue?: string
    decimals?: number
    onBlur?: (value: string) => void
    onChange?: (value: string) => void
}

export function useAmountField({ decimals, defaultValue, max, min, ...props }: Props): FieldShape {
    const onBlur: React.FocusEventHandler<HTMLInputElement> = event => {
        let { value } = event.target

        if (defaultValue && !value) {
            value = defaultValue
        } else if (value) {
            const validatedAmount = truncateDecimals(value, decimals)
            value = validatedAmount != null ? validatedAmount : ''
        }

        props.onBlur?.(value)
    }

    const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
        let { value } = event.target

        if ((event.nativeEvent as InputEvent).inputType === 'deleteByCut') {
            value = ''
        } else {
            value = value.replace(/[,]/g, '.')
            value = value.replace(/[.]+/g, '.')
            value = value.replace(/(?!- )[^0-9.]/g, '')
        }

        const bn = value ? new BigNumber(value) : undefined

        if (bn && max && bn.gt(max)) {
            value = max
        }
        if (bn && min && bn.lt(min)) {
            value = min
        }

        props.onChange?.(value)
    }

    return { onBlur, onChange }
}
