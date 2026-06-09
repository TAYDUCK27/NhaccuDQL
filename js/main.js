/* ==========================================================================
   MAIN JAVASCRIPT - CÁC TÍNH NĂNG TƯƠNG TÁC CHÍNH CỦA TRANG WEB
   ========================================================================== */

/**
 * Hàm khởi tạo và tạo ngẫu nhiên các ngôi sao nhấp nháy trên nền (hiệu ứng không gian vũ trụ).
 * Hàm này sẽ tìm thẻ chứa có class '.stars-container' và thêm 100 thẻ con đại diện cho các ngôi sao.
 */
function generateStars() {
    // Tìm phần tử HTML đóng vai trò làm khung chứa cho các ngôi sao
    const starsContainer = document.querySelector('.stars-container');
    
    // Nếu không tìm thấy container này trên trang hiện tại, dừng hàm để tránh lỗi
    if (!starsContainer) return;

    // Số lượng ngôi sao tối đa sẽ được tạo ra
    const starCount = 100;

    // Vòng lặp chạy 100 lần để tạo ra đúng 100 phần tử ngôi sao
    for (let i = 0; i < starCount; i++) {
        // Tạo một thẻ <div> mới trong bộ nhớ DOM để đại diện cho một ngôi sao
        const star = document.createElement('div');
        // Gán class cơ bản cho thẻ vừa tạo là 'star' để áp dụng các style CSS chung
        star.className = 'star';

        // Tạo một số ngẫu nhiên từ 0 đến dưới 1 để quyết định kích thước ngôi sao
        const sizeRandom = Math.random();
        
        // Phân loại kích thước ngôi sao dựa trên tỷ lệ ngẫu nhiên:
        // - 50% cơ hội là sao nhỏ (small)
        // - 30% cơ hội là sao vừa (medium)
        // - 20% cơ hội là sao lớn (large)
        if (sizeRandom < 0.5) {
            star.classList.add('small'); // Thêm class 'small' (CSS sẽ định kích thước nhỏ)
        } else if (sizeRandom < 0.8) {
            star.classList.add('medium'); // Thêm class 'medium' (CSS định kích thước vừa)
        } else {
            star.classList.add('large'); // Thêm class 'large' (CSS định kích thước lớn)
        }

        // Tạo tọa độ ngẫu nhiên từ 0% đến 100% để định vị ngôi sao trên màn hình theo hệ trục X (ngang) và Y (dọc)
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Áp dụng vị trí ngẫu nhiên vừa tính được vào thuộc tính style inline của thẻ
        star.style.left = x + '%'; // Vị trí cách mép trái khung chứa
        star.style.top = y + '%';  // Vị trí cách mép trên khung chứa

        // Đưa ngôi sao vừa được thiết lập xong vào trong thẻ container trên trang web thật
        starsContainer.appendChild(star);
    }
}

/**
 * Lắng nghe sự kiện DOMContentLoaded - Sự kiện này xảy ra khi toàn bộ cây HTML 
 * của trang đã được tải và dựng xong, giúp code JS tương tác an toàn với các thẻ HTML.
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Kích hoạt hàm tạo các ngôi sao lấp lánh trên nền vũ trụ
    generateStars();

    // 2. Thiết lập cuộn mềm mượt (Smooth Scroll) cho các liên kết neo (Anchor Links) dạng href="#id"
    // Tìm tất cả các thẻ <a> có thuộc tính href bắt đầu bằng ký tự '#'
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Thêm sự kiện click chuột cho từng thẻ liên kết neo này
        anchor.addEventListener('click', function (e) {
            // Ngăn chặn hành vi cuộn mặc định tức thời của trình duyệt
            e.preventDefault();
            
            // Lấy ra giá trị của thuộc tính href (ví dụ: '#gioi-thieu') và tìm thẻ HTML tương ứng với ID đó
            const target = document.querySelector(this.getAttribute('href'));
            
            // Nếu thẻ đích tồn tại trên trang, thực hiện cuộn màn hình đến vị trí của thẻ đó
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth', // Cuộn một cách mượt mà, từ từ thay vì nhảy ngay lập tức
                    block: 'start'      // Đưa mép trên của phần tử đích sát mép trên màn hình
                });
            }
        });
    });

    // 3. Thêm hiệu ứng tương tác (chuyển động mượt và xung động) cho các thẻ nhạc cụ (.instrument-card)
    const cards = document.querySelectorAll('.instrument-card');
    
    cards.forEach(card => {
        // Lắng nghe sự kiện di chuột vào thẻ (mouseenter)
        card.addEventListener('mouseenter', function () {
            // Thiết lập thuộc tính transition (hiệu ứng chuyển đổi) bằng Javascript 
            // Sử dụng hàm cubic-bezier để tạo gia tốc chuyển động tự nhiên, mượt mà khi phóng to hay bóng đổ thay đổi
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
});

/**
 * 4. Tạo và tiêm (inject) động các thuộc tính Keyframe CSS phục vụ hiệu ứng xung tích (pulse) vào thẻ <head>
 * Việc này giúp chúng ta có thể tạo ra các hiệu ứng hoạt ảnh phức tạp mà không cần viết trước trong file CSS tĩnh.
 */
const style = document.createElement('style'); // Tạo thẻ <style> mới trong bộ nhớ
style.textContent = `
    @keyframes pulse {
        0% {
            /* Lúc bắt đầu click: bóng viền màu tím nhạt ôm sát thẻ (chưa lan rộng) */
            box-shadow: 0 0 0 0 rgba(138, 43, 226, 0.7);
        }
        70% {
            /* Giữa hiệu ứng: viền bóng lan rộng ra 20px và mờ dần (độ trong suốt về 0) */
            box-shadow: 0 0 0 20px rgba(138, 43, 226, 0);
        }
        100% {
            /* Kết thúc hiệu ứng: bóng biến mất hoàn toàn */
            box-shadow: 0 0 0 0 rgba(138, 43, 226, 0);
        }
    }
`;
// Tiêm thẻ style vừa định nghĩa vào phần đầu (<head>) của trang tài liệu HTML
document.head.appendChild(style);

/**
 * 5. Hiệu ứng Parallax kính thiên văn: Các ngôi sao di chuyển nhẹ theo hướng di chuột của người dùng
 * Tạo cảm giác có chiều sâu 3D (lớp sao ở gần di chuyển nhanh hơn lớp sao ở xa).
 */
document.addEventListener('mousemove', (e) => {
    // Tìm tất cả các ngôi sao đang có trên trang
    const stars = document.querySelectorAll('.star');
    
    // Tính toán tỷ lệ vị trí chuột hiện tại so với kích thước toàn bộ cửa sổ trình duyệt (từ 0.0 đến 1.0)
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    // Vòng lặp cập nhật vị trí dịch chuyển cho từng ngôi sao
    stars.forEach((star, index) => {
        // Xác định "độ sâu" ảo của ngôi sao dựa trên chỉ số index của nó (chia lấy dư cho 3 cộng 1)
        // Kết quả sẽ nhận giá trị 1, 2 hoặc 3. Ngôi sao có depth lớn hơn sẽ dịch chuyển nhiều hơn.
        const depth = (index % 3) + 1;
        
        // Tính toán khoảng cách dịch chuyển (tối đa 30px tùy thuộc độ sâu và vị trí chuột)
        const moveX = x * 10 * depth;
        const moveY = y * 10 * depth;
        
        // Áp dụng phép biến đổi transform translate để dịch chuyển phần tử trên màn hình một cách mượt mà
        star.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

