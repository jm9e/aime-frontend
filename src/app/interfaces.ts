export type QuestionType = 'string' | 'text' | 'boolean' | 'tags' | 'select' | 'complex' | 'list';

export interface IQuestion {
	id?: string;

	type: QuestionType;
	optional?: boolean;
	default?: any;
	condition?: (value: any) => boolean;
	sub?: IQuestion;
	subs?: IQuestion[];
	config?: any;

	title?: string;
	question?: string;
	help?: string;
}

export function createDefaults(q: IQuestion): any {
	if (q.type === 'list') {
		return [];
	}
	if (q.type === 'complex') {
		const d = {};
		for (const e of q.subs) {
			d[e.id] = createDefaults(e);
		}
		return d;
	}
	if (typeof q.default === 'undefined') {
		return undefined;
	}
	return JSON.parse(JSON.stringify(q.default));
}

export function validate(q: IQuestion, a: any): { valid: boolean, msg?: string } {
	if (q.type === 'string' || q.type === 'text') {
		if (q.optional || a) {
			return {valid: true};
		}
		return {valid: false, msg: 'This field is required.'};
	}
	if (q.type === 'boolean') {
		return {valid: true};
	}
	if (q.type === 'tags') {
		if (q.optional || a.length > 0) {
			return {valid: true};
		}
		return {valid: false, msg: 'Selection is missing.'};
	}
	if (q.type === 'select') {
		if (q.optional || a) {
			return {valid: true};
		}
		return {valid: false, msg: 'Selection is missing.'};
	}
	if (q.type === 'complex') {
		return {valid: true};
	}
	if (q.type === 'list') {
		if (q.optional || a.length > 0) {
			return {valid: true};
		}
		return {valid: false, msg: 'No values have been specified.'};
	}
}

export interface IVersion {
	revision: number;
	date: Date;
}

export interface IReport {
	id: string;
	date: Date;
	versions: IVersion[];
	questionnaire: { [key: string]: any };
}
