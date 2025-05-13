// Global blog data
let blogData = null;

// Utility functions
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} tahun yang lalu`;
    if (interval === 1) return '1 tahun yang lalu';
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} bulan yang lalu`;
    if (interval === 1) return '1 bulan yang lalu';
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} hari yang lalu`;
    if (interval === 1) return '1 hari yang lalu';
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return `${interval} jam yang lalu`;
    if (interval === 1) return '1 jam yang lalu';
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} menit yang lalu`;
    if (interval === 1) return '1 menit yang lalu';
    
    return 'Baru saja';
};

// Load blog data
const loadBlogData = async () => {
    try {
        const response = await fetch('/data/blog.json');
        blogData = await response.json();
        initializePage();
    } catch (error) {
        console.error('Error loading blog data:', error);
    }
};

// Initialize page based on current URL
const initializePage = () => {
    const path = window.location.pathname;
    
    if (path === '/' || path === '/index.html') {
        initializeHomePage();
    } else if (path.includes('/article.html')) {
        initializeArticlePage();
    }
};

// Initialize home page
const initializeHomePage = () => {
    // Update site information
    document.title = blogData.site.name;
    document.querySelector('.navbar-brand').textContent = blogData.site.name;
    
    // Update featured post
    const featuredPost = blogData.posts[0];
    const featuredPostElement = document.querySelector('.card.shadow-sm.mb-4');
    if (featuredPostElement) {
        featuredPostElement.querySelector('img').src = featuredPost.featuredImage;
        featuredPostElement.querySelector('.badge').textContent = featuredPost.category.name;
        featuredPostElement.querySelector('h2').textContent = featuredPost.title;
        featuredPostElement.querySelector('.card-text').textContent = featuredPost.excerpt;
        featuredPostElement.querySelector('img.rounded-circle').src = featuredPost.author.avatar;
        featuredPostElement.querySelector('small.text-muted').textContent = formatDate(featuredPost.publishedAt);
        featuredPostElement.querySelector('a.btn').href = `article.html?slug=${featuredPost.slug}`;
    }
    
    // Update article cards
    const articleCards = document.querySelectorAll('.row-cols-1 .col');
    blogData.posts.slice(1, 5).forEach((post, index) => {
        if (articleCards[index]) {
            const card = articleCards[index];
            card.querySelector('img').src = post.featuredImage;
            card.querySelector('.badge').textContent = post.category.name;
            card.querySelector('h5').textContent = post.title;
            card.querySelector('.card-text').textContent = post.excerpt;
            card.querySelector('small.text-muted').textContent = formatDate(post.publishedAt);
            card.querySelector('a.text-decoration-none').href = `article.html?slug=${post.slug}`;
        }
    });
    
    // Update categories
    const categoryList = document.querySelector('.list-group.list-group-flush');
    if (categoryList) {
        categoryList.innerHTML = blogData.categories.map(category => `
            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                ${category.name}
                <span class="badge bg-primary rounded-pill">${category.postCount}</span>
            </a>
        `).join('');
    }
    
    // Update popular posts
    const popularPosts = document.querySelector('.card.shadow-sm.mb-4 .mt-3');
    if (popularPosts) {
        popularPosts.innerHTML = blogData.posts.slice(0, 3).map((post, index) => `
            <div class="d-flex mb-3">
                <img src="${post.featuredImage}" class="rounded me-3" alt="${post.title}" style="width: 80px; height: 80px; object-fit: cover;">
                <div>
                    <h6 class="mb-1">${post.title}</h6>
                    <small class="text-muted d-block mb-1">${formatDate(post.publishedAt)}</small>
                    <a href="article.html?slug=${post.slug}" class="text-decoration-none">
                        Baca
                    </a>
                </div>
            </div>
        `).join('');
    }
};

