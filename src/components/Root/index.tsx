import * as React from 'react'

import { Button } from '@/components/Button'
import { Code } from '@/components/Code'
import { Input } from '@/components/Input'
import { Widget } from '@/components/Widget'
import styles from './index.module.scss'

const code = `<h1 className={styles.title}>
    Integrate Widget
</h1>
<form className={styles.form}>
    <Input
        className={styles.input}
        placeholder='Token address'
    />
    <Button>
        Get Widget
    </Button>
</form>`

export const Root: React.FC = () => (
    <div className={styles.root}>
        <div className={styles.container}>
            <div className={styles.section}>
                <h1 className={styles.title}>
                    Integrate widget
                </h1>

                <form className={styles.form}>
                    <Input
                        className={styles.input}
                        placeholder='Token Address'
                    />
                    <Button>
                        Get Widget
                    </Button>
                </form>

                <Code
                    value={code}
                />
            </div>

            <div className={styles.section}>
                <h1 className={styles.title}>
                    Widget example
                </h1>

                <Widget />
            </div>
        </div>
    </div>
)
