const { useState, useMemo, useEffect } = React;

const recipesData = [
  {
    id: 1,
    name: 'Stuffed Eggplants',
    description: 'Eggplants stuffed with spiced yogurt and herbs.',
    price: 130,
    weight: '150g',
    category: 'Breakfast & Brunch',
    rating: 4.3,
    ratingCount: 32,
    image: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    extras: [
      { label: 'Extra Cheese', price: 25 },
      { label: 'Chilli Flakes', price: 10 },
      { label: 'Lemon Zest', price: 8 },
    ],
  },
  {
    id: 2,
    name: 'Autumn Soup',
    description: 'Creamy roasted pumpkin soup topped with seeds.',
    price: 120,
    weight: '100ml',
    category: 'Lunch',
    rating: 4.1,
    ratingCount: 21,
    image: 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    extras: [
      { label: 'Garlic Croutons', price: 12 },
      { label: 'Cream Swirl', price: 15 },
    ],
  },
  {
    id: 3,
    name: 'Breakfast Buddha Bowl',
    description: 'Grain bowl with veggies, avocado, and tahini.',
    price: 250,
    weight: '200g',
    category: 'Breakfast & Brunch',
    rating: 4.6,
    ratingCount: 44,
    image: 'https://images.unsplash.com/photo-1505576633757-0ac1084af824?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    extras: [
      { label: 'Poached Egg', price: 30 },
      { label: 'Roasted Seeds', price: 18 },
    ],
  },
  {
    id: 4,
    name: 'Avocado & Egg Toast',
    description: 'Sourdough toast with smashed avocado and soft egg.',
    price: 300,
    weight: '250g',
    category: 'Lunch',
    rating: 4.7,
    ratingCount: 53,
    image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    extras: [
      { label: 'Microgreens', price: 15 },
      { label: 'Truffle Oil', price: 35 },
    ],
  },
  {
    id: 5,
    name: 'Mediterranean Salad',
    description: 'Fresh greens, feta, olives, and lemon vinaigrette.',
    price: 250,
    weight: '200g',
    category: 'Dinner & Meal Ideas',
    rating: 4.2,
    ratingCount: 28,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    extras: [
      { label: 'Feta Crumble', price: 20 },
      { label: 'Toasted Pine Nuts', price: 28 },
    ],
  },
  {
    id: 6,
    name: 'Grilled Chicken Platter',
    description: 'Charred chicken with veggies and herb dip.',
    price: 350,
    weight: '300g',
    category: 'Dinner & Meal Ideas',
    rating: 4.5,
    ratingCount: 35,
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    extras: [
      { label: 'Extra Dip', price: 18 },
      { label: 'Grilled Lemon', price: 10 },
    ],
  },
  {
    id: 7,
    name: 'Vegetable Stir Fry',
    description: 'Seasonal veggies tossed in soy-ginger glaze.',
    price: 280,
    weight: '250g',
    category: 'Dinner & Meal Ideas',
    rating: 4.0,
    ratingCount: 19,
    image: 'https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    extras: [
      { label: 'Tofu Cubes', price: 22 },
      { label: 'Sesame Seeds', price: 10 },
    ],
  },
  {
    id: 8,
    name: 'Pasta Carbonara',
    description: 'Classic carbonara with silky egg-parmesan sauce.',
    price: 320,
    weight: '300g',
    category: 'Dinner & Meal Ideas',
    rating: 4.4,
    ratingCount: 41,
    image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
    extras: [
      { label: 'Extra Parmesan', price: 25 },
      { label: 'Crispy Bacon', price: 35 },
    ],
  },
];

const formatCurrency = (value) => `Rs.${value}`;

function Rating({ value, count, onChange }) {
  return (
    <div className="rating rating-control">
      {[5, 4, 3, 2, 1].map((star) => (
        <label key={star} title={`${star} star`} onClick={() => onChange(star)}>
          {star <= Math.round(value) ? '★' : '☆'}
        </label>
      ))}
      <span className="rating-meta">{value.toFixed(1)} ({count})</span>
    </div>
  );
}

function ExtrasSelector({ extras, selected, onToggle }) {
  return (
    <div className="extras">
      {extras.map((extra) => (
        <label key={extra.label} className="extra-pill">
          <input
            type="checkbox"
            checked={selected.includes(extra.label)}
            onChange={() => onToggle(extra)}
          />
          {extra.label} +{formatCurrency(extra.price)}
        </label>
      ))}
    </div>
  );
}

