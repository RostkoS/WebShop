const cartBtn = document.querySelector(".cart-btn");
const menuBtn = document.querySelector(".menu-btn");
const closeCartBtn = document.querySelector(".close-cart");
const closeMenuBtn = document.querySelector(".close-menu");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const menuDOM = document.querySelector(".menu");
const menuOverlay = document.querySelector(".menu-overlay");
const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-button");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products");
const menuContent = document.querySelector(".menu-content");
let cart = [];
let buttonsDOM = [];
class Products {
    //getting data from json file
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;
            products = products.map(item => {
                const { title, price, type } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image, type }
            })
           return products;
        
        } catch (error) {
            console.log(error);
        }
    }

}

class UI {
    //displaying products 
    displayProducts(products) {
        let result = "";
        let types = [];
        //filling array types
        products.forEach(product => {
            if (types.find(t => t === product.type)) {
            } else { types.push(product.type);}
        })

        //displaying products by their types
        types.forEach(type => {
            result += "<h2 class='heading' id=\"" + type + "\">" + type + "</h2> <div class='products-center'>";
            products.forEach(product => {
                if (product.type === type) {
                    result +=
                    "<article class='product'> <div class='img-container'> <img src=\"" + product.image + "\" alt='product'  class='product-img' /><button class='bag-btn' data-id= " + product.id + ">  add to bag </button> </div >  <h3>" + product.title + "</h3>  <h4>" + product.price + "</h4> </article >"
                }
            })
            result += "</div>";
        })
        //filling central piece of website
        productsDOM.innerHTML = result;
    }
    //setting up buttons 'add to cart' for products
    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            } 
                button.addEventListener('click', event => {
                    event.target.innerText = "In Cart";
                    event.target.disabled = true;
                    let cartItem = { ...Storage.getProduct(id), amount: 1};

                    cart = [...cart, cartItem];
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    this.addCartItem(cartItem);
                    this.showCart();
                }
                )
            
        })
    }
    //setting cart values for display
    setCartValues(cart) {
        let sum = 0;
        let am = 0;
        cart.map(c => {
            sum += c.price * c.amount;
            am += c.amount;
        });
        cartTotal.innerHTML = parseFloat(sum.toFixed(2));
        cartItems.innerHTML = am;

    }
    //adding item to cart
    addCartItem(cartItem) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = "<img src=\"" + cartItem.image + "\" alt='product' /><div> <h4>" + cartItem.title + "</h4><h5>" + cartItem.price + "</h5><span class = 'remove-item' data-id=" + cartItem.id + ">remove</span></div>" +
            "<div> <img src=\"images/up.png\" class='up' data-id=" + cartItem.id + " /> <p class='item-amount'>" + cartItem.amount + "</p><img src=\"images/down.png\" class='down' data-id=" + cartItem.id + "/>"
        cartContent.appendChild(div);
    }
    //making cart overlay visible
    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart')
    }
     //making menu overlay visible
    showMenu() {
        menuOverlay.classList.add('transparentM');
        menuDOM.classList.add('showMenu');
        
    }
    //seting up menu for display
    setupMenu(products) {
        let result = "";
        let types = [];
        products.forEach(product => {
            if (types.find(t => t === product.type)) {
            } else {
                types.push(product.type);
                result += " <h2><a class='menu-option' href=\"#" + product.type + "\">" + product.type + "</a></h2>";
         }
        })
        menuContent.innerHTML = result;
    }
    //initial setup 
    setupApp() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        menuBtn.addEventListener('click', this.showMenu);
        closeCartBtn.addEventListener('click', this.hideCart);
        closeMenuBtn.addEventListener('click', this.hideMenu);
        menuOverlay.addEventListener('click', this.hideMenu);
    }
    //filling cart
    populateCart(cart) {
        cart.forEach(c => {
            this.addCartItem(c)
        })
    }
    //making cart overlay invisible
    hideCart() {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart')
    }
    //making menu overlay invisible
    hideMenu() {
        menuOverlay.classList.remove('transparentM');
        menuDOM.classList.remove('showMenu');
    }
    //setting up cart logic with event listeners
    cartLogic() {
        clearCartBtn.addEventListener('click', () => {
            this.clearCart();
        });
        cartContent.addEventListener('click', (event) => {
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement)
                this.removeItem(id);
            }
            else if (event.target.classList.contains('up')) {
                let add = event.target;
                let id = (add.dataset.id).charAt(0);
                let temp = cart.find((item) => item.id === id);
                temp.amount += 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                add.nextElementSibling.innerText = temp.amount;
            }
            else if (event.target.classList.contains('down')) {
                let sub = event.target;
                let id = (sub.dataset.id).charAt(0);
                let temp = cart.find((item) => item.id === id);
                temp.amount -= 1;
                if (temp.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    
                    sub.previousElementSibling.innerText = temp.amount;
                }
                else {
                    cartContent.removeChild(sub.parentElement.parentElement)
                    this.removeItem(id);
                }
                }
        } );
    }
    menuLogic() {
        //hiding menu after clicking on it
        menuDOM.addEventListener('click', (event) => {
            if (event.target.classList.contains('menu-option')) {
                this.hideMenu();
            } 
        })
    }
    //function for clearing cart
    clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0])
        }
        this.hideCart();
    }
    //removing item from cart
    removeItem(id) {
        cart = cart.filter(item => item.id !==id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = "add to cart";
    }
    //getting button by id
    getSingleButton(id) {
        return buttonsDOM.find(b => b.dataset.id === id);
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    ui.setupApp();
    products.getProducts().then(products => {
        ui.displayProducts(products);
        ui.setupMenu(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getBagButtons();
        ui.cartLogic();
        ui.menuLogic();
    }
        )
})