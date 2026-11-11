import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Star, Filter, ArrowLeft, Clock, Plus, Check } from 'lucide-react';
import { formatCurrency, useDebounce, useNotificationStore } from '@epadash/shared';
import { useCartStore } from '@/stores/cart-store';

const allItems = [
  {
    id: 's_1',
    name: 'Assorted Meat Party Jollof',
    merchant: 'Buka Restaurant Osu',
    merchantId: 'm1',
    price: 65,
    rating: 4.9,
    category: 'Jollof',
    prepTime: '20 min',
    image: '/images/jollof.webp',
    description: 'Smoky firewood Ghanaian party jollof with goat meat, beef, and shito.',
  },
  {
    id: 's_2',
    name: 'Banku with Grilled Tilapia & Pepper',
    merchant: 'Mama Lit Kitchen Labone',
    merchantId: 'm3',
    price: 75,
    rating: 4.9,
    category: 'Local',
    prepTime: '25 min',
    image: '/images/banku.webp',
    description: 'Steamed corn-cassava dough with grilled tilapia and raw hot pepper.',
  },
  {
    id: 's_3',
    name: 'Traditional Banku & Okro Stew',
    merchant: 'Mama Lit Kitchen Labone',
    merchantId: 'm3',
    price: 58,
    rating: 4.8,
    category: 'Local',
    prepTime: '20 min',
    image: '/images/bank2.webp',
    description: 'Fresh banku with thick seafood, crab, and wele okro stew.',
  },
  {
    id: 's_4',
    name: 'Silky Fufu with Goat Meat Light Soup',
    merchant: 'Mama Lit Kitchen Labone',
    merchantId: 'm3',
    price: 70,
    rating: 4.9,
    category: 'Local',
    prepTime: '25 min',
    image: '/images/fufu.jpg',
    description: 'Silky pounded fufu in rich tomato ginger goat meat light soup.',
  },
  {
    id: 's_5',
    name: 'Pounded Fufu with Rich Groundnut Soup',
    merchant: 'Mama Lit Kitchen Labone',
    merchantId: 'm3',
    price: 68,
    rating: 4.8,
    category: 'Local',
    prepTime: '25 min',
    image: '/images/fufu-3.webp',
    description: 'Authentic fufu served with rich roasted peanut soup and smoked fish.',
  },
  {
    id: 's_6',
    name: 'Assorted Fried Rice Platter',
    merchant: 'Starbites Food Bar',
    merchantId: 'm2',
    price: 60,
    rating: 4.8,
    category: 'Fried Rice',
    prepTime: '15 min',
    image: '/images/firedrice.webp',
    description: 'Special wok-tossed fried rice with chicken, beef, egg, and coleslaw.',
  },
  {
    id: 's_7',
    name: 'Crispy Fried Wings & Yam Chips',
    merchant: 'Starbites Food Bar',
    merchantId: 'm2',
    price: 55,
    rating: 4.7,
    category: 'Grills',
    prepTime: '15 min',
    image: '/images/fried.webp',
    description: 'Golden seasoned chicken wings with deep-fried sweet puna yam fries.',
  },
  {
    id: 's_8',
    name: 'Street-Style Loaded Indomie Special',
    merchant: 'Buka Restaurant Osu',
    merchantId: 'm1',
    price: 35,
    rating: 4.8,
    category: 'Fast Food',
    prepTime: '10 min',
    image: '/images/indomie.jpg',
    description: 'Stir-fried indomie with chili, fried egg, sausages, and sardines.',
  },
  {
    id: 's_9',
    name: 'Flaky Golden Beef Meat Pie (2 pcs)',
    merchant: 'Starbites Food Bar',
    merchantId: 'm2',
    price: 24,
    rating: 4.8,
    category: 'Pastries',
    prepTime: '5 min',
    image: '/images/pie.webp',
    description: 'Flaky pastry filled with seasoned minced beef, potatoes, and onions.',
  },
  {
    id: 's_10',
    name: 'Spicy Peppered Gizzard Skewers',
    merchant: 'Buka Restaurant Osu',
    merchantId: 'm1',
    price: 45,
    rating: 4.9,
    category: 'Grills',
    prepTime: '15 min',
    image: '/images/zizard.webp',
    description: 'Tender chicken gizzard tossed in spicy pepper sauce and fried plantain.',
  },
  {
    id: 's_11',
    name: 'Gourmet Double Cheese Burger',
    merchant: 'Starbites Food Bar',
    merchantId: 'm2',
    price: 65,
    rating: 4.7,
    category: 'Burgers',
    prepTime: '15 min',
    image: '/images/cheese.webp',
    description: 'Double beef patty with melted cheddar, caramelized onions, and fries.',
  },
  {
    id: 's_12',
    name: 'Chilled Hibiscus Sobolo (500ml)',
    merchant: 'Buka Restaurant Osu',
    merchantId: 'm1',
    price: 18,
    rating: 4.8,
    category: 'Drinks',
    prepTime: '2 min',
    image: '/images/bels.jpg',
    description: 'Natural dried roselle with pineapple juice, cloves, and fresh mint.',
  },
];

const filterTags = ['All', 'Jollof', 'Local', 'Fried Rice', 'Burgers', 'Grills', 'Fast Food', 'Pastries', 'Drinks'];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const debouncedQuery = useDebounce(query, 200);
  const { addItem, items } = useCartStore();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const filteredItems = allItems.filter((item) => {
    const matchesTag = activeTag === 'All' ? true : item.category === activeTag;
    const matchesQuery =
      debouncedQuery.trim() === ''
        ? true
        : item.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.merchant.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(debouncedQuery.toLowerCase());

    return matchesTag && matchesQuery;
  });

  const handleQuickAdd = (item, e) => {
    e.stopPropagation();
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      merchantId: item.merchantId,
      merchantName: item.merchant,
      imageUrl: item.image,
    });
    addNotification({
      type: 'success',
      title: 'Added to Basket',
      message: `${item.name} added to your order.`,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Search Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Ghanaian favorites, restaurants, snacks..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm"
            autoFocus
          />
        </div>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filterTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTag === tag
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          Found <strong>{filteredItems.length}</strong> matching dishes
        </span>
        {query && (
          <button onClick={() => setQuery('')} className="text-emerald-700 font-semibold hover:underline">
            Clear query
          </button>
        )}
      </div>

      {/* Dish Grid with Real Food Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const inCart = items.find((i) => i.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/merchant/${item.merchantId}`)}
              className="group p-4 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 hover:shadow-md cursor-pointer transition-all flex gap-4 items-center justify-between"
            >
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{item.merchant}</p>
                <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="font-extrabold text-emerald-700 text-sm">{formatCurrency(item.price)}</span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{item.rating}</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                    <Clock className="h-3 w-3" /> {item.prepTime}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => handleQuickAdd(item, e)}
                className={`p-2.5 rounded-xl shrink-0 transition-all ${
                  inCart
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                }`}
                title={inCart ? 'In cart' : 'Add to cart'}
              >
                {inCart ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
