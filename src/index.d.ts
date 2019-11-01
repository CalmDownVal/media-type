export type MIMETypeObject =
{
	type:
	{
		name: string;
		isExtension: boolean;
	};

	subType:
	{
		name: string;
		tree: string | null;
		suffix: string | null;
	};

	parameters:
	{
		[index: string]: string;
	};
};

export declare function parse(str: string, allowWildcards?: boolean): MIMETypeObject | null
export declare function stringify(mime: MIMETypeObject | string): string
export declare class ContentMap<T> implements Iterable<[ string, T, MIMETypeObject ]>
{
	public constructor();
	public get size(): number;
	public [Symbol.iterator](): Iterator<[ string, T, MIMETypeObject ]>;
	public get(mime: MIMETypeObject | string): T | null;
	public getAll(mime: MIMETypeObject | string): T[];
	public has(mime: MIMETypeObject | string): boolean;
	public set(mime: MIMETypeObject | string, value: T): void;
	public delete(mime: MIMETypeObject | string): boolean;
}
