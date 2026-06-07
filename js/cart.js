/* ==========================================================================
   CART JAVASCRIPT - QUẢN LÝ VÀ XỬ LÝ HÀNH VI CỦA GIỎ HÀNG (SỬ DỤNG LOCALSTORAGE)
   ========================================================================== */

// Truy vấn các thành phần HTML chính trong giao diện giỏ hàng
const container = document.getElementById('cartItemsContainer'); // Khung chứa danh sách thẻ sản phẩm trong giỏ
const emptyMsg = container?.nextElementSibling;                // Thẻ thông báo giỏ hàng trống (thường là thẻ tiếp theo ngay sau container)
const summarySection = document.querySelector('.cart-summary-section'); // Khung hiển thị tổng kết hóa đơn thanh toán

/**
 * 1. Hàm xóa toàn bộ dữ liệu giỏ hàng (Clear Cart):
 * Hỏi ý kiến người dùng trước khi tiến hành xóa sạch bộ nhớ lưu trữ giỏ hàng.
 */
function clearOldCart() {
    // Hiển thị hộp thoại xác nhận (confirm popup) của trình duyệt
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu giỏ hàng cũ?')) {
        // Xóa khóa 'cartItems' khỏi bộ nhớ localStorage
        localStorage.removeItem('cartItems');
        // Tải lại trang hiện tại để cập nhật giao diện mới trống rỗng
        location.reload();
    }
}

/**
 * 2. Cập nhật số lượng và tính toán lại tiền của từng mặt hàng (Update Quantity):
 * @param {HTMLInputElement} input - Phần tử <input> chứa số lượng của sản phẩm vừa thay đổi.
 */
function updateQty(input) {
    // Tìm thẻ cha gần nhất của input có class '.cart-item' để định vị đúng dòng sản phẩm
    const card = input.closest('.cart-item');
    
    // Lấy giá trị đơn giá sản phẩm dưới dạng số nguyên bằng cách đọc chuỗi văn bản giá rồi lọc số qua getPrice()
    const price = getPrice(card.querySelector('.cart-item-price').textContent);
    
    // Đọc số lượng hiện tại từ ô input và chuyển sang kiểu số nguyên (parseInt)
    const qty = parseInt(input.value);
    
    // Tính Thành tiền = Đơn giá * Số lượng, sau đó định dạng thành tiền VNĐ và cập nhật vào cột Thành tiền tương ứng
    card.querySelector('.cart-item-subtotal').textContent = formatPrice((price * qty).toString());
    
    // Gọi hàm tính toán lại tổng hóa đơn thanh toán cho toàn bộ giỏ hàng
    updateCartSummary();
}

/**
 * 3. Nút tăng số lượng (Increase Quantity button):
 * Tăng số lượng sản phẩm lên 1 đơn vị, tối đa là 10.
 * @param {HTMLButtonElement} btn - Nút '+' được click.
 */
window.increaseQty = (btn) => {
    // Tìm ô nhập liệu số lượng (<input>) nằm ngay trước nút '+' trong cấu trúc HTML (previousElementSibling)
    const input = btn.previousElementSibling;
    
    // Tăng giá trị ô input lên 1 nhưng không vượt quá 10 (Math.min)
    input.value = Math.min(parseInt(input.value) + 1, 10);
    
    // Kích hoạt hàm cập nhật để tính lại thành tiền và tổng hóa đơn
    updateQty(input);
};

/**
 * 4. Nút giảm số lượng (Decrease Quantity button):
 * Giảm số lượng sản phẩm đi 1 đơn vị, tối thiểu là 1.
 * @param {HTMLButtonElement} btn - Nút '−' được click.
 */
window.decreaseQty = (btn) => {
    // Tìm ô nhập liệu số lượng (<input>) nằm ngay sau nút '−' trong cấu trúc HTML (nextElementSibling)
    const input = btn.nextElementSibling;
    
    // Giảm giá trị ô input đi 1 nhưng đảm bảo không nhỏ hơn 1 (Math.max)
    input.value = Math.max(parseInt(input.value) - 1, 1);
    
    // Kích hoạt hàm cập nhật để tính lại thành tiền và tổng hóa đơn
    updateQty(input);
};

/**
 * 5. Xóa một sản phẩm cụ thể khỏi giỏ hàng (Remove Item):
 * @param {string} name - Tên của sản phẩm cần xóa.
 */
window.removeItem = (name) => {
    // Hiển thị hộp thoại hỏi để tránh người dùng ấn nhầm nút xóa
    if (!confirm('Xóa sản phẩm này?')) return;
    
    // Đọc danh sách giỏ hàng hiện tại dưới dạng mảng
    let cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Lọc bỏ sản phẩm có tên trùng khớp khỏi mảng giỏ hàng (giữ lại các sản phẩm khác)
    cart = cart.filter(item => item.name !== name);
    
    // Lưu lại mảng giỏ hàng mới sau khi lọc vào localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Nạp lại dữ liệu giỏ hàng để cập nhật lại toàn bộ giao diện HTML
    loadCartFromStorage();
};

