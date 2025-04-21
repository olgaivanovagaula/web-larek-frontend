import { OrderPayload, ContactInfo } from '../types';

import { IEvents } from './base/events';

import { Form } from './form';

import { ensureAllElements, ensureElement } from '../utils/utils';

export class Order extends Form<OrderPayload> {
	private _addressInput: HTMLInputElement;

	private _payment: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._payment = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);

		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
			});
		});
		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				const paymentMethod = button.name;
				this.payment = paymentMethod;
				this.events.emit('order.payment:change', {
					field: 'payment',
					value: paymentMethod,
				});
			});
		});
	}

	set payment(name: string) {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
	public reset(): void {
		// Убираем значения из инпутов
		Object.values(this._inputs).forEach((input) => {
			input.value = '';
		});

		// Убираем ошибки
		this.setText(this._errors, '');
		Object.keys(this._inputs).forEach((key) => {
			const errorElement = this._inputs[key]?.nextElementSibling as HTMLElement;
			if (errorElement) {
				this.setText(errorElement, '');
			}
		});

		// Убираем активный класс у кнопок оплаты
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});

		// Отключаем кнопку submit
		this.setDisabled(this._submit, true);
	}
}

export class Contact extends Form<ContactInfo> {
	private _emailInput: HTMLInputElement;

	private _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}
	set email(value: string) {
		this._emailInput.value = value;
	}
	set phone(value: string) {
		this._phoneInput.value = value;
	}
}