function RecipeCard({
  recipe,
  rating,
  onRate,
  quantity,
  onQuantityChange,
  selectedExtras,
  onToggleExtra,
  onAddToCart,
}) {
  return (
    <div className="Image card">
      <img src={recipe.image} alt={recipe.name} />
      <h4>{recipe.name}</h4>
      <p className="desc">{recipe.description}</p>
      <div className="meta">
        <span>{recipe.weight}</span>
        <span className="price">{formatCurrency(recipe.price)}</span>
      </div>
      <Rating value={rating.value} count={rating.count} onChange={(v) => onRate(recipe.id, v)} />
      <div className="quantity">
        <label>Amount:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => onQuantityChange(recipe.id, Number(e.target.value))}
        />
      </div>
      <ExtrasSelector
        extras={recipe.extras}
        selected={selectedExtras}
        onToggle={(extra) => onToggleExtra(recipe.id, extra)}
      />
      <button className="buy-button" onClick={() => onAddToCart(recipe.id)}>
        Add to Cart
      </button>
    </div>
  );
}

function Cart({ items, onRemove }) {
  const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return (
    <div className="cart-panel">
      <div className="cart-header">
        <span>Cart</span>
        <span className="badge">{items.length}</span>
      </div>
      {items.length === 0 ? (
        <p className="cart-empty">Your cart is empty</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.cartId} className="cart-item">
                <div>
                  <strong>{item.name}</strong> × {item.quantity}
                  <div className="cart-sub">
                    {item.extras.length > 0 ? item.extras.join(', ') : 'No extras'}
                  </div>
                </div>
                <div className="cart-actions">
                  <span>{formatCurrency(item.lineTotal)}</span>
                  <button onClick={() => onRemove(item.cartId)}>✕</button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  const [filter, setFilter] = useState('All');
  const [ratings, setRatings] = useState(() =>
    recipesData.reduce((acc, r) => {
      acc[r.id] = { value: r.rating, count: r.ratingCount };
      return acc;
    }, {})
  );
  const [quantities, setQuantities] = useState(() =>
    recipesData.reduce((acc, r) => ({ ...acc, [r.id]: 1 }), {})
  );
  const [selectedExtras, setSelectedExtras] = useState(() =>
    recipesData.reduce((acc, r) => ({ ...acc, [r.id]: [] }), {})
  );
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('reactRecipeCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reactRecipeCart', JSON.stringify(cart));
  }, [cart]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(recipesData.map((r) => r.category)))],
    []
  );

  const filteredRecipes = useMemo(
    () => recipesData.filter((r) => (filter === 'All' ? true : r.category === filter)),
    [filter]
  );

  const handleRate = (id, value) => {
    setRatings((prev) => {
      const current = prev[id];
      const nextCount = current.count + 1;
      const nextValue = (current.value * current.count + value) / nextCount;
      return { ...prev, [id]: { value: nextValue, count: nextCount } };
    });
  };

  const handleQuantityChange = (id, qty) => {
    const safeQty = Number.isNaN(qty) ? 1 : Math.max(1, Math.min(10, qty));
    setQuantities((prev) => ({ ...prev, [id]: safeQty }));
  };

  const handleToggleExtra = (id, extra) => {
    setSelectedExtras((prev) => {
      const current = prev[id];
      const exists = current.includes(extra.label);
      return {
        ...prev,
        [id]: exists
          ? current.filter((e) => e !== extra.label)
          : [...current, extra.label],
      };
    });
  };

  const handleAddToCart = (id) => {
    const recipe = recipesData.find((r) => r.id === id);
    const qty = quantities[id] ?? 1;
    const extras = selectedExtras[id] ?? [];
    const extrasTotal = recipe.extras
      .filter((e) => extras.includes(e.label))
      .reduce((sum, e) => sum + e.price, 0);
    const lineTotal = (recipe.price + extrasTotal) * qty;

    setCart((prev) => [
      ...prev,
      {
        cartId: Date.now() + Math.random(),
        id: recipe.id,
        name: recipe.name,
        quantity: qty,
        extras,
        lineTotal,
      },
    ]);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  return (
    <div className="react-app">
      <header className="react-header">
        <div>
          <p className="eyebrow">Curated, tested, delicious</p>
          <h1>Recipe Marketplace</h1>
        </div>
        <div className="cart-inline">
          <Cart items={cart} onRemove={handleRemoveFromCart} />
        </div>
      </header>

      <nav className="filter-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      <section className="recipes-container react-grid" id="recipes">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            rating={ratings[recipe.id]}
            onRate={handleRate}
            quantity={quantities[recipe.id]}
            onQuantityChange={handleQuantityChange}
            selectedExtras={selectedExtras[recipe.id]}
            onToggleExtra={handleToggleExtra}
            onAddToCart={handleAddToCart}
          />
        ))}
      </section>

      <footer className="react-footer">
        <div className="footer-cart">
          <Cart items={cart} onRemove={handleRemoveFromCart} />
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
