// let products = [];
// let meals = [];
// let cart = [];

// //getting data from json file
// async function fetchProducts() {
//   const result = await fetch("products.json");
//   const data = await result.json();
//   products = data.filter((element) => element.category !== "Meal");
//   meals = data.filter((element) => element.category === "Meal");
//   //   console.log(products);
//   //   console.log(meals);
// }

// async function display() {
//   await fetchProducts();
//   addProducts("All", "");
// }

// //dynamically create cart
// function createCard(anyProduct) {
//   let { id, name, price, type, url } = anyProduct;
//   const card = document.createElement("div");

//   card.classList.add("product-card");
//   card.innerHTML = `
//     <img class="product-image" src="${url}" alt="${name}" />
//     <div class="product-details">
//     <h2>${name}</h2>
//     <p>Price: ${price}</p>
//     <p>Type: ${type}</p>
//     <label for="quantity${id}">Quantity:</label>
//     <select id='quantity${id}'>
//     <option value="1">1</option>
//     <option value="2">2</option>
//     <option value="3">3</option>
//     <option value="4">4</option>
//     <option value="5">5</option>
//     <option value="6">6</option>
//     <option value="7">7</option>
//     <option value="8">8</option>
//     <option value="9">9</option>
//     </select>
//     <button class="cart-icon" data-product-id="${id}">Add to Cart</button>
//     </div>`;

//   //event listener to btn
//   const addToCartBtn = card.querySelector(".cart-icon");
//   addToCartBtn.addEventListener("click", () => {
//     onClick(id);
//   });

//   return card;
// }

// //create product card
// function createProductCard(products) {
//   const product = createCard(products);
//   console.log(product);
//   return product;
// }

// //function meal card
// function createMealCard(meals) {
//   console.log(meals);
//   return createCard(meals);
// }

// createProductCard(products);
// createMealCard(meals);

// //get selected product
// function getSelectedProduct(products, selectedCategory, searchedItem) {
//   const filteredProduct = products.filter((item) => {
//     //checking matching category
//     let isMatchingCategoryAll;
//     if (selectedCategory === "All") {
//       isMatchingCategoryAll = true;
//     } else {
//       isMatchingCategoryAll = item.type === selectedCategory;
//     }

//     //checking matching search items
//     let isMatchingSearchedItem;
//     if (searchedItem) {
//       isMatchingSearchedItem = item.name
//         .toLowerCase()
//         .includes(searchedItem.toLowerCase());
//     } else {
//       isMatchingSearchedItem = true;
//     }

//     return isMatchingCategoryAll && isMatchingSearchedItem;
//   });
// }

// //add products for search and filterd items
// function addProducts(selectedCategory = "All", searchedItem) {
//   const productDiv = document.querySelector("#products");
//   productDiv.innerHTML = "";

//   const selectedProduct = getSelectedProduct(
//     products,
//     selectedCategory,
//     searchedItem
//   );

//   selectedProduct.forEach((element) => {
//     const productCard = createCard(element, addToCart);
//     productDiv.appendChild(productCard);
//   });
// }
// document.addEventListener("DOMContentLoaded", display);

let products = [];
let meals = [];
let cart = [];

//getting data from json file
async function fetchProducts() {
  const result = await fetch("products.json");
  const data = await result.json();
  products = data.filter((element) => element.category !== "Meal");
  meals = data.filter((element) => element.category === "Meal");
}

async function display() {
  await fetchProducts();
  addProducts("All", "");
}

//dynamically create cart
function createCard(anyProduct) {
  // console.log(anyProduct);
  let { id, name, price, type, url } = anyProduct;
  const card = document.createElement("div");

  card.classList.add("product-card");
  card.innerHTML = `
    <img class="product-image" src="${url}" alt="${name}" />
    <div class="product-details">
    <h2>${name}</h2>
    <p>Price: ${price}</p>
    <p>Type: ${type}</p>
    <label for="quantity${id}">Quantity:</label>
    <select id='quantity${id}'>
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
    <button class="cart-icon" data-product-id="${id}">Add to Cart</button>
    </div>`;

  //event listener to btn
  const addToCartBtn = card.querySelector(".cart-icon");
  addToCartBtn.addEventListener("click", () => {
    addToCart(id);
  });

  return card;
}

//create product card
function createProductCard(product) {
  const productCard = createCard(product);
  // console.log(productCard);
  return productCard;
}

//function meal card
function createMealCard(meal) {
  const mealCard = createCard(meal);
  // console.log(mealCard);
  return mealCard;
}

//get selected product
function getSelectedProduct(selectedCategory, searchedItem) {
  return products.filter((item) => {
    //checking matching category
    let isMatchingCategoryAll;
    if (selectedCategory === "All") {
      isMatchingCategoryAll = true;
    } else {
      isMatchingCategoryAll = item.type === selectedCategory;
    }

    //checking matching search items
    let isMatchingSearchedItem;
    if (searchedItem) {
      isMatchingSearchedItem = item.name
        .toLowerCase()
        .includes(searchedItem.toLowerCase());
    } else {
      isMatchingSearchedItem = true;
    }

    return isMatchingCategoryAll && isMatchingSearchedItem;
  });
}

//add products for search and filterd items
function addProducts(selectedCategory = "All", searchedItem) {
  console.log(selectedCategory);
  const productDiv = document.querySelector("#products");
  productDiv.innerHTML = "";

  const selectedProduct = getSelectedProduct(selectedCategory, searchedItem);
  console.log(selectedProduct);
  selectedProduct.forEach((element) => {
    console.log(element);
    const productCard = createCard(element);
    productDiv.appendChild(productCard);
  });
}

function onCategoryChange() {
  const selectedCategory = document.getElementById("c-filter").value;
  const searchTerm = document.getElementById("search-bar").value;
  addProducts(selectedCategory, searchTerm);
}

//Add event listeners for the search bar and category filter
document
  .getElementById("search-bar")
  .addEventListener("input", onCategoryChange);
document
  .getElementById("c-filter")
  .addEventListener("change", onCategoryChange);

document.addEventListener("DOMContentLoaded", display);
