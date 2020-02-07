export interface IDataset {
  clinical: 'clinical' | 'omics'; // D.1
  type: string; // D.2
  synthetic: 'synthetic' | 'real'; // D.3
  syntheticAvailable: string; // D.3
  availability: string; // D.4
  training: boolean; // D.5
  bias: string; // D.6
  biasAddressed: string; // D.7
  samples: string; // D.8a
  features: string; // D.8b
  normalized: string; // D.9
  preprocessing: string; // D.10

  fieldExpanded: any;
}

export interface IQuestionnaire {
  title: string; // MD.1
  description: string; // MD.2
  authorName: string; // MD.3
  authorAddress: string; // MD.3
  authorEmail: string; // MD.3
  authorORCID: string; // MD.3
  url: string; // MD.4
  public: boolean; // MD.5

  purpose: string; // P.1
  surrogate: string; // P.2
  category: string; // P.3

  datasets: IDataset[]; // D.*

  method: string; // M.1
  hyperparameters: string; // M.2
  testMetrics: string; // M.3
  overfitting: string; // M.4
  validation: string; // M.5
  confoundingFactors: string; // M.6
  reproducibility: string; // M.7
  randomBaseline: string; // M.8
  stateOfTheArt: string; // M.9

  availability: string; // R.1
  sourceCode: string; // R.2
  dependencies: string; // R.3
  operatingSystem: string; // R.4
  hardwareSpecs: string; // R.4
  highPerformance: string; // R.5

  fieldExpanded: any;
}

export interface IVersion {
  revision: number;
  date: Date;
}

export interface IReport {
  id: string;
  date: Date;
  versions: IVersion[];
  questionnaire: IQuestionnaire;
}

export function createQuestionnaire(): IQuestionnaire {
  return {
    hardwareSpecs: '',
    authorAddress: '',
    authorEmail: '',
    authorName: '',
    authorORCID: '',
    availability: '',
    category: '',
    confoundingFactors: '',
    datasets: [
      createDataset(),
    ],
    dependencies: '',
    description: '',
    highPerformance: '',
    hyperparameters: '',
    method: '',
    operatingSystem: '',
    overfitting: '',
    public: false,
    purpose: '',
    randomBaseline: '',
    reproducibility: '',
    sourceCode: '',
    stateOfTheArt: '',
    surrogate: '',
    testMetrics: '',
    title: '',
    url: '',
    validation: '',
    fieldExpanded: {},
  };
}

export function createDataset(): IDataset {
  return {
    features: '',
    availability: '',
    bias: '',
    biasAddressed: '',
    clinical: 'clinical',
    normalized: '',
    preprocessing: '',
    samples: '',
    synthetic: 'real',
    syntheticAvailable: '',
    training: false,
    type: '',
    fieldExpanded: {},
  };
}
