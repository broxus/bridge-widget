import * as React from 'react'

import { Button } from '@/components/Button'
import { Field } from '@/components/Field'
import { Input } from '@/components/Input'
import { Loader } from '@/components/Loader'
import { Select } from '@/components/Select'
import { SuccessScreen } from '@/components/SuccessScreen'
import { UserAvatar } from '@/components/UserAvatar'
import { networks } from '@/config'
import { useAmountField } from '@/hooks/useAmountField'
import { useProvider, useStore } from '@/hooks/useStore'
import { EvmConnectStore } from '@/stores/EvmConnectStore'
import { TokenListStore } from '@/stores/TokenListStore'
import { TvmConnectStore } from '@/stores/TvmConnectStore'
import { WidgetFormStore } from '@/stores/WidgetFormStore'
import { getNetworkById, getNetworkId, getTokenId } from '@/utils/bridge'
import { formattedTokenAmount } from '@broxus/js-utils'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import styles from './index.module.scss'

type Props = {
    outputTokenAddress?: string
}

export const Widget: React.FC<Props> = observer(({
    outputTokenAddress,
}) => {
    const EvmConnectProvider = useProvider(EvmConnectStore)
    const TvmConnectProvider = useProvider(TvmConnectStore)
    const TokenListProvider = useProvider(TokenListStore)
    const WidgetFormProvider = useProvider(WidgetFormStore)
    const tokenList = useStore(TokenListStore)
    const evmConnect = useStore(EvmConnectStore)
    const tvmConnect = useStore(TvmConnectStore)
    const form = useStore(WidgetFormStore, tokenList, evmConnect, tvmConnect)
    const [inputTokenLoading, setInputTokeLoading] = React.useState(false)
    const [outputTokenLoading, setOutputTokeLoading] = React.useState(false)

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

    const onCreateInputToken = action(async (e: string) => {
        setInputTokeLoading(true)
        try {
            if (form.inputNetwork) {
                const tokenId = getTokenId({ chainId: form.inputNetwork.chainId, address: e })
                const added = await tokenList.addToken(tokenId)
                runInAction(() => {
                    form.inputTokenId = added ? tokenId : undefined
                })
            }
        } catch (e) {
            console.error(e)
        }
        setInputTokeLoading(false)
    })

    const onCreateOutputToken = async (e: string) => {
        setOutputTokeLoading(true)
        try {
            const tokenId = getTokenId({ chainId: 1, address: e })
            const added = await tokenList.addToken(tokenId)
            runInAction(() => {
                form.outputTokenId = added ? tokenId : undefined
            })
        } catch (e) {
            console.error(e)
        }
        setOutputTokeLoading(false)
    }

    React.useEffect(() => {
        if (outputTokenAddress) {
            onCreateOutputToken(outputTokenAddress)
        }
    }, [outputTokenAddress])

    return (
        <WidgetFormProvider value={form}>
            <TokenListProvider value={tokenList}>
                <TvmConnectProvider value={tvmConnect}>
                    <EvmConnectProvider value={evmConnect}>
                        <form
                            className={styles.root}
                            onSubmit={e => {
                                e.preventDefault()
                                form.exchange()
                            }}
                        >
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
                                    : evmConnect.initialized && !evmConnect.extInstalled
                                    ? (
                                        <Button href='https://metamask.io/'>
                                            Install MetaMask
                                        </Button>
                                    )
                                    : (
                                        <Button
                                            disabled={evmConnect.disabled}
                                            onClick={evmConnect.connect}
                                        >
                                            Connect MetaMask
                                            {evmConnect.disabled && <Loader />}
                                        </Button>
                                    )}
                            </Field>

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
                                        <div className={styles.address}>
                                            <Input
                                                invalid={form.wrongOutputAddress}
                                                placeholder='Enter address or connect'
                                                className={styles.input}
                                                value={form.outputAddress}
                                                onChange={action(e => {
                                                    form.outputAddress = e.currentTarget.value
                                                })}
                                            />
                                            {tvmConnect.initialized && !tvmConnect.extInstalled
                                                ? (
                                                    <Button href='https://venomwallet.com/'>
                                                        Install Venom
                                                    </Button>
                                                )
                                                : (
                                                    <Button
                                                        disabled={tvmConnect.disabled || !tvmConnect.initialized}
                                                        onClick={tvmConnect.connect}
                                                    >
                                                        Connect
                                                        {tvmConnect.disabled && <Loader />}
                                                    </Button>
                                                )}
                                        </div>
                                    )}
                            </Field>

                            <Field label='Input blockchain'>
                                <Select
                                    isLoading={!tokenList.ready}
                                    isDisabled={!tokenList.ready || !!form.txHash}
                                    options={networkOptions}
                                    onChange={e => runInAction(() => form.inputNetworkId = e?.value)}
                                    value={networkOptions.find(item => item.value === form.inputNetworkId) ?? null}
                                    formatOptionLabel={({ label, value }) => (
                                        <div className={styles.option}>
                                            <img src={getNetworkById(value).icon} width={18} height={18} />
                                            {label}
                                        </div>
                                    )}
                                />
                            </Field>

                            <Field label='Input token'>
                                <Select
                                    placeholder={`Select or enter ${form.inputNetwork?.shortName ?? 'EVM'} address`}
                                    isLoading={!tokenList.ready || inputTokenLoading}
                                    isDisabled={!tokenList.ready || !!form.txHash}
                                    options={inputTokenOptions}
                                    onChange={e => runInAction(() => form.inputTokenId = e?.value)}
                                    value={inputTokenOptions.find(item => item.value === form.inputTokenId) ?? null}
                                    onCreateOption={onCreateInputToken}
                                    formatOptionLabel={({ label, value }) => {
                                        const token = tokenList.byId[value]
                                        return (
                                            <div className={styles.option}>
                                                {token?.logoURI
                                                    ? <img src={token?.logoURI} width={18} height={18} />
                                                    : token?.address
                                                    ? <UserAvatar address={token.address} size={18} />
                                                    : null}
                                                {label}
                                            </div>
                                        )
                                    }}
                                />
                            </Field>

                            <Field label='Output token'>
                                <Select
                                    placeholder='Select or enter Venom address'
                                    isLoading={!tokenList.ready || outputTokenLoading}
                                    isDisabled={!tokenList.ready || !!form.txHash}
                                    options={outputTokenOptions}
                                    onChange={e => runInAction(() => form.outputTokenId = e?.value)}
                                    value={outputTokenOptions.find(item => item.value === form.outputTokenId) ?? null}
                                    onCreateOption={onCreateOutputToken}
                                    formatOptionLabel={({ label, value }) => {
                                        const token = tokenList.byId[value]
                                        return (
                                            <div className={styles.option}>
                                                {token?.logoURI
                                                    ? <img src={token?.logoURI} width={18} height={18} />
                                                    : token?.address
                                                    ? <UserAvatar address={token.address} size={18} />
                                                    : null}
                                                {label}
                                            </div>
                                        )
                                    }}
                                />
                            </Field>

                            <Field label='Amount'>
                                <Input
                                    prefix={form.inputToken ? (
                                        form.inputToken.logoURI
                                            ? <img src={form.inputToken.logoURI} width={18} height={18} />
                                            : <UserAvatar address={form.inputToken.address} size={18} />
                                    ) : undefined}
                                    disabled={!!form.txHash}
                                    placeholder='Enter amount'
                                    value={form.amount}
                                    onChange={amountField.onChange}
                                    onBlur={amountField.onBlur}
                                    postfix={form.balance && form.inputToken
                                        ? `Balance: ${formattedTokenAmount(form.balance, form.inputToken.decimals)}`
                                        : undefined}
                                />
                            </Field>

                            <Field label='Min amount to receive'>
                                <Input
                                    readOnly
                                    prefix={form.outputToken ? (
                                        form.outputToken.logoURI
                                            ? <img src={form.outputToken.logoURI} width={18} height={18} />
                                            : <UserAvatar address={form.outputToken.address} size={18} />
                                    ) : undefined}
                                    value={form.amountToReceive ? formattedTokenAmount(form.amountToReceive) : ''}
                                />
                            </Field>

                            {form.txHash
                                ? (
                                    <Button onClick={form.reset}>
                                        New transfer
                                    </Button>
                                )
                                : form.wrongNetwork
                                ? (
                                    <Button
                                        disabled={evmConnect.disabled}
                                        onClick={() => evmConnect.changeNetwork(form.inputNetworkId!)}
                                    >
                                        Change Network
                                    </Button>
                                )
                                : (
                                    <Button
                                        submit
                                        disabled={!form.readyToExchange}
                                    >
                                        {form.loading
                                            ? <Loader />
                                            : form.notEnoughLiquidity
                                            ? 'Not enough liquidity'
                                            : (form.amountEnough === false || form.valueEnough === false)
                                            ? 'Insufficient balance'
                                            : form.wrongOutputAddress
                                            ? 'Invalid venom address'
                                            : 'Exchange'}
                                    </Button>
                                )}
                            <SuccessScreen />
                        </form>
                    </EvmConnectProvider>
                </TvmConnectProvider>
            </TokenListProvider>
        </WidgetFormProvider>
    )
})
