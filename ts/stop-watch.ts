export class StopWatch {
	public static start() {
		var retval = new StopWatch;
		retval.start();
		return retval;
	}

	public start() {
		var retval = this.stop();
		this._startTime = StopWatch._now();
		this._elapsed = undefined;
		return retval;
	}

	public pause() {
		this._pause = StopWatch._now();
	}

	public unpause() {
		if( this._pause ) {
			this._startTime += ( StopWatch._now() - this._pause );
			this._pause = undefined;
		}
	}

	public get elapsed() {
		return this._elapsed || ( ( this._pause || StopWatch._now() ) - this._startTime );
	}

	public stop() {
		return this._elapsed = this.elapsed;
	}

	private static _now: () => number = ( typeof performance === 'undefined' ) ? () => Date.now() : () => performance.now();

	private _pause: number;
	private _startTime: number;
	private _elapsed: number;
}
