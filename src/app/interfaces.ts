export type QuestionType = 'string' | 'text' | 'email' | 'boolean' | 'tags' | 'checkboxes' | 'radio' | 'select' | 'complex' | 'list';
export type ScoreType = 'validation' | 'reproducibility';

export interface IQuestion {
	id?: string;

	type: QuestionType;
	optional?: boolean;
	default?: any;
	sub?: IQuestion;
	subs?: IQuestion[];
	config?: any;

	title?: string;
	question?: string;
	help?: string;

	condition?: (value: any) => boolean;
	scores?: {
		validation?: (value: any) => number;
		reproducibility?: (value: any) => number;
	};
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
	if (q.type === 'tags' || q.type === 'checkboxes') {
		return q.default.map((e) => ({value: e, custom: false}));
	}
	if (q.type === 'select' || q.type === 'radio') {
		return {value: q.default, custom: false};
	}
	return JSON.parse(JSON.stringify(q.default));
}

export function validate(q: IQuestion, a: any): { valid: boolean, msg?: string } {
	if (q.type === 'string' || q.type === 'text') {
		if (q.optional || a) {
			if (a && q.config) {
				if (typeof q.config.maxLength !== 'undefined' && a.length > q.config.maxLength) {
					return {valid: false, msg: `Maximum length of ${q.config.maxLength} exceeded.`};
				}
				if (typeof q.config.minLength !== 'undefined' && a.length < q.config.minLength) {
					return {valid: false, msg: `Minimum length of ${q.config.minLength} not reached.`};
				}
			}
			return {valid: true};
		}
		return {valid: false, msg: 'This field is required.'};
	}
	if (q.type === 'tags' || q.type === 'checkboxes') {
		if (q.optional || a.length > 0) {
			if (a.length > 0 && q.config) {
				if (typeof q.config.maxLength !== 'undefined' && a.length > q.config.maxLength) {
					return {valid: false, msg: `Maximum number of ${q.config.maxLength} exceeded.`};
				}
				if (typeof q.config.minLength !== 'undefined' && a.length < q.config.minLength) {
					return {valid: false, msg: `Minimum number of ${q.config.minLength} not reached.`};
				}
			}
			return {valid: true};
		}
		return {valid: false, msg: 'Selection is missing.'};
	}
	if (q.type === 'boolean') {
		return {valid: true};
	}
	if (q.type === 'select' || q.type === 'radio') {
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
	return {valid: false, msg: 'Validation error (unknown type).'};
}

export function validateRec(prefix: string, q: IQuestion, a: any): { id: string, msg: string }[] {
	const msgs: { id: string, msg: string }[] = [];
	if (q.type === 'list') {
		if (q.id) {
			if (prefix) {
				prefix += '.';
			}
			prefix += q.id;
		}
		for (let i = 0; i < a.length; i++) {
			msgs.push(...validateRec(prefix + '.' + (i + 1), q.sub, a[i]));
		}
	} else if (q.type === 'complex') {
		if (q.id) {
			if (prefix) {
				prefix += '.';
			}
			prefix += q.id;
		}
		for (const s of q.subs) {
			if (typeof s.condition === 'undefined' || s.condition(a)) {
				msgs.push(...validateRec(prefix, s, a[s.id]));
			}
		}
	} else {
		const {valid, msg} = validate(q, a);
		if (!valid) {
			if (q.id) {
				if (prefix) {
					prefix += '.';
				}
				prefix += q.id;
			}
			msgs.push({id: prefix, msg});
		}
	}
	return msgs;
}

export function score(q: IQuestion, a: any, t: ScoreType): number {
	let sc = 0;
	if (q.type === 'list') {
		for (const ae of a) {
			sc += score(q.sub, ae, t) / a.length;
		}
	} else if (q.type === 'complex') {
		for (const s of q.subs) {
			if (typeof s.condition === 'undefined' || s.condition(a)) {
				sc += score(s, a[s.id], t);
			}
		}
	} else {
		switch (t) {
			case 'validation':
				if (typeof q.scores !== 'undefined' && typeof q.scores.validation === 'function') {
					sc += q.scores.validation(a);
				}
				break;
			case 'reproducibility':
				if (typeof q.scores !== 'undefined' && typeof q.scores.reproducibility === 'function') {
					sc += q.scores.reproducibility(a);
				}
				break;
		}
	}
	return sc;
}

export function maxScore(q: IQuestion, a: any, t: ScoreType): number {
	let sc = 0;
	if (q.type === 'list') {
		for (const ae of a) {
			sc += maxScore(q.sub, ae, t) / a.length;
		}
	} else if (q.type === 'complex') {
		for (const s of q.subs) {
			if (typeof s.condition === 'undefined' || s.condition(a)) {
				sc += maxScore(s, a[s.id], t);
			}
		}
	} else {
		switch (t) {
			case 'validation':
				if (typeof q.scores !== 'undefined' && typeof q.scores.validation === 'function') {
					sc += 1;
				}
				break;
			case 'reproducibility':
				if (typeof q.scores !== 'undefined' && typeof q.scores.reproducibility === 'function') {
					sc += 1;
				}
				break;
		}
	}
	return sc;
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
