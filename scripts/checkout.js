import { cart, removeFromCart, calclulateCartQuantity, updateQuantity, ifInvalidInput, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions } from "../data/deliveryOptions.js";

updateCartQuantity();

const today = dayjs();
const deliveryDate = today.add(7, 'days');;

let cartSummaryHTML = '';

// Looping and Generating the products at checkout.html.
cart.forEach((cartItem) => {

  // Getting the productId so that we can get other values like image, name and price of each product.
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if(product.id === productId) {
      matchingProduct = product;
    }
  });

  // Displaying delivery Date for each cart-item-container.
  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption;
  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });
  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');
  cartSummaryHTML +=
  `
    <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link"
            data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-quantity-link"
            data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
            <p class="invalid-input js-invalid-input-${matchingProduct.id}"></p>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
  `;
  updateCartQuantity();
});

/* Generating the Delivery Options for each product 
1. Loop through deliveryOptions that we created.
2. For each option, generate some HTML
3. Combine all HTML together */

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0
      ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

    // Check the correct delivery option
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html +=`
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });
  return html;
}


// Displaying the generated HTML on the page.
document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

// Making "delete" button interactive.
document.querySelectorAll('.js-delete-link')
  .forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
      const productId = deleteLink.dataset.productId;
      removeFromCart(productId);

      const itemContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      itemContainer.remove();
      updateCartQuantity();
    })
  });

// Getting each delivery option radio btn from the page.
document.querySelectorAll('.js-delivery-option')
  .forEach((element) => {
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
    });
  });

// function to save the cart quantity in middle header section
function updateCartQuantity() {
  let cartQuantity = calclulateCartQuantity();
  document.querySelector('.js-return-to-home-link')
    .innerHTML = `${cartQuantity} Items`;
}

// Making the "Update" button interactive.
document.querySelectorAll('.js-update-quantity-link')
  .forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
      
      // getting the container in which we are updating the quantity.
      const editingContainer = document.querySelector(`.js-cart-item-container-${productId}`);
      editingContainer.classList.add('is-editing-quantity');
    });
  });

  // Making the "save" button interactive
document.querySelectorAll('.js-save-quantity-link')
  .forEach((saveLink) => {
    saveLink.addEventListener('click', () => {
      const productId = saveLink.dataset.productId;
      const editingContainer = document.querySelector(`.js-cart-item-container-${productId}`);

      editingContainer.classList.remove('is-editing-quantity');
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = Number(quantityInput.value);
      updateQuantity(productId, newQuantity);

      // Updating quantity in quantity beside and in middle header section.
      if (newQuantity <= 0 || newQuantity > 10) {
        ifInvalidInput(productId);
      }
      else {
        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
        quantityLabel.innerHTML = newQuantity;
      }

      updateCartQuantity();
      quantityInput.value = ''; //Reset the input box to empty again,
    });
  });