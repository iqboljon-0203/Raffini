export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  rating: number;
  reviewsCount: number;
  branch: string;
  isTrending?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    title: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipping' | 'delivered';
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  branchName?: string;
  customerName: string;
  customerPhone: string;
  telegramUserId?: number | string;
  paymentMethod: 'payme' | 'click' | 'cash';
  notes?: string;
}

export interface Branch {
  id: string;
  name: string;
  landmark: string;
  address: string;
  phone: string;
  workHours: string;
  metro?: string;
}
