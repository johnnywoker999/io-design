// 通用功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化商品卡片滾動功能
    initProductScroll('scrollLeftNew', 'scrollRightNew');
    initProductScroll('scrollLeftHot', 'scrollRightHot');

    function initProductScroll(leftBtnId, rightBtnId) {
        const leftBtn = document.getElementById(leftBtnId);
        const rightBtn = document.getElementById(rightBtnId);
        const container = leftBtn.closest('.relative').querySelector('.flex.overflow-x-auto');

        if (leftBtn && rightBtn && container) {
            // 初始化按鈕顯示狀態
            updateScrollButtons();

            // 滾動事件處理
            container.addEventListener('scroll', updateScrollButtons);

            // 左右按鈕點擊事件
            leftBtn.addEventListener('click', () => {
                container.scrollBy({ left: -container.offsetWidth, behavior: 'smooth' });
            });

            rightBtn.addEventListener('click', () => {
                container.scrollBy({ left: container.offsetWidth, behavior: 'smooth' });
            });

            function updateScrollButtons() {
                // 更新左按鈕顯示狀態
                if (container.scrollLeft <= 0) {
                    leftBtn.classList.add('opacity-0', 'pointer-events-none');
                } else {
                    leftBtn.classList.remove('opacity-0', 'pointer-events-none');
                }

                // 更新右按鈕顯示狀態
                if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
                    rightBtn.classList.add('opacity-0', 'pointer-events-none');
                } else {
                    rightBtn.classList.remove('opacity-0', 'pointer-events-none');
                }
            }
        }
    }

    // 導航欄滾動效果
    let lastScrollTop = 0;
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    });

    // 圖片懶加載
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));

    // 滾動動畫
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    });
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animateOnScroll.observe(el);
    });
});

// 購物車功能
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.total = 0;
        this.updateUI();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({...product, quantity: 1});
        }
        this.saveToLocalStorage();
        this.updateUI();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToLocalStorage();
        this.updateUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            }
        }
        this.saveToLocalStorage();
        this.updateUI();
    }

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateUI() {
        // 更新購物車圖標數量
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
        }

        // 更新購物車頁面
        const cartItemsList = document.querySelector('.cart-items');
        if (cartItemsList) {
            cartItemsList.innerHTML = this.items.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price}</p>
                        <div class="quantity-controls">
                            <button onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button onclick="cart.removeItem(${item.id})">刪除</button>
                </div>
            `).join('');

            // 更新總價
            this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const totalElement = document.querySelector('.cart-total');
            if (totalElement) {
                totalElement.textContent = `總計: $${this.total}`;
            }
        }
    }
}

// 商品搜索功能
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const searchProducts = debounce((query) => {
    // 模擬API調用
    console.log(`Searching for: ${query}`);
    // 實際項目中這裡應該調用後端API
}, 300);

// 部落格相關功能
class BlogManager {
    constructor() {
        this.initializeFilters();
        this.initializeLikeSystem();
        this.initializeComments();
    }

    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-button');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按鈕的活動狀態
                filterButtons.forEach(btn => btn.classList.remove('bg-indigo-600', 'text-white'));
                button.classList.add('bg-indigo-600', 'text-white');
                
                const category = button.dataset.category;
                this.filterArticles(category);
            });
        });
    }

    filterArticles(category) {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            const articleCategory = article.dataset.category;
            if (category === 'all' || articleCategory === category) {
                article.style.display = 'block';
            } else {
                article.style.display = 'none';
            }
        });
    }

    initializeLikeSystem() {
        const likeButtons = document.querySelectorAll('.like-button');
        likeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const articleId = button.dataset.articleId;
                const likeCount = button.querySelector('.like-count');
                const currentLikes = parseInt(likeCount.textContent);
                
                // 模擬API調用
                setTimeout(() => {
                    likeCount.textContent = currentLikes + 1;
                    button.classList.add('liked');
                }, 100);
            });
        });
    }

    initializeComments() {
        const commentForms = document.querySelectorAll('.comment-form');
        commentForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const commentInput = form.querySelector('textarea');
                const comment = commentInput.value.trim();
                
                if (comment) {
                    this.addComment({
                        content: comment,
                        author: '訪客',
                        date: new Date().toLocaleDateString()
                    }, form.closest('article'));
                    commentInput.value = '';
                }
            });
        });
    }

    addComment(comment, article) {
        const commentsList = article.querySelector('.comments-list');
        const commentElement = document.createElement('div');
        commentElement.className = 'comment bg-gray-50 p-4 rounded-lg mb-4';
        commentElement.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <img class="h-10 w-10 rounded-full" src="https://via.placeholder.com/40" alt="${comment.author}">
                </div>
                <div class="ml-4">
                    <div class="flex items-center">
                        <h4 class="text-sm font-bold">${comment.author}</h4>
                        <span class="text-gray-500 text-xs ml-2">${comment.date}</span>
                    </div>
                    <p class="text-gray-600 mt-1">${comment.content}</p>
                </div>
            </div>
        `;
        commentsList.appendChild(commentElement);
    }
}

// 初始化
const cart = new ShoppingCart();
if (document.querySelector('.blog-section')) {
    const blogManager = new BlogManager();
}

// 商品卡片橫向滾動功能
function initProductScroll() {
    const productContainers = document.querySelectorAll('.hide-scrollbar');
    
    productContainers.forEach(container => {
        const prevBtn = container.parentElement.querySelector('.fa-chevron-left').parentElement;
        const nextBtn = container.parentElement.querySelector('.fa-chevron-right').parentElement;
        const scrollAmount = 300; // 每次滾動的距離

        if (prevBtn && nextBtn) {
            // 左滾動按鈕點擊事件
            prevBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });

            // 右滾動按鈕點擊事件
            nextBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });

            // 監聽滾動事件來更新按鈕顯示狀態
            container.addEventListener('scroll', () => {
                // 更新左按鈕狀態
                if (container.scrollLeft <= 0) {
                    prevBtn.style.opacity = '0';
                    prevBtn.style.pointerEvents = 'none';
                } else {
                    prevBtn.style.opacity = '1';
                    prevBtn.style.pointerEvents = 'auto';
                }

                // 更新右按鈕狀態
                if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
                    nextBtn.style.opacity = '0';
                    nextBtn.style.pointerEvents = 'none';
                } else {
                    nextBtn.style.opacity = '1';
                    nextBtn.style.pointerEvents = 'auto';
                }
            });

            // 初始化按鈕狀態
            container.dispatchEvent(new Event('scroll'));
        }
    });
}

// 頁面加載完成後初始化滾動功能
document.addEventListener('DOMContentLoaded', () => {
    initProductScroll();
});