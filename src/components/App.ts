import '../scss/styles.scss';
import { AppApi } from './web';
import { CatalogChangeEvent, AppState } from './appData';

import { EventEmitter } from './base/events';
import { Card } from './card';
import { Page } from './page';
import { Order, Contact } from './order';
import { Modal } from './modal';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { ProductData, DeliveryInfo, ContactInfo } from '../types';

import { Basket } from './basket';
import { Success } from './succes';

import { API_URL, CDN_URL } from '../utils/constants';

export class App {
	private basket: Basket;
	private order: Order;
	private contacts: Contact;
	private successModal: Success;
	private page: Page;
	private modal: Modal;
	private appData: AppState;
	private api: AppApi;
	private events: EventEmitter;

	constructor() {
		this.api = new AppApi(CDN_URL, API_URL);
		this.events = new EventEmitter();
		this.page = new Page(document.body, this.events);
		this.modal = new Modal(
			ensureElement<HTMLElement>('#modal-container'),
			this.events
		);
		this.appData = new AppState({}, this.events);

		this.basket = new Basket(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#basket')),
			this.events
		);
		this.order = new Order(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#order')),
			this.events
		);
		this.contacts = new Contact(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#contacts')),
			this.events
		);
		this.successModal = this.createSuccessModalInstance();

		this.initialize();
	}

	private initialize(): void {
		this.fetchProductData();
		this.setupEventHandlers();
	}

	private setupEventHandlers(): void {
		this.events.on('basket:open', () => this.displayBasket());

		this.events.on('order:open', () => this.displayOrderForm());

		this.events.on('order:submit', () => this.displayContactForm());

		this.events.on('contacts:submit', () => this.processOrderSubmission());

		this.events.on<CatalogChangeEvent>(
			'items:changed',
			this.refreshCatalog.bind(this)
		);
		this.events.on('basket:change', this.refreshBasketView.bind(this));

		this.events.on('card:select', (item: ProductData) => this.showCard(item));

		this.events.on('card:toBasket', (item: ProductData) =>
			this.handleBasketToggle(item)
		);
		this.events.on(
			'order.payment:change',
			({ field, value }: { field: keyof DeliveryInfo; value: string }) => {
				this.appData.setOrderField(field, value);
				console.log(`Выбран способ оплаты: ${value}`);
			}
		);
		this.events.onAll(({ eventName, data }) => console.log(eventName, data));

		this.events.on('orderOrderFormErrors:change', this.modifyOrderForm());

		this.events.on(/^contacts\..*:change/, this.modifyContactField.bind(this));

		this.events.on('contactsOrderFormErrors:change', this.modifyContactForm());

		this.events.on(/^order\..*:change/, this.modifyOrderField.bind(this));
		this.events.on(
			'order.payment:change',
			({ field, value }: { field: keyof DeliveryInfo; value: string }) => {
				this.appData.setOrderField(field, value);
				console.log(`Выбран способ оплаты: ${value}`);
			}
		);
		this.events.on('modal:closed', () => {
		  this.appData.order.address = ""
		  this.appData.order.payment = ""
		  this.appData.order.email = ""
		  this.appData.order.address = ""
			this.order.reset();
			this.contacts.reset();
		});
	}

	private createSuccessModalInstance() {
		return new Success(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#success')),
			{
				onSuccessClick: () => {
					this.modal.closeModal();
					this.appData.orderReset();
					this.appData.contactReset();
					this.events.emit('basket:change');
					this.order.render({
						payment: '',
						address: '',
						valid: false,
						errors: {},
					});
					this.contacts.render({
						email: '',
						phone: '',
						valid: false,
						errors: {},
					});
				},
			}
		);
	}
	private fetchProductData(): void {
		this.api
			.fetchProductList()
			.then((products) => {
				this.appData.setCatalog(products);
			})
			.catch((error) => console.error('Error loading product list:', error));
	}

	private createCatalogCard(item: ProductData): HTMLElement {
		const card = new Card(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#card-catalog')),
			item,
			{
				onClick: () => this.events.emit('card:select', item),
				onAddToBasket: () => this.handleBasketToggle(item),
				onRemoveFromBasket: () => this.handleBasketToggle(item),
			}
		);
		card.updateButtonState(this.appData.basket.includes(item.id));
		return card.getContainer();
	}
	private cards: Record<string, Card> = {};

