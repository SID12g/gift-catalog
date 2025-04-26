export interface Gift {
  id: string;
  name: string;
  price: number;
  quantity: number;
  purchaseLink: string;
  purchased: boolean;
  purchasedBy?: string;
}

export interface Catalog {
  id: string;
  password: string;
  title: string;
  description?: string;
  gifts: Gift[];
  createdAt: string;
}
