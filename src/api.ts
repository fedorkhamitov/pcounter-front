// src/api.ts
import type {
  ProductsResponse,
  Category,
  OrdersResponse,
  Customer,
  CartLine,
  HumanName,
  Address,
  CustomersResponse
} from "./types";

const API_URL = "https://fedorkhamitov-pocketcounter-7ba7.twc1.net";

function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    accept: "text/plain",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/category/all`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка при загрузке категорий");
  const data = await response.json();
  return data.result || [];
}

export async function fetchProducts(): Promise<ProductsResponse> {
  const response = await fetch(`${API_URL}/product?Page=1&PageSize=10000`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка при загрузке продуктов");
  return response.json();
}

export async function updateProductMainInfo(
  productId: string,
  categoryId: string,
  data: {
    sku: string;
    title: string;
    description: string;
    price: number;
    costPrice: number;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/category/${categoryId}/product/${productId}/main-info`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Ошибка обновления основной информации");
}

export async function updateProductDimensions(
  productId: string,
  categoryId: string,
  data: {
    width: number;
    height: number;
    depth: number;
    weigth: number;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/category/${categoryId}/product/${productId}/dimensions`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Ошибка обновления характеристик");
}

export async function updateProductQuantities(
  productId: string,
  categoryId: string,
  data: {
    actualQuantity: number;
    reservedQuantity: number;
    quantityForShipping: number;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/category/${categoryId}/product/${productId}/quantity`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Ошибка обновления количеств");
}

export async function updateProductPrices(
  productId: string,
  categoryId: string,
  data: {
    price: number;
    costPrice: number;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/category/${categoryId}/product/${productId}/prices`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Ошибка обновления количеств");
}

export async function addNewProduct(
  categoryId: string,
  data: {
    sku: string;
    title: string;
    description: string;
    price: number;
    costPrice: number;
    width: number;
    height: number;
    depth: number;
    weigth: number;
    quantityForShipping: number;
    reservedQuantity: number;
    actualQuantity: number;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/category/${categoryId}/product`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления количеств");
}

export async function hardDeleteProduct(productId: string, categoryId: string) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/category/${categoryId}/product/${productId}/hard`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Ошибка удаления продукта");
}

export async function addNewCategory(data: {
  name: string;
  description: string;
}) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/category`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления количеств");
}

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_URL}/customer/all`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка при загрузке категорий");
  const data: CustomersResponse = await response.json();
  return data.result || [];
}

export async function fetchOrders(): Promise<OrdersResponse> {
  const response = await fetch(`${API_URL}/orders?Page=1&PageSize=10000`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Ошибка при загрузке продуктов");
  return response.json();
}

export async function updateOrderCartLines(
  customerId: string,
  orderId: string,
  data: {
    cartLinesDtoForAdd: CartLine[] | null;
    cartLinesDtoForRemove: CartLine[] | null;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/customer/${customerId}/order/${orderId}/cartlines`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Ошибка обновления количеств");
}

export async function updateOrderStatus(
  customerId: string,
  orderId: string,
  data: {
    status: number;
    isPaid: boolean;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/customer/${customerId}/order/${orderId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Ошибка обновления количеств");
}

export async function updateCustonerNameAndPhone(
  customerId: string,
  data: {
    fullName: HumanName;
    phoneNumber: string;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/customer/${customerId}/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления данных заказчика");
}

export async function updateOrderAddress(
  customerId: string,
  orderId: string,
  data: {
    address: Address;
  }
) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/customer/${customerId}/order/${orderId}/address`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Ошибка обновления данных заказчика");
}

export async function createNewCustomer(data: {
  fullName: HumanName;
  phoneNumber: string;
}): Promise<{ result: string }> { // <-- добавьте тип возвращаемого значения
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/customer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления данных заказчика");
  return response.json(); // <-- обязательно вернуть результат!
}

export async function createNewOrder(
  customerId: string,
  data: {
  cartLineDtos: CartLine[];
  address: Address;
  comment: string;
}) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_URL}/customer/${customerId}/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Ошибка обновления данных заказчика");
}

export async function hardDeleteOrder(customerId:string, orderId: string) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/customer/${customerId}/order/${orderId}/hard`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Ошибка удаления заказа");
}

export async function hardDeleteCustomer(customerId:string) {
  const token = localStorage.getItem("authToken");
  const response = await fetch(
    `${API_URL}/customer/${customerId}/hard`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error("Ошибка удаления заказчика");
}