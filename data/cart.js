export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart =JSON.parse(localStorage.getItem('cart')) ||
  [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '2'
  }];
}

// function to store the cart in localStorage.
function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Checking if the product is already in the cart.
export function addToCart(productId, quantityValue = 1) {
  quantityValue = Number(quantityValue);
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
      quantity: quantityValue,
      deliveryOptionId: '1' //When we add new products, the dafault delivery option id will be 1 i.e, free delivery.
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

/* Updating the delivery option on page when we select any delivery option.
1. Loop through the cart and find the product
2. Update the deliveryOptionId of that product */
export function updateDeliveryOption(productId, deliveryOptionId) {

  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
    if (matchingItem) {
      matchingItem.deliveryOptionId = deliveryOptionId;
   }
    saveToStorage();
  });
}

// Ex14.e: calculating the cart quantity and using it in amazon.js and checkout.js files.
export function calclulateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

// Updating the cart quantity using the "Update" & "Save" button.
export function updateQuantity(productId, newQuantity) {
  cart.forEach((cartItem) => {
    if (cartItem.productId === productId) {
      if (newQuantity <=0 || newQuantity >10) {
        ifInvalidInput(productId);
      }
      else {
        cartItem.quantity = newQuantity;
      }
    }
  });
  saveToStorage();
}

export function ifInvalidInput(productId) {
  const invalidInput = document.querySelector(`.js-invalid-input-${productId}`)
  invalidInput.innerHTML = 'Enter quantity between 1 & 10';
  setTimeout(() => {
    invalidInput.innerHTML = '';
  }, 2500)
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    fun();
  });
  
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}