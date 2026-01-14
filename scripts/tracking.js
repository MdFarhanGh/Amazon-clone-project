import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { getOrder } from "../data/orders.js";
import { calclulateCartQuantity } from "../data/cart.js";

async function loadTrackingPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  // console.log(productId);
  const order = getOrder(orderId);
  const product  = getProduct(productId);

  let productDetails;
  order.products.forEach((details) => {
    if (product.id === details.productId) {
      productDetails = details;
    }
  });

  function updateCartQuantity() {
    let cartQuantity = calclulateCartQuantity();
    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
  }
  updateCartQuantity();

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
  console.log(percentProgress);;

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>

    <div class="delivery-date">
      Arriving on ${dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${product.name}
    </div>

    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>

    <img class="product-image" src="${product.image} ">

    <div class="progress-labels-container">
      <div class="progress-label ${
        percentProgress < 50 ? 'current-status' : ''
      } ">
        Preparing
      </div>
      <div class="progress-label ${
        percentProgress >=50 && percentProgress < 100 ? 'current-status' : ''
      } ">
        Shipped
      </div>
      <div class="progress-label ${
        percentProgress >= 100 ? 'current-status' : ''
      } ">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;" ></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
}
loadTrackingPage();