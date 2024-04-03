import { IReactionDisposer } from 'mobx'

export class Reactions {
    protected reactions: IReactionDisposer[] = []

    public create(...reactions: IReactionDisposer[]): void {
        this.destroy()
        this.reactions = this.reactions.concat(reactions)
    }

    public destroy(): void {
        this.reactions.forEach(item => item())
        this.reactions = []
    }
}
