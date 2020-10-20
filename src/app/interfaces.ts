export type QuestionType = 'string' | 'boolean' | 'text' | 'tags' | 'select' | 'complex' | 'list';

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
