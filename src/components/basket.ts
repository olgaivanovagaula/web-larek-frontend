import { EventEmitter } from './base/events';
import { BasketState } from '../types';
import { Component } from './base/component';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<BasketState> {
	private _priceElement: HTMLElement;

	private _listElement: HTMLElement;

	private _orderButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);
		this._orderButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this._priceElement = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this._listElement = ensureElement<HTMLElement>(
			'.basket__list',
			this.container
		);

		this._initializeOrderButton();
		this.items = [];
	}
	private _renderEmptyBasket(): void {
		this._listElement.innerHTML = '<p>Корзина пуста</p>';
		this.setDisabled(this._orderButton, true);
	}
	set items(items: HTMLElement[]) {
		if (!items || items.length === 0) {
			this._renderEmptyBasket();
		} else {
			this._listElement.replaceChildren(...items);
			this._updateItemIndices();
			this.setDisabled(this._orderButton, false);
		}
	}
	private _updateItemIndices(): void {
		this._listElement
			.querySelectorAll('.basket__item-index')
			.forEach((item, index) => {
				this.setText(item as HTMLElement, (index + 1).toString());
			});
	}
	private _initializeOrderButton(): void {
		this._orderButton.addEventListener('click', () => {
			this.events.emit('order:open');
		});
	}
	set totalPrice(price: number) {
		this.setText(this._priceElement, `${price} синапсов`);
	}

	public render(data?: Partial<BasketState>): HTMLElement {
		if (data?.items) {
			this.items = data.items;
		}

		if (typeof data?.price === 'number') {
			this.totalPrice = data.price;
		}

		this._updateItemIndices();

		return this.container;
	}

	public getContainer(): HTMLElement {
		return this.container;
	}
}
