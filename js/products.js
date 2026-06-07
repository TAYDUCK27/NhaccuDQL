/* ==========================================================================
   PRODUCTS JAVASCRIPT - XỬ LÝ MODAL CHI TIẾT SẢN PHẨM, GIỎ HÀNG VÀ HIỆU ỨNG GALAXY
   ========================================================================== */

// Tham chiếu đến các thành phần HTML của hộp thoại chi tiết sản phẩm (Modal)
const modal = document.getElementById('productModal'); // Khung che phủ mờ (overlay) và nội dung modal
const closeModal = document.querySelector('.close-modal'); // Nút dấu X dùng để đóng modal

/**
 * 1. Hàm bật/tắt hiển thị hộp thoại Modal (Toggle Modal View):
 * @param {boolean} show - Nhận giá trị true (hiển thị modal) hoặc false (ẩn modal).
 */
const toggleModal = (show) => {
    // Thêm class 'show' nếu show = true, ngược lại gỡ class 'show' nếu show = false
    modal.classList.toggle('show', show);
    
    // Khoá/Mở cuộn trang chính: Khi mở modal (show = true) thì khóa thanh cuộn nền trang (overflow = hidden)
    // Khi đóng modal (show = false) thì cho phép cuộn trang bình thường trở lại (overflow = auto)
    document.body.style.overflow = show ? 'hidden' : 'auto';
};

// Hàm tiện ích nhanh đóng modal bằng cách gọi toggleModal(false)
const closeModalFn = () => toggleModal(false);

// Đăng ký sự kiện click chuột vào nút dấu X để đóng modal
closeModal?.addEventListener('click', closeModalFn);

/**
 * Đăng ký sự kiện đóng modal tự động trong 2 trường hợp:
 * - Khi click chuột vào vùng phủ đen bên ngoài khung chứa nội dung modal (e.target === modal)
 * - Khi người dùng nhấn phím Esc (Escape) trên bàn phím máy tính
 */
modal?.addEventListener('click', (e) => e.target === modal && closeModalFn());
document.addEventListener('keydown', (e) => e.key === 'Escape' && modal?.classList.contains('show') && closeModalFn());

/**
 * 2. Sự kiện Click vào thẻ sản phẩm để Mở Modal chi tiết (Open Product Details Modal):
 * Sử dụng kỹ thuật ủy quyền sự kiện (Event Delegation) lắng nghe click toàn trang,
 * lọc ra các cú click vào thẻ sản phẩm (.product-card) trừ các nút thao tác trực tiếp.
 */
