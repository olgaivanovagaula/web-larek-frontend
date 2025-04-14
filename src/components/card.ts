import { ensureElement } from '../utils/utils';
import { settings } from '../utils/constants';

import { Component } from './base/component';

import { IProductItem } from '../types';
interface ICardActions {
	onAddToBasket?: (item: IProductItem) => void;
	onRemoveFromBasket?: (item: IProductItem) => void;
	onClick?: (event: MouseEvent) => void;
}

interface ICard extends IProductItem {
	identifierCard?: string;
}

export class Card extends Component<ICard> {
	private _title: HTMLElement;

	private _item: IProductItem;
	private _isInBasket: boolean;
	private _category?: HTMLElement;
	private _price: HTMLElement;
	private _description?: HTMLElement;
	private _image?: HTMLImageElement;
	private _button?: HTMLButtonElement;
	private _identifierCard?: HTMLElement;
	constructor(
		container: HTMLElement,
		item: IProductItem,
		actions: ICardActions
	) {
		super(container);

		this._item = item;
		this._isInBasket = false;

		this._identifierCard = container.querySelector('.basket__item-index');
		this._button = ensureElement<HTMLButtonElement>('.card__button', container);
		this._description = container.querySelector('.card__text');
		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);

		this._title = ensureElement<HTMLElement>('.card__title', container);

		if (actions.onClick) {
			this.container.addEventListener('click', actions.onClick);
		}

		if (this._button) {
			this._button.addEventListener('click', (event) => {
				event.stopPropagation();
				this.toggleBasket(actions);
			});
		}

		this.render(item);
	}

	updateButton(isInBasket: boolean): void {
		this._isInBasket = isInBasket;
		if (this._button) {
			this._button.textContent = !isInBasket
				? 'Добавить в корзину'
				: 'Удалить из корзины';
		}
	}

	private toggleBasket(actions: ICardActions) {
		if (this._isInBasket) {
			actions.onRemoveFromBasket?.(this._item);
		} else {
			actions.onAddToBasket?.(this._item);
		}
		this.updateButton(!this._isInBasket);
	}

	render(item: IProductItem): HTMLElement {
		this.title = item.title;
		this.description = item.description;
		this.category = item.category;
		this.price = item.price || 0;
		this.image = item.image;

		this.id = item.id;
		return this.container;
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}
	get identifierCard(): string {
		return this._identifierCard?.textContent || '';
	}
	set identifierCard(value: string) {
		this.setText(this._identifierCard, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	get category(): string {
		return this._category?.textContent || '';
	}
	set category(value: string) {
		this.setText(this._category, value);
		if (this._category) {
			this._category.classList.add(settings[value] || '');
		}
	}
	disableButton(value: number | null) {
		if (!value && this._button) {
			this._button.disabled = true;
		}
	}
	get price(): number {
		return +this._price.textContent?.replace(/\D/g, '') || 0;
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		this.disableButton(value);
	}

	getContainer(): HTMLElement {
		if (!this.container) {
			throw new Error('Container for Card component is undefined.');
		}
		return this.container;
	}
}
