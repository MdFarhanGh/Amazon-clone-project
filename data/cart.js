export const cart = [];

// Checking if the product is already in the cart.
export function addToCart(productId) {

  // Getting the Quantity Selector
  const quantity = document.querySelector(`.js-quantity-selector-${productId}`);
  const quantityValue = Number(quantity.value);

  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });
  if (matchingItem) {
    matchingItem.quantity += quantityValue;
  }
  // if product not in cart, add it.
  else {
    cart.push({
      productId: productId,
      quantity: quantityValue
    });
  } 
}