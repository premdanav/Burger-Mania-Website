let products = [];
let meals = [];
async function fetchProducts() {
  try {
    const results = await fetch("products.json");
    const data = await results.json();
    products = data.filter((item) => item.category !== "Meal");
    meals = data.filter((item) => item.category === "Meal");
    console.log(products);
    console.log(meals);
  } catch (error) {
    throw new Error("result not found");
  }
}

async function display() {
  await fetchProducts();
  addProducts("All");
}

document.addEventListener("DOMContentLoaded", display);

function createCardHTML({ id, name, price, type, url }) {
  return `
    <img class="product-image" src="${url}" alt="${name}" />
    <div class="product-details">
      <h2>${name}</h2>
      <p>Price: ${price}</p>
      <p>Type: ${type}</p>
      <label for="quantity${id}">Quantity:</label>
      <select id="quantity${id}">
        ${Array.from(
          { length: 9 },
          (_, i) => `<option value="${i + 1}">${i + 1}</option>`
        ).join("")}
      </select>
      <button class="cart-icon" data-product-id="${id}">Add to Cart</button>
    </div>`;
}

// Function to create a product card
function createProductCard(product) {
  return createCard(product, addToCart);
}

// Function to create a meal card
function createMealCard(meal) {
  return createCard(meal, addToCart);
}

// Function to create a card with common structure
function createCard(product, imageSrc, onClick) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = createCardHTML(product, imageSrc);

  // Add event listener to the button
  const button = card.querySelector(".cart-icon");
  button.addEventListener("click", () => onClick(product.id));

  return card;
}

function addProducts(filterCategory, searchTerm) {
  const productDiv = document.querySelector("#products");
  productDiv.innerHTML = "";

  products
    .filter((element) => {
      const matchesCategory =
        filterCategory === "All" || element.type === filterCategory;
      const matchesSearch = searchTerm
        ? element.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    })
    .forEach((element) => {
      const productCard = createProductCard(element);
      productDiv.appendChild(productCard);
    });

  meals
    .filter((meal) => {
      const matchesCategory =
        filterCategory === "All" || meal.type === filterCategory;
      const matchesSearch = searchTerm
        ? meal.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return matchesCategory && matchesSearch;
    })
    .forEach((meal) => {
      const mealCard = createMealCard(meal);
      productDiv.appendChild(mealCard);
    });
}

// Modify the onCategoryChange function to include the search term
function onCategoryChange() {
  const selectedCategory = document.getElementById("c-filter").value;
  const searchTerm = document.getElementById("search-bar").value;
  addProducts(selectedCategory, searchTerm);
}

// Add an event listener for the search bar
document
  .getElementById("search-bar")
  .addEventListener("input", onCategoryChange);

document
  .getElementById("c-filter")
  .addEventListener("change", onCategoryChange);

function addToCart(productId) {
  const quantity = document.getElementById(`quantity${productId}`).value;
  const product = products.find((p) => p.id === productId);

  const cartItem = {
    id: productId,
    name: product.name,
    price: product.price,
    quantity: parseInt(quantity),
  };

  cart.push(cartItem);
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${item.quantity}x ${item.name} - $${(
      item.price * item.quantity
    ).toFixed(2)}`;
    cartList.appendChild(listItem);
  });
}

function checkout() {
  document.getElementById("checkout").classList.remove("hidden");
}

document.querySelector("#checkout-btn").addEventListener("click", checkout);

function generateBill() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  // Calculate actual and optimized bills
  const actualBill = calculateActualBill();
  const optimizedBill = calculateOptimizedBill();

  // Display bills
  document.getElementById("actual-bill").innerHTML = `
    <h3>Actual Bill for ${name} (${email})</h3>
    ${actualBill}`;
  document.getElementById("optimized-bill").innerHTML = `
    <h3>Optimized Bill for ${name} (${email})</h3>
    ${optimizedBill}`;

  // Hide checkout and show bill
  document.getElementById("checkout").classList.add("hidden");
  document.getElementById("bill").classList.remove("hidden");

  // Clear the cart
  cart = [];
  updateCart();
}

document
  .getElementById("generate-bill-btn")
  .addEventListener("click", generateBill);

function calculateActualBill() {
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });
  return `Total: $${total.toFixed(2)}`;
}

function calculateOptimizedBill() {
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });
  const discount = total * 0.1;
  const optimizedTotal = total - discount;

  return `Total with 10% discount: $${optimizedTotal.toFixed(2)}`;
}

let cart = [];

addProducts();
