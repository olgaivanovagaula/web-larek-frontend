export interface IProductItem {
    id: string;
    description: string;
    title: string;
    image: string;
    category: string;
    price: number;
};

export interface IProductCartItem {
  id: string;
  title: string;
  price: number;
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
    telephone: string
};

export interface ISuccessOrder {
    totalPrice: number;
};

export interface IBasketData {
    items: IProductCartItem[];
    addItem:(item:IProductItem) => void;
    removeItem:(item:IProductItem) => void;
    clearBasket:() => void
}
