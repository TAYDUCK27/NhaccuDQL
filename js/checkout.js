/* ==========================================================================
   CHECKOUT JAVASCRIPT - XỬ LÝ QUY TRÌNH VÀ GIAO DIỆN THANH TOÁN ĐƠN HÀNG
   ========================================================================== */

/**
 * 1. Hàm nạp danh sách sản phẩm cần mua từ giỏ hàng và kết xuất ra giao diện (Load Order Items):
 * Đọc mảng sản phẩm lưu trong localStorage, hiển thị hình ảnh, tên, số lượng, giá và tính tổng hóa đơn cuối cùng.
 */
function loadOrderItems() {
    // Truy vấn khung HTML chứa danh sách sản phẩm trong hóa đơn đặt hàng
    const container = document.getElementById('orderItemsContainer');
    
    // Đọc giỏ hàng từ localStorage. Nếu không có thì gán mảng rỗng '[]'
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Nếu giỏ hàng trống:
    if (!cart.length) {
        // Đưa thông báo giỏ hàng trống lên màn hình
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: #9d9dff;">Giỏ hàng trống.</p>';
        // Gán tổng tiền thanh toán hiển thị là 0 đ
        document.getElementById('totalPayment').textContent = '0 ₫';
        return;
    }

    // Nếu có sản phẩm: Tạo cấu trúc HTML cho từng mặt hàng trong đơn hàng
    container.innerHTML = cart.map(item => `
        <div class="order-item">
            <!-- Ảnh sản phẩm -->
            <span class="order-item-emoji">
                <img src="${item.imgSrc || ''}" alt="${item.imgAlt || '🎵'}" style="max-width:60px; max-height:60px;">
            </span>
            <!-- Chi tiết tên và số lượng đặt hàng -->
            <div class="order-item-details">
                <span class="order-item-name">${item.name}</span>
                <span class="order-item-qty">Số lượng: ${item.qty}</span>
            </div>
            <!-- Giá tiền của sản phẩm đó -->
            <span class="order-item-price">${item.price}</span>
        </div>
    `).join('');
    
    // 2. Tính toán tổng hóa đơn thanh toán:
    let total = 0;
    // Lặp qua từng sản phẩm để tính tổng = Đơn giá * Số lượng
    cart.forEach(item => {
        total += getPrice(item.price) * (item.qty || 1);
    });
    
    // Hiển thị tổng số tiền đã được định dạng VNĐ chuẩn lên giao diện
    document.getElementById('totalPayment').textContent = formatPrice(total.toString());
}

// 3. Đăng ký sự kiện nạp đơn hàng tự động ngay khi tài liệu HTML tải xong
window.addEventListener('DOMContentLoaded', loadOrderItems);

/**
 * 4. Ẩn/Hiện Form thông tin Thẻ tín dụng (Dynamic Payment Form):
 * Lắng nghe thay đổi của các nút chọn (radio buttons) phương thức thanh toán.
 * Nếu chọn thanh toán bằng thẻ tín dụng (credit) thì hiển thị form điền thông tin thẻ, ngược lại thì ẩn đi.
 */
document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener('change', function() {
        // Tìm khung điền thông tin thẻ tín dụng
        const form = document.getElementById('creditCardForm');
        if (form) {
            // Nếu giá trị radio được chọn là 'credit', hiển thị form dạng block, ngược lại ẩn đi (none)
            form.style.display = this.value === 'credit' ? 'block' : 'none';
        }
    });
});

/**
 * 5. Xử lý sự kiện gửi biểu mẫu đặt hàng (Form Submit Handling):
 * Khi người dùng click nút "Đặt Hàng" và toàn bộ dữ liệu hợp lệ, ngăn chặn tải lại trang mặc định
 * và đưa ra thông báo đặt hàng thành công.
 */
document.getElementById('checkoutForm')?.addEventListener('submit', (e) => {
    // Ngăn chặn trình duyệt thực hiện hành vi submit mặc định (tải lại trang hoặc chuyển trang)
    e.preventDefault();
    
    // Hiển thị popup thông báo đặt hàng thành công tới khách hàng
    alert('✨ Đặt hàng thành công!');
});

