import { Rectangle } from "./rectangle";

export interface Matrix2D<T> extends Rectangle {
	get( x: number, y: number ): T;
	set( x: number, y: number, value: T ): void;
}
