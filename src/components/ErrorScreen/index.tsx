import * as React from 'react'

import { Button } from '@/components/Button'
import { Code } from '@/components/Code'
import { MessageScreen } from '@/components/MessageScreen'
import { useStoreContext } from '@/hooks/useStore'
import { WidgetFormStore } from '@/stores/WidgetFormStore'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import useClipboard from 'react-use-clipboard'
import styles from './index.module.scss'

export const ErrorScreen: React.FC = observer(() => {
    const form = useStoreContext(WidgetFormStore)
    const [visible, setVisible] = React.useState(false)
    const [isCopied, setCopied] = useClipboard(form.error ?? '', { successDuration: 1000 })

    const onClose = action(() => {
        setVisible(false)
        form.error = undefined
    })

    React.useEffect(() => {
        setVisible(!!form.error)
    }, [form.error])

    return visible
        ? (
            <MessageScreen
                onClose={onClose}
                title='Transaction error'
                message={
                    <>
                        <Code
                            className={styles.code}
                            value={form.error}
                        />
                        <Button
                            block
                            onClick={setCopied}
                        >
                            {isCopied ? 'Copied' : 'Copy'}
                        </Button>
                    </>
                }
            />
        )
        : null
})
