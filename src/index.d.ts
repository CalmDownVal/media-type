declare interface IMainType
{
	name: string;
	isExtension: boolean;
}

declare interface ISubType
{
	name: string;
	tree: string | null;
	suffix: string | null;
}

export declare interface IMediaType
{
	type: IMainType;
	subType: ISubType;
	parameters:
	{
		[index: string]: string;
	};
}

export declare function parse(str: string, allowWildcards?: boolean): IMediaType | null;
export declare function stringify(type: IMediaType | string): string;
export declare class ContentMap<T> implements Iterable<[ string, T, IMediaType ]>
{
	public constructor();
	public get size(): number;
	public [Symbol.iterator](): Iterator<[ string, T, IMediaType ]>;
	public get(type: IMediaType | string): T | null;
	public getAll(type: IMediaType | string): T[];
	public has(type: IMediaType | string): boolean;
	public set(type: IMediaType | string, value: T): void;
	public delete(type: IMediaType | string): boolean;
}
