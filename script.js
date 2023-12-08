let products = [];
let meals = [];
let cart = [];

let billForRegularItems = [];
let billForMeals = [];

//fetching products from json file
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

//displaying the products
async function display() {
  await fetchProducts();
  addProducts("All", "");
}

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
    billForMeals.push(productsComboFromMeal);

    // console.log(productsComboFromMeal);

    cartItem = {
      id: meal.id,
      name: meal.name,
      price: meal.price,
      quantity: parseInt(quantity),
    };
  } else {
    const product = products.find((p) => p.id === id);

    billForRegularItems.push(product.id);

    cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: parseInt(quantity),
    };
  }

  cart.push(cartItem);
  alert("Item Added to the Cart");
  updateCart();
  document.querySelector("#delete-btn").classList.remove("hidden");
}

//update cart items
function updateCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  cart.forEach((item) => {
    const listItem = document.createElement("li");
    const text = document.createTextNode(
      `${item.quantity} - ${item.name} = ${item.price * item.quantity} ₹`
    );
    listItem.appendChild(text);

    cartList.appendChild(listItem);
  });
}

//remove checkout after generating bill
function checkout() {
  document.getElementById("checkout").classList.remove("hidden");
}

document.querySelector("#checkout-btn").addEventListener("click", checkout);

function getBill() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const regularBill = calculateRegularBill();
  const discountedBill = calculateDiscountedBill();

  // Display bills
  document.getElementById("regular-bill").innerHTML = `
    <h3>Regular Bill for ${name} and ${email}</h3>
    ${regularBill}`;
  document.getElementById("discounted-bill").innerHTML = `
    <h3>Discounted Bill for ${name} and ${email}</h3>
    ${discountedBill}`;

  document.getElementById("checkout").classList.add("hidden");
  document.getElementById("bill").classList.remove("hidden");

  // Clear the cart
  cart = [];
  updateCart();
}

document.getElementById("generate-bill-btn").addEventListener("click", getBill);

//calculate regular bill
function calculateRegularBill() {
  let total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
  });
  return `Total: $${total}`;
}

//getMealPriceFromComboProducts
function getMealPriceFromComboProducts(arrOfProducts) {
  let price = 0;

  meals.filter((element) => {
    if (
      element.products[0] === arrOfProducts[0] &&
      element.products[1] === arrOfProducts[1]
    ) {
      price = element.price;
      return price;
    }
  });
  return price;
}
let mealsProductsArr = [];
//calculate discounted bill
function calculateDiscountedBill() {
  console.log(billForRegularItems);
  let total = 0;
  let price = 0;
  let cartQuantity = 0;

  meals.forEach((meal) => {
    mealsProductsArr.push(meal.products);
  });
  // console.log(mealsProductsArr);

  for (let i = 0; i < mealsProductsArr.length - 1; i++) {
    for (let j = 0; j < billForRegularItems.length; j++) {
      if (
        billForRegularItems[i] === mealsProductsArr[j][i] &&
        billForRegularItems[i + 1] === mealsProductsArr[j][i + 1]
      ) {
        price = getMealPriceFromComboProducts(mealsProductsArr[j]);
      }
    }
  }
  console.log(price);
  cart.forEach((item) => {
    cartQuantity += item.quantity;
  });

  total += price;
  return `Total: $${total}`;
}

addProducts();
