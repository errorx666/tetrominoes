export function choose<T>( choices: readonly T[], remove?: false ): T;
export function choose<T>( choices: T[], remove: true ): T;
export function choose<T>( choices: T[], remove = false ): T {
	const i = Math.floor( Math.random() * choices.length );
	const retval = choices[ i ];
	if( remove ) choices.splice( i, 1 );
	return retval;
}
