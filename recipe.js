// Shopping Cart Functionality
let cart = [];
let cartCount = 0;

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('recipeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        cartCount = cart.length;
        updateCartBadge();
    }
}

// Add to cart
function addToCart(recipeName, price, image) {
    const recipe = {
        id: Date.now(),
        name: recipeName,
        price: price,
        image: image
    };
    
    cart.push(recipe);
    cartCount = cart.length;
    localStorage.setItem('recipeCart', JSON.stringify(cart));
    updateCartBadge();
    showNotification(`${recipeName} added to cart!`);
}

// Update cart badge
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add buy buttons to recipe cards
function addBuyButtons() {
    const recipeCards = document.querySelectorAll('.Image');
    recipeCards.forEach(card => {
        const h4 = card.querySelector('h4');
        if (h4 && !card.querySelector('.buy-button')) {
            const text = h4.textContent;
            const priceMatch = text.match(/Rs:(\d+)/);
            const nameMatch = text.match(/Recipe:(.+?)(?:\s|Weight:)/);
            
            if (priceMatch && nameMatch) {
                const price = parseInt(priceMatch[1]);
                const name = nameMatch[1].trim();
                const img = card.querySelector('img');
                const imageSrc = img ? img.src : '';
                
                const buyButton = document.createElement('button');
                buyButton.className = 'buy-button';
                buyButton.textContent = 'Add to Cart';
                buyButton.onclick = () => addToCart(name, price, imageSrc);
                card.appendChild(buyButton);
            }
        }
    });
}

// Create cart icon
function createCartIcon() {
    const cartIcon = document.createElement('div');
    cartIcon.className = 'cart-icon';
    cartIcon.innerHTML = `
        🛒
        <div class="cart-badge" style="display: ${cartCount > 0 ? 'flex' : 'none'}">${cartCount}</div>
    `;
    cartIcon.onclick = () => {
        if (cart.length > 0) {
            alert(`Cart Items (${cart.length}):\n\n${cart.map(item => `• ${item.name} - Rs.${item.price}`).join('\n')}\n\nTotal: Rs.${cart.reduce((sum, item) => sum + item.price, 0)}`);
        } else {
            alert('Your cart is empty!');
        }
    };
    document.body.appendChild(cartIcon);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initCart();
    addBuyButtons();
    createCartIcon();
});
