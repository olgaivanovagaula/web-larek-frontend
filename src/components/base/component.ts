/**
 * Базовый компонент
 */
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {
	
	}

  protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	protected setHidden(element: HTMLElement) {
		element.style.display = 'none';
	}

	protected setVisible(element: HTMLElement) {
		element.style.removeProperty('display');
	}

	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}
  protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
