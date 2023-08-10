export class StopWatch {
	public static start() {
		const retval = new StopWatch;
		retval.start();
		return retval;
	}

	public start() {
		const retval = this.stop();
		this.#startTime = performance.now();
		this.#elapsed = undefined;
		return retval;
	}

	public pause() {
		this.#pause = performance.now();
	}

	public unpause() {
		if( this.#pause ) {
			this.#startTime += ( performance.now() - this.#pause );
			this.#pause = undefined;
		}
	}

	public get elapsed() {
		return this.#elapsed || ( ( this.#pause ?? performance.now() ) - this.#startTime );
	}

	public stop() {
		return this.#elapsed = this.elapsed;
	}

	#pause: number|undefined;
	#startTime: number;
	#elapsed: number;
}
