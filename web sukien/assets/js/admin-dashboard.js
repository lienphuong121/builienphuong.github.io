// ==========================================
// 1. KHAI BÁO BIẾN & ĐỒNG BỘ LOCALSTORAGE (Cái này giúp 2 trang nhớ dữ liệu của nhau)
// ==========================================
let salesChart;
let pieChart;

// Lấy số liệu từ bộ nhớ trình duyệt, nếu chưa có thì lấy số gốc mặc định
let currentRevenue = parseInt(localStorage.getItem('spoton_revenue')) || 1564; 
let currentTickets = parseInt(localStorage.getItem('spoton_tickets')) || 24000;
let currentNewCustomers = parseInt(localStorage.getItem('spoton_customers')) || 14500;

// Lấy lịch sử mảng đơn hàng từ bộ nhớ (để trang Order và Dashboard dùng chung)
let orderHistory = JSON.parse(localStorage.getItem('spoton_orders')) || [];

// Hàm cập nhật mấy con số trên thẻ Card
function updateStatsUI() {
    const revEl = document.getElementById('total-revenue');
    const tickEl = document.getElementById('total-tickets');
    const custEl = document.getElementById('new-customers');
    if (revEl) revEl.innerText = '$' + currentRevenue;
    if (tickEl) tickEl.innerText = currentTickets;
    if (custEl) custEl.innerText = currentNewCustomers;
}
// Chạy luôn lúc vừa load trang
updateStatsUI();


// ==========================================
// 2. KHỞI TẠO BIỂU ĐỒ (Chỉ vẽ khi ở Dashboard)
// ==========================================
if (typeof Chart !== 'undefined') {
    const salesCtx = document.getElementById('salechart');
    if (salesCtx) {
        salesChart = new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['May', 'Jun', 'July', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Revenue',
                    data: [5200, 7600, 6800, 9200, 8300, currentRevenue > 12860 ? currentRevenue : 12860], // Điểm cuối ăn theo doanh thu hiện tại
                    borderColor: '#14b8a6', backgroundColor: 'rgba(20, 184, 166, 0.15)', 
                    tension: 0.4, fill: true,
                    pointBackgroundColor: '#ffffff', pointBorderColor: '#14b8a6', pointBorderWidth: 2, pointRadius: 4 
                }]
            },
            options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                }
            }
        });
    }

    const pieCtx = document.getElementById('piechart');
    if (pieCtx) {
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: ['Concert', 'Thể Thao', 'Workshop', 'Khác'],
                datasets: [{
                    data: [350, 250, 200, 200],
                    backgroundColor: ['#14b8a6', '#1e293b', '#94a3b8', '#cbd5e1'], borderWidth: 2, borderColor: '#ffffff' 
                }]
            },
            options: { maintainAspectRatio: false, responsive: true, plugins: { legend: { position: 'bottom', labels: { color: '#475569', usePointStyle: true, padding: 10 } } } }
        });
    }
}


// ==========================================
// 3. XỬ LÝ DỮ LIỆU ĐƠN HÀNG ẢO ĐỒNG BỘ
// ==========================================
const fakeNames = ["Nguyễn Xuân Bách", "Nguyễn Thành Công", "Trần Thiện Thanh Bảo", "Phạm Khôi Vũ", "Justin Bieber", "Jaysonlei", "Sơn K", "Captain"];
const statuses = ["Completed", "Pending"]; 

