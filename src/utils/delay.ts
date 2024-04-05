export async function delay(ms: number): Promise<void> {
    await new Promise(r => {
        setTimeout(r, ms)
    })
}
