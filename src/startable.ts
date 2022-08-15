import { boundMethod } from 'autobind-decorator';
import { catchThrow } from './catch-throw';
import { AssertionError } from 'assert';


export enum ReadyState {
	READY = 'READY',
	STARTING = 'STARTING',
	STARTED = 'STARTED',
	STOPPING = 'STOPPING',
	STOPPED = 'STOPPED',
}

export interface OnStopping {
	(err?: Error): void;
}

export abstract class Startable {
	protected abstract state: State;
	protected abstract rawStart: RawStart;
	protected abstract rawStop: RawStop;

	public getReadyState(): ReadyState {
		return this.state.getReadyState();
	}

	/**
	 * @throws StateError
	 */
	public assertReadyState(
		action: string,
		expected: ReadyState[] = [ReadyState.STARTED],
	): void {
		for (const state of expected)
			if (this.getReadyState() === state)
				return;
		throw new StateError(
			action,
			this.getReadyState(),
			expected,
		);
	}

	/**
	 * Skip from READY to STARTED.
	 */
	public skart(startingError?: Error): void {
		this.state.skart(startingError);
	}

	/**
	 * 1. If it's READY now, then
	 * 	1. Start.
	 * 1. Return the promise of STARTING.
	 * @decorator `@boundMethod`
	 * @throws ReferenceError
	 */
	@boundMethod
	public start(onStopping?: OnStopping): PromiseLike<void> {
		return this.state.start(onStopping);
	}

	/**
	 * - If it's READY now, then
	 * 	1. Skip to STOPPED.
	 * - If it's STARTING now and `err` is given, then
	 * 	1. Make the STARTING process throw `err`.
	 * - Otherwise,
	 * 	1. If it's STARTING now and `err` is not given, then
	 * 		1. Wait until STARTED.
	 * 	1. If it's STARTED now, then
	 * 		1. Stop.
	 * 	1. If it's STOPPING or STOPPED now, then
	 * 		1. Return the promise of STOPPING.
	 * @decorator `@boundMethod`
	 * @decorator `@catchThrow()`
	 */
	@boundMethod
	@catchThrow()
	public async stop(err?: Error): Promise<void> {
		return await this.state.stop(err);
	}

	/**
	 * @throws ReferenceError
	 */
	public getRunningPromise(): PromiseLike<void> {
		return this.state.getRunningPromise();
	}
}


export abstract class Friendly extends Startable {
	public abstract state: State;
	public abstract rawStart: RawStart;
	public abstract rawStop: RawStop;
}

/**
 * @throws Error
 */
export interface RawStart {
	(): Promise<void>;
}

/**
 * @throws Error
 */
export interface RawStop {
	(err?: Error): Promise<void>;
}


export abstract class State {
	protected abstract host: Startable;

	public abstract postActivate(): void;
	public abstract getReadyState(): ReadyState;
	public abstract start(onStopping?: OnStopping): PromiseLike<void>;
	public abstract skart(err?: Error): void;
	public abstract stop(err?: Error): Promise<void>;
	public abstract getRunningPromise(): PromiseLike<void>;
}

export class StateError extends AssertionError {
	public constructor(
		public action: string,
		actualState: ReadyState,
		expectedStates?: ReadyState[],
	) {
		super({
			expected: expectedStates,
			actual: actualState,
			operator: 'in',
		});
	}
}
