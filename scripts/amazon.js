// Importing files
import { cart } from "../data/cart.js";

// Saving The Data. (Getting products Array from products.js)

// GENERATING THE HTML
// Storing all the generated HTML in this var and displaying it on page.
let productsHTML = '';

products.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});

// Putting the generated html on the page.
document.querySelector('.js-product-grid')
  .innerHTML = productsHTML;


// MAKING THE PAGE INTERACTIVE.

// Creating setTimeout object. coz to store id for multiple products.
const addedMsgTimeouts = {};

// Making the add-to-cart button interactive.
document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const productId= button.dataset.productId;

      // Getting the Quantity Selector
      const quantity = document.querySelector(`.js-quantity-selector-${productId}`);
      const quantityValue = Number(quantity.value);

      // Checking if the product is already in the cart.
      let matchingItem;
      cart.forEach((item) => {
        if (productId === item.productId) {
          matchingItem = item;
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

      // calculating the total quantity in the cart and displaying it on top.
      let cartQuantity = 0;
      cart.forEach((item) => {
        cartQuantity += item.quantity;
      });
      document.querySelector('.js-cart-quantity')
        .innerHTML = cartQuantity;

      // Displaying the 'added' message on the page.
      const addedMsg = document.querySelector(`.js-added-to-cart-${productId}`);
      addedMsg.classList.add('js-added-to-cart-opacity');

      const previousTimeoutId = addedMsgTimeouts[productId];
      if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
      }
      
      const timeoutId = setTimeout(() => {
        addedMsg.classList.remove('js-added-to-cart-opacity');
      },2000);
      addedMsgTimeouts[productId] = timeoutId;
    });
  });
