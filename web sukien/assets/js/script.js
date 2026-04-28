// Xử lý ẩn/hiện mật khẩu cho giao diện
document.addEventListener('DOMContentLoaded', () => {
    const toggleIcons = document.querySelectorAll('.toggle-password');

    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            // Lấy id của input tương ứng từ data-target
            const targetId = this.getAttribute('data-target');
            const inputField = document.getElementById(targetId);

            // Đổi type của input
            if (inputField.type === 'password') {
                inputField.type = 'text';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            } else {
                inputField.type = 'password';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            }
        });
    });
});
// HÃY THAY BẰNG 2 DÒNG NÀY:
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBB1QpFqLyz9KCgvUE7ZRdKwNb5zDWGrPI",
  authDomain: "ticketbox-225cf.firebaseapp.com",
  projectId: "ticketbox-225cf",
  storageBucket: "ticketbox-225cf.firebasestorage.app",
  messagingSenderId: "913581673614",
  appId: "1:913581673614:web:04f77a17d6aa7c728f4ddf",
  measurementId: "G-EWD6PMWXK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4. Khởi tạo Providers (Google và GitHub)
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// 5. Xử lý sự kiện click nút đăng nhập Google
document.getElementById('btn-google').addEventListener('click', (e) => {
    e.preventDefault(); // Ngăn load lại trang
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Đăng nhập thành công
        const user = result.user;
        alert(`Đăng nhập Google thành công! Xin chào ${user.displayName}`);
        console.log("Thông tin user:", user);
        
        const templateParams = {
            to_name: user.displayName, // Tên lấy từ tài khoản Google của họ
            to_email: user.email       // Email lấy từ tài khoản Google của họ
        };

        // Gửi email thông báo
        emailjs.send("service_2uhkzho","template_0e8vo6c", templateParams)
            .then(function(response) {
               console.log('Đã gửi mail thông báo thành công!', response.status, response.text);
            }, function(error) {
               console.log('Gửi mail thất bại...', error);
            });
            
        // ==========================================
        // 2 DÒNG QUAN TRỌNG NHẤT ĐỂ HOẠT ĐỘNG VỚI INDEX
        // ==========================================
        // 1. Phát tín hiệu đã đăng nhập cho trang index biết
        localStorage.setItem('isLoggedIn', 'true'); 
        
        // 2. Chuyển thẳng về trang chủ (Thay "index.html" nếu đường dẫn của bạn khác)
        window.location.href = "index.html"; 
        
      }).catch((error) => {
        alert("Lỗi đăng nhập Google: " + error.message);
      });
});

// 6. Xử lý sự kiện click nút đăng nhập GitHub
document.getElementById('btn-github').addEventListener('click', (e) => {
    e.preventDefault();
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        const user = result.user;
        alert(`Đăng nhập GitHub thành công! Xin chào ${user.displayName || user.email}`);
        console.log("Thông tin user:", user);
        
        // ==========================================
        // ÁP DỤNG TƯƠNG TỰ CHO GITHUB
        // ==========================================
        localStorage.setItem('isLoggedIn', 'true'); 
        window.location.href = "index.html"; 
        
      }).catch((error) => {
        alert("Lỗi đăng nhập GitHub: " + error.message);
      });
});