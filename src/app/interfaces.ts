export type QuestionType = 'string' | 'text' | 'email' | 'boolean' | 'tags' | 'checkboxes' | 'radio' | 'select' | 'complex' | 'list' | 'file';
export type ScoreType = 'validation' | 'reproducibility';

export interface IQuestion {
	id?: string;

	type: QuestionType;
	optional?: boolean;
	default?: any;
	child?: IQuestion;
	children?: IQuestion[];
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
		if (q.optional) {
			return [];
		}
		return [createDefaults(q.child)];
	}
	if (q.type === 'complex') {
		const d = {};
		for (const e of q.children) {
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
	if (q.type === 'file') {
		if (!a || !a.name) {
			return {valid: false, msg: 'No file has been specified.'};
		}
		if (!a.file) {
			return {valid: false, msg: 'Something went wrong during the file upload.'};
		}
		return {valid: true};
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
		if (q.config) {
			if (a.length < q.config.minLength) {
				return {valid: false, msg: `Need at least ${q.config.minLength} entries.`};
			}
			if (a.length > q.config.maxLength) {
				return {valid: false, msg: `At most ${q.config.maxLength} entries allowed.`};
			}
		}
		if (q.optional || a.length > 0) {
			return {valid: true};
		}
		return {valid: false, msg: 'No values have been specified.'};
	}
	return {valid: false, msg: 'Validation error (unknown type).'};
}

export function validateRec(prefix: string, q: IQuestion, a: any): { id: string, msg: string }[] {
	const msgs: { id: string, msg: string }[] = [];
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
	if (q.type === 'list') {
		if (q.id) {
			if (prefix) {
				prefix += '.';
			}
			prefix += q.id;
		}
		for (let i = 0; i < a.length; i++) {
			msgs.push(...validateRec(prefix + '.' + (i + 1), q.child, a[i]));
		}
	} else if (q.type === 'complex') {
		if (q.id) {
			if (prefix) {
				prefix += '.';
			}
			prefix += q.id;
		}
		for (const s of q.children) {
			if (typeof s.condition === 'undefined' || s.condition(a)) {
				msgs.push(...validateRec(prefix, s, a[s.id]));
			}
		}
	}
	return msgs;
}

export function score(q: IQuestion, a: any, t: ScoreType): number {
	let sc = 0;
	if (q.type === 'list') {
		for (const ae of a) {
			sc += score(q.child, ae, t) / a.length;
		}
	} else if (q.type === 'complex') {
		for (const s of q.children) {
			if (typeof s.condition === 'undefined' || s.condition(a)) {
				sc += score(s, a[s.id], t);
			}
		}
	} else {
		switch (t) {
			case 'validation':
				if (typeof q.scores !== 'undefined' && typeof q.scores.validation === 'function') {
					const as = q.scores.validation(a);
					if (typeof as !== 'undefined') {
						sc += as;
					}
				}
				break;
			case 'reproducibility':
				if (typeof q.scores !== 'undefined' && typeof q.scores.reproducibility === 'function') {
					const as = q.scores.reproducibility(a);
					if (typeof as !== 'undefined') {
						sc += as;
					}
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
			sc += maxScore(q.child, ae, t) / a.length;
		}
	} else if (q.type === 'complex') {
		for (const s of q.children) {
			if (typeof s.condition === 'undefined' || s.condition(a)) {
				sc += maxScore(s, a[s.id], t);
			}
		}
	} else {
		switch (t) {
			case 'validation':
				if (typeof q.scores !== 'undefined' && typeof q.scores.validation === 'function') {
					if (typeof q.scores.validation(a) !== 'undefined') {
						sc += 1.0;
					}
				}
				break;
			case 'reproducibility':
				if (typeof q.scores !== 'undefined' && typeof q.scores.reproducibility === 'function') {
					if (typeof q.scores.reproducibility(a) !== 'undefined') {
						sc += 1.0;
					}
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

export function parseQuestions(jsonSpec: any): IQuestion {
	const parseFunctions = (q) => {
		if (typeof q.condition === 'string') {
			q.condition = new Function('val', 'return ' + q.condition);
		}
		if (typeof q.scores !== 'undefined') {
			if (typeof q.scores.validation === 'string') {
				q.scores.validation = new Function('val', 'return ' + q.scores.validation);
			}
			if (typeof q.scores.reproducibility === 'string') {
				q.scores.reproducibility = new Function('val', 'return ' + q.scores.reproducibility);
			}
		}
		if (q.type === 'list') {
			parseFunctions(q.child);
		} else if (q.type === 'complex') {
			for (const s of q.children) {
				parseFunctions(s);
			}
		}
	}
	parseFunctions(jsonSpec);
	return jsonSpec;
}