/**
 * 6. Cập nhật và tính toán lại tổng hóa đơn thanh toán giỏ hàng (Update Cart Summary):
 * Tính tổng số lượng hàng hóa và tổng tiền cần thanh toán, sau đó lưu lại vào localStorage.
 */
function updateCartSummary() {
    let total = 0; // Biến tích lũy tổng tiền
    let qty = 0;   // Biến tích lũy tổng số lượng sản phẩm
    
    // Đọc danh sách giỏ hàng hiện tại từ bộ nhớ trình duyệt
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Lặp qua từng thẻ sản phẩm đang hiển thị trên giao diện HTML
    container.querySelectorAll('.cart-item').forEach((item, index) => {
        // Lấy số lượng thực tế từ ô nhập liệu của thẻ sản phẩm đó
        const itemQty = parseInt(item.querySelector('.qty-input').value);
        qty += itemQty; // Cộng dồn số lượng
        
        // Lấy đơn giá của thẻ sản phẩm đó, nhân với số lượng và cộng dồn vào tổng tiền thanh toán
        total += getPrice(item.querySelector('.cart-item-price').textContent) * itemQty;
        
        // Đồng bộ hóa giá trị số lượng mới vào đúng phần tử trong mảng dữ liệu gốc (cartItems) để lưu trữ chính xác
        if (cartItems[index]) {
            cartItems[index].qty = itemQty;
        }
    });
    
    // Tìm các phần tử hiển thị tổng số sản phẩm và tổng tiền trong khung tổng kết hóa đơn
    const label = document.querySelector('.summary-row:first-of-type .summary-label');
    const value = document.querySelector('.summary-row:first-of-type .summary-value');
    
    // Cập nhật văn bản hiển thị (Ví dụ: "Tổng cộng (3 sản phẩm):")
    if (label) label.textContent = `Tổng cộng (${qty} sản phẩm):`;
    // Cập nhật số tiền đã được định dạng VNĐ (Ví dụ: "5.400.000 ₫")
    if (value) value.textContent = formatPrice(total.toString());
    
    // Ghi đè mảng giỏ hàng với thông tin số lượng mới nhất vào localStorage để đồng bộ dữ liệu
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

/**
 * 7. Nạp dữ liệu giỏ hàng từ localStorage và render giao diện HTML (Load Cart):
 * Nếu giỏ hàng trống, hiển thị thông báo trống. Ngược lại dựng cấu trúc HTML cho từng sản phẩm.
 */
function loadCartFromStorage() {
    // Đọc dữ liệu giỏ hàng
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    // Kiểm tra xem giỏ hàng có bị rỗng hay không
    const isEmpty = !cart || cart.length === 0;
    
    if (isEmpty) {
        // Nếu rỗng:
        container.innerHTML = '';          // Làm rỗng giao diện container
        container.style.display = 'none';   // Ẩn khung danh sách sản phẩm đi
        emptyMsg.style.display = 'block';   // Hiển thị thông báo "Giỏ hàng của bạn đang trống"
        summarySection.style.display = 'none'; // Ẩn phần tổng kết hóa đơn thanh toán
        return;
    }

    // Nếu có sản phẩm: Tạo chuỗi HTML đại diện cho từng sản phẩm bằng hàm map() và ghép lại bằng join('')
    container.innerHTML = cart.map(item => `
        <div class="cart-item">
            <!-- Khung hiển thị ảnh sản phẩm -->
            <div class="cart-item-image">
                <img src="${item.imgSrc || ''}" alt="${item.imgAlt || '🎵'}" style="max-width:100%; max-height:60px;">
            </div>
            <!-- Khung hiển thị thông tin sản phẩm -->
            <div class="cart-item-info">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-category">${item.category}</p>
                <div class="cart-item-rating"><span>${item.rating}</span></div>
            </div>
            <!-- Giá của một sản phẩm -->
            <div class="cart-item-price">${item.price}</div>
            <!-- Bộ điều khiển số lượng (nút giảm, ô nhập số, nút tăng) -->
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="decreaseQty(this)">−</button>
                <input type="number" class="qty-input" value="${item.qty}" min="1" max="10">
                <button class="qty-btn" onclick="increaseQty(this)">+</button>
            </div>
            <!-- Cột tính thành tiền của sản phẩm này (Giá * Số lượng) -->
            <div class="cart-item-subtotal">${formatPrice((getPrice(item.price) * item.qty).toString())}</div>
            <!-- Nút xóa sản phẩm khỏi giỏ hàng nhanh bằng icon thùng rác -->
            <button class="cart-item-remove" onclick="removeItem('${item.name}')">🗑️</button>
        </div>
    `).join('');

    // Hiển thị lại các khung chứa giao diện chính xác sau khi đã dựng xong HTML
    container.style.display = 'flex';
    emptyMsg.style.display = 'none';
    summarySection.style.display = 'block';
    
    // Chạy tính toán tổng số tiền lần đầu tiên sau khi nạp giỏ hàng
    updateCartSummary();
}

// 8. Đăng ký sự kiện nạp giỏ hàng tự động ngay khi tài liệu HTML tải xong
window.addEventListener('DOMContentLoaded', loadCartFromStorage);

