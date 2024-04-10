import classNames from 'classnames'
import * as React from 'react'

import styles from './index.module.scss'

type Props = {
    address: string
    className?: string
    size?: number
}

const circles = [
    {
        cx: 3,
        cy: 3,
        r: 7,
        fill: 0,
    },
    {
        cx: 3,
        cy: 13,
        r: 7,
        fill: 4,
    },
    {
        cx: 3,
        cy: 23,
        r: 7,
        fill: 8,
    },
    {
        cx: 3,
        cy: 33,
        r: 7,
        fill: 12,
    },
    {
        cx: 13,
        cy: 3,
        r: 7,
        fill: 1,
    },
    {
        cx: 13,
        cy: 13,
        r: 7,
        fill: 5,
    },
    {
        cx: 13,
        cy: 23,
        r: 7,
        fill: 9,
    },
    {
        cx: 13,
        cy: 33,
        r: 7,
        fill: 13,
    },
    {
        cx: 23,
        cy: 3,
        r: 7,
        fill: 2,
    },
    {
        cx: 23,
        cy: 13,
        r: 7,
        fill: 6,
    },
    {
        cx: 23,
        cy: 23,
        r: 7,
        fill: 10,
    },
    {
        cx: 23,
        cy: 33,
        r: 7,
        fill: 14,
    },
    {
        cx: 33,
        cy: 3,
        r: 7,
        fill: 3,
    },
    {
        cx: 33,
        cy: 13,
        r: 7,
        fill: 7,
    },
    {
        cx: 33,
        cy: 23,
        r: 7,
        fill: 11,
    },
    {
        cx: 33,
        cy: 33,
        r: 7,
        fill: 15,
    },
]

export const UserAvatar: React.FC<Props> = ({
    address,
    className,
    size = 24,
}) => {
    const colors = React.useMemo(() => getColors(address), [address])

    return (
        <svg
            width={size}
            height={size}
            viewBox='0 0 36 36'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className={classNames(styles.root, className)}
        >
            <g>
                {circles.map(({ fill, ...circle }) => (
                    <circle
                        key={`${Object.values(circle).join()}${fill}`}
                        {...circle}
                        fill={colors[fill]}
                    />
                ))}
            </g>
        </svg>
    )
}

function getColors(address: string): string[] {
    const hash = address.split(':')[1] ?? address.split('x')[1] ?? address
    const factor = Math.floor((hash.length > 64 ? 64 : hash.length) / 16)
    const colors: string[] = []
    for (let i = 0; i < 16; i++) {
        colors.push(
            `#${hash[0]}${hash[i * factor]}${hash[i * factor + 1]}${hash[i * factor + 2]}${hash[hash.length - 1]}${
                hash[i * factor + 3]
            }`,
        )
    }

    return colors
}
