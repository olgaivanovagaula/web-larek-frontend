import { Component } from './base/component';

import { IEvents } from './base/events';

import { ensureElement } from '../utils/utils';

interface IPage {
	counter: number;

	catalog: HTMLElement[];

	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _pageWrapper: HTMLElement;

	protected _counterElement: HTMLElement;
	protected _catalogElement: HTMLElement;

	protected _basketElement: HTMLElement;

	constructor(container: HTMLElement, protected eventHandlers: IEvents) {
		super(container);

		this._counterElement = ensureElement<HTMLElement>(
			'.header__basket-counter'
		);
		this._catalogElement = ensureElement<HTMLElement>('.gallery');
		this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basketElement = ensureElement<HTMLElement>('.header__basket');

		this._basketElement.addEventListener('click', () => {
			this.eventHandlers.emit('basket:open');
		});
	}
	set locked(isLocked: boolean) {
		this.toggleClass(this._pageWrapper, 'page__wrapper_locked', isLocked);
	}

	set catalog(items: HTMLElement[]) {
		this._catalogElement.replaceChildren(...items);
	}
	set counter(value: number) {
		this.setText(this._counterElement, value.toString());
	}

	public logElementInfo(element: HTMLElement): void {
		console.log(
			`Element Info - Tag: ${element.tagName}, Classes: ${Array.from(
				element.classList
			).join(', ')}`
		);
	}
}
