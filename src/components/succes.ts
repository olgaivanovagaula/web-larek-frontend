import { Component } from './base/component';
import { ensureElement } from './../utils/utils';
import { SuccessResponse } from '../types';

interface SuccessResponseActions {
	onSuccessClick?: () => void;
}

//
export class Success extends Component<SuccessResponse> {
	private readonly totalDisplay: HTMLElement;

	private readonly closeButton: HTMLButtonElement;

	constructor(
		containerElement: HTMLElement,

		private readonly actions?: SuccessResponseActions
	) {
		super(containerElement);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			containerElement
		);

		this.totalDisplay = ensureElement<HTMLElement>(
			'.order-success__description',
			containerElement
		);

		this.actions?.onSuccessClick &&
			this.closeButton.addEventListener('click', this.actions.onSuccessClick);
	}

	set totalAmount(total: number) {
		this.totalDisplay.textContent = `Списано ${total} синапсов`;
	}

	render(responseData: SuccessResponse): HTMLElement {
		this.totalAmount = responseData.total;

		return this.container;
	}
}
