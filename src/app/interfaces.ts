export type QuestionType = 'string' | 'boolean' | 'text' | 'tags' | 'select' | 'complex' | 'list';

export interface ISection {
  short: string;
  title: string;
  icon: string;
  questions: IQuestion[];
}

export interface IQuestion {
  id: string;
  type: QuestionType;
  default?: any;
  optional?: boolean;
  title: string;
  question: string;
  help?: string;
  sub?: IQuestion; // For multi questions
  subs?: { // For complex questions
    condition?: (value: any) => boolean;
    sub: IQuestion;
  }[];
  config?: any;
}

export function createDefaults(q: IQuestion): any {
  if (q.type === 'list') {
    return [];
  }
  if (q.type === 'complex') {
    const d = {};
    for (const e of q.subs) {
      d[e.sub.id] = createDefaults(e.sub);
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
