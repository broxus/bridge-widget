/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

type Store = {
    init?(): void
    dispose?(): void
    [key: string]: any
}

const ctxs = new Map<Store, React.Context<any>>()

const providers = new Map<Store, React.FC<any>>()

export function useStoreContext<S extends Store>(
    Store: { new(...args: any[]): S },
): S {
    const ctx = ctxs.get(Store)

    if (!ctx) {
        throw new Error(`${Store.name} context not found`)
    }

    const result = React.useContext(ctx)

    if (result === undefined) {
        throw new Error(`${Store.name} must be defined`)
    }

    return result
}

type ProviderProps<S> = {
    value: S
    children: React.ReactNode
}

export const useProvider = <S extends Store, A extends any[]>(
    Store: { new(...args: A): S },
): React.FC<ProviderProps<S>> => {
    let ctx = ctxs.get(Store)

    if (!ctx) {
        ctx = React.createContext<S | undefined>(undefined)
        ctx.displayName = Store.name
        ctxs.set(Store, ctx)
    }

    const CtxProvider = ctx.Provider

    let Provider: React.FC<ProviderProps<S>> | undefined = providers.get(Store)

    if (!Provider) {
        Provider = function ProviderComponent(
            { children, value }: ProviderProps<S>,
        ) {
            React.useEffect(() => {
                value.init?.()
                return () => {
                    value.dispose?.()
                }
            }, [value])

            return (
                <CtxProvider value={value}>
                    {children}
                </CtxProvider>
            )
        }
        providers.set(Store, Provider)
    }

    return Provider
}

export const useStore = <S extends Store, A extends any[]>(
    Store: { new(...args: A): S },
    ...deps: A
): S =>
    React.useMemo(() => (
        new Store(...deps)
    ), deps)
