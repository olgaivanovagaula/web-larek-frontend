import { Api as BaseApi } from './base/api';

import {
	OrderPayload as OrderPayload,
	OrderResponse as OrderResponse,
	ProductData as ProductData,
	ApiResponseList as ProductListResponse,
} from '../types';

export interface AppApiInterface {
	fetchProductList: () => Promise<ProductData[]>;
	processOrderSubmission: (payload: OrderPayload) => Promise<OrderResponse>;
}

export class AppApi extends BaseApi implements AppApiInterface {
	readonly contentDeliveryUrl: string;

	constructor(
		apiBaseUrl: string,

		contentDeliveryUrl: string,

		config?: RequestInit
	) {
		super(apiBaseUrl, config);
		this.contentDeliveryUrl = contentDeliveryUrl;
	}

	fetchProductList(): Promise<ProductData[]> {
		return this.get('/product')

			.then((data: ProductListResponse<ProductData>) =>
				data.items.map((item) => ({
					...item,
					image: `${this.contentDeliveryUrl}${item.image}`,
				}))
			)

			.catch((err) => {
				console.error('aElisst:', err);
				throw new Error('Fai');
			});
	}

	processOrderSubmission(payload: OrderPayload): Promise<OrderResponse> {
		return this.post('/order', payload)
			.then((response: OrderResponse) => response)
			.catch((err) => {
				console.error('Err order:', err);
				throw new Error('on failed.');
			});
	}
}
