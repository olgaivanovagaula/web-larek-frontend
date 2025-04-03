export interface IProductItem {
    id: string;
    description: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
};

export interface IProductCartItem {
  id: string;
  title: string;
  price: number;
  removeProductFromCart: () => void;
}

export interface IBasketView {
    items: IProductCartItem[];
    totalPrice: number;
};

export interface IDeliveryInfo {
    address: string;
    payment: string
};

export interface IContactInfo {
    email: string;
    phone: string
};

export interface IOrder extends IDeliveryInfo, IContactInfo {
    total: number;
    items: string[]
}

export interface ISuccessOrder {
    id: string;
    total: number;
};

export interface IBasketData {
    items: IProductCartItem[];
    addItem:(item:IProductItem) => void;
    removeItem:(item:IProductItem) => void;
    clearBasket:() => void
}

