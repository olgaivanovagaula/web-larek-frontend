import { ensureElement } from '../../utils/utils';
import { IEvents } from './events';
import { Component } from './component';
interface IFormState<T> {
	valid: boolean;
	errors: Partial<Record<keyof T, string>>;
}

export class Form<T> extends Component<IFormState<T>> {
	protected _errors: HTMLElement;
	protected _submit: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
		});
		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);
		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected validateField(field: keyof T, value: string): string | null {
		if (field === 'email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(value) ? null : 'Некорректный email';
		}
		if (field === 'address') {
			return value.trim().length >= 5
				? null
				: 'Адрес должен быть не менее 5 символов';
		}
		return null;
	}

	protected updateFormState() {
		const errors: Partial<Record<keyof T, string>> = {};
		const formData = new FormData(this.container);

		formData.forEach((value, key) => {
			const fieldError = this.validateField(key as keyof T, value.toString());
			if (fieldError) {
				errors[key as keyof T] = fieldError;
			}
		});

		this.errors = errors;
		this.valid = Object.keys(errors).length === 0;
	}

	protected onInputChange(field: keyof T, value: string) {
		const error = this.validateField(field, value);
		this.events.emit(`${this.container.name}.${String(field)}:change`, {
			value,
			error,
			field,
		});
		this.updateFormState();
	}
	set errors(errors: Partial<Record<keyof T, string>>) {
		const errorMessages = Object.values(errors).filter(Boolean).join('; ');
		this.setText(this._errors, errorMessages);
	}

	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	render(state: Partial<T> & IFormState<T>): HTMLFormElement {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.entries(inputs).forEach(([key, value]) => {
			const input = this.container.querySelector<HTMLInputElement>(
				`[name="${key}"]`
			);
			if (input) input.value = value as string;
		});
		return this.container;
	}
}
