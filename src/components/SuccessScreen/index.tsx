import * as React from 'react'

import { MessageScreen } from '@/components/MessageScreen'
import { useStoreContext } from '@/hooks/useStore'
import { WidgetFormStore } from '@/stores/WidgetFormStore'
import { getTxLink } from '@/utils/bridge'
import { sliceAddress } from '@broxus/js-utils'
import { observer } from 'mobx-react-lite'
import { Button } from '@/components/Button'

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
                title='Transaction successful'
                message={
                    <>
                        <a
                            href={getTxLink(form.inputNetwork, form.txHash)}
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            {sliceAddress(form.txHash)}
                        </a>
                        <Button block onClick={form.reset}>
                            New transfer
                        </Button>
                    </>
                }
            />
        )
        : null
})
