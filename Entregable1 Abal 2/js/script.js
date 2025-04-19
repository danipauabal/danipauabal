// Saludo personalizado 
const saludoDiv = document.getElementById("saludo");
let nombre = ""; 
saludoDiv.textContent = `Bienvenido, ${nombre} a Giorgio Redaelli!`;

// Asesoramiento personalizado
const submitEventTypeBtn = document.getElementById("submitEventType");
const eventInput = document.getElementById("typeOfEventInput");

// Definimos las constantes de los tipos de eventos válidos
const formalEvent = "formal";
const informalEvent = "informal";
const noDresscode = "libre";

submitEventTypeBtn.addEventListener("click", () => {
    const typeOfEvent = eventInput.value.trim().toLowerCase();

    if ([formalEvent, informalEvent, noDresscode].includes(typeOfEvent)) {
        const asesoramiento = asesoramientoPersonalizado(typeOfEvent);
        const asesoramientoDiv = document.getElementById("asesoramiento");
        asesoramientoDiv.textContent = asesoramiento;
    } else {
        const errorDiv = document.getElementById("errorMessage");
        errorDiv.textContent = "Por favor ingresa un tipo de evento válido.";
    }
});

const asesoramientoPersonalizado = (eventType) => {
    if (eventType === formalEvent) {
        return "Es recomendable usar un ambo oscuro, camisa y corbata.";
    } else if (eventType === informalEvent) {
        return "Podes combinar un saco con pantalón tipo chino y agregar un pañuelo de bolsillo en el saco para darle un toque distinto al conjunto.";
    } else {
        return "Aprovechá para ponerte lo que más hable de quién sos.";
    }
};

// Productos (con Fetch)
let productsOnline = []; // Se carga con fetch desde JSON
const listado = document.getElementById("listado");
const error = document.getElementById("error");
const linkAJSON = "./products.json";

// Definición de clase
class Product {
    constructor(name, id, price, stock, description) {
        this.name = name;
        this.id = id;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }
}

// Cargar datos desde JSON
async function cargarDatos() {
    try {
        const datosJSON = await fetch(linkAJSON);
        const data = await datosJSON.json();

        productsOnline = data.map(product => new Product(
            product.name,
            product.id,
            product.price,
            product.stock,
            product.description
        ));

        showProducts();
    } catch (e) {
        listado.innerHTML = "Hubo un problema al cargar los productos.";
        console.error("Error al cargar productos:", e);
    }
}

// Carrito
const titulo = document.getElementById("titulo");
const cartList = document.getElementById("cart");
const placeOrderBtn = document.getElementById("placeOrder");
const mensajes = document.getElementById("mensajeCompra");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cargarDOM = () => {
    titulo.textContent = "Bienvenido a Giorgio Redaelli";
};

function showProducts() {
    listado.innerHTML = "";

    productsOnline.forEach((producto) => {
        const li = document.createElement("li");

        const cartaProducto = document.createElement("div");
        cartaProducto.classList.add("product-card");

        const h3 = document.createElement("h3");
        h3.textContent = producto.name;

        const p = document.createElement("p");
        p.textContent = `${producto.description} - $${producto.price}`;

        const boton = document.createElement("button");
        boton.textContent = "Agregar al carrito";
        boton.onclick = () => addToCart(producto);

        cartaProducto.appendChild(h3);
        cartaProducto.appendChild(p);
        cartaProducto.appendChild(boton);

        li.appendChild(cartaProducto);
        listado.appendChild(li);
    });
}

// Agregar productos al carrito con mensaje de SweetAlert2
function addToCart(product) {
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();

    Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        text: `${product.name} se agregó al carrito.`,
        timer: 1500,
        showConfirmButton: false
    });
}

// Mostrar el carrito
function showCart() {
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = "<p>El carrito está vacío.</p>";
        return;
    }

    cart.forEach((prodCart, index) => {
        const li = document.createElement("li");
        li.textContent = `${prodCart.name} - $${prodCart.price}`;

        const button = document.createElement("button");
        button.textContent = "Eliminar";
        button.onclick = () => removeFromCart(index);

        li.appendChild(button);
        cartList.appendChild(li);
    });

    const total = document.createElement("li");
    total.textContent = `Total: $${cart.reduce((total, prodEnCarr) => total + prodEnCarr.price, 0)}`;
    cartList.appendChild(total);
}

// Eliminar productos del carrito con mensaje de SweetAlert2
function removeFromCart(index) {
    const removed = cart.splice(index, 1)[0];
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart();

    Swal.fire({
        icon: 'info',
        title: 'Producto eliminado',
        text: `${removed.name} fue eliminado del carrito.`,
        timer: 1500,
        showConfirmButton: false
    });
}

// Finalizar compra con mensaje de SweetAlert2
function placeOrder() {
    if (cart.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Carrito vacío',
            text: 'No puedes finalizar la compra, tu carrito está vacío.'
        });
        return;
    }

    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    cartList.innerHTML = "";

    Swal.fire({
        icon: 'success',
        title: '¡Gracias por tu compra!',
        text: 'Tu pedido ha sido procesado con éxito.'
    });
}

placeOrderBtn.addEventListener("click", placeOrder);

// Cargar DOM
cargarDOM();
showProducts();
showCart();