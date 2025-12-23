// Importing files
import { cart, addToCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

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
        $${formatCurrency(product.priceCents)}
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

// calculating the total quantity in the cart and displaying it on header top-right.
function updateCartQuantity() {

  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
}

// Creating setTimeout object outside. coz to store id for multiple products.
const addedMsgTimeouts = {};
// Displaying the 'added' message on the page.
function displayAddedMsg(productId) {

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
}

// Making the add-to-cart button interactive.
document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const productId= button.dataset.productId;

      addToCart(productId);
      updateCartQuantity();
      displayAddedMsg(productId);
    });
  });
