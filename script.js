let products = [];
let meals = [];
let cart = [];
let mealStack = [];
let burgerCounter = 0;
let cokeCounter = 0;
let friesCounter = 0;

//fetching products from json file
async function fetchProducts() {
  try {
    const results = await fetch("products.json");
    const data = await results.json();

    products = data.filter((item) => item.category !== "Meal");
    meals = data.filter((item) => item.category === "Meal");

    console.log(products);
    console.log(meals);
    //storing meals in localstorage
    window.localStorage.setItem("meals", JSON.stringify(meals));
  } catch (error) {
    throw new Error("result not found");
  }
}
//displaying the products
async function display() {
  await fetchProducts();
  addProducts("All");
}

console.log(`meals are ${meals}`);

//display only when doucment is loaded
document.addEventListener("DOMContentLoaded", display);

//creating hmtl for meals and products
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
      <button class="cart-icon" id='cart-btn' data-product-id="${id}">Add to Cart</button>
    </div>`;
}
//create cart
function createCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.innerHTML = createCardHtml(product);

  // Add event listener to the button
  const button = card.querySelector(".cart-icon");

  button.addEventListener("click", () => addToCart(product));

  return card;
}

// create a product card
function createProductCard(product) {
  return createCard(product);
}

//  create a meal card
function createMealCard(meal) {
  return createCard(meal);
}

//add product on ui
function addProducts(filterCategory, searchTerm) {
  const productDiv = document.querySelector("#products");
  productDiv.innerHTML = "";

  //filtered and searched the products
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

  //filtered and searched meals
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

//when category chagnes
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

//add to cart
function addToCart(productData) {
  console.log(productData);
  let { id, type } = productData;
  const quantity = document.getElementById(`quantity${id}`).value;
  let cartItem;

  if (type === "Meal") {
    const meal = meals.find((p) => p.id === id);

    const productsComboFromMeal = meal.products;

    // console.log(productsComboFromMeal);

    cartItem = {
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: parseInt(quantity),
    };
  } else {
    const product = products.find((p) => p.id === id);

    if (productData.category === "Burger") {
      burgerCounter += parseInt(quantity);
    } else if (productData.category === "Coke") {
      cokeCounter += parseInt(quantity);
    } else if (productData.category === "Fries") {
      friesCounter += parseInt(quantity);
    }

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
      console.error("error occured:", error);
      cart = [];
    }
  } else {
    cart = [];
  }

  cart.push(cartItem);
  alert("Item Added to the Cart");

  //setting cart in local storage
  window.localStorage.setItem("cart", JSON.stringify(cart));

  let counterArray = [burgerCounter, cokeCounter, friesCounter];
  window.localStorage.setItem("counterArray", JSON.stringify(counterArray));
}

addProducts();
