// FUNCIONES DE DELICIAS EXPRESS

// 1. Obtener los productos guardados en el navegador
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Guardar los productos en el almacenamiento local
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// 2. AGREGAR PRODUCTOS AL CARRITO (Usando delegación de eventos global)
// Esto asegura que funcione aunque los botones se carguen dinámicamente o estén en otra vista.
document.addEventListener("click", function(evento) {
    if (evento.target && evento.target.classList.contains("agregar")) {
        const boton = evento.target;
        
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        // Buscar si el producto ya existe en el carrito
        const productoExistente = carrito.find(function(producto) {
            return producto.nombre === nombre;
        });

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }

        guardarCarrito();
        mostrarCarrito();

        // Mostrar mensaje temporal en pantalla
        const mensaje = document.getElementById("mensajeCarrito");
        if (mensaje) {
            mensaje.textContent = "¡" + nombre + " agregado al carrito!";
            setTimeout(() => {
                mensaje.textContent = "";
            }, 3000);
        }
    }
});

// 3. MOSTRAR EL CARRITO Y CALCULAR TOTALES (Solo se ejecuta si existen los elementos en la página)
function mostrarCarrito() {
    const lista = document.getElementById("listaCarrito");
    const totalElemento = document.getElementById("totalCarrito");

    if (!lista || !totalElemento) {
        return; // Si no estamos en la página del carrito/pedidos, se detiene aquí sin dar error
    }

    lista.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        lista.textContent = "Tu carrito está vacío.";
        totalElemento.textContent = "0.00";
        return;
    }

    carrito.forEach(function(producto, indice) {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        const elemento = document.createElement("div");
        elemento.className = "item-carrito";

        const descripcion = document.createElement("span");
        descripcion.textContent = producto.nombre + " (x" + producto.cantidad + ") - $" + subtotal.toFixed(2);

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "boton-eliminar";

        // Evento para eliminar un producto individual
        botonEliminar.addEventListener("click", function() {
            carrito.splice(indice, 1);
            guardarCarrito();
            mostrarCarrito();
        });

        elemento.appendChild(descripcion);
        elemento.appendChild(botonEliminar);
        lista.appendChild(elemento);
    });

    totalElemento.textContent = total.toFixed(2);
}

// 4. VACIAR TODO EL CARRITO
const botonVaciar = document.getElementById("vaciarCarrito");
if (botonVaciar) {
    botonVaciar.addEventListener("click", function() {
        carrito = [];
        guardarCarrito();
        mostrarCarrito();
    });
}

// 5. VALIDAR Y CONFIRMAR EL PEDIDO (Para la página de pedidos)
const formulario = document.getElementById("pedidoForm");
if (formulario) {
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const direccion = document.getElementById("direccion").value.trim();
        const entrega = document.getElementById("entrega").value;
        const mensaje = document.getElementById("mensajePedido");

        if (carrito.length === 0) {
            mensaje.textContent = "Agregue al menos un producto al carrito antes de ordenar.";
            return;
        }

        let total = 0;
        carrito.forEach(function(producto) {
            total += producto.precio * producto.cantidad;
        });

        mensaje.style.color = "#4CAF50";
        mensaje.textContent = "¡Gracias, " + nombre + "! Pedido registrado con éxito. Total: $" + total.toFixed(2) + " (" + entrega + ").";

        // Limpiar carrito y formulario
        carrito = [];
        guardarCarrito();
        mostrarCarrito();
        formulario.reset();
    });
}

// CARGAR EL CARRITO AL ABRIR LA PÁGINA
mostrarCarrito();