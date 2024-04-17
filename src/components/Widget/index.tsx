import * as React from 'react'

import { Button } from '@/components/Button'
import { ErrorScreen } from '@/components/ErrorScreen'
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
import BigNumber from 'bignumber.js'
import { action, runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { Popover } from 'react-tiny-popover'
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

    const [slippageActive, setSlippageActive] = React.useState(false)

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

    const slippageField = useAmountField({
        defaultValue: '15',
        min: '0.01',
        onChange: action(e => form.slippage = e),
        onBlur: action(e => form.slippage = e),
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
                            <Field label='MetaMask'>
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
                                    placeholder='Select blockchain'
                                    maxMenuHeight={106}
                                    isLoading={!tokenList.ready}
                                    isDisabled={!tokenList.ready || !!form.txHash || form.submitLoading}
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
                                    maxMenuHeight={106}
                                    placeholder={`Select or enter ${form.inputNetwork?.shortName ?? 'EVM'} address`}
                                    isLoading={!tokenList.ready || inputTokenLoading}
                                    isDisabled={!tokenList.ready || !!form.txHash || form.submitLoading}
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

                            <Field
                                label={
                                    <Popover
                                        isOpen={slippageActive}
                                        onClickOutside={() => setSlippageActive(false)}
                                        positions={['left', 'bottom']}
                                        align='start'
                                        padding={10}
                                        content={
                                            <div className={styles.slippage}>
                                                <Field label='Slippage tolerance'>
                                                    <Input
                                                        value={form.slippage}
                                                        onChange={slippageField.onChange}
                                                        onBlur={slippageField.onBlur}
                                                        prefix='%'
                                                    />
                                                    <div className={styles.btns}>
                                                        <Button
                                                            size='s'
                                                            className={styles.btn}
                                                            onClick={action(() => {
                                                                form.slippage = '1'
                                                            })}
                                                        >
                                                            1%
                                                        </Button>
                                                        <Button
                                                            size='s'
                                                            className={styles.btn}
                                                            onClick={action(() => {
                                                                form.slippage = '5'
                                                            })}
                                                        >
                                                            5%
                                                        </Button>
                                                        <Button
                                                            size='s'
                                                            className={styles.btn}
                                                            onClick={action(() => {
                                                                form.slippage = '15'
                                                            })}
                                                        >
                                                            15%
                                                        </Button>
                                                    </div>
                                                </Field>
                                            </div>
                                        }
                                    >
                                        <button
                                            type='button'
                                            className={styles.amountSettings}
                                            onClick={() => setSlippageActive(!slippageActive)}
                                        >
                                            <div>
                                                Input amount
                                            </div>
                                            <div>
                                                <svg
                                                    fill='none'
                                                    xmlns='http://www.w3.org/2000/svg'
                                                    viewBox='0 0 24 24'
                                                    height='24'
                                                    width='24'
                                                >
                                                    <path
                                                        d='M17.0458 20.2491C17.8104 19.764 18.503 19.1724 19.1031 18.4941L21.2666 19.7627L23.2365 16.298L21.0774 15.0321C21.3519 14.181 21.5134 13.2783 21.5436 12.3426L24 11.9028L23.3156 7.9629L20.8597 8.40269C20.5203 7.54852 20.0649 6.75427 19.5127 6.04049L21.1181 4.09798L18.0999 1.52657L16.4959 3.46742C15.7124 3.04112 14.864 2.72245 13.9698 2.53122V0L10.03 0V2.53122C9.13573 2.72245 8.2873 3.04112 7.50375 3.46742L5.89979 1.52657L2.88162 4.09807L4.48685 6.04058C3.93473 6.75436 3.47938 7.54871 3.13997 8.40279L0.684057 7.96299L0 11.9029L2.45601 12.3427C2.48628 13.2785 2.64785 14.181 2.92238 15.0324L0.763035 16.2982L2.73306 19.7628L4.89665 18.4946C5.49658 19.1725 6.18913 19.7643 6.95388 20.2494L6.09985 22.6317L9.80225 23.9998L10.6551 21.6207C11.0946 21.6839 11.5435 21.7174 11.9999 21.7174C12.4563 21.7174 12.9053 21.684 13.3448 21.6207L14.1976 24L17.8998 22.6315L17.0458 20.2491ZM11.9997 18C8.6861 17.9999 6 15.3136 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3138 15.3135 18.0002 11.9997 18Z'
                                                        fill='currentColor'
                                                    >
                                                    </path>
                                                </svg>
                                            </div>
                                        </button>
                                    </Popover>
                                }
                            >
                                <Input
                                    disabled={!!form.txHash || form.submitLoading}
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
                                    maxMenuHeight={106}
                                    placeholder='Select or enter Venom address'
                                    isLoading={!tokenList.ready || outputTokenLoading}
                                    isDisabled={!tokenList.ready || !!form.txHash || form.submitLoading}
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

                            <Field label='Amount to receive'>
                                <Input
                                    readOnly
                                    disabled={!!form.txHash || form.submitLoading}
                                    value={form.amountToReceive ? formattedTokenAmount(form.amountToReceive.max) : ''}
                                />

                                <div className={styles.hint}>
                                    Min amount according to slippage
                                    {' — '}
                                    {form.amountToReceive?.min
                                        ? `${formattedTokenAmount(form.amountToReceive.min)}`
                                        : 'n/a'}
                                </div>
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
                                            : (form.swapPayload.error || form.bridgePayload.error)
                                            ? 'Not enough liquidity'
                                            : (form.amountEnough === false || form.valueEnough === false)
                                            ? 'Insufficient balance'
                                            : form.wrongOutputAddress
                                            ? 'Invalid venom address'
                                            : form.minAmountValid === false && form.minAmount
                                                    && form.bridgePayload.params
                                            ? `Min input amount is ${
                                                formattedTokenAmount(form.minAmount, undefined, {
                                                    roundingMode: BigNumber.ROUND_UP,
                                                })
                                            } ${form.bridgePayload.params?.evmTokenSymbol}`
                                            : 'Exchange'}
                                    </Button>
                                )}

                            <SuccessScreen />
                            <ErrorScreen />
                        </form>
                    </EvmConnectProvider>
                </TvmConnectProvider>
            </TokenListProvider>
        </WidgetFormProvider>
    )
})
