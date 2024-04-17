import * as React from 'react'

import { Button } from '@/components/Button'
import { MessageScreen } from '@/components/MessageScreen'
import { useStoreContext } from '@/hooks/useStore'
import { WidgetFormStore } from '@/stores/WidgetFormStore'
import { getBridgeLink } from '@/utils/bridge'
import { sliceAddress } from '@broxus/js-utils'
import { observer } from 'mobx-react-lite'

import styles from './index.module.scss'

export const SuccessScreen: React.FC = observer(() => {
    const form = useStoreContext(WidgetFormStore)
    const [visible, setVisible] = React.useState(false)

    React.useEffect(() => {
        setVisible(!!form.txHash)
    }, [form.txHash])

    return visible && form.txHash && form.inputNetwork
        ? (
            <MessageScreen
                onClose={() => setVisible(false)}
                title='Transaction sent'
                message={
                    <>
                        <div className={styles.msg}>
                            <div>
                                Transaction time may take up to 5 minutes
                            </div>
                            <div>
                                Track on Venombridge:{' '}
                                <a
                                    href={getBridgeLink(form.inputNetwork, form.txHash)}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    {sliceAddress(form.txHash)}
                                </a>
                            </div>
                        </div>
                        <Button block onClick={form.reset}>
                            New transfer
                        </Button>
                    </>
                }
            />
        )
        : null
})
