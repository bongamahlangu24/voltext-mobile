
const CART_KEY = "voltixCart";

// Get the saved cart from the browser
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Save the cart
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Update the cart count, total and product list
function updateCart() {
    const cart = getCart();

    const count = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });

    document.querySelectorAll(".cart-total").forEach(element => {
        element.textContent = "R" + total.toFixed(2);
    });

    
const deliveryFee = cart.length === 0 ? 0 : 60;
const finalTotal = total + deliveryFee;

const deliveryElement = document.getElementById("delivery-fee");
if (deliveryElement) {
    deliveryElement.textContent = "R" + deliveryFee.toFixed(2);
}

const finalTotalElement = document.getElementById("final-total");
if (finalTotalElement) {
    finalTotalElement.textContent = "R" + finalTotal.toFixed(2);
}


    const cartItems = document.getElementById("cart-items");

    if (cartItems) {
        cartItems.innerHTML = "";

        if (cart.length === 0) {
            cartItems.textContent = "Your cart is empty.";
        } else {
            cart.forEach(item => {
                const row = document.createElement("li");
                row.textContent =
                    `${item.name} x ${item.quantity} — R${(
                        item.price * item.quantity
                    ).toFixed(2)}`;

                const decreaseButton = document.createElement("button");
decreaseButton.textContent = "−";
decreaseButton.type = "button";

decreaseButton.addEventListener("click", function () {
    const cart = getCart();
    const product = cart.find(product => product.name === item.name);

    if (product.quantity > 1) {
        product.quantity--;
    } else {
        const index = cart.findIndex(product => product.name === item.name);
        cart.splice(index, 1);
    }

    saveCart(cart);
    updateCart();
});

const quantity = document.createElement("span");
quantity.textContent = ` ${item.quantity} `;

const increaseButton = document.createElement("button");
increaseButton.textContent = "+";
increaseButton.type = "button";

increaseButton.addEventListener("click", function () {
    const cart = getCart();
    const product = cart.find(product => product.name === item.name);

    product.quantity++;
    saveCart(cart);
    updateCart();
});

const removeButton = document.createElement("button");
removeButton.textContent = "Remove";
removeButton.type = "button";

removeButton.addEventListener("click", function () {
    const updatedCart = getCart().filter(product => product.name !== item.name);
    saveCart(updatedCart);
    updateCart();
});

row.appendChild(document.createTextNode(" "));
row.appendChild(decreaseButton);
row.appendChild(quantity);
row.appendChild(increaseButton);
row.appendChild(document.createTextNode(" "));
row.appendChild(removeButton);
                cartItems.appendChild(row);
            });
        }
    }
}

// Add products to the shared cart
document.addEventListener("DOMContentLoaded", function () {
    updateCart();

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const name = button.dataset.name;
            const price = Number(button.dataset.price);

            const cart = getCart();
            const existingItem = cart.find(
                item => item.name === name
            );

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            saveCart(cart);
            updateCart();

            button.textContent = "Added!";
            setTimeout(() => {
                button.textContent = "Add to Cart";
            }, 800);
        });
    });

    const clearButton = document.getElementById("clear-cart");

    if (clearButton) {
        clearButton.addEventListener("click", function () {
            saveCart([]);
            updateCart();
        });
    }
});


function updateCheckout() {
    const cart = JSON.parse(localStorage.getItem("voltixCart")) || [];

    const itemsList = document.getElementById("checkout-items");
    const subtotalElement = document.getElementById("checkout-subtotal");
    const deliveryElement = document.getElementById("checkout-delivery");
    const totalElement = document.getElementById("checkout-total");
    const placeOrderButton = document.getElementById("place-order");

    // Stop if this is not the checkout page
    if (!itemsList) return;

    itemsList.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const listItem = document.createElement("li");
        listItem.textContent =
            `${item.name} x ${item.quantity} — R${itemTotal.toFixed(2)}`;

        itemsList.appendChild(listItem);
    });

    const delivery = cart.length === 0 ? 0 : 60;
    const total = subtotal + delivery;

    subtotalElement.textContent = "R" + subtotal.toFixed(2);
    deliveryElement.textContent = "R" + delivery.toFixed(2);
    totalElement.textContent = "R" + total.toFixed(2);

    if (placeOrderButton) {
        placeOrderButton.disabled = cart.length === 0;
    }

    if (cart.length === 0) {
        itemsList.textContent = "Your cart is empty.";
    }
}

document.addEventListener("DOMContentLoaded", updateCheckout);


document.addEventListener("DOMContentLoaded", function () {
    const checkoutForm = document.getElementById("checkout-form");

    if (!checkoutForm) return;

    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const cart = JSON.parse(localStorage.getItem("voltixCart")) || [];
        const message = document.getElementById("checkout-message");

        if (cart.length === 0) {
            message.textContent = "Your cart is empty. Please add products first.";
            return;
        }

        if (!checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }

        const subtotal = cart.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
        );

        const delivery = cart.length > 0 ? 60 : 0;
        const total = subtotal + delivery;

        const orderNumber = "VM" + Date.now().toString().slice(-8);
        
const customerOrder = {
    orderNumber: orderNumber,
    date: new Date().toLocaleString(),
    customer: {
        fullName: document.getElementById("full-name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        suburb: document.getElementById("suburb").value.trim(),
        city: document.getElementById("city").value.trim(),
        postalCode: document.getElementById("postal-code").value.trim()
    },
    items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
    })),
    subtotal: subtotal,
    delivery: delivery,
    total: total,
    status: "Pending"
};

const savedOrders = JSON.parse(
    localStorage.getItem("voltixOrders") || "[]"
);

savedOrders.push(customerOrder);

localStorage.setItem(
    "voltixOrders",
    JSON.stringify(savedOrders)
);


        message.textContent =
            `Order ${orderNumber} confirmed! Your total is R${total.toFixed(2)}. ` +
            "This is a demo confirmation; no payment has been processed.";

        localStorage.setItem("voltixCart", JSON.stringify([]));

        checkoutForm.reset();
        updateCart();
        updateCheckout();

        const placeOrderButton = document.getElementById("place-order");
        if (placeOrderButton) {
            placeOrderButton.disabled = true;
        }
    });
});
