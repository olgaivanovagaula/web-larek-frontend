import { Form } from './base/form';

import { ensureAllElements, ensureElement } from '../utils/utils';
import { IOrder, IContact } from '../types';
import { IEvents } from './base/events';
export class Order extends Form<IOrder> {
	private _addressInput: HTMLInputElement;
	private _payment: HTMLButtonElement[];

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);
		this._payment = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			this.container
		);
		this._payment.forEach((button) => {
			button.addEventListener('click', () => {
				this.payment = button.name;
				this.onInputChange('payment', button.name);
			});
		});
	}
	set payment(name: string) {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
		});
	}
	set address(value: string) {
		this._addressInput.value = value;
	}
	set valid(value: boolean) {
		this._submit.disabled =
			!value ||
			!this._payment.some((button) =>
				button.classList.contains('button_alt-active')
			);
	}

	clearFieldPayment() {
		this._payment.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', false);
		});
	}

	updateErrors(errors: Partial<IOrder>): void {
		const errorMessages = Object.values(errors).filter(Boolean).join('; ');
		const errorContainer = this.container.querySelector('.form__errors');
		if (errorContainer) {
			errorContainer.textContent = errorMessages;
		}
	}
}

export class Contact extends Form<IContact> {
	private _emailInput: HTMLInputElement;
	private _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);
		this._phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}
	set phone(value: string) {
		this._phoneInput.value = value;
	}

	updateErrors(errors: Partial<IContact>): void {
		const errorMessages = Object.values(errors).filter(Boolean).join('; ');
		const errorContainer = this.container.querySelector('.form__errors');
		if (errorContainer) {
			errorContainer.textContent = errorMessages;
		}
	}
}
