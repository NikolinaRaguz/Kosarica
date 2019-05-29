function shoppingCart() {
    // Creates container in .root element for products
    var container = document.createElement('div');
    container.setAttribute('class', 'container');
    document.getElementById('root').appendChild(container);

    // Cahce necesarry DOM Elements
    var cart = document.querySelector(".shopping-cart-list"),
        productQuantity = document.querySelector(".product-quantity"),
        emptyCart = document.querySelector(".empty-cart-btn"),
        cartCheckout = document.querySelector(".cart-checkout"),
        totalPrice = document.querySelector(".total-price");

    // Get JSON data from API
    jQuery.getJSON('https://api.myjson.com/bins/1925o6', function(data) {
        // Store JSON data in variable
        var productsEl = data

        // Iterate through JSON data
        jQuery.each(data.products, function(x, v) {
            // Create card element to store individual product
            var card = document.createElement('div');
            card.setAttribute('class', 'card');
            // Create p elements inside card elements
            var products = document.createElement("p");
            products.className = "product";
            // Create div elements with product information
            products.innerHTML = `<div class="product-image">
                                <img src="${v.image}" alt="${v.name}">
                            </div>
                            <div class="product-name"> ${v.name}</div>
                            <div class="product-price"><b>${v.price.amount} ${v.price.currency + "/" + v.price.measureUnit}</b></div>
                            <div class="product-add-to-cart">
                            <a href="#0" class="button add-to-cart" data-id=${v.id}>Dodaj</a>
                            </div>`;
            // Append necessary elements
            container.appendChild(card);
            card.appendChild(products);
        });

        // Declare empty array for products in cart
        var productsInCart = [];

        // Save cart to local storage
        function saveCart() {
            sessionStorage.setItem('shoppingCart', JSON.stringify(productsInCart));
        }

        // Load cart from local storage
        function loadCart() {
            productsInCart = JSON.parse(sessionStorage.getItem('shoppingCart'));
        }
        if (sessionStorage.getItem("shoppingCart") != null) {
            loadCart();
        }

        // Function for generating cart list
        var generateCartList = function() {
            cart.innerHTML = "";
            productsInCart.forEach(function(item) {
                // Create and append list of added product to cart
                var li = document.createElement('li');
                li.innerHTML = `<div class="list"><div class="cart-image">
                <img class="cart-image" src="${item.product.image}" alt="${item.product.name}">
                </div> &nbsp&nbsp ${item.quantity} x ${item.product.name} <a href="#0" class="button remove-item">x</a> <br> &nbsp&nbsp Ukupno: ${item.product.price.amount * item.quantity} kn </div>`;
                cart.appendChild(li);
            });
            productQuantity.innerHTML = productsInCart.length;
            generateCartButtons()
        }

        //Function that generates empty cart and checkout buttons based on condition that checks if productsInCart array is empty
        function generateCartButtons() {
            if (productsInCart.length > 0) {
                emptyCart.style.display = "block";
                cartCheckout.style.display = "block"
                totalPrice.innerHTML = calculateTotalPrice() + " kn";
            } else {
                emptyCart.style.display = "none";
                cartCheckout.style.display = "none";
            }
        }

        // Setting up event listener on contair under contidion that it contains add-to-cart button
        var setupListeners = function() {
            container.addEventListener("click", function(event) {
                var el = event.target;
                if (el.classList.contains("add-to-cart")) {
                    var elId = el.dataset.id;
                    addToCart(elId);
                }
            });
        }

        // Setting up event listener on empty cart button
        emptyCart.addEventListener("click", function(event) {
            productsInCart = [];
            generateCartList();
            saveCart();
        });

        // Setting up on click event to remove specific item from cart
        jQuery('ul').on('click', '.remove-item', function() {
            var index = $('.remove-item').index(this);
            $(this).parent().remove();
            productsInCart.splice(index, 1);
            generateCartList();
            saveCart();
        });

        // Adds new items or updates existing one in productsInCart array
        var addToCart = function(id) {
            var obj = productsEl.products[id - 1];
            var exists = 0;
            productsInCart.forEach(function(item) {
                if (item.product.id == obj.id) {
                    item.quantity++;
                    exists = 1;
                }
            });
            if (exists === 0)
                productsInCart.push({ product: obj, quantity: 1 });
            generateCartList();
            saveCart();
        }

        // Calculating total price for all items
        var calculateTotalPrice = function() {
            return productsInCart.reduce(function(total, item) {
                return total + (item.product.price.amount * item.quantity);

            }, 0);
        }
        generateCartList();
        setupListeners();
    });
};
shoppingCart();