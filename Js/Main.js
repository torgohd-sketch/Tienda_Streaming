// Reemplaza por tu número
const TELEFONO_WHATSAPP = "3016451598";

document.addEventListener("DOMContentLoaded", () => {
  // Lógica de Modales
  const modal = document.getElementById("orderModal");
  const closeModalBtn = document.getElementById("closeModal");
  const orderForm = document.getElementById("orderForm");

  let selectedProduct = { name: "", price: "", type: "" };

  const openModal = (name, price, type) => {
    selectedProduct = { name, price, type };
    document.getElementById("modalProductName").textContent = name;
    document.getElementById("modalProductType").textContent = type;
    document.getElementById("modalProductPrice").textContent = price;
    modal.classList.add("active");
  };

  const closeModal = () => modal.classList.remove("active");
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  // Cambiar precio dinámico en tarjetas con opciones
  document.querySelectorAll('.variant-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const card = e.target.closest('.card');
      const option = e.target.options[e.target.selectedIndex];
      card.querySelector('.amount').textContent = option.value;
    });
  });

  // Lógica de Buscador y Paginación
  const searchInput = document.getElementById('searchInput');
  const productsGrid = document.getElementById('productsGrid');
  const paginationControls = document.getElementById('paginationControls');
  
  // Guardar todos los artículos (convertidos en un array)
  const allCards = Array.from(document.querySelectorAll('.product-item'));
  
  let currentPage = 1;
  const itemsPerPage = 8;
  let filteredCards = [...allCards];

  const renderGrid = () => {
    productsGrid.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = filteredCards.slice(start, end);
    
    paginatedItems.forEach(card => {
      productsGrid.appendChild(card);
      // Reasignar el evento de botón a las tarjetas visibles
      const btn = card.querySelector('.buy-btn');
      btn.onclick = () => {
        const name = btn.getAttribute('data-name');
        const select = card.querySelector('.variant-select');
        let price = btn.getAttribute('data-price');
        let type = btn.getAttribute('data-type');

        // Si tiene selector de variante, usar esos datos
        if (select) {
          const option = select.options[select.selectedIndex];
          price = `$${option.value}`;
          type = option.getAttribute('data-type');
        }
        openModal(name, price, type);
      };
    });
    
    renderPagination();
  };

  const renderPagination = () => {
    paginationControls.innerHTML = '';
    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);
    
    if(totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      btn.textContent = i;
      btn.addEventListener('click', () => {
        currentPage = i;
        renderGrid();
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
      });
      paginationControls.appendChild(btn);
    }
  };

  // Evento de Búsqueda
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    filteredCards = allCards.filter(card => {
      const searchData = card.getAttribute('data-search').toLowerCase();
      const title = card.querySelector('h3').textContent.toLowerCase();
      return searchData.includes(term) || title.includes(term);
    });
    currentPage = 1;
    renderGrid();
  });

  // Procesar compra y enviar a WhatsApp
  orderForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userName = document.getElementById("userName").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;
    if (!userName) return;

    const mensaje = `¡Hola!  Quisiera solicitar:\n\n *Servicio:* ${selectedProduct.name}\n *Plan/Tiempo:* ${selectedProduct.type}\n💰 *Precio:* ${selectedProduct.price}\n👤 *Cliente:* ${userName}\n💳 *Pago:* ${paymentMethod}\n\nQuedo atento(a) para proceder con el pago.`;
    window.open(`https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`, "_blank");
    closeModal();
    orderForm.reset();
  });

  // Render inicial
  renderGrid();
});