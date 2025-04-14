import { EventEmitter } from './base/events';
import { Model } from './base/modal';

export interface CatalogChangeEvent {
	products: IProductItem[];
}
import {
	IOrder,
	FormErrors,
	IDelivery,
	IProductItem,
	IContact,
	IAppState,
} from '../types';

export class AppState extends Model<IAppState> {
	order: Omit<IOrder, 'items'> = {
		total: 0,
		email: '',
		payment: '',
		address: '',
		phone: '',
	};
	orderError: FormErrors = {};
	preview: string | null = null;
	catalog: IProductItem[] = [];
	basket: string[] = [];

	constructor(
		initialState: Partial<IAppState>,
		protected events: EventEmitter
	) {
		super(initialState, events);
		this.preview = initialState.prewiew || null;
		this.basket = [];
		this.catalog = initialState.products || [];
	}

	removeBasket(productId: string) {
		const index = this.basket.indexOf(productId);
		if (index !== -1) {
			this.basket.splice(index, 1);
			this.updateBasket();
		}
	}

	addBasket(productId: string) {
		if (!this.basket.includes(productId)) {
			this.basket.push(productId);
			this.updateBasket();
		}
	}

	updateBasket() {
		this.events.emit('basket:change', {
			products: this.getBasketProducts(),
			total: this.getTotal(),
		});
	}

	clearBasket() {
		this.basket = [];
		this.updateBasket();
	}
	setOrderField(field: keyof IDelivery, value: string) {
		this.order[field] = value;
		this.validateOrder();
	}

	getTotal(): number {
		return this.getBasketProducts().reduce(
			(sum, product) => sum + (product.price || 0),
			0
		);
	}
	validateOrder(): boolean {
		const errors: FormErrors = {};
		if (!this.order.payment) errors.payment = 'Укажите способ оплаты';
		if (!this.order.address) errors.address = 'Укажите адрес';
		this.orderError = errors;
		this.events.emit('orderformErrors:change', errors);
		return Object.keys(errors).length === 0;
	}
	setContactField(field: keyof IContact, value: string) {
		this.order[field] = value;
		this.validateContact();
	}
	setCatalog(products: IProductItem[]) {
		this.catalog = products;
		this.events.emit('items:changed', { products: this.catalog });
	}

	contactReset() {
		this.order.email = '';
		this.order.phone = '';
		this.events.emit('contact:reset', this.order);
	}

	getBasketProducts(): IProductItem[] {
		return this.catalog.filter((item) => this.basket.includes(item.id));
	}

	validateContact(): boolean {
		const errors: FormErrors = {};
		if (!this.order.email) errors.email = 'Укажите email';
		if (!this.order.phone) errors.phone = 'Укажите телефон';

		this.orderError = errors;
		this.events.emit('contactsformErrors:change', errors);
		return Object.keys(errors).length === 0;
	}

	orderReset() {
		this.order.payment = '';
		this.order.address = '';
		this.events.emit('order:reset', this.order);
	}

	setPreview(item: IProductItem) {
		this.preview = item.id;
		this.events.emit('preview:changed', item);
	}
}
