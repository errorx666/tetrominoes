import { StopWatch } from './stop-watch';

export class Timer {
	constructor( interval: number, fn?: () => void ) {
		this.#interval = interval;
		this.#fn = fn;
		this.#stopWatch = StopWatch.start();
	}

	reset() {
		this.#stopWatch.start();
	}

	check() {
		if( this.#stopWatch.elapsed > this.#interval ) {
			if( this.#fn ) this.#fn();
			this.reset();
			return true;
		}
		return false;
	}

	public pause() {
		this.#stopWatch.pause();
	}

	public unpause() {
		this.#stopWatch.unpause();
	}

	#fn: () => void;
	#stopWatch: StopWatch;
	#interval: number;
}
