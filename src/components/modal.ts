import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Component } from './base/component';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	private readonly closeButtonElement: HTMLButtonElement;

	private readonly contentContainerElement: HTMLElement;

	constructor(
		containerElement: HTMLElement,
		private readonly eventDispatcher: IEvents
	) {
		super(containerElement);

		this.closeButtonElement = ensureElement<HTMLButtonElement>(
			'.modal__close',
			containerElement
		) as HTMLButtonElement;
		this.contentContainerElement = ensureElement<HTMLElement>(
			'.modal__content',
			containerElement
		) as HTMLElement;

		this.initializeEventListeners();
	}

	set content(newContent: HTMLElement | null) {
		this.contentContainerElement.replaceChildren(
			newContent || document.createTextNode('')
		);
	}
	private initializeEventListeners(): void {
		this.closeButtonElement.addEventListener('click', () => this.closeModal());
		this.container.addEventListener('click', () => this.closeModal());
		this.contentContainerElement.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	}
	closeModal(): void {
		this.toggleClass(this.container, 'modal_active', false);
		this.content = null;
		this.eventDispatcher.emit('modal:closed');
	}

	openModal(): void {
		this.toggleClass(this.container, 'modal_active', true);
		this.eventDispatcher.emit('modal:opened');
	}

	get content(): HTMLElement {
		return this.contentContainerElement;
	}

	renderModal(modalData: IModalData): HTMLElement {
		this.content = modalData.content;
		this.openModal();
		return this.container;
	}

	logModalState(): void {
		console.log(
			`Modal state - Active: ${this.container.classList.contains(
				'modal_active'
			)}`
		);
	}
}
