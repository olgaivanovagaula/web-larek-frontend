export type ApiResponseList<Type> = {
	total: number;
	items: Type[];
};
export interface ProductData {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface AppState {
	products: ProductData[];
	basket: ProductData[];
	order: OrderPayload;
	orderResponse: OrderResponse | null;
	preview: string | null;
}
export interface BasketState {
	items: HTMLElement[];
	price: number;
	selected: string[];
}

export interface ContactInfo {
	phone: string;
	email: string;
}
export interface DeliveryInfo {
	address: string;
	payment: string;
}

export interface OrderResponse {
	id: string;
	total: number;
}
export interface OrderPayload extends DeliveryInfo, ContactInfo {
	total: number;
	items: string[];
}

export interface SuccessResponse {
	total: number;
}
export type OrderFormErrors = Partial<
	Omit<Record<keyof OrderPayload, string>, 'items'>
>;

export interface CardEventHandlers {
	onClick?: (event: MouseEvent) => void;
	onAddToBasket?: (item: ProductData) => void;
	onRemoveFromBasket?: (item: ProductData) => void;
}
