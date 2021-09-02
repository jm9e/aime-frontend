import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-cite-aime',
	templateUrl: './cite-aime.component.html',
	styleUrls: ['./cite-aime.component.scss']
})
export class CiteAimeComponent implements OnInit {

	public version = 0;
	public citations = [
		`Matschinske, J., Alcaraz, N., Benis, A. et al. The AIMe registry for artificial intelligence in biomedical research. Nat Methods (2021), DOI: 10.1038/s41592-021-01241-0, https://rdcu.be/cv5H7.`,
		`@article{matschinske2021aime,
\ttitle        = {The AIMe registry for artificial intelligence in biomedical research},
\tauthor       = {Matschinske, Julian and Alcaraz, Nicolas and Benis, Arriel and Golebiewski, Martin and Grimm, Dominik G. and Heumos, Lukas and Kacprowski, Tim and Lazareva, Olga and List, Markus and Louadi, Zakaria and Pauling, Josch K. and Pfeifer, Nico and R{\\"o}ttger, Richard and Schw{\\"a}mmle, Veit and Sturm, Gregor and Traverso, Alberto and Van Steen, Kristel and de Freitas, Martiela Vaz and Villalba Silva, Gerda Cristal and Wee, Leonard and Wenke, Nina K. and Zanin, Massimiliano and Zolotareva, Olga and Baumbach, Jan and Blumenthal, David B.},
\tyear         = 2021,
\tmonth        = {Aug},
\tday          = 25,
\tjournal      = {Nature Methods},
\tdoi          = {10.1038/s41592-021-01241-0},
\tissn         = {1548-7105},
\turl          = {https://doi.org/10.1038/s41592-021-01241-0},
\tabstract     = {We present the AIMe registry, a community-driven reporting platform for AI in biomedicine. It aims to enhance the accessibility, reproducibility and usability of biomedical AI models, and allows future revisions by the community.}
}`,
	`@article{matschinske2021aime,
\ttitle        = {The AIMe registry for artificial intelligence in biomedical research},
\tauthor       = {Matschinske, Julian and Alcaraz, Nicolas and Benis, Arriel and Golebiewski, Martin and Grimm, Dominik G and Heumos, Lukas and Kacprowski, Tim and Lazareva, Olga and List, Markus and Louadi, Zakaria and others},
\tyear         = 2021,
\tjournal      = {Nature Methods},
\tpublisher    = {Nature Publishing Group},
\tpages        = {1--4}
}`
	];

	constructor() {
	}

	ngOnInit(): void {
	}

}
