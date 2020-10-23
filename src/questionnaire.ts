import { IQuestion } from './app/interfaces';

export const questionnaire: IQuestion = {
	type: 'complex',
	children: [
		{
			id: 'MD',
			type: 'complex',
			title: 'Metadata',
			children: [
				{
					id: '1',
					type: 'string',
					default: '',
					title: 'Title',
					help: 'TestTestTest',
					question: 'Title of the AI.',
					config: {
						minLength: 8,
						maxLength: 128,
					},
				},
				{
					id: '2',
					type: 'string',
					default: '',
					title: 'Short Title',
					question: 'Short title of the AI.',
					config: {
						minLength: 2,
						maxLength: 32,
					},
				},
				{
					id: '3',
					type: 'tags',
					default: [],
					title: 'Keywords',
					question: 'Keywords relevant for the AI.',
					config: {
						allowCustom: true,
						options: [
							{key: 'omics', value: 'Omics'},
							{key: 'clinical', value: 'Clinical'},
							{key: 'medical_speciality', value: 'Medical speciality'},
							{key: 'endocrinology', value: 'Endocrinology'},
							{key: 'cardiology', value: 'Cardiology'},
						],
						minLength: 2,
						maxLength: 10,
					},
				},
				{
					id: '4',
					type: 'list',
					title: 'Contact',
					child: {
						type: 'complex',
						title: 'Contact',
						children: [
							{
								id: '1',
								type: 'string',
								title: 'Name',
								question: 'Name of the author.',
								default: ''
							},
							{
								id: '2',
								type: 'string',
								title: 'Institution',
								question: 'Name of the institution.',
								default: ''
							},
							{
								id: '3',
								type: 'string',
								title: 'Email',
								question: 'Email address of the author.',
								default: '',
								config: {
									inputType: 'email',
								},
							},
							{
								id: '4',
								type: 'string',
								default: '',
								optional: true,
								title: 'ORCID iD',
								question: 'ORCID iD of the author.',
							},
						],
					},
				},
				{
					id: '5',
					type: 'list',
					title: 'Funding',
					question: 'Funding details relevant for the AI.',
					child: {
						type: 'text',
						default: '',
						title: 'Funding',
						question: 'Funding details relevant for the AI.',
					},
				},
				{
					id: '6',
					type: 'boolean',
					default: false,
					title: 'Appear in search',
					question: 'Specify whether the AI should appear in the search.',
				},
			]
		},
		{
			id: 'P', type: 'complex', title: 'Purpose', question: '', children: [
				{
					id: '1',
					type: 'text',
					default: '',
					title: 'Purpose',
					question: 'What is your AI designed to learn or predict?',
				},
				{
					id: '2',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'boolean',
							default: false,
							title: 'Predicts surrogate marker',
							question: 'Does your AI predict a surrogate marker?',
						},
						{
							id: '2',
							type: 'text',
							default: '',
							condition: (val: any) => val['1'] === true,
							title: 'Information about surrogate marker',
							question: 'More detailed information about the surrogate marker.',
						},
					]
				},
				{
					id: '3',
					type: 'complex',
					title: 'AI category',
					question: 'To which category does your AI problem belong?',
					children: [
						{
							id: '1',
							type: 'select',
							title: 'Category',
							question: 'To which category does your AI problem belong?',
							config: {
								allowCustom: false,
								options: [
									{key: 'cf', value: 'Classification'},
									{key: 'ce', value: 'Continuous estimation'},
									{key: 'cl', value: 'Clustering'},
									{key: 'dr', value: 'Dimensionality reduction'},
									{key: 'ad', value: 'Anomaly detection'},
									{key: 'rr', value: 'Ranking / Recommendation'},
									{key: 'dg', value: 'Data generation'},
									{key: 'other', value: 'Other'},
								],
							},
						},
						{
							id: '2',
							type: 'text',
							default: '',
							condition: (val: any) => val['1'] === 'other',
							title: 'Category',
							question: 'More detailed information',
						},
					]
				},
			]
		},
		{
			id: 'D',
			type: 'list',
			title: 'Dataset',
			child: {
				type: 'complex',
				title: 'Title',
				question: 'Title of the AI',
				children: [
					{
						id: '1',
						type: 'text',
						default: '',
						title: 'Information about the data',
						question: 'What is the type of the data and how was it generated or obtained?',
					},
					{
						id: '2',
						type: 'complex',
						children: [
							{
								id: '1',
								type: 'radio',
								default: 'r',
								question: 'Is the data real or simulated?',
								config: {
									options: [
										{key: 'r', value: 'Real'},
										{key: 's', value: 'Simulated'},
									],
								},
							},
							{
								id: '2',
								condition: (val: any) => val['1'].value === 's',
								type: 'text',
								default: '',
								title: 'Information about simulated data',
								question: 'How was the data simulated?',
							},
						],
					},
					{
						id: '3',
						type: 'complex',
						children: [
							{
								id: '1',
								type: 'radio',
								default: 'na',
								question: 'Is the data publicly available?',
								config: {
									options: [
										{key: 'a', value: 'Publicly available'},
										{key: 'r', value: 'Upon request'},
										{key: 'na', value: 'Not available'},
									],
								},
								scores: {
									reproducibility: (val: any) => ({a: 1.0, r: 0.5, na: 0.0}[val.value]),
								},
							},
							{
								id: '2',
								condition: (val: any) => val['1'].value === 'a',
								type: 'string',
								default: '',
								title: 'Data availability details',
								question: 'Where can the data be found?',
							},
							{
								id: '3',
								condition: (val: any) => val['1'].value === 'r',
								type: 'string',
								default: '',
								title: 'Data request details',
								question: 'How can the data be requested?',
							},
						],
					},
					{
						id: '4',
						type: 'radio',
						default: 'no',
						question: 'Is this data used for training?',
						help: 'Specify if this dataset or part of this dataset was used for training the AI method and how.',
						config: {
							options: [
								{key: 'yes', value: 'Yes'},
								{key: 'no', value: 'No'},
							],
						},
					},
					{
						id: '5',
						type: 'complex',
						children: [
							{
								id: '1',
								type: 'radio',
								default: 'no',
								question: 'Did you check if the data is subject to biases?',
								config: {
									options: [
										{key: 'yes', value: 'Yes'},
										{key: 'no', value: 'No'},
									],
								},
								scores: {
									validation: (val: any) => ({yes: 1.0, no: 0.0}[val.value]),
								},
							},
							{
								id: '2',
								condition: (val: any) => val['1'].value === 'yes',
								type: 'text',
								default: '',
								title: 'Details on biases',
								question: 'How did you check for biases and what was your conclusion?',
							},
						],
					},
					{
						id: '6',
						type: 'complex',
						children: [
							{
								id: '1',
								type: 'string',
								default: '',
								title: 'Samples',
								question: 'How many samples does the dataset have?',
							},
							{
								id: '2',
								type: 'string',
								default: '',
								title: 'Features',
								question: 'How many features does the dataset have?',
							},
						],
					},
					{
						id: '7',
						type: 'complex',
						children: [
							{
								id: '1',
								type: 'checkboxes',
								default: [],
								optional: true,
								question: 'How did you pre-process your data?',
								config: {
									options: [
										{key: 'no', value: 'Normalization'},
										{key: 'fs', value: 'Feature selection'},
										{key: 'md', value: 'Handling of missing data'},
										{key: 'ol', value: 'Handling of outliers'},
										{key: 'ab', value: 'Abstraction'},
										{key: 'rf', value: 'Reformulation'},
										{key: 'ap', value: 'Approximation'},
										{key: 'ft', value: 'Feature transformation'},
										{key: 'other', value: 'Other'},
									],
								}
							},
							{
								id: '2',
								condition: (val: any) => val['1'].length > 0,
								type: 'text',
								default: '',
								title: 'Pre-processing details',
								question: 'Elaborate how you have performed pre-processing of this data.',
							},
						],
					},
				]
			},
		},
		{
			id: 'M',
			type: 'complex',
			title: 'Method',
			children: [
				{
					id: '1',
					type: 'text',
					default: '',
					title: 'AI or mathematical methods',
					question: 'Which AI or mathematical methods did you use and how did you select them?',
				},
				{
					id: '2',
					type: 'radio',
					default: 'default',
					title: 'Hyper-parameters',
					question: 'How did you select your method’s hyper-parameters?',
					config: {
						options: [
							{key: 'default', value: 'Default'},
							{key: 'hpt', value: 'Hyper-parameter tuning'},
							{key: 'na', value: 'Doesn\'t apply'},
						],
					},
					scores: {
						validation: (val: any) => ({default: 0.0, hpt: 1.0}[val.value]),
					}
				},
				{
					id: '3',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'checkboxes',
							default: [],
							title: 'Test metrics',
							question: 'Which test metrics do you report?',
							config: {
								options: [
									{key: 'acc', value: 'Accuracy'},
									{key: 'pc', value: 'Precision'},
									{key: 'rc', value: 'Recall'},
									{key: 'cm', value: 'Confusion matrix'},
									{key: 'f1', value: 'F1-score'},
									{key: 'l', value: 'Loss'},
									{key: 'auc', value: 'AUC (area under curve)'},
									{key: 'me', value: 'MAE/MSE (mean absolute/square error)'},
									{key: 'gini', value: 'Gini coefficient'},
									{key: 'rt', value: 'Runtime'},
									{key: 'sa', value: 'Sensitivity analysis'},
									{key: 'other', value: 'Other'},
								],
							},
							scores: {
								validation: (val: any) => val.length > 0 ? 1.0 : 0.0,
							},
						},
						{
							id: '2',
							condition: (val: any) => val['1'].find((o) => o.value === 'other'),
							type: 'text',
							default: '',
							title: 'Additional test metrics',
							question: 'Which additional metrics do you report?',
						},
					]
				},
				{
					id: '4',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'checkboxes',
							default: [],
							question: 'How do you prevent overfitting?',
							config: {
								options: [
									{key: 'cv', value: 'Cross validation'},
									{key: 'ss', value: 'Shuffle split'},
									{key: 'id', value: 'Validation on independent dataset'},
									{key: 'bs', value: 'Bootstrapping'},
									{key: 'rg', value: 'Regularization'},
									{key: 'fs', value: 'Feature selection'},
									{key: 'other', value: 'Other'},
								],
							},
							scores: {
								validation: (val: any) => val.length > 0 ? 1.0 : 0.0,
							},
						},
						{
							id: '2',
							condition: (val: any) => val['1'].length > 0,
							type: 'text',
							default: '',
							title: 'Overfitting details',
							question: 'Elaborate on how you prevented overfitting.',
						},
					]
				},
				{
					id: '5',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'radio',
							default: 'no',
							question: 'Did you check if there are specific trigger situations ' +
								'(e.g. confounding factors) that induce your AI to fail in its task?',
							config: {
								options: [
									{key: 'yes', value: 'Yes'},
									{key: 'no', value: 'No'},
								],
							},
							scores: {
								validation: (val: any) => val.value === 'yes' ? 1.0 : 0.0,
							},
						},
						{
							id: '2',
							condition: (val: any) => val['1'].value === 'yes',
							type: 'text',
							default: '',
							title: 'Trigger situations',
							question: 'Elaborate on whether there are trigger situations.',
						},
					]
				},
				{
					id: '6',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'radio',
							default: 'no',
							question: 'Did you check whether randomized steps in your AI affect the stability of the results?',
							config: {
								options: [
									{key: 'yes', value: 'Yes'},
									{key: 'no', value: 'No'},
								],
							},
							scores: {
								validation: (val: any) => val.value === 'yes' ? 1.0 : 0.0,
							},
						},
						{
							id: '2',
							condition: (val: any) => val['1'].value === 'yes',
							type: 'text',
							default: '',
							title: 'Randomized steps',
							question: 'Elaborate on how randomized steps affect the stability.',
						},
					]
				},
				{
					id: '7',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'radio',
							default: 'no',
							question: 'Did you compare against a simple baseline model?',
							config: {
								options: [
									{key: 'yes', value: 'Yes'},
									{key: 'no', value: 'No'},
								],
							},
							scores: {
								validation: (val: any) => val.value === 'yes' ? 1.0 : 0.0,
							},
						},
						{
							id: '2',
							condition: (val: any) => val['1'].value === 'yes',
							type: 'text',
							default: '',
							title: 'Baseline model comparison',
							question: 'Elaborate on how you compared against a baseline model.',
						},
					]
				},
				{
					id: '8',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'radio',
							default: 'no',
							question: 'Did you compare against state-of-the-art approaches?',
							config: {
								options: [
									{key: 'yes', value: 'Yes'},
									{key: 'no', value: 'No'},
								],
							},
							scores: {
								validation: (val: any) => val.value === 'yes' ? 1.0 : 0.0,
							},
						},
						{
							id: '2',
							condition: (val: any) => val['1'].value === 'yes',
							type: 'text',
							default: '',
							title: 'State-of-the-art comparison',
							question: 'Elaborate on how you compared against state-of-the-art approaches.',
						},
					]
				},
			],
		},
		{
			id: 'R',
			type: 'complex',
			title: 'Reproducibility',
			children: [
				{
					id: '1',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'radio',
							default: 'no',
							question: 'Do you provide all means (including dependencies) to easily re-run your AI?',
							config: {
								options: [
									{key: 'no', value: 'No'},
									{key: 'yes', value: 'Yes'},
								],
							},
							scores: {
								reproducibility: (val: any) => val.value === 'yes' ? 1.0 : 0.0,
							}
						},
						{
							id: '2',
							condition: (val: any) => val['1'].value === 'yes',
							type: 'checkboxes',
							default: [],
							question: 'Which means for re-running your AI do you provide?',
							config: {
								options: [
									{key: 'docker', value: 'Dockerfile'},
									{key: 'build', value: 'Build system files'},
									{key: 'readme', value: 'Detailed README'},
									{key: 'other', value: 'Other'},
								]
							}
						},
						{
							id: '3',
							condition: (val: any) => val['1'].value === 'yes' && val['2'].find((o) => o.value === 'other'),
							type: 'text',
							default: '',
							title: 'Elaboration on means to re-run AI',
							question: 'Elaborate on additional means you provide.',
						}
					]
				},
				{
					id: '2',
					type: 'complex',
					children: [
						{
							id: '1',
							type: 'radio',
							default: 'no',
							question: 'Is the source code of your AI publicly available?',
							config: {
								options: [
									{key: 'yes', value: 'Yes'},
									{key: 'no', value: 'No'},
									{key: 'na', value: 'Doesn\'t apply'},
								],
							},
							scores: {
								reproducibility: (val: any) => ({yes: 1.0, no: 0.0}[val.value]),
							}
						},
						{
							id: '2',
							condition: (val: any) => val['1'].value === 'yes',
							type: 'string',
							default: '',
							question: 'Specify where the source code can be found.',
						},
						{
							id: '3',
							condition: (val: any) => val['1'].value === 'yes',
							type: 'boolean',
							default: '',
							title: 'SCM was used',
							question: 'Have you used a source code management tool (e.g., Git)?',
							scores: {
								reproducibility: (val: any) => val ? 1.0 : 0.0,
							}
						},
						{
							id: '4',
							condition: (val: any) => val['1'].value === 'yes',
							type: 'select',
							title: 'License',
							question: 'Which license did you publish the code under?',
							config: {
								allowCustom: true,
								options: [
									{key: 'mit', value: 'MIT License'},
									{key: 'av2', value: 'Apache License 2.0'},
									{key: 'moz2', value: 'Mozilla Public License 2.0'},
									{key: 'gnuv3', value: 'GNU GPLv3'},
									{key: 'gnuagplv3', value: 'GNU AGPLv3'},
									{key: 'gnulgplv3', value: 'GNU LGPLv3'},
									{key: 'boost1', value: 'Boost Software License 1.0'},
								],
							}
						},
					]
				}
			],
		},
	]
};
