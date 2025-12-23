export let cart =JSON.parse(localStorage.getItem('cart')) ||
[{
  productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
  quantity: 2,
}, {
  productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
  quantity: 1
}];

// function to store the cart in localStorage.
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

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

  saveToStorage();
}


/*Steps to remove the item from the cart when we click delete.  
1. Create a new array.
2. Loop through the cart
3. Add each product to the new array, except for this productId. */
export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });
  cart = newCart

  saveToStorage();
}