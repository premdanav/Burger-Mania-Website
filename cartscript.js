let cart = JSON.parse(window.localStorage.getItem("cart"));

let [burgerCounter, cokeCounter, friesCounter] = JSON.parse(
  window.localStorage.getItem("counterArray")
) || [0, 0, 0];

let counterArray = [];

console.log(`burger counter =${burgerCounter}`);
console.log(`coke counter =${cokeCounter}`);
console.log(`fries counter =${friesCounter}`);

let finalAmount = 0;

console.log(cart);
let meals = JSON.parse(window.localStorage.getItem("meals"));
console.log(meals);

document
  .querySelector("#delete-btn")
  .addEventListener("click", delteLastItemFromCart);

function delteLastItemFromCart() {
  if (cart.length === 0) {
    alert("Cart is empty");
    document.querySelector("#delete-btn").classList.remove("hidden");
  }

  console.log(cart);
  cart.pop();
  updateCart();
}

function checkout() {
  document.getElementById("checkout").classList.remove("hidden");
}

document.querySelector("#checkout-btn").addEventListener("click", checkout);

//function get bill
function getBill() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const regularBill = calculateRegularBill();
  const discountedBill = calculateDiscountedBill(regularBill);

  document.getElementById("regular-bill").innerHTML = `
        <h3>Regular Bill for ${name} and ${email}</h3>Total Bill : 
        ${regularBill}`;
  document.getElementById("discounted-bill").innerHTML = `
        <h3>Discounted Bill for ${name} and ${email}</h3>
        ${discountedBill}`;

  document.getElementById("checkout").classList.add("hidden");
  document.getElementById("bill").classList.remove("hidden");

  cart = [];
  updateCart();

  document.getElementById("home-page").addEventListener("click", goToHomePage);
}

document.querySelector("#generate-bill-btn").addEventListener("click", getBill);

function goToHomePage() {
  // displayRazorPay(finalAmount);
  document.getElementById("bill").classList.add("hidden");
  const homeBtn = document.querySelector("#checkout-btn");
  homeBtn.innerText = `Eat More Burgers`;
  setTimeout(() => {
    homeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }, 2000);
}

function calculateRegularBill() {
  let total = 0;
  cart.forEach((item) => {
    console.log(item);
    total += item.price * item.quantity;
  });

  return total;
}

function calculateDiscountedBill(regularBill) {
  let totalDiscount = 0;

  for (let meal of meals) {
    let productIds = meal.products;
    console.log("product ids" + productIds);
    let mealCount = getMealCount(productIds);
    console.log(`mela cout==${mealCount}`);

    if (mealCount > 0) {
      totalDiscount = regularBill - 150 * mealCount;
      console.log(`total disc=${totalDiscount}`);
    }
  }

  if (totalDiscount === 0) {
    cart.forEach((item) => {
      totalDiscount += item.price * item.quantity;
    });
  }

  return `Discounted Total: ${totalDiscount}`;
}

function getMealCount(productIds) {
  let count = Infinity;

  for (let id of productIds) {
    let item = cart.find((product) => product.id === id);
    console.log(`item is ${item}`);
    if (!item) {
      count = 0;
      break;
    }

    count = Math.min(count, item.quantity);
    console.log(`count=${count}`);
  }

  return count;
}

// function checkInMeals(item1, item2) {
//   console.log(`item1 is ${item1.id} and item2 is ${item2.id}`);
//   let foundAndPrice = [false, 0];

//   let meal;
//   for (let i = 0; i < mealStack.length; i++) {
//     let productsArrInMeals = mealStack[i].products;
//     console.log(productsArrInMeals);
//     if (
//       productsArrInMeals.includes(item1.id) &&
//       productsArrInMeals.includes(item2.id)
//     ) {
//       meal = mealStack[i];
//       break;
//     }
//   }
//   console.log(meal);

//   if (meal) {
//     console.log(meal);
//     foundAndPrice[0] = true;
//     foundAndPrice[1] = meal.price;
//   }
//   return foundAndPrice;
// }

//increase
function increaseQuantity(itemId) {
  const item = cart.find((item) => item.id === itemId);
  if (item) {
    item.quantity += 1;
    if (item.category === "Burger") {
      burgerCounter++;
    } else if (item.category === "Coke") {
      cokeCounter++;
    } else if (item.category === "Fries") {
      friesCounter++;
    }
    counterArray = [burgerCounter, cokeCounter, friesCounter];

    console.log(`burger counter in increse=${burgerCounter}`);
    console.log(`coke counter in increase=${cokeCounter}`);
    console.log(`fries counter in increase=${friesCounter}`);
    updateCart();
  }
}

//decrease
function decreaseQuantity(itemId, count = 1) {
  const item = cart.find((item) => item.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity -= count;
    if (item.category === "Burger") {
      burgerCounter--;
    } else if (item.category === "Coke") {
      cokeCounter--;
    } else if (item.category === "Fries") {
      friesCounter--;
    }
    counterArray = [burgerCounter, cokeCounter, friesCounter];

    console.log(`burger counter in decrease=${burgerCounter}`);
    console.log(`coke counter in decrease=${cokeCounter}`);
    console.log(`fries counter in decrease=${friesCounter}`);
    updateCart();
  }
}

//update cart
function updateCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  cart.forEach((item) => {
    const listItem = document.createElement("li");

    const increaseButton = document.createElement("button");
    increaseButton.innerText = "+";
    increaseButton.addEventListener("click", () => increaseQuantity(item.id));

    const decreaseButton = document.createElement("button");
    decreaseButton.innerText = "-";
    decreaseButton.addEventListener("click", () => decreaseQuantity(item.id));

    const text = document.createTextNode(
      `${item.quantity} - ${item.name} = ${item.price * item.quantity} ₹`
    );

    const br = document.createElement("br");
    br.innerHTML = "<br/>";

    listItem.appendChild(text);
    cartList.appendChild(listItem);
    cartList.appendChild(br);
    listItem.appendChild(increaseButton);
    listItem.appendChild(decreaseButton);
  });

  window.localStorage.setItem("cart", JSON.stringify(cart));

  counterArray = [burgerCounter, cokeCounter, friesCounter];
  window.localStorage.setItem("counterArray", JSON.stringify(counterArray));
}

updateCart();

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.head.appendChild(script);
  });
}

const displayRazorPay = async (amount) => {
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert(
        "Failed to load Razorpay script. Please check your internet connection."
      );
      return;
    }

    const options = {
      key: "rzp_test_hRHaEIhkpd6odG",
      currency: "INR",
      amount: amount * 100,
      name: "Market",
      description: "Congratulations",
      handler: async function (response) {
        // Payment successful

        fetch("http://localhost:8080/api/user/order?userId=" + user.id, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }).then((result) => {
          console.log("result", result);
          result.json().then((res) => {
            console.log(res);
          });
        });

        alert("Payment successful and cart cleared");
        navigate("/");
      },
      prefill: {
        name: "Burger Shop",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error("An error occurred while displaying Razorpay:", error);
    alert("An error occurred while displaying Razorpay. Please try again.");
  }
};
