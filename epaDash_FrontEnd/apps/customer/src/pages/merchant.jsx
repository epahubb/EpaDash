import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Clock,
  Bike,
  ArrowLeft,
  Plus,
  Check,
  ShoppingBag,
  MapPin,
  Phone,
  ShieldCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, Button, useNotificationStore } from '@epadash/shared';
import { useCartStore } from '@/stores/cart-store';

const merchantDetails = {
  id: 'm1',
  name: 'Buka Restaurant Osu',
  cuisine: 'Ghanaian, West African Authentic Cuisine & Grills',
  rating: 4.9,
  reviewsCount: 482,
  deliveryTime: '20-35 mins',
  deliveryFee: 12,
  address: '10th Street, Osu RE, Accra (Near Danquah Circle)',
  phone: '+233 24 488 9900',
  bannerImage: '/images/delicious.jpg',
  categories: ['All Dishes', 'Most Popular', 'Jollof & Rice', 'Soups & Swallows', 'Grills & Sides', 'Drinks'],
  menu: [
    {
      id: 'item_1',
      name: 'Signature Assorted Meat Jollof',
      description: 'Smoky firewood Ghanaian party jollof served with tender goat meat, beef, fried ripe plantain, and fiery homemade shito.',
      price: 65,
      category: 'Jollof & Rice',
      isPopular: true,
      imageUrl: '/images/jollof.webp',
      prepTime: '15-20 min',
    },
    {
      id: 'item_2',
      name: 'Banku with Fresh Tilapia & Hot Pepper',
      description: 'Steamed fermented corn and cassava dough served with seasoned charcoal-grilled tilapia, sliced onions, and raw tomato pepper.',
      price: 75,
      category: 'Soups & Swallows',
      isPopular: true,
      imageUrl: '/images/banku.webp',
      prepTime: '20-25 min',
    },
    {
      id: 'item_3',
      name: 'Special Assorted Fried Rice Platter',
      description: 'Wok-tossed seasoned fragrant rice loaded with chicken chunks, beef, scrambled eggs, sweet peas, and fresh coleslaw.',
      price: 60,
      category: 'Jollof & Rice',
      isPopular: true,
      imageUrl: '/images/firedrice.webp',
      prepTime: '15 min',
    },
    {
      id: 'item_4',
      name: 'Silky Fufu with Light Soup & Goat Meat',
      description: 'Hand-pounded cassava and green plantain fufu served with rich aromatic light soup with choice cuts of tender chevon.',
      price: 70,
      category: 'Soups & Swallows',
      isPopular: true,
      imageUrl: '/images/fufu.jpg',
      prepTime: '20 min',
    },
    {
      id: 'item_5',
      name: 'Traditional Banku with Rich Okro Stew',
      description: 'Two balls of smooth banku paired with thick crab, wele, and smoked fish okro soup topped with red palm oil.',
      price: 58,
      category: 'Soups & Swallows',
      isPopular: false,
      imageUrl: '/images/bank2.webp',
      prepTime: '20 min',
    },
    {
      id: 'item_6',
      name: 'Pounded Fufu with Groundnut Soup & Fish',
      description: 'Velvety fufu immersed in rich roasted peanut soup prepared with smoked salmon, dried shrimp, and tender beef.',
      price: 68,
      category: 'Soups & Swallows',
      isPopular: false,
      imageUrl: '/images/fufu-3.webp',
      prepTime: '25 min',
    },
    {
      id: 'item_7',
      name: 'Crispy Fried Chicken Wings & Yam Chips',
      description: 'Six golden deep-fried chicken wings marinated in ginger-garlic spice blend, served with deep-fried sweet pona yam chips.',
      price: 55,
      category: 'Grills & Sides',
      isPopular: false,
      imageUrl: '/images/fried.webp',
      prepTime: '15 min',
    },
    {
      id: 'item_8',
      name: 'Street-Style Loaded Indomie Special',
      description: 'Noodles stir-fried with hot chili, fried egg, diced sausages, sardine, and crunchy sweet peppers.',
      price: 35,
      category: 'Grills & Sides',
      isPopular: true,
      imageUrl: '/images/indomie.jpg',
      prepTime: '10-15 min',
    },
    {
      id: 'item_9',
      name: 'Spicy Peppered Gizzard Skewers',
      description: 'Charcoal-grilled tender chicken gizzards tossed in fiery bell pepper relish and caramelized onions.',
      price: 45,
      category: 'Grills & Sides',
      isPopular: true,
      imageUrl: '/images/zizard.webp',
      prepTime: '15 min',
    },
    {
      id: 'item_10',
      name: 'Flaky Golden Meat Pie (Pack of 2)',
      description: 'Freshly oven-baked puff pastry filled with well-seasoned minced beef, potatoes, carrots, and thyme.',
      price: 24,
      category: 'Grills & Sides',
      isPopular: false,
      imageUrl: '/images/pie.webp',
      prepTime: '5 min',
    },
    {
      id: 'item_11',
      name: 'Gourmet Double Cheese Burger',
      description: 'Double grilled beef patty with melted cheddar cheese, caramelized onions, crisp lettuce, and special burger sauce.',
      price: 65,
      category: 'Grills & Sides',
      isPopular: false,
      imageUrl: '/images/cheese.webp',
      prepTime: '15-20 min',
    },
    {
      id: 'item_12',
      name: 'Chilled Hibiscus Sobolo (500ml Bottle)',
      description: 'Natural dried roselle leaves steeped with crushed pineapple, cloves, ginger, and fresh mint.',
      price: 18,
      category: 'Drinks',
      isPopular: true,
      imageUrl: '/images/bels.jpg',
      prepTime: '2 min',
    },
  ],
};

