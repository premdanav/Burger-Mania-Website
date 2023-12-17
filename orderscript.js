let prevOrdersHistoryCart = JSON.parse(
  window.localStorage.getItem("prev-orders")
);
let count = 1;
function createCartTable(prevOrdersHistoryCart) {
  const table = document.createElement("table");
  //insertRow func create
  const headerRow = table.insertRow();
  const headers = ["Item Id", "Name", "Price", "Category", "Quantity"];

  // Create table headers
  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  // Create table rows
  prevOrdersHistoryCart.forEach((item) => {
    const row = table.insertRow();

    Object.values(item).forEach((value) => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });

  return table;
}

const table = createCartTable(prevOrdersHistoryCart);

document.querySelector("#prev-orders-list").appendChild(table);
