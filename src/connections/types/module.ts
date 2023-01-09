export type Module = {
    name: string,
    init: () => Promise<void>
}