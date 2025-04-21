import { IEvents } from './events';

export const isModel = <T>(obj: unknown): obj is Model<T> => {
    return obj instanceof Model;
};

export abstract class Model<T> {
    protected state: Partial<T>;
    setState(updates: Partial<T>, event?: string): void {
        this.state = { ...this.state, ...updates };
        if (event) {
            this.emitChanges(event, updates);
        }
    }
    constructor(data: Partial<T>, protected events: IEvents) {
        this.state = { ...data };
    }

    protected emitChanges(event: string, payload: Partial<T> = {}): void {
        this.events.emit(event, payload);
    }
}
