import { TypeProduct } from "../firebase/models/product";

export type CartItem = TypeProduct & {
  quantity: number;
};

export const money = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

export function readCart(): CartItem[] {
  try {
    const data = JSON.parse(
      localStorage.getItem("dadiva-cart") || "[]"
    );

    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(
      (item: CartItem) =>
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Number.isFinite(item.value) &&
        item.value >= 0 &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]): void {
  localStorage.setItem("dadiva-cart", JSON.stringify(items));

  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: TypeProduct): void {
  const items = readCart();
  const item = items.find((item) => item.id === product.id);

  if (item) {
    item.quantity++;
  } else {
    items.push({
      ...product,
      quantity: 1,
    });
  }

  writeCart(items);
}
