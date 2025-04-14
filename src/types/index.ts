export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IBasketView {
	items: HTMLElement[];
	price: number;
	selected: string[];
}

export interface IDelivery {
	address: string;
	payment: string;
}

export interface IContact {
	phone: string;
	email: string;
}

export interface IOrder extends IDelivery, IContact {
	total: number;
	items: string[];
}

export interface IOderResult {
	id: string;
	total: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface ISuccess {
	total: number;
}

export interface IAppState {
	products: IProductItem[];
	basket: IProductItem[];
	order: IOrder;
	orderResponse: IOderResult | null;
	prewiew: string | null;
}

export type ApiListResponse<Type> = {
	total: number;
	items: Type[];
};

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
    onAddToBasket?: (item: IProductItem) => void;
    onRemoveFromBasket?: (item: IProductItem) => void;
}
