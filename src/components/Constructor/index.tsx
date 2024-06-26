import * as React from 'react'

import { Button } from '@/components/Button'
import { Code } from '@/components/Code'
import { Input } from '@/components/Input'
import { useProvider, useStore } from '@/hooks/useStore'
import { ConstructorStore } from '@/stores/ConstructorStore'
import { action } from 'mobx'
import { observer } from 'mobx-react-lite'
import useClipboard from 'react-use-clipboard'
import styles from './index.module.scss'

export const Constructor: React.FC = observer(() => {
    const ConstructorProvider = useProvider(ConstructorStore)
    const constructor = useStore(ConstructorStore)

    const code = `<iframe src="${constructor.iframeURL}" style="border: 0px; height: 581px; width: 420px;"></iframe>`
    const [isCopied, setCopied] = useClipboard(code, { successDuration: 1000 })

    return (
        <ConstructorProvider value={constructor}>
            <div className={styles.root}>
                <div className={styles.container}>
                    <div className={styles.section}>
                        <h1 className={styles.title}>
                            Integrate widget
                        </h1>

                        <Input
                            className={styles.input}
                            placeholder='Output token address'
                            value={constructor.outputTokenAddress}
                            onChange={action(e => {
                                constructor.outputTokenAddress = e.currentTarget.value
                            })}
                        />

                        <Code
                            value={code}
                        />
                        <Button
                            size='s'
                            onClick={setCopied}
                            className={styles.copy}
                        >
                            {isCopied ? 'Copied' : 'Copy'}
                        </Button>
                    </div>

                    <div className={styles.section}>
                        <h1 className={styles.title}>
                            Widget example
                        </h1>

                        <iframe
                            src={constructor.iframeURL}
                            style={{
                                border: 0,
                                height: 581,
                            }}
                        />
                    </div>
                </div>
            </div>
        </ConstructorProvider>
    )
})
