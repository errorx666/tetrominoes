import { Renderable } from '../renderable';

export interface GameState extends Renderable {
	start?(): void;
	update?(): void;
	input?( e: KeyboardEvent ): void;
	suspend?(): void;
	resume?(): void;
	stop?(): void;
}