document.addEventListener('click', (e) => {
    // Kiểm tra xem vị trí click chuột có thuộc về thẻ sản phẩm nào không
    const card = e.target.closest('.product-card');
    
    // Nếu click ra ngoài thẻ sản phẩm HOẶC click trúng vào các nút mua hàng/yêu thích (.product-actions) thì dừng xử lý
    if (!card || e.target.closest('.product-actions')) return;
    
    // Lấy thông tin ảnh đại diện sản phẩm trên thẻ
    const imgEl = card.querySelector('.product-emoji img');
    const imgSrc = imgEl?.src || '';
    const imgAlt = imgEl?.alt || 'Sản Phẩm';
    
    // Thu thập toàn bộ dữ liệu văn bản từ thẻ sản phẩm đã chọn
    const data = {
        category: card.querySelector('.product-category')?.textContent || 'Nhạc Cụ',
        name: card.querySelector('.product-name')?.textContent || 'Sản Phẩm',
        price: card.querySelector('.product-price')?.textContent || '0 ₫',
        desc: card.querySelector('.product-desc')?.textContent || 'Mô tả sản phẩm',
        rating: card.querySelector('.product-rating')?.innerHTML || '⭐⭐⭐⭐⭐'
    };
    
    // Tiến hành gán (render) dữ liệu thu thập được vào các thẻ tương ứng trong hộp thoại Modal
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalTitle').textContent = data.name;
    document.getElementById('modalPrice').textContent = data.price;
    document.getElementById('modalDesc').textContent = data.desc;
    document.getElementById('modalRating').innerHTML = data.rating;
    
    // Lấy thẻ hiển thị ảnh trong modal và khung chứa ảnh đại diện của modal
    const modalImg = document.getElementById('modalImageImg');
    const imgContainer = document.getElementById('modalImage');
    
    // Lưu tạm tên sản phẩm vào dataset của ảnh để phục vụ việc lưu vào giỏ sau này
    modalImg.dataset.productName = imgAlt;
    // Gán đường dẫn ảnh mới từ thẻ sản phẩm vào ảnh trong modal
    modalImg.src = imgSrc;
    
    // Xử lý nạp ảnh hoặc fallback hiển thị chữ/emoji nếu thiếu ảnh thật
    if (!imgSrc) {
        modalImg.style.display = 'none'; // Ẩn thẻ ảnh chính đi
        // Dựng một thẻ hiển thị chữ lớn của hãng/biểu tượng để lấp đầy khoảng trống
        imgContainer.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:#1a0033; border-radius:10px; color:#9d9dff; font-size:48px;">${imgAlt}</div>`;
    } else {
        modalImg.style.display = 'block'; // Hiển thị thẻ ảnh chính
        imgContainer.innerHTML = '';      // Xóa các mã HTML fallback cũ
        imgContainer.appendChild(modalImg); // Đưa ảnh sản phẩm thực vào khung chứa
    }
    
    // 3. Tiêm hiệu ứng xoay ngân hà (galaxy effect) cho hình ảnh trong modal:
    if (typeof injectGalaxyEffectsForContainer === 'function') {
        injectGalaxyEffectsForContainer(imgContainer);
    }
    
    // Bật mở hiển thị hộp thoại modal
    toggleModal(true);
});

/**
 * 4. Sự kiện click nút "Thêm vào Giỏ" ngay trong hộp thoại Modal:
 * Thu thập dữ liệu hiện thời trên modal và đẩy vào giỏ hàng thông qua addProductToCart().
 */
document.getElementById('modalAddCart')?.addEventListener('click', () => {
    const product = {
        id: Date.now(), // ID ngẫu nhiên bằng thời gian hiện tại
        imgSrc: document.getElementById('modalImageImg').src,
        imgAlt: document.getElementById('modalImageImg').dataset.productName || 'Sản Phẩm',
        name: document.getElementById('modalTitle').textContent,
        price: document.getElementById('modalPrice').textContent,
        category: document.getElementById('modalCategory').textContent,
        // Lấy ký tự ngôi sao đầu tiên trong chuỗi đánh giá (loại bỏ phần số lượt xem)
        rating: document.getElementById('modalRating').textContent.split(' ')[0],
        qty: 1 // Mặc định số lượng thêm là 1
    };
    
    // Thêm sản phẩm này vào localStorage giỏ hàng
    addProductToCart(product);
    // Tự động đóng modal sau khi đã thêm xong
    closeModalFn();
});

/**
 * 5. Bật/tắt trạng thái nút Yêu Thích trong Modal (Modal Wishlist Toggle):
 * Thay đổi ký tự trái tim và văn bản của nút bấm từ "❤️ Yêu Thích" sang "🤍 Bỏ Yêu Thích" và ngược lại.
 */
document.getElementById('modalWishlist')?.addEventListener('click', (e) => {
    e.target.textContent = e.target.textContent === '❤️ Yêu Thích' ? '🤍 Bỏ Yêu Thích' : '❤️ Yêu Thích';
});

/**
 * 6. Sự kiện click thêm sản phẩm trực tiếp từ nút "Thêm vào giỏ" trên thẻ sản phẩm:
 * Lọc sự kiện click trúng nút có class '.btn-add-cart'.
 */
document.addEventListener('click', (e) => {
    if (!e.target.closest('.btn-add-cart')) return;
    
    // Tìm thẻ sản phẩm bao bọc nút bấm này
    const card = e.target.closest('.product-card');
    
    // Trích xuất dữ liệu từ thẻ và gọi hàm thêm vào giỏ hàng
    addProductToCart(extractProductData(card));
});

