import { Api } from './base/api';
import { IOrder, IOderResult, IProductItem, ApiListResponse } from '../types';

export interface IAppAPI {
	order: (order: IOrder) => Promise<IOderResult>;
	getProductList: () => Promise<IProductItem[]>;
}

export class AppApi extends Api implements IAppAPI {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);

		this.cdn = cdn;
	}

	order(order: IOrder): Promise<IOderResult> {
		return this.post('/order', order).then((data: IOderResult) => data);
	}

	getProductList(): Promise<IProductItem[]> {
		return this.get('/product').then((data: ApiListResponse<IProductItem>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}
}
