/* ==========================================================================
   UTILS JAVASCRIPT - CÁC HÀM TIỆN ÍCH DÙNG CHUNG TOÀN HỆ THỐNG
   ========================================================================== */

/**
 * Hiển thị thông báo Toast (một hộp nhỏ tự động biến mất) ở góc dưới cùng bên phải màn hình.
 * @param {string} message - Nội dung thông báo muốn hiển thị.
 * @param {number} [duration=2000] - Thời gian hiển thị thông báo trước khi biến mất (mili-giây), mặc định là 2 giây.
 */
function showToast(message, duration = 2000) {
    // Tạo phần tử <div> trong DOM đại diện cho thẻ thông báo
    const toast = document.createElement('div');
    
    // Gán nội dung văn bản cho hộp thông báo
    toast.textContent = message;
    
    // Thiết lập trực tiếp phong cách (CSS) cho hộp thông báo qua thuộc tính cssText
    // - Vị trí cố định (position: fixed) ở góc dưới bên phải (bottom: 20px, right: 20px)
    // - Nền màu xanh lá cây hơi mờ (rgba 100, 200, 100, 0.9) phối chữ trắng
    // - Lớp hiển thị cao nhất (z-index: 999) để đè lên mọi phần tử khác trên trang
    // - Chạy hoạt ảnh slideIn (bay từ mép vào) trong 0.3 giây
    toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: rgba(100, 200, 100, 0.9); color: white; padding: 12px 20px; border-radius: 8px; z-index: 999; animation: slideIn 0.3s ease;';
    
    // Thêm thẻ thông báo vừa tạo vào cuối thẻ <body> để hiển thị lên màn hình thực tế
    document.body.appendChild(toast);
    
    // Thiết lập hẹn giờ để ẩn thông báo sau khi hết thời lượng hiển thị
    setTimeout(() => {
        // Áp dụng animation biến mất slideOut (trượt ngược ra ngoài)
        toast.style.animation = 'slideOut 0.3s ease';
        
        // Chờ 300ms (bằng thời gian chạy hoạt ảnh slideOut) để gỡ bỏ hoàn toàn thẻ khỏi cấu trúc DOM
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Định dạng một chuỗi hoặc số biểu thị giá thành định dạng tiền tệ Việt Nam (VNĐ).
 * Ví dụ: "1500000" hoặc "1.500.000đ" -> "1.500.000 ₫"
 * @param {string} priceStr - Chuỗi giá trị đầu vào chứa số cần định dạng.
 * @returns {string} Chuỗi giá đã định dạng kèm ký hiệu '₫'.
 */
function formatPrice(priceStr) {
    // Bước 1: Loại bỏ tất cả các ký tự không phải là chữ số bằng biểu thức chính quy (Regex: [^0-9])
    // và chuyển đổi chuỗi số còn lại thành số nguyên (parseInt)
    const numPrice = parseInt(priceStr.replace(/[^0-9]/g, ''));
    
    // Bước 2: Sử dụng toLocaleString với mã ngôn ngữ 'vi-VN' để tự động thêm dấu phân cách hàng nghìn (dấu chấm)
    // và nối thêm ký hiệu '₫' ở cuối
    return numPrice.toLocaleString('vi-VN') + ' ₫';
}

/**
 * Trích xuất và chuyển đổi chuỗi giá cả thành giá trị số nguyên nguyên bản để thực hiện các phép toán cộng trừ nhân chia.
 * Ví dụ: "1.200.000 ₫" -> 1200000
 * @param {string} priceStr - Chuỗi giá cả chứa ký tự chữ và ký hiệu tiền tệ.
 * @returns {number} Giá trị số nguyên tương ứng.
 */
function getPrice(priceStr) {
    // Tìm và loại bỏ bất kỳ ký tự nào không thuộc dải số từ 0 đến 9, sau đó chuyển chuỗi kết quả thành số nguyên
    return parseInt(priceStr.replace(/[^0-9]/g, ''));
}

/**
 * Thêm sản phẩm được chọn vào giỏ hàng và lưu trữ thông tin xuống bộ nhớ trình duyệt (localStorage).
 * @param {Object} product - Đối tượng chứa thông tin sản phẩm cần thêm.
 */
function addProductToCart(product) {
    // Lấy dữ liệu giỏ hàng hiện tại từ bộ nhớ localStorage có tên là 'cartItems'.
    // Nếu chưa từng có giỏ hàng, khởi tạo một chuỗi mảng rỗng '[]', sau đó chuyển đổi từ chuỗi JSON sang mảng JS.
    let cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Tìm kiếm xem sản phẩm này đã có sẵn trong giỏ hàng hay chưa dựa vào tên trùng khớp
    const existing = cart.find(item => item.name === product.name);
    
    if (existing) {
        // Nếu đã tồn tại, tăng số lượng lên 1. 
        // Dùng Math.min để giới hạn số lượng tối đa cho mỗi sản phẩm là 10 cái nhằm tránh quá tải đơn hàng.
        existing.qty = Math.min(existing.qty + 1, 10);
    } else {
        // Nếu chưa tồn tại, đưa sản phẩm mới này vào mảng giỏ hàng
        cart.push(product);
    }
    
    // Chuyển mảng giỏ hàng vừa cập nhật thành chuỗi JSON và lưu đè ngược lại vào localStorage
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    // Hiển thị một thông báo Toast nhỏ báo hiệu đã thêm thành công
    showToast('✓ Đã thêm vào giỏ hàng!');
}

/**
 * Trích xuất toàn bộ dữ liệu thuộc tính của sản phẩm từ một thẻ HTML đại diện sản phẩm (.product-card).
 * Hàm này dùng khi nhấn "Thêm vào giỏ" ngay trên danh sách sản phẩm.
 * @param {HTMLElement} card - Thẻ HTML chứa thông tin sản phẩm.
 * @returns {Object} Đối tượng chứa các trường thông tin chuẩn của sản phẩm.
 */
function extractProductData(card) {
    // Tìm thẻ <img> chứa ảnh đại diện sản phẩm trong khung emoji/hình ảnh
    const imgEl = card.querySelector('.product-emoji img');
    
    return {
        // Tạo một ID duy nhất bằng dấu mốc thời gian hiện tại (miliseconds)
        id: Date.now(),
        // Lấy đường dẫn ảnh, nếu không có ảnh thì trả về chuỗi rỗng
        imgSrc: imgEl?.src || '',
        // Lấy nội dung mô tả ảnh (alt), mặc định là 'Sản Phẩm' nếu rỗng
        imgAlt: imgEl?.alt || 'Sản Phẩm',
        // Lấy biểu tượng emoji phòng hờ (fallback) hiển thị nếu thiếu ảnh sản phẩm
        emoji: card.querySelector('.product-emoji')?.textContent || '🎵',
        // Lấy tên sản phẩm từ class '.product-name', mặc định là 'Sản phẩm' nếu không tìm thấy
        name: card.querySelector('.product-name')?.textContent || 'Sản phẩm',
        // Lấy giá sản phẩm dạng chuỗi văn bản, mặc định là '0 ₫'
        price: card.querySelector('.product-price')?.textContent || '0 ₫',
        // Lấy danh mục phân loại nhạc cụ
        category: card.querySelector('.product-category')?.textContent || 'Nhạc cụ',
        // Lấy điểm đánh giá sao (chỉ lấy phần ký tự ngôi sao, loại bỏ số lượt đánh giá đằng sau)
        rating: card.querySelector('.product-rating')?.textContent?.split(' ')[0] || '⭐',
        // Thiết lập số lượng khởi tạo mặc định là 1
        qty: 1
    };
}

/**
 * Tạo ra một danh sách các mẫu đường dẫn ảnh dự kiến cho một sản phẩm dựa trên tên của nó.
 * Điều này giúp tăng độ linh hoạt khi nạp ảnh (hỗ trợ cả định dạng PNG, SVG, tên viết hoa, viết thường, có khoảng cách hay viết liền).
 * @param {string} productName - Tên sản phẩm đầy đủ (Ví dụ: "Yamaha U3 Piano").
 * @returns {string[]} Mảng chứa các đường dẫn tương đối dự đoán tới tệp ảnh.
 */
function getImagePatterns(productName) {
    // Chuyển toàn bộ tên sản phẩm thành chữ thường và cắt bỏ khoảng trắng thừa ở hai đầu
    const name = productName.toLowerCase().trim();
    
    // Tách từ đầu tiên đại diện cho hãng thương hiệu (ví dụ: "yamaha")
    const brand = name.split(' ')[0];
    
    // Tách từ thứ hai đại diện cho dòng máy (model) và loại bỏ các ký tự dấu gạch ngang hoặc khoảng trắng
    const model = (name.split(' ')[1] || '').replace(/[-\s]/g, '');
    
    // Viết hoa chữ cái đầu tiên của model và viết thường các chữ còn lại (Ví dụ: "u3" -> "U3")
    const modelCap = model.charAt(0).toUpperCase() + model.slice(1).toLowerCase();
    
    // Trả về danh sách các đường dẫn ảnh khả thi mà hệ thống có thể thử truy cập
    return [
        `../hinhanh/hinhanhsanpham/${brand}${modelCap}.png`, // Ví dụ: ../hinhanh/hinhanhsanpham/yamahaU3.png
        `../hinhanh/hinhanhsanpham/${brand}${modelCap}.svg`, // Ví dụ: ../hinhanh/hinhanhsanpham/yamahaU3.svg
        `../hinhanh/hinhanhsanpham/${brand}.png`,            // Ví dụ: ../hinhanh/hinhanhsanpham/yamaha.png
        `../hinhanh/hinhanhsanpham/${brand}.svg`,            // Ví dụ: ../hinhanh/hinhanhsanpham/yamaha.svg
        `../hinhanh/hinhanhsanpham/${name.replace(/\s+|-/g, '')}.png`, // Ghép liền toàn bộ tên sản phẩm dạng png
        `../hinhanh/hinhanhsanpham/${name.replace(/\s+|-/g, '')}.svg`, // Ghép liền toàn bộ tên sản phẩm dạng svg
    ];
}

/**
 * Hiển thị ký tự emoji khổ lớn ở trung tâm khung ảnh sản phẩm như một giải pháp thay thế (fallback) khi đường dẫn ảnh thật bị lỗi hoặc không tồn tại.
 * @param {HTMLElement} container - Khung chứa hình ảnh của sản phẩm.
 * @param {string} emoji - Ký tự biểu cảm cần hiển thị (ví dụ: '🎸', '🎹').
 */
function showEmojiImg(container, emoji) {
    // Kiểm tra xem đã có sẵn emoji thay thế cũ nào trong khung này chưa, nếu có thì xóa đi
    const existing = container.querySelector('.fallback-emoji');
    if (existing) existing.remove();
    
    // Tạo thẻ <div> mới để chứa ký tự emoji
    const fallback = document.createElement('div');
    fallback.className = 'fallback-emoji';
    fallback.textContent = emoji;
    
    // Thiết lập phong cách trực quan cho emoji: Kích thước cực đại (200px), 
    // căn giữa tuyệt đối theo cả hai chiều ngang và dọc (flexbox)
    fallback.style.cssText = 'font-size: 200px; display: flex; align-items: center; justify-content: center; cursor: default;';
    
    // Đưa thẻ emoji thay thế này vào bên trong khung ảnh sản phẩm
    container.appendChild(fallback);
}

