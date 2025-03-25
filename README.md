# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура


Код приложения разделен на слои согласно паттерну MVP. 
 - слой представления отвечает за отоброжение данных.
 - слой данных отвечает за хранение и изменение. 
 - презентер, отвечает за связь представления и данных.

#### Класс API 

 Этот класс предстваляет основу для взаимодействия с сервером. Поддерживает базовые методы GET, POST, DELETE. А также класс обрабатывает ответы с сервера. 

 Класс содержит методы: 


- `handleResponse` - Логика обработки ответа с сервера. Проверка статуса ответа, в случае, если приходит ответ, но ключ ok является ложным. Вызываем ошибку через rejected. 
- `get` - Метод, принимающий параметр (uri), возвращает запрос на сервер с методом _GET_.
- `post`- Метод, принимающий 3 параметра (uri, data, method). Где, Data - тело запроса, также возвращает fetch запрос с методоми  _POST_, _DELETE_, _PUT_. В случае если не передали метод, при вызове по умолчанию _POST_ (default).  



#### Класс EventEmitter 

Брокер событий позволяет подписываться, а также отписываться на события, происходящие в системе. Класс используется в приложении для генерации событий. Основные методы, реализуемые классом описаны в интерфейсе `IEvents`:

- `on` - Метод, позваляющий осуществить подписку на событие. 
- `off` - Метод, отписаться от события. 
- `emit` - Метод, позволяющий осуществить событие с данными.
- `onAll` - Метод, для прослушивания всех событий. 
- `offAll` - Метод, чтобы сбросить прослушивания со всех событий.
- `trigger` - Метод, создающий коллбек триггер, генерирующий событие при вызове.


## Данные и типы данных, используемые в приложении. 


- Товар


```
export interface IProductItem {
    id: string;
    description: string;
    title: string;
    image: string;
    category: string;
    price: number;
};
```

- Товар в корзине

```
export interface IProductCartItem {
  id: string;
  title: string;
  price: number;
}
```

- Корзина

```
export interface IBasketView {
    items: IProductCartItem[];
    totalPrice: number;
};
```

- Доставка (адрес / способ оплаты)

```
export interface IDeliveryInfo {
    address: string;
    payment: string
};
```

- Контакты (Эл. почта / телефон)

```
export interface IContactInfo {
    email: string;
    telephone: string
};
```

- Успешный заказ

```
export interface ISuccessOrder {
    totalPrice: number;
};
```

- События в корзине

```
export interface IBasketData {
    items: IProductCartItem[];
    addItem(item:IProductItem): => void;
    removeItem(item:IProductItem): => void;
    clearBasket(): => void
}
```