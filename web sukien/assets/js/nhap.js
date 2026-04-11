document.addEventListener('DOMContentLoaded', () => {


    // ========================================================
    // PHẦN 1: BANNER CHÍNH QUAY VÒNG (CAROUSEL TRÊN CÙNG)
    // ========================================================
    const track = document.getElementById('carouselTrack');
    
    if (track) { 
        const cards = Array.from(document.querySelectorAll('.carousel-card'));
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('dotsContainer');

        const totalOriginal = cards.length; 
        
        const cloneFirst = cards[0].cloneNode(true);
        const cloneSecond = cards[1].cloneNode(true);
        const cloneLast = cards[totalOriginal - 1].cloneNode(true);
        
        track.insertBefore(cloneLast, cards[0]);
        track.appendChild(cloneFirst);
        track.appendChild(cloneSecond);
        
        let currentIndex = 0; 
        let isTransitioning = false;
        
        if(dotsContainer) {
            for (let i = 0; i < totalOriginal; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    if (!isTransitioning) updateSlider(i);
                });
                dotsContainer.appendChild(dot);
            }
        }
        const dots = document.querySelectorAll('#dotsContainer .dot');
        
        function updateSlider(index, smooth = true) {
            isTransitioning = smooth; 
            currentIndex = index;
            
            const cardWidth = cards[0].offsetWidth;
            const gap = 20;
            const domIndex = currentIndex + 1; 
            const moveDistance = (cardWidth + gap) * domIndex;
            
            track.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
            track.style.transform = `translateX(-${moveDistance}px)`;
            
            dots.forEach(d => d.classList.remove('active'));
            let dotIndex = currentIndex;
            if (currentIndex === totalOriginal) dotIndex = 0; 
            if (currentIndex === -1) dotIndex = totalOriginal - 1; 
            if (dots[dotIndex]) dots[dotIndex].classList.add('active');
        }
        
        track.addEventListener('transitionend', (e) => {
            if (e.propertyName !== 'transform') return;
            isTransitioning = false;
            
            if (currentIndex === totalOriginal) {
                updateSlider(0, false);
            } else if (currentIndex === -1) {
                updateSlider(totalOriginal - 1, false);
            }
        });
        
        if(nextBtn) nextBtn.addEventListener('click', () => { if (!isTransitioning) updateSlider(currentIndex + 1); });
        if(prevBtn) prevBtn.addEventListener('click', () => { if (!isTransitioning) updateSlider(currentIndex - 1); });
        
        updateSlider(0, false);
    }

    // ========================================================
    // PHẦN 2: CÁC DANH SÁCH SỰ KIỆN Ở DƯỚI
    // ========================================================
    const eventSections = document.querySelectorAll('.event-section');

    eventSections.forEach(section => {
        const sliderTrack = section.querySelector('.scroll-track');
        const listPrevBtn = section.querySelector('.list-prev');
        const listNextBtn = section.querySelector('.list-next');
        const listDotsContainer = section.querySelector('.list-dots');
        
        if (!sliderTrack) return;

        const listCards = Array.from(sliderTrack.children);
        const listTotalOriginal = listCards.length;
        if (listTotalOriginal === 0) return;

        // TỰ ĐỘNG PHÂN LOẠI: Kiểm tra xem section này có thẻ xếp hạng (rank) không
        const isTrendingSection = section.querySelector('.rank-number') !== null;

        if (isTrendingSection) {
            // ----------------------------------------------------
            // LOGIC A: KHÔNG XOAY VÒNG (Dành riêng cho Sự kiện xu hướng)
            // ----------------------------------------------------
            
            // Ép CSS trực tiếp bằng JS để vô hiệu hóa transform xoay vòng
            sliderTrack.style.width = 'auto';
            sliderTrack.style.overflowX = 'auto';
            sliderTrack.style.transform = 'none';
            sliderTrack.style.scrollBehavior = 'smooth';

            const updateTrendingDots = () => {
                if (!listDotsContainer) return;
                const pages = Math.ceil(sliderTrack.scrollWidth / sliderTrack.clientWidth);
                const activeIndex = Math.round(sliderTrack.scrollLeft / sliderTrack.clientWidth);

                if (listDotsContainer.children.length !== pages) {
                    listDotsContainer.innerHTML = '';
                    for (let i = 0; i < pages; i++) {
                        const dot = document.createElement('div');
                        dot.classList.add('dot');
                        if (i === activeIndex) dot.classList.add('active');
                        listDotsContainer.appendChild(dot);
                    }
                } else {
                    const dots = listDotsContainer.querySelectorAll('.dot');
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === activeIndex);
                    });
                }

                // Ẩn mờ nút khi cuộn kịch kim 2 đầu
                if(listPrevBtn) listPrevBtn.style.opacity = sliderTrack.scrollLeft <= 0 ? '0.3' : '1';
                if(listNextBtn) listNextBtn.style.opacity = sliderTrack.scrollLeft >= (sliderTrack.scrollWidth - sliderTrack.clientWidth - 5) ? '0.3' : '1';
            };

            sliderTrack.addEventListener('scroll', updateTrendingDots);
            window.addEventListener('resize', updateTrendingDots);
            setTimeout(updateTrendingDots, 200);

            if (listNextBtn) listNextBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: sliderTrack.clientWidth, behavior: 'smooth' }));
            if (listPrevBtn) listPrevBtn.addEventListener('click', () => sliderTrack.scrollBy({ left: -sliderTrack.clientWidth, behavior: 'smooth' }));

            // Xử lý kéo thả bằng scrollLeft
            let isDown = false;
            let startX, scrollLeft;

            sliderTrack.addEventListener('mousedown', (e) => {
                isDown = true;
                sliderTrack.style.scrollBehavior = 'auto'; 
                startX = e.pageX - sliderTrack.offsetLeft;
                scrollLeft = sliderTrack.scrollLeft;
            });
            sliderTrack.addEventListener('mouseleave', () => { isDown = false; sliderTrack.style.scrollBehavior = 'smooth'; });
            sliderTrack.addEventListener('mouseup', () => { isDown = false; sliderTrack.style.scrollBehavior = 'smooth'; });
            sliderTrack.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - sliderTrack.offsetLeft;
                const walk = (x - startX) * 1.5; 
                sliderTrack.scrollLeft = scrollLeft - walk;
            });

        } else {
            // ----------------------------------------------------
            // LOGIC B: XOAY VÒNG VÔ TẬN (Dành cho các sự kiện còn lại)
            // ----------------------------------------------------
            const clonesStart = listCards.slice(0, 4).map(card => card.cloneNode(true));
            const clonesEnd = listCards.slice(-4).map(card => card.cloneNode(true));

            clonesEnd.forEach(clone => sliderTrack.insertBefore(clone, sliderTrack.firstChild));
            clonesStart.forEach(clone => sliderTrack.appendChild(clone));

            let listCurrentIndex = 4; 
            let listIsTransitioning = false;
            
            const getListCardWidth = () => sliderTrack.children[0].offsetWidth + 20;

            sliderTrack.style.transition = 'none';
            sliderTrack.style.transform = `translateX(-${listCurrentIndex * getListCardWidth()}px)`;

            function moveListSlider(newIndex, smooth = true) {
                listIsTransitioning = smooth;
                listCurrentIndex = newIndex;
                
                sliderTrack.style.transition = smooth ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
                sliderTrack.style.transform = `translateX(-${listCurrentIndex * getListCardWidth()}px)`;
                
                if (listDotsContainer) {
                    const listDots = listDotsContainer.querySelectorAll('.dot');
                    listDots.forEach(d => d.classList.remove('active'));
                    
                    let dotIndex = Math.floor((listCurrentIndex - 4) / 2);
                    if (dotIndex < 0) dotIndex = Math.floor((listTotalOriginal - 1) / 2);
                    if (dotIndex >= Math.ceil(listTotalOriginal / 2)) dotIndex = 0;
                    
                    if (listDots[dotIndex]) listDots[dotIndex].classList.add('active');
                }
            }

            sliderTrack.addEventListener('transitionend', () => {
                listIsTransitioning = false;
                if (listCurrentIndex <= 0) {
                    moveListSlider(listTotalOriginal, false);
                } else if (listCurrentIndex >= listTotalOriginal + 4) {
                    moveListSlider(4, false); 
                }
            });

            if (listNextBtn) listNextBtn.addEventListener('click', () => { if (!listIsTransitioning) moveListSlider(listCurrentIndex + 2); });
            if (listPrevBtn) listPrevBtn.addEventListener('click', () => { if (!listIsTransitioning) moveListSlider(listCurrentIndex - 2); });

            let isDown = false;
            let startX, currentTranslate, prevTranslate;

            sliderTrack.addEventListener('mousedown', (e) => {
                isDown = true;
                listIsTransitioning = true;
                sliderTrack.style.transition = 'none';
                startX = e.pageX;
                
                const transformMatrix = window.getComputedStyle(sliderTrack).getPropertyValue('transform');
                if (transformMatrix !== 'none') {
                    currentTranslate = parseInt(transformMatrix.split(',')[4].trim());
                } else {
                    currentTranslate = 0;
                }
                prevTranslate = currentTranslate;
            });

            sliderTrack.addEventListener('mouseleave', () => { isDown = false; });
            sliderTrack.addEventListener('mouseup', (e) => {
                if (!isDown) return;
                isDown = false;
                
                const movedBy = currentTranslate - prevTranslate;
                
                if (movedBy < -100) moveListSlider(listCurrentIndex + 1); 
                else if (movedBy > 100) moveListSlider(listCurrentIndex - 1); 
                else moveListSlider(listCurrentIndex); 
            });

            sliderTrack.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const currentX = e.pageX;
                const diff = currentX - startX;
                currentTranslate = prevTranslate + diff;
                sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
            });

            if (listDotsContainer) {
                const pages = Math.ceil(listTotalOriginal / 2);
                listDotsContainer.innerHTML = '';
                for (let i = 0; i < pages; i++) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    if (i === 0) dot.classList.add('active');
                    listDotsContainer.appendChild(dot);
                }
            }
        }
    });

});


