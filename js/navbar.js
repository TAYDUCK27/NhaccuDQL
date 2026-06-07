/* ==========================================================================
   NAVBAR JAVASCRIPT - XỬ LÝ THANH ĐIỀU HƯỚNG DÍNH (STICKY) VÀ MENU DI ĐỘNG
   ========================================================================== */

// Khai báo các biến tham chiếu đến các phần tử HTML trên thanh điều hướng (Navbar)
const stickyNavbar = document.getElementById('stickyNavbar'); // Khung navbar chính
const navbarMenu = document.getElementById('navbarMenu');     // Danh sách các liên kết menu (Ul/Div)
const navbarToggle = document.getElementById('navbarToggle'); // Nút bật/tắt menu trên thiết bị di động (Hamburger Button)
const navbarLinks = document.querySelectorAll('.navbar-link'); // Tập hợp tất cả các thẻ liên kết điều hướng (.navbar-link)

/**
 * 1. Hiệu ứng cuộn trang (Scroll Effect):
 * Lắng nghe sự kiện người dùng cuộn chuột trên trang. 
 * Khi cuộn xuống quá 100 pixel, tự động thêm class 'scrolled' vào navbar để thay đổi màu nền hoặc bóng viền qua CSS.
 */
window.addEventListener('scroll', () => {
    // Nếu đối tượng stickyNavbar tồn tại, sử dụng toggle() để:
    // - Thêm class 'scrolled' nếu window.scrollY > 100 là true
    // - Xóa class 'scrolled' nếu window.scrollY > 100 là false (khi cuộn về đầu trang)
    stickyNavbar?.classList.toggle('scrolled', window.scrollY > 100);
});

/**
 * 2. Menu di động (Mobile Responsive Menu Toggle):
 * Khi người dùng click vào nút Hamburger (navbarToggle), bật/tắt class 'active' cho nút và thanh menu.
 * CSS sẽ dựa trên class 'active' để ẩn/hiển thị thanh menu theo dạng dropdown hoặc trượt từ cạnh vào.
 */
navbarToggle?.addEventListener('click', () => {
    // Bật/tắt class 'active' trên nút bấm để tạo hiệu ứng chuyển động nút hamburger (ví dụ: biến thành dấu X)
    navbarToggle.classList.toggle('active');
    // Bật/tắt class 'active' trên danh sách menu để kéo menu xuất hiện/biến mất
    navbarMenu.classList.toggle('active');
});

/**
 * 3. Tự động đóng menu khi chọn trang (Auto Close Menu):
 * Lặp qua tất cả các liên kết trong thanh điều hướng, khi click chọn một mục thì đóng menu di động ngay lập tức.
 * Điều này rất hữu ích đối với trang dạng Single Page hoặc khi người dùng click để cuộn đến một phần trên cùng trang.
 */
navbarLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Gỡ bỏ class 'active' để thu gọn menu và chuyển nút bấm trở lại trạng thái hamburger ban đầu
        navbarToggle?.classList.remove('active');
        navbarMenu?.classList.remove('active');
    });
});

/**
 * 4. Đóng menu khi click ra ngoài vùng chứa (Click Outside to Close):
 * Theo dõi hành động click chuột của người dùng trên toàn bộ trang tài liệu.
 * Nếu menu đang mở và người dùng click vào một khu vực bất kỳ bên ngoài thanh điều hướng, menu sẽ tự động đóng lại.
 */
document.addEventListener('click', (e) => {
    // Kiểm tra xem vị trí click chuột (e.target) có nằm bên trong hoặc thuộc nhóm con của '.sticky-navbar' hay không.
    // Nếu click ra ngoài (closest trả về null) VÀ menu di động đang hiển thị (có class 'active')
    if (!e.target.closest('.sticky-navbar') && navbarMenu?.classList.contains('active')) {
        // Thực hiện đóng menu
        navbarToggle?.classList.remove('active');
        navbarMenu?.classList.remove('active');
    }
});

/**
 * 5. Tự động làm nổi bật menu tương ứng với trang đang hiển thị (Active Nav Link Highlighter):
 * Hàm này phân tích URL hiện tại trên thanh địa chỉ của trình duyệt, so sánh với đường dẫn (href) của từng thẻ liên kết,
 * và thêm class 'active' vào liên kết tương ứng giúp người dùng nhận biết họ đang ở trang nào.
 */
function setActiveNavLink() {
    // Lấy phần đường dẫn thư mục của URL hiện tại (Ví dụ: "/pages/products.html")
    const path = window.location.pathname;
    
    // Lặp qua tất cả các liên kết trong danh sách navbar
    navbarLinks.forEach(link => {
        // Tạm thời xóa class 'active' cũ đi để reset trạng thái
        link.classList.remove('active');
        
        // Lấy giá trị của thuộc tính href (Ví dụ: "products.html" hoặc "../pages/products.html")
        const href = link.getAttribute('href');
        
        // Nếu href tồn tại và đường dẫn URL hiện tại chứa phần tên file cuối cùng của href
        // (ví dụ: "/pages/products.html" có chứa "products.html")
        if (href && path.includes(href.split('/').pop())) {
            // Thêm class 'active' để tô màu nổi bật cho menu đó
            link.classList.add('active');
        }
    });

    // Trường hợp đặc biệt: Nếu người dùng đang ở trang chủ (index.html) hoặc ở thư mục gốc của dự án
    if (path.includes('index.html') || path.endsWith('/music-instruments/')) {
        // Mặc định tô sáng liên kết đầu tiên (Liên kết Trang Chủ)
        navbarLinks[0]?.classList.add('active');
    }
}

// 6. Lắng nghe sự kiện tải trang hoàn tất để chạy hàm đánh dấu menu active
document.addEventListener('DOMContentLoaded', setActiveNavLink);

