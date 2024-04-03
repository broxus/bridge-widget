declare module '*.jpg'
declare module '*.png'
declare module '*.svg'
declare module '*.module.scss'

interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __venom: any
}
