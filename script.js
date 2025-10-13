// Basic product data
const PRODUCTS = [
  {
    id: 'p1',
    title: 'Vòng cổ cho thú cưng gắn định vị kèm sạc',
    colors: ['Xanh','Đỏ','Cam','Hồng','Đen'],
    img: 'img/vong-co-dinh-vi.jfif',
    images: [ 'img/vong-co-dinh-vi.jfif', 'img/vc1.jfif', 'img/vc2.jfif', 'img/vc3.jfif', 'img/vc4.jfif' ],
    desc: 'An toàn Tuyệt đối. Theo dõi vị trí GPS/LBS chính xác 24/7. Cảnh báo tức thì khi thú cưng rời khỏi vùng an toàn. Tích hợp theo dõi sức khỏe và hoạt động.',
    price: 349000
  },
  {
    id: 'p2',
    title: 'Thức ăn hạt cao cấp',
    img: 'img/0cfac883-d915-4057-af38-6d0e9256d2ef.jfif',
    desc: 'Nguồn năng lượng Tối ưu. Công thức dinh dưỡng cân bằng, giàu protein, hỗ trợ duy trì sức khỏe và mức năng lượng cho thú cưng năng động.',
    price: 149000
  },
  {
    id: 'p3',
    title: 'Bộ đồ chơi đa năng',
    img: 'img/61977635-fa97-4acd-8c16-df7dc1faf7c0.jfif',
    desc: 'Kích thích Trí tuệ & Giảm căng thẳng. Các món đồ chơi tương tác giúp thú cưng vận động, ngăn ngừa các hành vi phá hoại và duy trì tinh thần vui vẻ.',
    price: 89000
  },
  {
    id: 'p4',
    title: 'Pate cho Chó/Mèo (100gr)',
    img: 'img/1a1999e0-baa2-4491-b2b9-08806b005310.jfif',
    desc: 'Hỗ trợ Hydrat hóa & Tiêu hóa. Bổ sung độ ẩm, vitamin và khoáng chất. Lý tưởng để phục hồi và làm bữa ăn thêm hấp dẫn.',
    price: 99000
  },
  {
    id: 'p5',
    title: 'Dụng cụ chải lông',
    img: 'img/5643474e-b2ef-4e98-91fd-9db7aca57add.jfif',
    desc: 'Bộ lông Khỏe mạnh & Giảm rụng. Lược/găng tay chuyên dụng loại bỏ lông chết hiệu quả, giúp da và lông thú cưng luôn bóng mượt.',
    price: 39000
  },
  {
    id: 'p6',
    title: 'Dây dắt Chó/Mèo',
    img: 'img/day-dat-cho-meo.jfif',
    desc: 'Kiểm soát An toàn & Thoải mái. Chất liệu bền bỉ, chống tuột và có phản quang. Đảm bảo trải nghiệm đi dạo an toàn, thoải mái cho cả chủ và thú cưng.',
    price: 29000
  }
];

// --- LOGIC: KIỂM TRA KHÁCH HÀNG MỚI VÀ ÁP DỤNG GIẢM GIÁ ---
const isNewCustomer = !localStorage.getItem('grandpet_has_ordered');
const DISCOUNT_FOR_NEW_CUSTOMER = 10; // Giảm 10%

const PROCESSED_PRODUCTS = PRODUCTS.map(p => {
  if (isNewCustomer) {
    return {
      ...p,
      originalPrice: p.price,
      price: p.price * (1 - DISCOUNT_FOR_NEW_CUSTOMER / 100)
    };
  }
  return p;
});

const FEATURED_PRODUCT = PROCESSED_PRODUCTS.find(p => p.id === 'p1');
const OTHER_PRODUCTS = PROCESSED_PRODUCTS.filter(p => p.id !== 'p1');

// Utilities
const fmt = (v) => v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';

// App state
let cart = JSON.parse(localStorage.getItem('cart_v1') || '{}');

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const featuredProductEl = document.getElementById('featured-product');
const cartCount = document.getElementById('cartCount');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const closeCart = document.getElementById('closeCart');
const clearCartBtn = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutForm = document.getElementById('checkoutForm');
const confirmModal = document.getElementById('confirmModal');
const firstTimeBanner = document.getElementById('firstTimeBanner');

