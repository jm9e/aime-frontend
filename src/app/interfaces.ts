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
  default: any;
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
