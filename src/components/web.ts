import { Api as BaseApi } from './base/api';
import {
	ApiResponseList as ProductListResponse,
	OrderPayload as OrderPayload,
	ProductData as ProductData,
	OrderResponse as OrderResponse,
} from '../types';

export interface AppApiInterface {
	processOrderSubmission: (payload: OrderPayload) => Promise<OrderResponse>;

	fetchProductList: () => Promise<ProductData[]>;
}

export class AppApi extends BaseApi implements AppApiInterface {
	readonly contentDeliveryUrl: string;

	constructor(
		contentDeliveryUrl: string,
		apiBaseUrl: string,
		config?: RequestInit
	) {
		super(apiBaseUrl, config);
		this.contentDeliveryUrl = contentDeliveryUrl;
	}

	processOrderSubmission(payload: OrderPayload): Promise<OrderResponse> {
		return this.post('/order', payload).then(
			(response: OrderResponse) => response
		);
	}
	fetchProductList(): Promise<ProductData[]> {
		return this.get('/product').then((data: ProductListResponse<ProductData>) =>
			data.items.map((item) => ({
				...item,
				image: `${this.contentDeliveryUrl}${item.image}`,
			}))
		);
	}
}
