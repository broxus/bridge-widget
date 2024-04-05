import * as React from 'react'

import { Button } from '@/components/Button'
import { getTxLink } from '@/utils/bridge'
import { sliceAddress } from '@broxus/js-utils'
import { observer } from 'mobx-react-lite'
import styles from './index.module.scss'
import { useStoreContext } from '@/hooks/useStore'
import { WidgetFormStore } from '@/stores/WidgetFormStore'

export const SuccessScreen: React.FC = observer(() => {
    const form = useStoreContext(WidgetFormStore)
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
        setVisible(!!form.txHash)
    }, [form.txHash])

    return visible && form.txHash && form.inputNetwork ? (
        <div className={styles.root}>
            <div
                className={styles.overlay}
                onClick={() => setVisible(false)}
            />
            <div className={styles.success}>
                <div className={styles.title}>
                    Transaction successful
                </div>
                <div className={styles.link}>
                    <a
                        href={getTxLink(form.inputNetwork, form.txHash)}
                        target="_blank"
                        rel='noopener noreferrer'
                    >
                        {sliceAddress(form.txHash)}
                    </a>
                </div>
                <div className={styles.btn}>
                    <Button
                        width={150}
                        onClick={form.reset}
                    >
                        New transfer
                    </Button>
                </div>
            </div>
        </div>
    ) : null
})