/**
 * 7. Bật/tắt nút yêu thích hình trái tim trực tiếp trên thẻ sản phẩm:
 * Chuyển trạng thái icon trái tim từ đỏ '❤️' sang trắng '🤍' và ngược lại.
 */
document.addEventListener('click', (e) => {
    if (!e.target.closest('.btn-wishlist')) return;
    e.target.textContent = e.target.textContent === '❤️' ? '🤍' : '❤️';
});

/**
 * 8. Lọc sản phẩm theo danh mục (Category Filter Active Toggle & Product Filtering):
 * - Đánh dấu chuyên mục được chọn bằng cách xóa class active ở các danh mục khác và thêm active vào danh mục hiện tại.
 * - Lọc và hiển thị các sản phẩm thuộc danh mục tương ứng trong danh sách sản phẩm.
 */
document.addEventListener('click', (e) => {
    const catItem = e.target.closest('.category-item');
    if (!catItem) return;
    e.preventDefault(); // Ngăn chặn hành vi mặc định của thẻ link
    
    // Loại bỏ class 'active' khỏi toàn bộ các nút phân loại chuyên mục
    document.querySelectorAll('.category-item').forEach(cat => cat.classList.remove('active'));
    // Thêm class 'active' vào nút phân loại vừa được click
    catItem.classList.add('active');

    // Lấy tên danh mục từ thuộc tính data-category (ví dụ: all, string, keyboard, wind, percussion, accessories)
    const selectedCategory = catItem.dataset.category;
    
    // Lấy tất cả các thẻ sản phẩm (.product-card) trên trang chủ/kho sản phẩm thuộc phần lưới chính
    const productCards = document.querySelectorAll('.products-grid .product-card');

    // Bản đồ ánh xạ từ data-category sang các danh mục hiển thị trên thẻ sản phẩm (không dấu, viết thường để so khớp linh hoạt)
    const categoryMapping = {
        'all': [],
        'string': ['guitar acoustic', 'guitar electric', 'ukulele', 'violin', 'guitar'],
        'keyboard': ['piano điện', 'keyboard 61 phím', 'piano', 'keyboard'],
        'wind': ['nhạc cụ hơi', 'trumpet', 'wind'],
        'percussion': ['bộ trống', 'drums', 'trống'],
        'accessories': ['phụ kiện']
    };

    productCards.forEach(card => {
        // Lấy tên danh mục của sản phẩm hiện tại (ví dụ: "Guitar Acoustic")
        const productCatText = card.querySelector('.product-category')?.textContent.toLowerCase().trim() || '';
        
        if (selectedCategory === 'all') {
            // Nếu chọn "Tất Cả", hiển thị lại tất cả sản phẩm
            card.style.display = 'flex';
        } else {
            // Kiểm tra xem danh mục sản phẩm hiện tại có trùng khớp với danh mục được chọn hay không
            const allowedCategories = categoryMapping[selectedCategory] || [];
            const isMatch = allowedCategories.some(cat => productCatText.includes(cat));
            
            if (isMatch) {
                card.style.display = 'flex'; // Hiển thị sản phẩm trùng khớp
            } else {
                card.style.display = 'none'; // Ẩn sản phẩm không trùng khớp
            }
        }
    });
});

/**
 * 9. Sắp xếp danh sách sản phẩm (Sort select event):
 * Lắng nghe sự kiện người dùng thay đổi tiêu chí sắp xếp sản phẩm (Giá tăng dần, giảm dần...).
 */
document.querySelector('.sort-select')?.addEventListener('change', (e) => {
    // In tiêu chí sắp xếp ra tab console phục vụ việc phát triển tính năng lọc động sau này
    console.log('Sắp xếp theo:', e.target.value);
});

/* ==========================================================================
   THÊM HIỆU ỨNG GALAXY CHO HÌNH ẢNH SẢN PHẨM (DỰNG VÒNG XOAY NGÂN HÀ 3D TĨNH)
   ========================================================================== */

