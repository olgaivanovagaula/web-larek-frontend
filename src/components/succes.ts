import { Component } from './base/component';
import { ensureElement } from './../utils/utils';
import { ISuccess } from '../types';

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _closeButton: HTMLButtonElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, protected actions?: ISuccessActions) {
		super(container);
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this._total = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);

		if (actions?.onClick) {
			this._closeButton.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this._total.textContent = `Списано ${value} синапсов`;
	}

	render(data: ISuccess): HTMLElement {
		this.total = data.total;
		return this.container;
	}
}
