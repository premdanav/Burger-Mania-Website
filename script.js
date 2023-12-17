let products = [];
let meals = [];
let cart = [];

// Fetching products from json file
async function fetchProducts() {
  try {
    const results = await fetch("products.json");
    const data = await results.json();

    products = data.filter((item) => item.category !== "Meal");
    meals = data.filter((item) => item.category === "Meal");

    console.log(products);
    console.log(meals);

    // Storing meals in local storage
    window.localStorage.setItem("meals", JSON.stringify(meals));
  } catch (error) {
    throw new Error("Result not found");
  }
}

// Displaying the products
async function display() {
  await fetchProducts();
  addProducts("All");
}

console.log(`Meals are ${meals}`);

// Display only when document is loaded
document.addEventListener("DOMContentLoaded", display);

// Creating HTML for meals and products
function createCardHtml(product) {
  let { id, name, price, type, url } = product;
  return `
    <img class="product-image" src="${url}" alt="${name}" />
    <div class="product-details">
      <h2>${name}</h2>
      <p>Price: ${price}</p>
      <p>Type: ${type}</p>
      <label for="quantity${id}">Quantity:</label>
      <select id="quantity${id}">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
      </select>
      </div>
      <div class="ATCB">
        <button class="cart-icon" id='cart-btn' data-product-id="${id}">Add to Cart</button>
        <br><br><br><br>
      </div>   
      <br>
      `;
}

// Create cart
function createCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = createCardHtml(product);

  // Add event listener to the button
  const button = card.querySelector(".cart-icon");
  button.addEventListener("click", (e) => addToCart(product, e));

  return card;
}

// Create a product card
function createProductCard(product) {
  return createCard(product);
}

// Create a meal card
function createMealCard(meal) {
  return createCard(meal);
}

// Add product on UI
function addProducts(filterCategory, searchTerm) {
  const productDiv = document.querySelector("#products");
  productDiv.innerHTML = "";

  // Filtered and searched the products
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

  // Filtered and searched meals
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

// When category changes
function onCategoryChange() {
  const selectedCategory = document.getElementById("c-filter").value;
  const searchTerm = document.getElementById("search-bar").value;
  addProducts(selectedCategory, searchTerm);
}

document
  .getElementById("search-bar")
  .addEventListener("input", onCategoryChange);
document
  .getElementById("c-filter")
  .addEventListener("change", onCategoryChange);

// Add to cart
function addToCart(productData, e) {
  console.log(productData);
  let { id, type } = productData;
  const quantity = document.getElementById(`quantity${id}`).value;
  let cartItem;

  if (type === "Meal") {
    const meal = meals.find((p) => p.id === id);

    cartItem = {
      id: meal.id,
      name: meal.name,
      price: meal.price,
      category: meal.category,
      quantity: parseInt(quantity),
    };
  } else {
    const product = products.find((p) => p.id === id);

    cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: parseInt(quantity),
    };
  }

  // Retrieve the cart data from local storage
  let cartItemsFromLocalStorage = window.localStorage.getItem("cart");

  // Check if the cart data is not null or empty
  if (cartItemsFromLocalStorage) {
    try {
      cart = JSON.parse(cartItemsFromLocalStorage);
    } catch (error) {
      console.error("Error occurred:", error);
      cart = [];
    }
  } else {
    cart = [];
  }

  let itemFound = false;
  cart.forEach((item) => {
    if (item.id === cartItem.id) {
      item.quantity += cartItem.quantity;
      itemFound = true;
      return;
    }
  });

  if (!itemFound) {
    cart.push(cartItem);
  }

  const addButton = e.target;
  addButton.disabled = true;
  addButton.innerText = "Item Added";
  addButton.style.backgroundColor = "green";

  setTimeout(() => {
    addButton.disabled = false;
    addButton.innerText = "Add to Cart";
    addButton.style.backgroundColor = "";
  }, 500);

  // Setting cart in local storage
  window.localStorage.setItem("cart", JSON.stringify(cart));
}

addProducts();
