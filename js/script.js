document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const swiperInstances = {}; 

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            const accordionContent = accordionItem.querySelector('.accordion-content');
            const swiperContainer = accordionContent.querySelector('.swiper');
            const isCurrentlyActive = accordionItem.classList.contains('active');

            document.querySelectorAll('.accordion-item.active').forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                    item.querySelector('.accordion-content').style.maxHeight = 0;
                    const oldSwiperContainer = item.querySelector('.accordion-content .swiper');
                    if (swiperInstances[oldSwiperContainer.id]) {
                        swiperInstances[oldSwiperContainer.id].destroy(true, true);
                        delete swiperInstances[oldSwiperContainer.id];
                    }
                }
            });

            if (isCurrentlyActive) {
                accordionItem.classList.remove('active');
                accordionContent.style.maxHeight = 0;
                if (swiperInstances[swiperContainer.id]) {
                    swiperInstances[swiperContainer.id].destroy(true, true);
                    delete swiperInstances[swiperContainer.id];
                }
            } else {
                accordionItem.classList.add('active');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";

                setTimeout(() => { 
                    const currentSwiperId = swiperContainer.id;

                    if (!currentSwiperId) {
                        swiperContainer.id = 'swiper-' + Math.random().toString(36).substr(2, 9);
                    }
    
                    if (!swiperInstances[swiperContainer.id]) {
                        const nextBtn = swiperContainer.querySelector('.swiper-button-next') || undefined;
                        const prevBtn = swiperContainer.querySelector('.swiper-button-prev') || undefined;
                        const paginationEl = swiperContainer.querySelector('.swiper-pagination') || undefined;
                        
                        swiperInstances[swiperContainer.id] = new Swiper(swiperContainer, {
                            slidesPerView: 1, 
                            spaceBetween: 30,
                            loop: true,
                            navigation: nextBtn && prevBtn ? { 
                                nextEl: nextBtn, 
                                prevEl: prevBtn 
                            } : undefined,
                            pagination: paginationEl ? { 
                                el: paginationEl, 
                                clickable: true 
                            } : undefined,
                            observer: true, 
                            observeParents: true,
                            
                            on: {
                                resize: function () {
                                    this.update();
                                }
                            }
                        });
                        
                        swiperInstances[swiperContainer.id].update(); 
                        swiperInstances[swiperContainer.id].update(); 

                        const activeVideos = swiperContainer.querySelectorAll('video');
                        activeVideos.forEach(video => {
                            if (video.hasAttribute('data-src')) {
                                video.src = video.getAttribute('data-src');
                                video.removeAttribute('data-src');
                            }
                            video.load();
                        });
                    } else {
                        swiperInstances[swiperContainer.id].update();
                    }
                }, 750); 
            }
        });
    })


    const gatito = document.createElement('div');
    gatito.id = 'gatito';
    document.body.appendChild(gatito);

    const spriteConfigWalk = {
        width: 256,    
        height: 128,    
        frames: 4,    
        fps: 10,      
        imagePath: 'img/catsprite.png'
    };

    const spriteConfigSit = {
        width: 128,    
        height: 128,    
        frames: 1,    
        fps: 10,      
        imagePath: 'img/sitcat.png' 
    };

    Object.assign(gatito.style, {
        width: `${spriteConfigWalk.width}px`, 
        height: `${spriteConfigWalk.height}px`, 
        position: 'absolute',
        top: `calc(100vh - 50px - ${spriteConfigWalk.height}px)`, 
        left: '50px',
        backgroundImage: `url('${spriteConfigWalk.imagePath}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '0 0',
        backgroundSize: 'auto',
        cursor: 'pointer',
        zIndex: '1000',
        pointerEvents: 'auto',
        imageRendering: 'pixelated' 
    });

    let currentFrame = 0;
    let isMoving = false;
    let animationInterval;
    let targetX = 50;
    let targetY; 
    const speed = 5;

    let randomActionTimeout; 

    targetY = window.pageYOffset + window.innerHeight - 50 - spriteConfigWalk.height;

    function animate() {
        if (gatito.style.backgroundImage.includes(spriteConfigWalk.imagePath) && spriteConfigWalk.frames > 1) { 
            currentFrame = (currentFrame + 1) % spriteConfigWalk.frames;
            const offsetX = -currentFrame * spriteConfigWalk.width;
            gatito.style.backgroundPosition = `${offsetX}px 0`;
        } else {
        }
    }

    function moveGatito() {
        const rect = gatito.getBoundingClientRect();
        const currentX = rect.left + window.pageXOffset; 
        const currentY = rect.top + window.pageYOffset; 
        
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < speed) {
            gatito.style.left = `${targetX}px`;
            gatito.style.top = `${targetY}px`; 
            stopMoving();
            sitGatito(); 
            scheduleRandomAction(); 
            return;
        }
        
        const ratio = speed / distance;
        const newX = currentX + dx * ratio;
        const newY = currentY + dy * ratio;
        
        gatito.style.left = `${newX}px`;
        gatito.style.top = `${newY}px`; 
        
        if (dx > 0) {
            gatito.style.transform = 'scaleX(1)';
        } else if (dx < 0) {
            gatito.style.transform = 'scaleX(-1)';
        }
    }

    function startMoving(newTargetX, newTargetY) {
        clearTimeout(randomActionTimeout); 
        
        gatito.style.width = `${spriteConfigWalk.width}px`;
        gatito.style.height = `${spriteConfigWalk.height}px`;
        gatito.style.backgroundImage = `url('${spriteConfigWalk.imagePath}')`;
        gatito.style.backgroundSize = 'auto'; 
        gatito.style.backgroundPosition = '0 0'; 
        
        targetX = newTargetX;
        targetY = newTargetY; 
        
        if (isMoving) return;
        isMoving = true;
        animationInterval = setInterval(() => {
            animate();
            moveGatito();
        }, 1000 / spriteConfigWalk.fps); 
    }

    function stopMoving() {
        isMoving = false;
        clearInterval(animationInterval);
    }

    function sitGatito() {
        stopMoving(); 
        
        gatito.style.width = `${spriteConfigWalk.width}px`;  
        gatito.style.height = `${spriteConfigWalk.height}px`; 

        gatito.style.backgroundImage = `url('${spriteConfigSit.imagePath}')`;
        gatito.style.backgroundSize = `contain`; 
        gatito.style.backgroundPosition = `center bottom`; 
        
        scheduleRandomAction(); 
    }

    function getRandomCoordinate(max, minSize) {
        const scrollOffset = window.pageYOffset;
        const minY = scrollOffset + 10;
        const maxY = scrollOffset + window.innerHeight - minSize - 10;
        
        if (max === window.innerWidth) { 
            return Math.random() * (max - minSize - 20) + 10; 
        } else { 
            return Math.random() * (maxY - minY) + minY;
        }
    }

    function performRandomAction() {
        const actionType = Math.random();
        if (actionType < 0.7) { 
            const newTargetX = getRandomCoordinate(window.innerWidth, spriteConfigWalk.width);
            const newTargetY = getRandomCoordinate(window.innerHeight, spriteConfigWalk.height);
            startMoving(newTargetX, newTargetY);
        } else { 
            sitGatito();
        }
    }

    function scheduleRandomAction() {
        const minTime = 3000; 
        const maxTime = 8000; 
        const randomTime = Math.random() * (maxTime - minTime) + minTime;
        randomActionTimeout = setTimeout(performRandomAction, randomTime);
    }

    document.addEventListener('click', function(event) {
        if (event.target.tagName === 'A' || 
            event.target.tagName === 'BUTTON' || 
            event.target.tagName === 'VIDEO' ||
            event.target.closest('a') || 
            event.target.closest('button') || 
            event.target.closest('.swiper-button-prev') ||
            event.target.closest('.swiper-button-next') ||
            event.target.closest('.swiper-pagination-bullet')) {
            return;
        }
        
        clearTimeout(randomActionTimeout);
        stopMoving(); 
        
        targetY = event.clientY + window.pageYOffset; 
        targetX = event.clientX - spriteConfigWalk.width / 2; 
        
        targetX = Math.max(window.pageXOffset + 10, Math.min(targetX, window.pageXOffset + window.innerWidth - spriteConfigWalk.width - 10));
        targetY = Math.max(window.pageYOffset + 10, Math.min(targetY, window.pageYOffset + window.innerHeight - spriteConfigWalk.height - 10));

        sitGatito(); 
        scheduleRandomAction(); 
    });

    gatito.addEventListener('click', function(event) {
        event.stopPropagation(); 
        clearTimeout(randomActionTimeout); 
        stopMoving(); 
        
        if (gatito.style.backgroundImage.includes(spriteConfigSit.imagePath)) {
            gatito.style.transform = 'scale(1.05)';
            setTimeout(() => {
                gatito.style.transform = 'scale(1)';
            }, 100);
            scheduleRandomAction(); 
            return;
        }

        targetY = gatito.getBoundingClientRect().top + window.pageYOffset; 
        sitGatito();
        scheduleRandomAction(); 
    });

    window.addEventListener('resize', function() {
        const rect = gatito.getBoundingClientRect();
        const currentLeft = rect.left + window.pageXOffset;
        const currentTop = rect.top + window.pageYOffset;

        if (currentLeft + spriteConfigWalk.width > window.pageXOffset + window.innerWidth) {
            gatito.style.left = (window.pageXOffset + window.innerWidth - spriteConfigWalk.width - 10) + 'px';
        }
        if (currentTop + spriteConfigWalk.height > window.pageYOffset + window.innerHeight) {
            gatito.style.top = (window.pageYOffset + window.innerHeight - spriteConfigWalk.height - 10) + 'px';
        }
        targetX = Math.min(targetX, window.pageXOffset + window.innerWidth - spriteConfigWalk.width - 10);
        targetY = Math.min(targetY, window.pageYOffset + window.innerHeight - spriteConfigWalk.height - 10);

        for (const swiperId in swiperInstances) {
            if (swiperInstances.hasOwnProperty(swiperId)) {
                swiperInstances[swiperId].update();
            }
        }
    });

    const imgWalk = new Image();
    imgWalk.src = spriteConfigWalk.imagePath;
    imgWalk.onerror = function() {
        console.error('No se pudo cargar la imagen de caminar del gato en:', spriteConfigWalk.imagePath);
        gatito.style.display = 'none';
    };

    const imgSit = new Image();
    imgSit.src = spriteConfigSit.imagePath; 
    imgSit.onerror = function() {
        console.error('No se pudo cargar la imagen de sentado del gato en:', spriteConfigSit.imagePath);
    };

    scheduleRandomAction(); 
});