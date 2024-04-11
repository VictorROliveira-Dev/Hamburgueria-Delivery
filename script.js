const menu = document.getElementById("menu");
const cartButton = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutButton = document.getElementById("checkout-btn");
const closeModalButton = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
// Criando array para ser preenchidos com itens adicionados a sacola:
let bag = [];
// Realizando abertura e fechamento do modal:
// Abrindo modal:
cartButton.addEventListener("click", () => {
  UpdateCartModal();
  cartModal.style.display = "flex";
});
// Fechando modal clicando fora dele:
cartModal.addEventListener("click", (event) => {
  if (event.target == cartModal) {
    cartModal.style.display = "none";
  }
});
// Fechando modal clicando no botão fechar:
closeModalButton.addEventListener("click", () => {
  cartModal.style.display = "none";
});
// Adicionando método de adicionar o item a sacola:
menu.addEventListener("click", (event) => {
  // Caso o clique seja no ícone do botão, o evento funcionará, o "closest" faz isso.
  let parentButton = event.target.closest(".add-cart-button");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    AddToBag(name, price);
  }
});
// Função para adicionar a sacola:
function AddToBag(name, price) {
  const existItem = bag.find((item) => item.name === name);

  if (existItem) {
    existItem.quantity += 1;
  } else {
    bag.push({ name, price, quantity: 1 });
  }

  UpdateCartModal();
}
// Atualiza o modal com os itens:
function UpdateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  bag.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-extrabold mt-2 text-red-600">R$: ${item.price.toFixed(
                  2
                )}</p>
            </div>

            <div>
                <button data-name="${
                  item.name
                }" class="remove-cart-button border-2 rounded-md hover:border-red-600 hover:bg-red-600 hover:text-white duration-300 px-1 py-1">Remover</button>
            </div>
        </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = bag.length;
}
// Função para remover o item do carrinho apertando o botão:
cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-cart-button")) {
    const name = event.target.getAttribute("data-name");

    RemoveItemCart(name);
  }

  function RemoveItemCart(name) {
    const index = bag.findIndex((item) => item.name === name);

    if (index !== -1) {
      const item = bag[index];

      if (item.quantity > 1) {
        item.quantity -= 1;
        UpdateCartModal();
        return;
      }

      bag.splice(index, 1);
      UpdateCartModal();
    }
  }
});
// Realizando captura do campo do input:
addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-600");
    addressWarn.classList.add("hidden");
  }
});
// Fazendo verificação de conteúdo no input:
checkoutButton.addEventListener("click", () => {
  const isOpen = CheckRestaurantOpen();
  if (!isOpen) {
    // Utilizando biblioteca toastfy:
    Toastify({
      text: "Ops, o restaurante se encontra fechado!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#ef4444",
      },
    }).showToast();
    
    return;
  }

  if (bag.length === 0) return;
  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-600");
    return;
  }
  // Enviando pedido pelo whatsapp:
  const itemsMessage = bag
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity})x Preço: R$ ${item.price} | `;
    })
    .join("");

  const message = encodeURIComponent(itemsMessage);
  const phone = "83981961246";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  bag = [];
  UpdateCartModal();
});
// Verificação do restaurante (aberto ou fechado):
function CheckRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();

  return hora >= 18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = CheckRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-600");
  spanItem.classList.add("bg-green-500");
} else {
  spanItem.classList.add("bg-red-600");
  spanItem.classList.remove("bg-green-500");
}
