class Cart {
  cartItems;
  localStorageKey;

  // works like normal method(function)
  // Special thing about this is, when we generate this object, it will run this code automatically.
  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems =JSON.parse(localStorage.getItem(this.localStorageKey)) ||
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
  saveToStorage() {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  // Checking if the product is already in the cart.
  addToCart(productId, quantityValue = 1) {
    quantityValue = Number(quantityValue);
    let matchingItem;

    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    if (matchingItem) {
      matchingItem.quantity += quantityValue;
    }
    // if product not in cart, add it.
    else {
      this.cartItems.push({
        productId: productId,
        quantity: quantityValue,
        deliveryOptionId: '1' //When we add new products, the dafault delivery option id will be 1 i.e, free delivery.
      });
    } 
    this.saveToStorage();
  }

  /*Steps to remove the item from the cart when we click delete.  
  1. Create a new array.
  2. Loop through the cart
  3. Add each product to the new array, except for this productId. */
  removeFromCart(productId) {
    const newCart = [];

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
    this.cartItems = newCart
    this.saveToStorage();
  }

  /* Updating the delivery option on page when we select any delivery option.
  1. Loop through the cart and find the product
  2. Update the deliveryOptionId of that product */
  updateDeliveryOption(productId, deliveryOptionId) {

    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
      if (matchingItem) {
        matchingItem.deliveryOptionId = deliveryOptionId;
    }
      this.saveToStorage();
    });
  }

  // Ex14.e: calculating the cart quantity and using it in amazon.js and checkout.js files.
  calclulateCartQuantity() {
    let cartQuantity = 0;

    this.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
  }

  // Updating the cart quantity using the "Update" & "Save" button.
  updateQuantity(productId, newQuantity) {

    this.cartItems.forEach((cartItem) => {
      if (cartItem.productId === productId) {
        if (newQuantity <=0 || newQuantity >10) {
          this.ifInvalidInput(productId);
        }
        else {
          cartItem.quantity = newQuantity;
        }
      }
    });
    this.saveToStorage();
  }

  ifInvalidInput(productId) {
    const invalidInput = document.querySelector(`.js-invalid-input-${productId}`)
    invalidInput.innerHTML = 'Enter quantity between 1 & 10';
    setTimeout(() => {
      invalidInput.innerHTML = '';
    }, 2500)
  }    
}

const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');

// cart.addToCart('83d4ca15-0f35-48f5-b7a3-1ea210004f2e');
console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart);