function saveCart() {
  localStorage.setItem('cart_v1', JSON.stringify(cart));
}

function cartQuantity() {
  return Object.values(cart).reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
  cartItemsEl.innerHTML = '';
  const items = Object.values(cart);
  if (items.length === 0) {
    cartItemsEl.innerHTML = '<p>Giỏ hàng trống.</p>';
    cartTotalEl.textContent = fmt(0);
    cartCount.textContent = '0';
    return;
  }
  items.forEach(it => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div style="flex:1">
        <div style="font-weight:700">${it.title}</div>
        <div style="color:#6b7280;font-size:.95rem">${it.desc}</div>
      </div>
      <div style="text-align:right">
        <div class="qty">
          <button data-id="${it.id}" class="dec">-</button>
          <span style="min-width:28px;display:inline-block;text-align:center">${it.qty}</span>
          <button data-id="${it.id}" class="inc">+</button>
        </div>
        <div style="margin-top:6px;font-weight:700">${fmt(it.price * it.qty)}</div>
        <button data-id="${it.id}" class="remove btn-secondary" style="margin-top:6px">Xóa</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });
  cartTotalEl.textContent = fmt(items.reduce((s, i) => s + i.price * i.qty, 0));
  cartCount.textContent = cartQuantity();
  cartItemsEl.querySelectorAll('.inc').forEach(b => b.addEventListener('click', () => { modifyQty(b.dataset.id, 1) }));
  cartItemsEl.querySelectorAll('.dec').forEach(b => b.addEventListener('click', () => { modifyQty(b.dataset.id, -1) }));
  cartItemsEl.querySelectorAll('.remove').forEach(b => b.addEventListener('click', () => { removeItem(b.dataset.id) }));
}

function modifyQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  saveCart();
  renderCart();
}

function removeItem(id) {
  delete cart[id];
  saveCart();
  renderCart();
}

function addToCart(product) {
  if (!cart[product.id]) cart[product.id] = { ...product, qty: 0 };
  cart[product.id].qty += 1;
  saveCart();
  renderCart();
}

function showToast(message, timeout = 2800) {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.innerHTML = `<span class="icon">🛒</span><div>${message}</div><button class="close" aria-label="Đóng">✖</button>`;
  toastEl.classList.remove('hidden');
  toastEl.classList.add('show');
  const closeBtn = toastEl.querySelector('.close');
  const hide = () => { toastEl.classList.remove('show'); toastEl.classList.add('hide'); setTimeout(() => toastEl.classList.add('hidden'), 320); };
  closeBtn.addEventListener('click', hide, { once: true });
  clearTimeout(toastEl._t);
  toastEl._t = setTimeout(hide, timeout);
}

function renderPrice(product) {
  if (product.originalPrice) {
    return `
      <div class="price-container">
        <span class="original-price">${fmt(product.originalPrice)}</span>
        <span class="final-price">${fmt(product.price)}</span>
      </div>
    `;
  }
  return `<div class="price">${fmt(product.price)}</div>`;
}

function renderFeaturedProduct() {
  if (!FEATURED_PRODUCT || !featuredProductEl) return;
  const p = FEATURED_PRODUCT;
  const thumbsHtml = p.images && p.images.length > 1
    ? `<div class="thumbs">` + p.images.map((src, i) => `<img class="thumb" data-src="${src}" src="${src}" alt="thumb-${i}" loading="lazy" />`).join('') + `</div>`
    : '';

  featuredProductEl.innerHTML = `
    <div class="featured-product-container">
      <div class="featured-gallery">
        ${p.originalPrice ? `<div class="discount-badge">-${DISCOUNT_FOR_NEW_CUSTOMER}%</div>` : ''}
        <img src="${p.images[0]}" alt="${p.title}" class="main-image" data-main="true" />
        ${thumbsHtml}
      </div>
      <div class="featured-details">
        <div class="tag">Sản phẩm nổi bật</div>
        <h2>${p.title}</h2>
        <p class="desc">${p.desc}</p>
        <div class="price-section">${renderPrice(p)}</div>
        <p><strong>Màu sắc có sẵn:</strong> ${p.colors.join(', ')}</p>
        <button class="btn-primary add-btn" data-id="${p.id}">Thêm vào giỏ</button>
      </div>
    </div>
  `;

  featuredProductEl.querySelector('.add-btn').addEventListener('click', () => {
    addToCart(p);
    showToast(p.title + ' đã được thêm vào giỏ');
  });

  const mainImg = featuredProductEl.querySelector('img[data-main]');
  const thumbs = Array.from(featuredProductEl.querySelectorAll('.thumbs .thumb'));
  if (mainImg && thumbs.length > 0) {
    thumbs.forEach((t, i) => {
      t.tabIndex = 0;
      if (i === 0) t.classList.add('active');
      t.addEventListener('click', () => {
        mainImg.src = t.dataset.src;
        thumbs.forEach(x => x.classList.remove('active'));
        t.classList.add('active');
      });
    });
  }
}

