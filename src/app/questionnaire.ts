export interface IDataset {
  clinical: string; // D.1
  type: string; // D.2
  synthetic: string; // D.3
  availability: string; // D.4
  training: boolean; // D.5
  bias: boolean; // D.6
  biasAddressed?: string; // D.7
  samples: string; // D.8
  normalized: string; // D.9
  preprocessing: string; // D.10
}

export interface IQuestionnaire {
  title: string; // MD.1
  description: string; // MD.2
  author: string; // MD.3
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
  highPerformance: string; // R.5
}