/**
 * Hàm tiêm cấu trúc hiệu ứng ngân hà bao gồm viền tinh vân sáng (nebula) và 3 vòng xoay vũ trụ chứa các hạt sao chuyển động
 * xung quanh hình ảnh sản phẩm.
 * @param {HTMLElement} container - Khung chứa hình ảnh cần áp dụng hiệu ứng.
 */
function injectGalaxyEffectsForContainer(container) {
    // Nếu khung rỗng hoặc đã được tiêm hiệu ứng ngân hà trước đó rồi thì bỏ qua để tránh trùng lặp
    if (!container || container.querySelector('.galaxy-container')) return;
    
    // Tìm phần tử chứa hình ảnh sản phẩm thật nằm bên trong khung
    const productEl = container.querySelector('.product-emoji');
    
    // Tạo phần tử cha đóng vai trò là vỏ bọc cho hiệu ứng: '.galaxy-container'
    const galaxy = document.createElement('div');
    galaxy.className = 'galaxy-container';
    
    // A. Tạo vòng sáng tinh vân nền (Nebula Glow)
    const nebula = document.createElement('div');
    nebula.className = 'nebula-glow';
    galaxy.appendChild(nebula);
    
    // B. Tạo Vòng ngân hà 1 (Phía sau ảnh):
    const ring1 = document.createElement('div');
    ring1.className = 'galaxy-ring ring-1';
    // Vòng lặp tạo 4 ngôi sao lấp lánh chạy xung quanh vòng
    for (let s = 1; s <= 4; s++) {
        const star = document.createElement('span');
        star.className = `galaxy-star star-${s}`;
        ring1.appendChild(star);
    }
    galaxy.appendChild(ring1);
    
    // C. Tạo Vòng ngân hà 3 (Phía sau cùng):
    const ring3 = document.createElement('div');
    ring3.className = 'galaxy-ring ring-3';
    for (let s = 1; s <= 4; s++) {
        const star = document.createElement('span');
        star.className = `galaxy-star star-${s}`;
        ring3.appendChild(star);
    }
    galaxy.appendChild(ring3);
    
    // D. Di chuyển (re-parent) hình ảnh sản phẩm vào trung tâm của hệ ngân hà vừa dựng
    if (productEl) {
        productEl.remove(); // Tách ảnh sản phẩm khỏi khung chứa cũ
        galaxy.appendChild(productEl); // Đưa vào làm tâm điểm của hệ ngân hà
    }
    
    // E. Tạo Vòng ngân hà 2 (Phía trước đè lên ảnh tạo chiều sâu 3D):
    const ring2 = document.createElement('div');
    ring2.className = 'galaxy-ring ring-2';
    for (let s = 1; s <= 4; s++) {
        const star = document.createElement('span');
        star.className = `galaxy-star star-${s}`;
        ring2.appendChild(star);
    }
    galaxy.appendChild(ring2);
    
    // F. Tiêm toàn bộ cấu trúc ngân hà ảo diệu này vào đầu khung chứa ảnh sản phẩm
    container.insertBefore(galaxy, container.firstChild);
}

/**
 * Tự động tiêm hiệu ứng ngân hà lung linh cho tất cả các thẻ hình ảnh sản phẩm trên trang
 */
function injectAllGalaxyEffects() {
    document.querySelectorAll('.product-image').forEach(container => {
        injectGalaxyEffectsForContainer(container);
    });
}

// Kiểm tra trạng thái tải tài liệu HTML để thực hiện tiêm hiệu ứng đúng thời điểm
if (document.readyState === 'loading') {
    // Nếu HTML vẫn đang tải, đợi sự kiện DOMContentLoaded
    document.addEventListener('DOMContentLoaded', injectAllGalaxyEffects);
} else {
    // Nếu HTML đã dựng xong hoàn toàn, chạy hàm tiêm ngay lập tức
    injectAllGalaxyEffects();
}

