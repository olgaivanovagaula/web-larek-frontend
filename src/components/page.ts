import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;
	protected _catalog: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this._catalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
	set counter(value: number) {
		this.setText(this._counter, value.toString());
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}
}
