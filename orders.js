
function displayOrders() {
    const orders = JSON.parse(
        localStorage.getItem("voltixOrders") || "[]"
    );

    const ordersList = document.getElementById("orders-list");
    const ordersCount = document.getElementById("orders-count");
    const pendingCount = document.getElementById("pending-count");
    const ordersValue = document.getElementById("orders-value");

    ordersList.innerHTML = "";

    ordersCount.textContent = orders.length;

    pendingCount.textContent = orders.filter(
        order => order.status === "Pending"
    ).length;

    const totalValue = orders.reduce(
        (sum, order) => sum + order.total, 0
    );

    ordersValue.textContent = "R" + totalValue.toFixed(2);

    if (orders.length === 0) {
        ordersList.textContent =
            "No orders yet. Completed customer orders will appear here.";
        return;
    }

    // Show the newest orders first
    orders.slice().reverse().forEach(order => {
        const card = document.createElement("section");
        card.className = "order-card";

        const heading = document.createElement("h2");
        heading.textContent = "Order " + order.orderNumber;
        card.appendChild(heading);

        const date = document.createElement("p");
        date.textContent = "Date: " + order.date;
        card.appendChild(date);

        const status = document.createElement("p");
        status.textContent = "Status: " + order.status;
        card.appendChild(status);

        const customerHeading = document.createElement("h3");
        customerHeading.textContent = "Customer Details";
        card.appendChild(customerHeading);

        const customer = order.customer;

        [
            "Name: " + customer.fullName,
            "Email: " + customer.email,
            "Phone: " + customer.phone,
            "Address: " + customer.address,
            "Suburb: " + customer.suburb,
            "City: " + customer.city,
            "Postal Code: " + customer.postalCode
        ].forEach(detail => {
            const paragraph = document.createElement("p");
            paragraph.textContent = detail;
            card.appendChild(paragraph);
        });

        const itemsHeading = document.createElement("h3");
        itemsHeading.textContent = "Products Ordered";
        card.appendChild(itemsHeading);

        const itemsList = document.createElement("ul");

        order.items.forEach(item => {
            const listItem = document.createElement("li");
            const itemTotal = item.price * item.quantity;

            listItem.textContent =
                `${item.name} x ${item.quantity} — R${itemTotal.toFixed(2)}`;

            itemsList.appendChild(listItem);
        });

        card.appendChild(itemsList);

        const subtotal = document.createElement("p");
        subtotal.textContent = "Subtotal: R" + order.subtotal.toFixed(2);
        card.appendChild(subtotal);

        const delivery = document.createElement("p");
        delivery.textContent = "Delivery: R" + order.delivery.toFixed(2);
        card.appendChild(delivery);

        const total = document.createElement("p");
        total.className = "order-total";
        total.textContent = "Order Total: R" + order.total.toFixed(2);
        card.appendChild(total);

        ordersList.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", displayOrders);

