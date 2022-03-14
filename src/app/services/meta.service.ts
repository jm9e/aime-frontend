import {Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Injectable({
	providedIn: 'root'
})
export class MetaService {

	constructor(private title: Title) {
	}

	private static getFaviconElement(): HTMLLinkElement | undefined {
		const links = Array.from(document.getElementsByTagName('link'));
		for (const link of links) {
			if (link.getAttribute('rel') === 'icon') {
				return link;
			}
		}
		return undefined;
	}

	public setTitle(title?: string) {
		if (typeof title === 'undefined') {
			this.title.setTitle(`AIMe - The registry for artificial intelligence in biomedical research`);
			return;
		}
		this.title.setTitle(`AIMe / ${title}`);
	}

	public setFavicon(href: string) {
		const linkElement = MetaService.getFaviconElement();
		if (!linkElement) {
			return;
		}
		linkElement.href = href;
	}

}