function renderProducts(list) {
  productsGrid.innerHTML = '';
  list.forEach(p => {
    const el = document.createElement('article');
    el.className = 'product-card';
    const imageHtml = `<div class="product-image"><img src="${p.img || ''}" alt="${p.title}" loading="lazy" /></div>`;
    const badgeHtml = p.originalPrice ? `<div class="discount-badge">-${DISCOUNT_FOR_NEW_CUSTOMER}%</div>` : '';

    el.innerHTML = `
      ${badgeHtml}
      ${imageHtml}
      <div class="product-title">${p.title}</div>
      <div class="product-desc">${p.desc}</div>
      <div class="product-footer">
        <div class="tag">${p.colors ? 'Màu: ' + p.colors.join(', ') : 'Sản phẩm Đa năng'}</div>
        <div style="text-align:right">
          ${renderPrice(p)}
          <div style="margin-top:8px"><button class="btn-primary add-btn" data-id="${p.id}">Thêm vào giỏ</button></div>
        </div>
      </div>
    `;
    productsGrid.appendChild(el);
  });

  productsGrid.querySelectorAll('.add-btn').forEach(b => {
    const id = b.dataset.id;
    const prod = PROCESSED_PRODUCTS.find(x => x.id === id);
    b.addEventListener('click', () => {
      addToCart(prod);
      showToast(prod.title + ' đã được thêm vào giỏ');
    });
  });
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) return renderProducts(OTHER_PRODUCTS);
  const filtered = OTHER_PRODUCTS.filter(p => (p.title + ' ' + p.desc).toLowerCase().includes(q));
  renderProducts(filtered);
});

cartBtn.addEventListener('click', () => { cartModal.classList.remove('hidden'); renderCart(); });
closeCart.addEventListener('click', () => cartModal.classList.add('hidden'));
clearCartBtn.addEventListener('click', () => { cart = {}; saveCart(); renderCart(); });

checkoutBtn.addEventListener('click', () => {
  cartModal.classList.add('hidden');
  checkoutModal.classList.remove('hidden');
});
closeCheckout.addEventListener('click', () => checkoutModal.classList.add('hidden'));
document.querySelectorAll('[data-close="confirm"]').forEach(b => b.addEventListener('click', () => confirmModal.classList.add('hidden')));

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData(checkoutForm);
  const order = {
    name: form.get('name'), phone: form.get('phone'), address: form.get('address'),
    method: form.get('method'), items: cart,
    total: Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0)
  };
  console.log('Order placed', order);

  localStorage.setItem('grandpet_has_ordered', 'true');

  cart = {};
  saveCart();
  checkoutModal.classList.add('hidden');
  confirmModal.classList.remove('hidden');
  document.getElementById('orderMsg').textContent = 'Cảm ơn ' + order.name + '! Đơn hàng của bạn (' + fmt(order.total) + ') đã được ghi nhận.';
  renderCart();
});

function initializeApp() {
  document.getElementById('year').textContent = new Date().getFullYear();

  const siteHeader = document.querySelector('.site-header');
  if (isNewCustomer && firstTimeBanner && siteHeader) {
    firstTimeBanner.classList.remove('hidden');
    
    // === SỬA LỖI TẠI ĐÂY ===
    // Đợi một chút để trình duyệt render banner rồi mới lấy chiều cao
    setTimeout(() => {
      const bannerHeight = firstTimeBanner.offsetHeight;
      siteHeader.style.top = bannerHeight + 'px';
    }, 0);
  }

  renderFeaturedProduct();
  renderProducts(OTHER_PRODUCTS);
  renderCart();
}

initializeApp();