	private updateCard(itemId: string): void {
		const card = this.cards[itemId];
		if (!card) return;
		card.updateButtonState(this.appData.basket.includes(itemId));
	}

	private handleBasketToggle(item: ProductData): void {
		this.appData.basket.includes(item.id)
			? this.appData.removeBasket(item.id)
			: this.appData.addBasket(item.id);
		this.events.emit('basket:change');
	}
	private refreshBasketView(): void {
		this.updateBasketCounter();
		this.updateBasket();
		this.appData.basket.forEach((id) => this.updateCard(id));
	}
	private updateBasket(): void {
		const basketItems = this.appData
			.getBasketProducts()
			.map((item, index) => this.createBasketItem(item, index));
		this.basket.render({ items: basketItems, price: this.appData.getTotal() });
	}

	private createBasketItem(product: ProductData, index: number): HTMLElement {
		const card = new Card(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#card-basket')),
			product,
			{
				onRemoveFromBasket: () => this.removeItemFromBasket(product.id),
			}
		);

		card.setIndex(index); // ➕ Устанавливаем индекс

		return card.getContainer();
	}

	private updateBasketCounter(): void {
		this.page.counter = this.appData.basket.length;
	}

	private refreshCatalog(): void {
		this.page.catalog = this.appData.catalog.map((item) =>
			this.createCatalogCard(item)
		);
	}
	private showCard(item: ProductData): void {
		const card = new Card(
			cloneTemplate(ensureElement<HTMLTemplateElement>('#card-preview')),
			item,
			{
				onAddToBasket: () => this.handleBasketToggle(item),
				onRemoveFromBasket: () => this.handleBasketToggle(item),
			}
		);
		this.modal.render({ content: card.getContainer() });
		this.modal.openModal();
		card.updateButtonState(this.appData.basket.includes(item.id));
	}
	private displayBasket(): void {
		this.modal.render({ content: this.basket.getContainer() });
		this.modal.openModal();
	}

	private displayOrderForm(): void {
		this.modal.render({
			content: this.order.render({
				payment: '',
				address: '',
				valid: false,
				errors: {},
			}),
		});
	}

	private displayContactForm(): void {
		this.modal.render({
			content: this.contacts.render({
				phone: '',
				email: '',
				valid: false,
				errors: {},
			}),
		});
	}

	private removeItemFromBasket(itemId: string): void {
		this.appData.removeBasket(itemId);
		this.refreshBasketView();
	}

	private modifyOrderField({
		field,
		value,
	}: {
		field: keyof DeliveryInfo;
		value: string;
	}): void {
		this.appData.setOrderField(field, value);
		console.log(field);
		console.log(value);
	}

	private modifyContactField({
		field,
		value,
	}: {
		field: keyof ContactInfo;
		value: string;
	}): void {
		this.appData.setContactField(field, value);
	}
	private processOrderSubmission(): void {
		const { payment } = this.appData.order;
		if (!payment) return;

		this.api
			.processOrderSubmission({
				...this.appData.order,
				total: this.appData.getTotal(),
				items: this.appData.basket,
			})
			.then((res) => {
				this.appData.clearBasket();
				this.appData.orderReset();
				this.order.reset();
				this.contacts.reset();
				this.appData.contactReset();
				this.events.emit('basket:change');

				this.events.emit('basket:change');
				this.modal.render({
					content: this.successModal.render({ total: res.total }),
				});
			})
			.catch(console.error);
	}

	private modifyContactForm(): (errors: Partial<ContactInfo>) => void {
		return (errors: Partial<ContactInfo>): void => {
			this.contacts.errors = errors;
			this.contacts.valid = Object.keys(errors).length === 0;
		};
	}

	private modifyOrderForm(): (errors: Partial<DeliveryInfo>) => void {
		return (errors: Partial<DeliveryInfo>): void => {
			this.order.errors = errors;
			this.order.valid = Object.keys(errors).length === 0;
		};
	}
}
