// ========================================
// BLOGS.JS - Dynamic Blog Rendering & CRUD
// ========================================

// Sample initial blogs data
const sampleBlogs = [
    {
        id: 1,
        title: "The Wonders of the Amazon Rainforest",
        author: "Sarah Johnson",
        category: "Geography",
        image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800",
        description: "Explore the incredible biodiversity and unique ecosystems of the world's largest tropical rainforest.",
        content: "The Amazon Rainforest is one of the most incredible places on Earth. Spanning across nine countries in South America, this vast tropical paradise is home to an estimated 10% of all species on the planet. From colorful macaws to elusive jaguars, the Amazon's biodiversity is unmatched. The rainforest plays a crucial role in regulating the Earth's climate and is often referred to as the 'lungs of the planet.' However, deforestation poses a significant threat to this vital ecosystem. Conservation efforts are more important than ever to protect this natural wonder for future generations.",
        date: "2025-10-15",
        likes: 45
    },
    {
        id: 2,
        title: "The Rise and Fall of the Roman Empire",
        author: "Michael Chen",
        category: "History",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800",
        description: "Journey through time to understand one of the most powerful civilizations in human history.",
        content: "The Roman Empire stands as one of the greatest civilizations in human history. From its legendary founding by Romulus in 753 BCE to the fall of Constantinople in 1453 CE, Rome's influence shaped Western civilization. The Romans excelled in engineering, law, and military strategy. Their architectural marvels, like the Colosseum and aqueducts, still inspire awe today. The empire's legal system formed the basis of many modern legal codes. However, internal corruption, economic troubles, and barbarian invasions eventually led to its decline. The legacy of Rome continues to influence our modern world in countless ways.",
        date: "2025-10-12",
        likes: 67
    },
    {
        id: 3,
        title: "Understanding Cryptocurrency and Blockchain",
        author: "David Martinez",
        category: "Economics",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=800",
        description: "Dive into the revolutionary world of digital currencies and decentralized technology.",
        content: "Cryptocurrency has revolutionized the financial world, introducing a new era of digital money. Bitcoin, created in 2009, was the first cryptocurrency and remains the most valuable. The underlying blockchain technology provides a secure, transparent, and decentralized way to record transactions. This technology has applications far beyond currency, including supply chain management, voting systems, and digital identity verification. While cryptocurrencies offer exciting opportunities, they also come with risks such as volatility and regulatory uncertainty. Understanding these digital assets is becoming increasingly important in our modern economy.",
        date: "2025-10-10",
        likes: 89
    },
    {
        id: 4,
        title: "Japanese Tea Ceremony: Art and Tradition",
        author: "Yuki Tanaka",
        category: "Culture",
        image: "https://images.unsplash.com/photo-1563233269-7e86880558a7?w=800",
        description: "Discover the elegant ritual that embodies centuries of Japanese cultural refinement.",
        content: "The Japanese tea ceremony, known as 'chanoyu' or 'sado,' is a choreographed ritual of preparing and serving Japanese green tea. Rooted in Zen Buddhism, this centuries-old practice is much more than just drinking tea—it's a spiritual experience that emphasizes harmony, respect, purity, and tranquility. Every movement in the ceremony is deliberate and meaningful, from the way the tea is whisked to how the bowl is turned. The tea room itself is designed to create a peaceful atmosphere, often featuring minimalist aesthetics and natural elements. Participating in a tea ceremony offers a profound insight into Japanese culture and philosophy.",
        date: "2025-10-08",
        likes: 34
    },
    {
        id: 5,
        title: "Minimalist Living: Less is More",
        author: "Emma Wilson",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
        description: "Learn how simplifying your life can lead to greater happiness and fulfillment.",
        content: "Minimalism is more than just having fewer possessions—it's a lifestyle philosophy that focuses on what truly matters. By removing excess and clutter from our lives, we create space for experiences, relationships, and personal growth. Minimalist living can reduce stress, save money, and increase productivity. It encourages us to be more mindful about our consumption habits and their impact on the environment. Starting small, like decluttering one room at a time, can lead to significant changes. The goal isn't to own as little as possible, but to ensure that everything you own adds value to your life.",
        date: "2025-10-05",
        likes: 56
    },
    {
        id: 6,
        title: "Artificial Intelligence: The Future is Now",
        author: "Alex Thompson",
        category: "Technology",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        description: "Explore how AI is transforming industries and reshaping our daily lives.",
        content: "Artificial Intelligence is no longer science fiction—it's an integral part of our daily lives. From virtual assistants like Siri and Alexa to recommendation algorithms on Netflix and Spotify, AI is everywhere. Machine learning enables computers to learn from data and improve their performance without explicit programming. Deep learning, a subset of ML, powers breakthrough applications in image recognition, natural language processing, and autonomous vehicles. AI is revolutionizing healthcare through disease diagnosis and drug discovery. However, it also raises important ethical questions about privacy, job displacement, and algorithmic bias. Understanding AI is crucial for navigating our technological future.",
        date: "2025-10-03",
        likes: 92
    },
    {
        id: 7,
        title: "The Fascinating World of Quantum Physics",
        author: "Dr. Rachel Adams",
        category: "Science",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
        description: "Unravel the mysteries of the subatomic world and quantum mechanics.",
        content: "Quantum physics is perhaps the most mind-bending field of science, challenging our everyday understanding of reality. At the quantum level, particles can exist in multiple states simultaneously—a phenomenon called superposition. They can also be 'entangled,' instantaneously affecting each other regardless of distance. These strange behaviors have led to revolutionary technologies like quantum computers, which could solve complex problems exponentially faster than classical computers. Quantum mechanics also explains fundamental aspects of chemistry and electronics. While the field can be counterintuitive, it provides the most accurate description of nature at the smallest scales.",
        date: "2025-10-01",
        likes: 78
    },
    {
        id: 8,
        title: "Why Dogs Make Better Comedians Than Cats",
        author: "John Laughs",
        category: "Comedy",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800",
        description: "A hilarious look at our furry friends and their unintentional comedy gold.",
        content: "Let's face it—dogs are natural comedians. While cats plot world domination from their cardboard boxes, dogs are out there slipping on hardwood floors, chasing their tails, and getting confused by their own reflection. Have you ever seen a dog try to catch a bubble? It's like watching a tiny, furry physicist fail repeatedly at understanding surface tension. And don't even get me started on the 'zoomies'—that random burst of energy where dogs run around like they've had too much coffee and made poor life choices. Sure, cats have their moments of knocking things off tables with that smug look, but dogs? They're the class clowns of the animal kingdom, bringing joy and laughter wherever they go, usually while covered in mud.",
        date: "2025-09-28",
        likes: 123
    }
];