export default function MerchantPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All Dishes');
  const [searchQuery, setSearchQuery] = useState('');
  const { addItem, items, total } = useCartStore();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const filteredMenu = merchantDetails.menu.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Dishes'
        ? true
        : selectedCategory === 'Most Popular'
        ? item.isPopular
        : item.category === selectedCategory;

    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const cartTotal = total();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddItem = (item) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      merchantId: merchantDetails.id,
      merchantName: merchantDetails.name,
      imageUrl: item.imageUrl,
    });
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${item.name} added to your order.`,
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to all restaurants
      </button>

      {/* ──────────────── Merchant Header Hero with Real Food Photo ──────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-xl">
        <div className="absolute inset-0">
          <img
            src={merchantDetails.bannerImage}
            alt={merchantDetails.name}
            className="w-full h-full object-cover opacity-40 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
              <span>Verified Merchant & Halal Certified</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {merchantDetails.name}
            </h1>
            <p className="text-sm text-gray-200 font-medium">{merchantDetails.cuisine}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                {merchantDetails.address}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                {merchantDetails.phone}
              </span>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="flex items-center gap-1.5 bg-white text-gray-900 px-3 py-1.5 rounded-xl text-sm font-extrabold shadow-sm">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{merchantDetails.rating}</span>
              <span className="text-xs text-gray-500 font-normal">({merchantDetails.reviewsCount} reviews)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/90 font-medium">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-emerald-400" /> {merchantDetails.deliveryTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Bike className="h-3.5 w-3.5 text-emerald-400" /> {formatCurrency(merchantDetails.deliveryFee)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── Search & Category Filter Navigation ──────────────── */}
      <div className="space-y-3 sticky top-16 z-20 bg-gray-50/95 backdrop-blur-md py-2">
        <div className="relative max-w-md">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in this restaurant's menu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {merchantDetails.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ──────────────── Menu Items Grid with Real Food Photos ──────────────── */}
      <div>
        <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
          <span>Showing {filteredMenu.length} delicious dishes</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-emerald-700 font-semibold hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMenu.map((item) => {
            const itemInCart = items.find((i) => i.id === item.id);
            return (
              <div
                key={item.id}
                className="group p-4 sm:p-5 bg-white rounded-3xl border border-gray-100 hover:border-emerald-200 shadow-sm hover:shadow-md transition-all flex flex-col-reverse sm:flex-row justify-between gap-4"
              >
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                        {item.name}
                      </h3>
                      {item.isPopular && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-emerald-700 text-base">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-[10px] text-gray-400">({item.prepTime})</span>
                    </div>

                    <button
                      onClick={() => handleAddItem(item)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        itemInCart
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      }`}
                    >
                      {itemInCart ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Added ({itemInCart.quantity})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add to order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative w-full sm:w-32 h-36 sm:h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────────────── Floating Bottom Cart Bar ──────────────── */}
      {itemCount > 0 && (
        <div className="fixed bottom-20 lg:bottom-6 inset-x-4 max-w-xl mx-auto z-40 animate-in slide-in-from-bottom-4 duration-300">
          <div
            onClick={() => navigate('/cart')}
            className="flex items-center justify-between bg-emerald-700 text-white p-4 rounded-2xl shadow-2xl hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-800/90 p-2.5 rounded-xl">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-200">{itemCount} items selected</p>
                <p className="text-base font-extrabold">{formatCurrency(cartTotal)}</p>
              </div>
            </div>
            <span className="text-sm font-bold bg-white text-emerald-800 px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-50 transition-colors">
              Checkout Now →
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
