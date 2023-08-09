import { StopWatch } from './stop-watch';

export class Timer {
	constructor( interval: number, fn?: () => void ) {
		this._interval = interval;
		this._fn = fn;
		this._stopWatch = StopWatch.start();
	}

	reset() {
		this._stopWatch.start();
	}

	check() {
		if( this._stopWatch.elapsed > this._interval ) {
			if( this._fn ) this._fn();
			this.reset();
			return true;
		}
		return false;
	}

	public pause() {
		this._stopWatch.pause();
	}

	public unpause() {
		this._stopWatch.unpause();
	}

	private _fn: () => void;
	private _stopWatch: StopWatch;
	private _interval: number;
}
