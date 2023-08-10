import { Game } from '../game';
import { GameState } from './game-state';

export class GameStatePause implements GameState {
	constructor( game: Game ) {
		this.#game = game;
	}

	public start() {
		this.#game.playedTime.pause();
	}

	public stop() {
		this.#game.playedTime.unpause();
	}

	public input( e: KeyboardEvent ) {
		if( e.keyCode === 13 ) this.#game.popState();
	}

	public render( c2d: CanvasRenderingContext2D ) {
		c2d.save();

		this.#game.board.render( c2d );
		c2d.font = '24pt sans-serif';
		c2d.fillText( 'Paused', 0, 150 );

		c2d.restore();
	}

	#game: Game;
}
