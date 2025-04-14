import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

import { IBasketView } from '../types';
import { Component } from './base/component';

export class Basket extends Component<IBasketView> {
	private _price: HTMLElement;
	private _button: HTMLButtonElement;
	private _list: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._price = ensureElement<HTMLElement>('.basket__price', this.container);

		if (this._button) {
			this._button.addEventListener('click', () => {
				this.events.emit('order:open');
			});
		}

		this.items = [];
	}

	set priceTotal(price: number) {
		this.setText(this._price, `${price.toString()} синапсов`);
	}

	public render(data?: Partial<IBasketView>): HTMLElement {
		if (data?.items) {
			this.items = data.items;
		}

		if (typeof data?.price === 'number') {
			this.priceTotal = data.price;
		}

		return this.container;
	}

	set items(items: HTMLElement[]) {
		if (!items || items.length === 0) {
			this._list.innerHTML = '<p>Корзина пуста</p>';
			this._button.disabled = true;
		} else {
			this._list.replaceChildren(...items);
			this._button.disabled = false;
		}
	}

	public getContainer(): HTMLElement {
		return this.container;
	}
}