// Initialize article page
const initializeArticlePage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postSlug = urlParams.get('slug');
    
    if (!postSlug) {
        window.location.href = '/';
        return;
    }
    
    const post = blogData.posts.find(p => p.slug === postSlug);
    if (!post) {
        window.location.href = '/';
        return;
    }
    
    // Update page title and meta
    document.title = `${post.title} - ${blogData.site.name}`;
    
    // Update breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item"><a href="index.html">Home</a></li>
            <li class="breadcrumb-item"><a href="#">${post.category.name}</a></li>
            <li class="breadcrumb-item active" aria-current="page">${post.title}</li>
        `;
    }
    
    // Update article header
    const articleHeader = document.querySelector('.text-center.mb-4');
    if (articleHeader) {
        articleHeader.innerHTML = `
            <span class="badge bg-primary mb-2">${post.category.name}</span>
            <h1 class="display-5 fw-bold mb-3">${post.title}</h1>
            <div class="d-flex align-items-center justify-content-center mb-4">
                <img src="${post.author.avatar}" class="rounded-circle me-2" alt="${post.author.name}">
                <div class="text-start">
                    <p class="mb-0 fw-bold">${post.author.name}</p>
                    <p class="text-muted small mb-0">Dipublikasikan: ${formatDate(post.publishedAt)} · ${post.readTime} membaca</p>
                </div>
            </div>
        `;
    }
    
    // Update featured image
    const featuredImage = document.querySelector('.mb-5 img');
    if (featuredImage) {
        featuredImage.src = post.featuredImage;
        featuredImage.alt = post.title;
    }
    
    // Update article content
    const articleContent = document.querySelector('.article-content');
    if (articleContent) {
        articleContent.innerHTML = `
            <p class="lead">${post.excerpt}</p>
            ${post.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
        `;
    }
    
    // Update related posts
    const relatedPosts = document.querySelector('.row-cols-1.row-cols-md-3');
    if (relatedPosts) {
        const relatedPostsData = blogData.posts.filter(p => post.relatedPosts.includes(p.id));
        relatedPosts.innerHTML = relatedPostsData.map(relatedPost => `
            <div class="col">
                <div class="card h-100 shadow-sm">
                    <img src="${relatedPost.featuredImage}" class="card-img-top" alt="${relatedPost.title}">
                    <div class="card-body">
                        <h5 class="card-title">${relatedPost.title}</h5>
                        <p class="card-text small">${relatedPost.excerpt}</p>
                        <a href="article.html?slug=${relatedPost.slug}" class="text-decoration-none">
                            Baca selengkapnya
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Update comments
    const comments = blogData.comments.filter(c => c.postId === post.id);
    const commentsList = document.querySelector('.comments-list');
    if (commentsList) {
        commentsList.innerHTML = comments.map(comment => `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex mb-3">
                        <img src="${comment.avatar}" class="rounded-circle me-2" alt="${comment.author}">
                        <div>
                            <h6 class="card-subtitle mb-1">${comment.author}</h6>
                            <p class="card-text">
                                <small class="text-muted">${formatTimeAgo(comment.createdAt)}</small>
                            </p>
                        </div>
                    </div>
                    <p class="card-text">${comment.content}</p>
                    <button class="btn btn-sm btn-link text-decoration-none p-0 reply-btn" data-comment-id="${comment.id}">
                        <i class="bi bi-chat-dots me-1"></i> Balas
                    </button>
                </div>
            </div>
        `).join('');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadBlogData();
    
    // Handle subscribe form submission
    const subscribeForm = document.getElementById('subscribeForm');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('subscribeEmail').value;
            alert(`Terima kasih telah berlangganan dengan email: ${email}`);
            subscribeForm.reset();
        });
    }
    
    // Handle newsletter form submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value;
            alert(`Terima kasih telah berlangganan newsletter dengan email: ${email}`);
            newsletterForm.reset();
        });
    }
    
    // Handle footer newsletter form submission
    const footerNewsletterForm = document.getElementById('footerNewsletterForm');
    if (footerNewsletterForm) {
        footerNewsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('footerNewsletterEmail').value;
            alert(`Terima kasih telah berlangganan newsletter dengan email: ${email}`);
            footerNewsletterForm.reset();
        });
    }
    
    // Handle comment form submission
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('commentName').value;
            const email = document.getElementById('commentEmail').value;
            const comment = document.getElementById('commentText').value;
            const saveInfo = document.getElementById('saveInfo').checked;
            
            alert(`Komentar dari ${name} telah diterima. Terima kasih!`);
            
            if (saveInfo) {
                localStorage.setItem('commentName', name);
                localStorage.setItem('commentEmail', email);
            } else {
                localStorage.removeItem('commentName');
                localStorage.removeItem('commentEmail');
            }
            
            commentForm.reset();
        });
        
        // Fill form with saved data if available
        const savedName = localStorage.getItem('commentName');
        const savedEmail = localStorage.getItem('commentEmail');
        
        if (savedName) {
            document.getElementById('commentName').value = savedName;
        }
        
        if (savedEmail) {
            document.getElementById('commentEmail').value = savedEmail;
        }
        
        if (savedName && savedEmail) {
            document.getElementById('saveInfo').checked = true;
        }
    }
    
    // Handle reply buttons
    const replyButtons = document.querySelectorAll('.reply-btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const commentId = this.getAttribute('data-comment-id');
            
            // Check if reply form already exists
            let replyForm = document.querySelector(`.reply-form-${commentId}`);
            
            if (replyForm) {
                // Toggle visibility if form exists
                replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
            } else {
                // Create new reply form
                replyForm = document.createElement('div');
                replyForm.className = `reply-form reply-form-${commentId}`;
                replyForm.innerHTML = `
                    <div class="card card-body bg-light mt-2 mb-3">
                        <form class="reply-form-content">
                            <div class="row mb-3">
                                <div class="col-md-6 mb-2 mb-md-0">
                                    <input type="text" class="form-control form-control-sm" placeholder="Nama" required>
                                </div>
                                <div class="col-md-6">
                                    <input type="email" class="form-control form-control-sm" placeholder="Email" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <textarea class="form-control form-control-sm" rows="3" placeholder="Balas komentar..." required></textarea>
                            </div>
                            <div class="d-flex justify-content-between">
                                <button type="submit" class="btn btn-sm btn-primary">Kirim Balasan</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary cancel-reply">Batal</button>
                            </div>
                        </form>
                    </div>
                `;
                
                // Insert form after the button
                this.parentNode.appendChild(replyForm);
                
                // Handle reply form submission
                const replyFormContent = replyForm.querySelector('.reply-form-content');
                replyFormContent.addEventListener('submit', function(e) {
                    e.preventDefault();
                    alert('Balasan komentar telah diterima. Terima kasih!');
                    replyForm.style.display = 'none';
                });
                
                // Handle cancel button
                const cancelButton = replyForm.querySelector('.cancel-reply');
                cancelButton.addEventListener('click', function() {
                    replyForm.style.display = 'none';
                });
            }
        });
    });
    
    // Handle search functionality
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = document.getElementById('searchInput').value.trim();
            if (searchTerm) {
                alert(`Mencari artikel dengan kata kunci: "${searchTerm}"`);
            } else {
                alert('Silakan masukkan kata kunci pencarian');
            }
        });
    }
    
    // Handle share buttons
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Handle dark mode toggle
    const darkModeButton = document.querySelector('.dark-mode-toggle');
    if (darkModeButton) {
        darkModeButton.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            const isDarkMode = document.body.classList.contains('dark-mode');
            if (isDarkMode) {
                this.innerHTML = '<i class="bi bi-sun"></i> Mode Terang';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                this.innerHTML = '<i class="bi bi-moon"></i> Mode Gelap';
                localStorage.setItem('darkMode', 'disabled');
            }
        });
        
        // Check for saved dark mode preference
        if (localStorage.getItem('darkMode') === 'enabled') {
            document.body.classList.add('dark-mode');
            darkModeButton.innerHTML = '<i class="bi bi-sun"></i> Mode Terang';
        }
    }
});