// Initialize blogs - now from MongoDB
async function initializeBlogs() {
    // No longer needed - blogs come from database
    console.log('Blogs loaded from MongoDB');
}

// Get all blogs from API
async function getAllBlogs() {
    return await api.getAllBlogs();
}

// Get single blog by ID from API
async function getBlogById(id) {
    return await api.getBlogById(id);
}

// ========================================
// RENDER BLOGS
// ========================================

async function renderBlogs(blogs = null, containerId = 'blogsContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Show loading
    container.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading blogs...</p></div>';
    
    // If blogs not provided, fetch them
    if (!blogs) {
        blogs = await getAllBlogs();
    }
    
    if (blogs.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="no-blogs">
                    <i class="fas fa-folder-open"></i>
                    <h3>No blogs found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    blogs.forEach(blog => {
        const blogCard = createBlogCard(blog);
        container.appendChild(blogCard);
    });
}

// Create blog card element
function createBlogCard(blog) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    const categoryColor = getCategoryColor(blog.category);
    const blogId = blog._id || blog.id; // Handle both MongoDB _id and local id
    
    col.innerHTML = `
        <div class="blog-card" onclick="openBlogModal('${blogId}')">
            <div class="blog-card-img-wrapper">
                <img src="${blog.image}" alt="${blog.title}" class="blog-card-img" onerror="this.src='https://via.placeholder.com/400x220?text=Blog+Image'">
                <span class="blog-card-category" style="background-color: ${categoryColor}">
                    ${blog.category}
                </span>
            </div>
            <div class="blog-card-body">
                <h5 class="blog-card-title">${blog.title}</h5>
                <p class="blog-card-text">${blog.description}</p>
                <div class="blog-card-meta">
                    <div class="blog-card-author">
                        <i class="fas fa-user"></i>
                        <span>${blog.authorName || blog.author?.name || 'Unknown'}</span>
                    </div>
                    <div class="blog-card-date">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(blog.createdAt || blog.date)}</span>
                    </div>
                </div>
                <div class="mt-2">
                    <span class="blog-likes" onclick="event.stopPropagation(); likeBlog('${blogId}')">
                        <i class="fas fa-heart"></i>
                        <span id="likes-${blogId}">${blog.likes || 0}</span>
                    </span>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

// ========================================
// BLOG MODAL
// ========================================

async function openBlogModal(blogId) {
    const blog = await getBlogById(blogId);
    if (!blog) {
        showErrorMessage('Blog not found');
        return;
    }
    
    const modal = document.getElementById('blogModal');
    if (!modal) return;
    
    const categoryColor = getCategoryColor(blog.category);
    
    document.getElementById('modalBlogTitle').textContent = blog.title;
    document.getElementById('modalBlogCategory').innerHTML = `
        <span class="badge" style="background-color: ${categoryColor}">${blog.category}</span>
    `;
    document.getElementById('modalBlogAuthor').innerHTML = `
        <i class="fas fa-user me-2"></i>${blog.authorName || blog.author?.name || 'Unknown'}
    `;
    document.getElementById('modalBlogDate').innerHTML = `
        <i class="fas fa-calendar me-2"></i>${formatDate(blog.createdAt || blog.date)}
    `;
    document.getElementById('modalBlogImage').src = blog.image;
    document.getElementById('modalBlogImage').onerror = function() {
        this.src = 'https://via.placeholder.com/800x400?text=Blog+Image';
    };
    document.getElementById('modalBlogContent').innerHTML = blog.content.replace(/\n/g, '<br><br>');
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
}

// ========================================
// LIKE FUNCTIONALITY
// ========================================

async function likeBlog(blogId) {
    if (!api.isLoggedIn()) {
        showErrorMessage('Please login to like blogs');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const result = await api.likeBlog(blogId);
    
    if (result && result.success) {
        // Update UI
        const likesElement = document.getElementById(`likes-${blogId}`);
        if (likesElement) {
            likesElement.textContent = result.data.likes;
        }
        
        // Show animation
        const likeBtn = event.currentTarget;
        likeBtn.style.transform = 'scale(1.3)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

// ========================================
// SEARCH & FILTER
// ========================================

function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterBlogs);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterBlogs);
    }
}

async function filterBlogs() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const category = document.getElementById('categoryFilter')?.value || '';
    
    // Build query parameters
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (category && category !== 'all') params.category = category;
    
    // Fetch filtered blogs from API
    const blogs = await api.getAllBlogs(params);
    
    await renderBlogs(blogs);
}

// ========================================
// FEATURED BLOGS (Homepage)
// ========================================

async function loadFeaturedBlogs() {
    const container = document.getElementById('featuredBlogs');
    if (!container) return;
    
    const blogs = await api.getAllBlogs({ limit: 6 }); // Get first 6 blogs
    await renderBlogs(blogs, 'featuredBlogs');
}

// ========================================
// LOAD ALL BLOGS (Blog List Page)
// ========================================

async function loadAllBlogs() {
    const urlParams = new URLSearchParams(window.location.search);
    const myBlogs = urlParams.get('myblogs');
    
    if (myBlogs === 'true' && api.isLoggedIn()) {
        // Load user's own blogs
        const blogs = await api.getMyBlogs();
        await renderBlogs(blogs);
    } else {
        await renderBlogs();
    }
}

// ========================================
// INITIALIZE
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeBlogs();
    
    // Check which page we're on and load appropriate content
    if (document.getElementById('featuredBlogs')) {
        loadFeaturedBlogs();
    }
    
    if (document.getElementById('blogsContainer')) {
        loadAllBlogs();
        initSearchAndFilter();
    }
});