function showNotification(message) {
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    if(!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('toast-hidden');
    toast.classList.add('toast-show');
    setTimeout(() => { toast.classList.remove('toast-show'); toast.classList.add('toast-hidden'); }, 3500);
}

// Hàm render: Sinh ra HTML nhét vào bảng
function renderOrderRow(order, showAnim = true) {
    const dashTableBody = document.getElementById('order-list');
    const fullOrderTableBody = document.getElementById('full-order-list');

    // Chèn vào bảng Dashboard
    if (dashTableBody) {
        const newRow = document.createElement('tr');
        if(showAnim) newRow.classList.add('new-order-row'); 
        const statusClass = order.status === 'Completed' ? 'status-completed' : 'status-pending';
        newRow.innerHTML = `
            <td>#${order.id}</td>
            <td><strong>${order.name}</strong></td>
            <td>$${order.amount}</td>
            <td class="${statusClass}">${order.status}</td>
            <td>${order.date}</td>
            <td>${order.email}</td>
        `;
        dashTableBody.insertBefore(newRow, dashTableBody.firstChild);
        if (dashTableBody.children.length > 8) dashTableBody.removeChild(dashTableBody.lastChild);
    }

    // Chèn vào bảng Order
    if (fullOrderTableBody) {
        const newRow = document.createElement('tr');
        if(showAnim) newRow.classList.add('new-order-row'); 
        newRow.innerHTML = `
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>$${order.amount}</td>
            <td><span class="status_or ${order.status}">${order.status}</span></td>
            <td>${order.date}</td>
            <td>${order.email}</td>
            <td><button class="btn_or">View</button></td>
        `;
        fullOrderTableBody.insertBefore(newRow, fullOrderTableBody.firstChild);
        if (fullOrderTableBody.children.length > 15) fullOrderTableBody.removeChild(fullOrderTableBody.lastChild);
    }
}

// Hàm load lại các đơn hàng cũ khi vừa chuyển trang (tránh bị mất data)
function loadExistingOrders() {
    // Duyệt ngược mảng để thằng mới nhất được đẩy lên trên cùng
    for (let i = orderHistory.length - 1; i >= 0; i--) {
        renderOrderRow(orderHistory[i], false); // Không chạy animation lúc vừa mở trang
    }
}
loadExistingOrders();


// ==========================================
// 4. TRIGGER CHẠY AUTO LƯU VÀO BỘ NHỚ
// ==========================================
function triggerFakeOrder() {
    const name = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const amount = Math.floor(Math.random() * 150 + 20); 
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const email = `${name.toLowerCase().replace(/\s/g, '')}@meme.com`;
    const orderId = Math.floor(Math.random() * 9000 + 1000);
    const today = new Date();
    const dateString = String(today.getDate()).padStart(2, '0') + '/' + String(today.getMonth() + 1).padStart(2, '0') + '/' + today.getFullYear();

    // Đóng gói đơn hàng mới
    const newOrder = { id: orderId, name: name, amount: amount, status: status, email: email, date: dateString };

    // 1. CẬP NHẬT DỮ LIỆU & LƯU VÀO BỘ NHỚ TRÌNH DUYỆT (LOCALSTORAGE)
    orderHistory.unshift(newOrder); // Nhét lên đầu mảng
    if (orderHistory.length > 15) orderHistory.pop(); // Giữ tối đa 15 đơn
    localStorage.setItem('spoton_orders', JSON.stringify(orderHistory));

    currentRevenue += amount;
    currentTickets += Math.floor(Math.random() * 4) + 1;
    currentNewCustomers += Math.floor(Math.random() * 2) + 1;
    
    localStorage.setItem('spoton_revenue', currentRevenue);
    localStorage.setItem('spoton_tickets', currentTickets);
    localStorage.setItem('spoton_customers', currentNewCustomers);

    // 2. CẬP NHẬT GIAO DIỆN HIỂN THỊ
    renderOrderRow(newOrder, true);
    updateStatsUI();
    showNotification(`Đơn hàng mới từ ${name}: $${amount}`);

    // Cập nhật biểu đồ nếu có
    if (salesChart) {
        const lastDataIndex = salesChart.data.datasets[0].data.length - 1;
        salesChart.data.datasets[0].data[lastDataIndex] = currentRevenue; // Chart giờ nối thẳng vào data thực tế
        salesChart.update(); 
    }
    if (pieChart) {
        const randomCategoryIndex = Math.floor(Math.random() * 4);
        pieChart.data.datasets[0].data[randomCategoryIndex] += 1;
        pieChart.update(); 
    }
}

// Chạy tự động sau mỗi 4 đến 8 giây
setInterval(triggerFakeOrder, Math.floor(Math.random() * 4000) + 4000);

// NÚT ẤN RESET (Dùng khi m test xong muốn xóa sạch data cũ, m chỉ cần mở console F12 gõ resetData() )
function resetData() {
    localStorage.clear();
    location.reload();
}