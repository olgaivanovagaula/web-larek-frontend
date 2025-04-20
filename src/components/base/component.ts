
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	toggleClass(element: HTMLElement | null, className: string, force?: boolean): void {
		if (element) {
			element.classList.toggle(className, force);
		}
	}


	protected setText(element: HTMLElement | null, value: unknown): void {
		if (element) {
			element.textContent = String(value ?? '');
		}
	}

	setDisabled(element: HTMLElement | null, state: boolean): void {
		if (element) {
			element.toggleAttribute('disabled', state);
		}
	}

	protected setHidden(element: HTMLElement | null): void {
		if (element) {
			element.style.display = 'none';
		}
	}

	protected setVisible(element: HTMLElement | null): void {
		if (element) {
			element.style.removeProperty('display');
		}
	}

	protected setImage(
		element: HTMLImageElement | null,
		src: string,
		alt?: string
	): void {
		if (element) {
			element.src = src;
			if (alt) element.alt = alt;
		}
	}

	protected setAttribute(
		element: HTMLElement | null,
		attr: string,
		value: string
	): void {
		if (element) {
			element.setAttribute(attr, value);
		}
	}

	protected removeAttribute(element: HTMLElement | null, attr: string): void {
		if (element) {
			element.removeAttribute(attr);
		}
	}

	protected addEventHandler<K extends keyof HTMLElementEventMap>(
		element: HTMLElement | null,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void
	): void {
		if (element) {
			element.addEventListener(event, callback);
		}
	}

	protected removeEventHandler<K extends keyof HTMLElementEventMap>(
		element: HTMLElement | null,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void
	): void {
		if (element) {
			element.removeEventListener(event, callback);
		}
	}

	protected setStyle(element: HTMLElement | null, styles: Partial<CSSStyleDeclaration>): void {
		if (element) {
			Object.assign(element.style, styles);
		}
	}

	render(data?: Partial<T>): HTMLElement {
		if (data) {
			Object.keys(data).forEach((key) => {
				if (key in this) {
					(this as any)[key] = data[key as keyof T];
				}
			});
		}
		return this.container;
	}
}
