// Get elements
const cartButton = document.querySelector('.cart-button');
const cartBadge = document.querySelector('.cart-badge');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const modalClose = document.querySelector('.close');
const buyButton = document.querySelector('.buy-btn');
const cartItemsList = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const itemsGrid = document.querySelector('.items-grid');
const sortSelect = document.querySelector('#sort')
var removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');

let items = [
    {
        id: 1,
        name: 'Apple',
        price: 0.99,
    },
    {
        id: 2,
        name: 'Banana',
        price: 10,
    },
    {
        id: 3,
        name: 'Tractor',
        price: 20,
    },
    {
        id: 4,
        name: 'Cow',
        price: 300,
    },
    {
        id: 5,
        name: 'Shoes',
        price: 25,
    },
    {
        id: 6,
        name: 'Shorts',
        price: 15,
    },
    {
        id: 7,
        name: 'Laptop',
        price: 450,
    },
    {
        id: 8,
        name: 'Flower',
        price: 3,
    },
    {
        id: 9,
        name: 'Chair',
        price: 45,
    },
];

let cart = [];

// An example function that creates HTML elements using the DOM.
function fillItemsGrid() {
    for (const item of items) {
        let itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="https://picsum.photos/200/300?random=${item.id}" alt="${item.name}">
            <div class="item-row">
                <h2>${item.name}</h2>
                <p>$${item.price}</p>
                <button class="add-to-cart-btn" data-id="${item.id}">Add to cart</button>
                <input type="number" id="quantity${item.id}" name="quantity" min="1">
                <p class="error-message" id="message${item.id}" style="visibility:hidden">Quantity must be greater than 0</p>
            </div>
        `;
        itemsGrid.appendChild(itemElement);
    }
}

// Adding the .show-modal class to an element will make it visible
// because it has the CSS property display: block; (which overrides display: none;)
// See the CSS file for more details.
function toggleModal() {
  modal.classList.toggle('show-modal');
}

function addToCart() {
    id = this.getAttribute("data-id")
    quantity = document.getElementById(`quantity${id}`).value
    var item = items.find(item => {
        return item.id == id
    })
    if(quantity < 1) {
        errorMessage = document.getElementById(`message${id}`)
        errorMessage.style.visibility = "visible"
        setTimeout(function(){
            errorMessage.style.visibility = "hidden";
        }, 3000)
        return
    }
    const cartIndex = cart.findIndex((item) => item.id == id)
    console.log(cartIndex)
    if(cartIndex === -1) {
        cart.push({
            id:item.id,
            name:item.name,
            price:item.price,
            quantity: quantity
        });
    } else {
        cart.at(cartIndex).quantity = Number(cart.at(cartIndex).quantity) + Number(quantity);
    }
    cartSize = Number(cartBadge.innerHTML)
    cartBadge.innerHTML = `${cartSize += Number(quantity)}`;
    updateCart();
}

function removeFromCart() {
    id = this.getAttribute("data-id")
    const index = cart.findIndex((item) => item.id == id);
    if (cart.at(index).quantity == 1) {
        cart.splice(index, 1);
    } else {
        cart.at(index).quantity--;
    }
    cartSize = Number(cartBadge.innerHTML)
    cartBadge.innerHTML = `${cartSize -= 1}`;
    updateCart();
}

function updateCart() {
    cartItemsList.innerHTML = ""
    totalPrice = 0.0;

    cart.forEach(function(item){
        listItem = document.createElement('li')

        span = document.createElement('span')
        span.innerHTML = `${item.name} - ${item.price} x ${item.quantity}`

        removeButton = document.createElement('button')
        removeButton.classList.add('remove-from-cart-btn')
        removeButton.setAttribute('data-id', item.id);
        removeButton.innerHTML = "Remove from cart"

        listItem.appendChild(span)
        listItem.appendChild(removeButton)
        cartItemsList.appendChild(listItem)

        removeFromCartButtons = document.querySelectorAll('.remove-from-cart-btn');
        removeFromCartButtons.forEach(function(button){
            button.addEventListener('click', removeFromCart);
        });

        totalPrice += item.price * item.quantity
    })
    if (cart.length > 0) {
        buyButton.style.visibility = "visible"
    } else {
        buyButton.style.visibility = "hidden"
    }
    cartTotal.innerHTML = `$${totalPrice}`
}

function buy() {
    cart = [];
    updateCart();

    cartBadge.innerHTML = "0"

    checkoutMessage = document.createElement('p')
    checkoutMessage.classList.add('success-message')
    checkoutMessage.innerHTML = "You have successfully checked out"

    modalContent.appendChild(checkoutMessage)
    setTimeout(function(){
        checkoutMessage.remove();
    }, 3000)
}

function sort() {
    sortType = sortSelect.value;
    if(sortType == "highestPrice") {
        items.sort(function(a,b) {
            return b.price - a.price;
        })
    } else if (sortType == "lowestPrice") {
        items.sort(function(a,b) {
            return a.price - b.price;
        })
    } else if (sortType == "aToZ") {
        items.sort(function(a,b) {
            if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
        })
    } else {
        items.sort(function(a,b) {
            if (a.name < b.name) {
                return 1;
              }
              if (a.name > b.name) {
                return -1;
              }
              return 0;
        })
    }
    itemsGrid.innerHTML = "";
    fillItemsGrid();
    addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(function(button){
        button.addEventListener('click', addToCart);
    });
}

// Call fillItemsGrid function when page loads
sort()
updateCart();

// Example of DOM methods for adding event handling
cartButton.addEventListener('click', toggleModal);
modalClose.addEventListener('click', toggleModal);
buyButton.addEventListener('click', buy);
sortSelect.addEventListener('change', sort)
