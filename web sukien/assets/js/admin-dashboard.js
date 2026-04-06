// ==========================================
// 1. Sale Chart (Line)
// ==========================================
const salesCtx = document.getElementById('salechart');

new Chart(salesCtx, {
    type: 'line',
    data: {
        labels: ['May', 'Jun', 'July', 'Aug', 'Sep', 'Oct'],
        datasets: [{
            label: 'Revenue',
            data: [5200, 7600, 6800, 9200, 8300, 12860],
            borderColor: '#14b8a6', // Viền màu xanh ngọc (Teal)
            backgroundColor: 'rgba(20, 184, 166, 0.15)', // Nền xanh ngọc pha trong suốt
            tension: 0.4, // Độ cong mềm mại hơn
            fill: true,
            pointBackgroundColor: '#ffffff', // Tâm chấm tròn màu trắng
            pointBorderColor: '#14b8a6', // Viền chấm tròn xanh ngọc
            pointBorderWidth: 2,
            pointRadius: 4 // Tăng kích thước chấm tròn lên chút cho đẹp
        }]
    },
    options: {
        maintainAspectRatio: false, // Bắt buộc để không vỡ khung CSS
        responsive: true,
        plugins: {
            legend: { display: false } // Ẩn chú thích
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' }, // Đường kẻ ngang màu xám rất nhạt
                ticks: { color: '#64748b' } // Chữ số trục y màu xám
            },
            x: {
                grid: { display: false }, // Ẩn đường kẻ dọc cho xịn
                ticks: { color: '#64748b' } // Chữ số trục x màu xám
            }
        }
    }
});

// ==========================================
// 2. Biểu đồ Pie (Category Breakdown)
// ==========================================
const pieCtx = document.getElementById('piechart');

new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: ['Concert', 'Thể Thao', 'Workshop', 'Khác'],
        datasets: [{
            data: [350, 250, 200, 200],
            // 4 màu: Xanh ngọc, Xanh tím than, Xám nhạt, Xám sáng
            backgroundColor: ['#14b8a6', '#1e293b', '#94a3b8', '#cbd5e1'], 
            borderWidth: 2, 
            borderColor: '#ffffff' // Đường cắt màu trắng cho các mảng
        }]
    },
    options: {
        maintainAspectRatio: false, // Bắt buộc để không vỡ khung CSS
        responsive: true,
        plugins: {
            legend: { 
                position: 'bottom',
                labels: { 
                    color: '#475569', // Màu chữ xám đậm
                    usePointStyle: true, // Đổi icon chú thích thành hình tròn
                    padding: 10
                    
                }
            } 
        }
    }
});