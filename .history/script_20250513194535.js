// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
            
            // In a real application, you would send this data to a server
            // For demo purposes, we'll just show an alert
            alert(`Komentar dari ${name} telah diterima. Terima kasih!`);
            
            // Save user info in localStorage if checkbox is checked
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
                // In a real application, you would redirect to search results page
                // window.location.href = `search.html?q=${encodeURIComponent(searchTerm)}`;
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

    // Add dark mode toggle functionality
    // First, let's add the dark mode toggle button to the navbar
    const navbarNav = document.querySelector('.navbar-nav');
    if (navbarNav) {
        const darkModeToggle = document.createElement('li');
        darkModeToggle.className = 'nav-item ms-lg-2';
        darkModeToggle.innerHTML = `
            <button class="btn btn-sm btn-outline-secondary dark-mode-toggle">
                <i class="bi bi-moon"></i> Mode Gelap
            </button>
        `;
        navbarNav.appendChild(darkModeToggle);
        
        // Handle dark mode toggle
        const darkModeButton = document.querySelector('.dark-mode-toggle');
        darkModeButton.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Update button text and icon
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