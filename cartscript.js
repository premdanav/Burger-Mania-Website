let cart = JSON.parse(window.localStorage.getItem("cart"));
let finalAmount = 0;
let meals = JSON.parse(window.localStorage.getItem("meals"));
document.querySelector("#delete-btn").classList.remove("hidden");

// listener for delete-btn
document
  .querySelector("#delete-btn")
  .addEventListener("click", delteLastItemFromCart);

// listener for checkout-btn
document.querySelector("#checkout-btn").addEventListener("click", checkout);

//listener for generate-bill-btn
document.querySelector("#generate-bill-btn").addEventListener("click", getBill);

//listener for home-page
document.getElementById("home-page").addEventListener("click", goToHomePage);

//delete the last item from the cart
function delteLastItemFromCart() {
  if (cart.length === 0) {
    alert("Cart is empty");
    window.location.href = "index.html";
  }

  console.log(cart);
  cart.pop();
  updateCart();
}

//checkout
function checkout() {
  document.getElementById("checkout").classList.remove("hidden");
}

//getbill
function getBill() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  const regularBill = calculateRegularBill();
  console.log(`regular bill ${regularBill}`);
  const discountedBill = calculateDiscountedBill(regularBill);
  console.log(`discounted bill ${discountedBill}`);

  document.getElementById("regular-bill").innerHTML = `
        <h3>Regular Bill for ${name} and ${email}</h3>Total Bill : 
        ${regularBill}`;

  //no discount
  if (regularBill === discountedBill) {
    document.getElementById("discounted-bill").innerHTML = `
        <h3>Discounted Bill for ${name} and ${email}</h3>
        ${discountedBill}`;
  }

  //discount
  document.getElementById("discounted-bill").innerHTML = `
        <h2>Congrats You Got Discount<h2>
        <h3>Discounted Bill for ${name} and ${email}</h3>
        ${discountedBill}`;

  document.getElementById("checkout").classList.add("hidden");
  document.getElementById("bill").classList.remove("hidden");

  cart = [];
  updateCart();
}

// home page function
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

// regular bill
function calculateRegularBill() {
  let total = 0;
  cart.forEach((item) => {
    console.log(item);
    total += item.price * item.quantity;
  });

  return total;
}

// optimised bill
function calculateDiscountedBill(regularBill) {
  let totalDiscount = 0;

  for (let meal of meals) {
    let productIds = meal.products;
    console.log("Product IDs: " + productIds);
    let mealCount = getMealCount(productIds);
    console.log(`Meal count == ${mealCount}`);

    if (mealCount > 0) {
      totalDiscount = regularBill - 50 * mealCount;
      console.log(`Total discount = ${totalDiscount}`);
    }
  }

  if (totalDiscount === 0) {
    cart.forEach((item) => {
      totalDiscount += item.price * item.quantity;
    });
  }

  finalAmount = totalDiscount;
  return `Discounted Total: ${totalDiscount}`;
}

// count of meals we occured
function getMealCount(productIds) {
  let count = Infinity;

  for (let id of productIds) {
    let item = cart.find((product) => product.id === id);
    console.log(`Item is ${item}`);
    if (!item) {
      count = 0;
      break;
    }
    //taking minimum count
    count = Math.min(count, item.quantity);
    console.log(`Count = ${count}`);
  }

  return count;
}

// increase quantity
function increaseQuantity(itemId) {
  const item = cart.find((item) => item.id === itemId);
  if (item) {
    item.quantity += 1;
    updateCart();
  }
}

// decrease quantity
function decreaseQuantity(itemId, count = 1) {
  const item = cart.find((item) => item.id === itemId);
  if (item && item.quantity > 1) {
    item.quantity -= count;
    updateCart();
  }
}

// update the cart
function updateCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";

  cart.forEach((item) => {
    const listItem = document.createElement("li");

    //increase button
    const increaseButton = document.createElement("button");
    increaseButton.innerText = "+";
    increaseButton.addEventListener("click", () => increaseQuantity(item.id));

    //decrease button
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
}

updateCart();

// load script
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

// RazorPay paymnet gateway
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
      name: "Burger Shop",
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
          console.log("Result", result);
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
