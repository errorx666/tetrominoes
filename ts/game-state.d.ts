declare interface GameState extends Renderable {
	start?( param? );
	update?();
	input?( e: KeyboardEvent );
	suspend?();
	resume?( param? );
	stop?();
}
