import { Startable } from './startable';
export interface StatefulLike<Snapshot, Backup = Snapshot> {
    capture(): Snapshot;
    restore(backup: Backup): void;
}
export declare abstract class StatefulStartable<Snapshot, Backup = Snapshot> extends Startable implements StatefulLike<Snapshot, Backup> {
    protected abstract StatefulStartable$rawStart(): Promise<void>;
    protected abstract StatefulStartable$rawStop(): Promise<void>;
    protected abstract StatefulStartable$rawCapture(): Snapshot;
    protected abstract StatefulStartable$rawRestore(backup: Backup): void;
    private StatefulStartable$restored?;
    protected Startable$rawStart(): Promise<void>;
    protected Startable$rawStop(): Promise<void>;
    capture(): Snapshot;
    restore(backup: Backup): void;
}
