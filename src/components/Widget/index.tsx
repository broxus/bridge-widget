import * as React from 'react'

import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Input } from '@/components/Input'
import { Loader } from '@/components/Loader'
import { Select } from '@/components/Select'
import { networks } from '@/config'
import { useAmountField } from '@/hooks/useAmountField'
import { useProvider, useStore } from '@/hooks/useStore'
import { EvmConnectStore } from '@/stores/EvmConnectStore'
import { TokenListStore } from '@/stores/TokensStore'
import { TvmConnectStore } from '@/stores/TvmConnectStore'
import { WidgetFormStore } from '@/stores/WidgetFormStore'
import { getNetworkId, getTokenId } from '@/utils/bridge'
import { formattedTokenAmount } from '@broxus/js-utils'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import styles from './index.module.scss'

export const Widget: React.FC = observer(() => {
    const EvmConnectProvider = useProvider(EvmConnectStore)
    const TvmConnectProvider = useProvider(TvmConnectStore)
    const TokenListProvider = useProvider(TokenListStore)
    const WidgetFormProvider = useProvider(WidgetFormStore)
    const tokenList = useStore(TokenListStore)
    const evmConnect = useStore(EvmConnectStore)
    const tvmConnect = useStore(TvmConnectStore)
    const form = useStore(WidgetFormStore, tokenList, evmConnect)

    const networkOptions = networks
        .filter(item => item.type === 'evm')
        .map(item => ({
            value: getNetworkId(item),
            label: item.shortName,
        }))

    const inputTokenOptions = form.inputNetworkId
        ? (tokenList.byNetwork[form.inputNetworkId] ?? [])
            .map(item => ({
                value: getTokenId(item),
                label: item.symbol,
            }))
        : []

    const outputTokenOptions = (tokenList.byNetwork['tvm-1'] ?? [])
        .map(item => ({
            value: getTokenId(item),
            label: item.symbol,
        }))

    const amountField = useAmountField({
        onChange: action(e => form.amount = e),
        onBlur: action(e => form.amount = e),
    })

    return (
        <WidgetFormProvider value={form}>
            <TokenListProvider value={tokenList}>
                <TvmConnectProvider value={tvmConnect}>
                    <EvmConnectProvider value={evmConnect}>
                        <div className={styles.root}>
                            <Field label='Venom Wallet'>
                                {tvmConnect.address
                                    ? (
                                        <div className={styles.address}>
                                            <Input
                                                readOnly
                                                value={tvmConnect.address}
                                                className={styles.input}
                                            />
                                            <Button
                                                disabled={tvmConnect.disabled}
                                                onClick={tvmConnect.disconnect}
                                            >
                                                Disconnect
                                            </Button>
                                        </div>
                                    )
                                    : (
                                        <Button
                                            disabled={tvmConnect.disabled}
                                            onClick={tvmConnect.connect}
                                        >
                                            Connect Venom Wallet
                                            {tvmConnect.disabled && <Loader />}
                                        </Button>
                                    )}
                            </Field>

                            <Field label='Meta Mask'>
                                {evmConnect.address
                                    ? (
                                        <div className={styles.address}>
                                            <Input
                                                readOnly
                                                value={evmConnect.address}
                                                className={styles.input}
                                            />
                                            {form.wrongNetwork && (
                                                <Button
                                                    disabled={evmConnect.disabled}
                                                    onClick={() => evmConnect.changeNetwork(form.inputNetworkId!)}
                                                >
                                                    Change Network
                                                </Button>
                                            )}
                                        </div>
                                    )
                                    : (
                                        <Button
                                            disabled={evmConnect.disabled}
                                            onClick={evmConnect.connect}
                                        >
                                            Connect Meta Mask
                                            {evmConnect.disabled && <Loader />}
                                        </Button>
                                    )}
                            </Field>

                            <Field label='Input blockchain'>
                                <Select
                                    isLoading={!tokenList.isReady}
                                    isDisabled={!tokenList.isReady}
                                    options={networkOptions}
                                    onChange={e => runInAction(() => form.inputNetworkId = e?.value)}
                                    value={networkOptions.find(item => item.value === form.inputNetworkId) ?? null}
                                />
                            </Field>

                            <Field label='Input token'>
                                <Select
                                    isLoading={!tokenList.isReady}
                                    isDisabled={!tokenList.isReady}
                                    options={inputTokenOptions}
                                    onChange={e => runInAction(() => form.inputTokenId = e?.value)}
                                    value={inputTokenOptions.find(item => item.value === form.inputTokenId) ?? null}
                                />
                            </Field>

                            <Field
                                label='Amount to exchange'
                                error={form.amountEnough === false ? 'Insufficient balance' : undefined}
                            >
                                <Input
                                    placeholder='Enter amount'
                                    value={form.amount}
                                    onChange={amountField.onChange}
                                    onBlur={amountField.onBlur}
                                    postfix={form.balance && form.inputToken
                                        ? `Balance: ${formattedTokenAmount(form.balance, form.inputToken.decimals)}`
                                        : undefined}
                                />
                            </Field>

                            <Field label='Output token'>
                                <Select
                                    isLoading={!tokenList.isReady}
                                    isDisabled={!tokenList.isReady}
                                    options={outputTokenOptions}
                                    onChange={e => runInAction(() => form.outputTokenId = e?.value)}
                                    value={outputTokenOptions.find(item => item.value === form.outputTokenId) ?? null}
                                />
                            </Field>

                            <Button disabled>
                                Exchange
                            </Button>
                        </div>
                    </EvmConnectProvider>
                </TvmConnectProvider>
            </TokenListProvider>
        </WidgetFormProvider>
    )
})
