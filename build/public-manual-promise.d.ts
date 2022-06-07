import { ManualPromise } from '@zimtsui/manual-promise';
export interface PublicManualPromiseLike extends Promise<void> {
    resolve(): void;
    reject(err: Error): void;
}
export declare class PublicManualPromise extends ManualPromise<void> {
    static create(): PublicManualPromiseLike;
    resolve: () => void;
    reject: (err: Error) => void;
}
