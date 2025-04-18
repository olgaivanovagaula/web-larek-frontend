/**
 * Базовый компонент
 */
export abstract class Component<T> {
	protected constructor(protected readonly container: HTMLElement) {}

	/**
	 * Переключение класса элемента
	 */
	toggleClass(element: HTMLElement | null, className: string, force?: boolean): void {
		if (element) {
			element.classList.toggle(className, force);
		}
	}

	/**
	 * Установка текста элемента
	 */
	protected setText(element: HTMLElement | null, value: unknown): void {
		if (element) {
			element.textContent = String(value ?? '');
		}
	}

	/**
	 * Установка состояния disabled
	 */
	setDisabled(element: HTMLElement | null, state: boolean): void {
		if (element) {
			element.toggleAttribute('disabled', state);
		}
	}

	/**
	 * Скрыть элемент
	 */
	protected setHidden(element: HTMLElement | null): void {
		if (element) {
			element.style.display = 'none';
		}
	}

	/**
	 * Показать элемент
	 */
	protected setVisible(element: HTMLElement | null): void {
		if (element) {
			element.style.removeProperty('display');
		}
	}

	/**
	 * Установка изображения с альтернативным текстом
	 */
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

	/**
	 * Установка атрибута элемента
	 */
	protected setAttribute(
		element: HTMLElement | null,
		attr: string,
		value: string
	): void {
		if (element) {
			element.setAttribute(attr, value);
		}
	}

	/**
	 * Удаление атрибута элемента
	 */
	protected removeAttribute(element: HTMLElement | null, attr: string): void {
		if (element) {
			element.removeAttribute(attr);
		}
	}

	/**
	 * Добавление обработчика события
	 */
	protected addEventHandler<K extends keyof HTMLElementEventMap>(
		element: HTMLElement | null,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void
	): void {
		if (element) {
			element.addEventListener(event, callback);
		}
	}

	/**
	 * Удаление обработчика события
	 */
	protected removeEventHandler<K extends keyof HTMLElementEventMap>(
		element: HTMLElement | null,
		event: K,
		callback: (event: HTMLElementEventMap[K]) => void
	): void {
		if (element) {
			element.removeEventListener(event, callback);
		}
	}

	/**
	 * Установка стиля элемента
	 */
	protected setStyle(element: HTMLElement | null, styles: Partial<CSSStyleDeclaration>): void {
		if (element) {
			Object.assign(element.style, styles);
		}
	}

	/**
	 * Вернуть корневой DOM-элемент после обновления состояния
	 */
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
