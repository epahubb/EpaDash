import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, formatCurrency, Button, useNotificationStore } from '@epadash/shared';
import { useCartStore } from '@/stores/cart-store';
import {
  Search,
  Star,
  Clock,
  Bike,
  Sparkles,
  Flame,
  CheckCircle2,
  Activity,
  Plus,
  Check,
  TrendingUp,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { TestBackendService } from '@epadash/shared';

const categories = [
  { id: '1', name: 'Party Jollof', image: '/images/jollof.webp', count: 48, tag: 'Ghana Favorite' },
  { id: '2', name: 'Banku & Tilapia', image: '/images/banku.webp', count: 32, tag: 'Traditional' },
  { id: '3', name: 'Local Soups & Fufu', image: '/images/fufu.jpg', count: 27, tag: 'Authentic' },
  { id: '4', name: 'Fried Rice & Grills', image: '/images/firedrice.webp', count: 41, tag: 'Bestseller' },
  { id: '5', name: 'Burgers & Fries', image: '/images/cheese.webp', count: 29, tag: 'Fast Food' },
  { id: '6', name: 'Street Indomie', image: '/images/indomie.jpg', count: 36, tag: 'Late Night' },
  { id: '7', name: 'Pies & Pastries', image: '/images/pie.webp', count: 22, tag: 'Snacks' },
  { id: '8', name: 'Spicy Gizzard', image: '/images/zizard.webp', count: 19, tag: 'Grill Spot' },
];

const featuredMerchants = [
  {
    id: 'm1',
    name: 'Buka Restaurant Osu',
    category: 'Ghanaian & West African Specialities',
    rating: 4.9,
    reviews: 482,
    deliveryTime: '20-30 min',
    deliveryFee: 12,
    bannerImage: '/images/delicious.jpg',
    featuredItem: 'Assorted Firewood Jollof with Tilapia',
    featuredThumb: '/images/jollof.webp',
    tag: '20% OFF FIRST ORDER',
  },
  {
    id: 'm2',
    name: 'Starbites Food Bar',
    category: 'Continental Grills & Gourmet Burgers',
    rating: 4.7,
    reviews: 512,
    deliveryTime: '25-40 min',
    deliveryFee: 15,
    bannerImage: '/images/cheese.webp',
    featuredItem: 'Double Bacon Burger & Crispy Wings',
    featuredThumb: '/images/fried.webp',
    tag: 'FREE DRINK OVER GH₵ 100',
  },
  {
    id: 'm3',
    name: 'Mama Lit Kitchen Labone',
    category: 'Authentic Banku & Steaming Soups',
    rating: 4.9,
    reviews: 320,
    deliveryTime: '20-35 min',
    deliveryFee: 10,
    bannerImage: '/images/banku.webp',
    featuredItem: 'Banku with Hot Pepper & Tilapia',
    featuredThumb: '/images/bank2.webp',
    tag: 'TOP RATED LOCAL',
  },
];

const trendingDishes = [
  {
    id: 'td_1',
    name: 'Signature Assorted Meat Jollof',
    merchant: 'Buka Restaurant Osu',
    merchantId: 'm1',
    price: 65,
    rating: 4.9,
    prepTime: '15-20 min',
    image: '/images/jollof.webp',
    description: 'Smoky firewood Ghanaian party jollof with goat meat, beef chunks, fried plantain and homemade shito.',
  },
  {
    id: 'td_2',
    name: 'Banku with Grilled Tilapia & Pepper',
    merchant: 'Mama Lit Kitchen Labone',
    merchantId: 'm3',
    price: 75,
    rating: 4.9,
    prepTime: '20-25 min',
    image: '/images/banku.webp',
    description: 'Fresh fermented corn and cassava dough served with well-seasoned charcoal-grilled tilapia and raw hot pepper.',
  },
  {
    id: 'td_3',
    name: 'Special Assorted Fried Rice Platter',
    merchant: 'Starbites Food Bar',
    merchantId: 'm2',
    price: 60,
    rating: 4.8,
    prepTime: '15 min',
    image: '/images/firedrice.webp',
    description: 'Wok-tossed seasoned rice loaded with shredded chicken, beef, spring onions, eggs, and sweet carrots.',
  },
  {
    id: 'td_4',
    name: 'Light Soup Fufu with Goat Meat',
    merchant: 'Mama Lit Kitchen Labone',
    merchantId: 'm3',
    price: 70,
    rating: 4.9,
    prepTime: '25 min',
    image: '/images/fufu.jpg',
    description: 'Silky pounded cassava and plantain fufu bathed in rich, aromatic tomato and ginger goat meat light soup.',
  },
  {
    id: 'td_5',
    name: 'Supreme Cheesy Beef Burger',
    merchant: 'Starbites Food Bar',
    merchantId: 'm2',
    price: 65,
    rating: 4.7,
    prepTime: '15-20 min',
    image: '/images/cheese.webp',
    description: 'Double grilled beef patty with melted cheddar cheese, caramelized onions, crisp lettuce, and special sauce.',
  },
  {
    id: 'td_6',
    name: 'Street-Style Loaded Indomie Special',
    merchant: 'Buka Restaurant Osu',
    merchantId: 'm1',
    price: 35,
    rating: 4.8,
    prepTime: '10-15 min',
    image: '/images/indomie.jpg',
    description: 'Stir-fried noodles with hot chili, fried egg, diced sausages, sardine, and fresh bell peppers.',
  },
  {
    id: 'td_7',
    name: 'Flaky Golden Beef Meat Pie (2 pcs)',
    merchant: 'Starbites Food Bar',
    merchantId: 'm2',
    price: 24,
    rating: 4.8,
    prepTime: '5 min',
    image: '/images/pie.webp',
    description: 'Freshly baked buttery pastry filled with seasoned minced beef, potatoes, onions, and aromatic herbs.',
  },
  {
    id: 'td_8',
    name: 'Spicy Peppered Gizzard Skewers',
    merchant: 'Buka Restaurant Osu',
    merchantId: 'm1',
    price: 45,
    rating: 4.9,
    prepTime: '15 min',
    image: '/images/zizard.webp',
    description: 'Tender chicken gizzards slow-cooked and tossed in spicy bell pepper relish with fried sweet plantain.',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { addItem, items } = useCartStore();
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [testResult, setTestResult] = useState({ status: 'idle' });

  const runBackendTest = async () => {
    setTestResult({ status: 'loading' });
    try {
      const res = await TestBackendService.testEcho({
        client: 'EpaDash Customer App',
        user: user?.name,
        timestamp: new Date().toISOString(),
      });
      setTestResult({ status: 'success', data: res.data });
    } catch (err) {
      setTestResult({ status: 'error', error: err.message || 'Connection test failed' });
    }
  };

  const handleQuickAdd = (dish, e) => {
    e.stopPropagation();
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      merchantId: dish.merchantId,
      merchantName: dish.merchant,
      imageUrl: dish.image,
    });
    addNotification({
      type: 'success',
      title: 'Added to Basket',
      message: `${dish.name} from ${dish.merchant} added to your order.`,
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* ──────────────── Hero Welcome Banner ──────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-emerald-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Fastest hot meal delivery in Accra, Kumasi & Takoradi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Craving something special, {user?.name?.split(' ')[0] || 'Friend'}?
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-lg">
            Order authentic Ghanaian dishes, street favorites, and gourmet fast food delivered fresh and steaming to your doorstep.
          </p>

          <div
            onClick={() => navigate('/search')}
            className="flex items-center gap-3 bg-white text-gray-900 rounded-2xl px-4 py-3.5 shadow-lg cursor-pointer hover:bg-gray-50 transition-all group"
          >
            <Search className="h-5 w-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            <span className="text-sm text-gray-500 font-normal flex-1">
              Search for Jollof, Banku, Fufu, Burgers, Indomie...
            </span>
            <span className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-xl shadow-sm group-hover:bg-emerald-700 transition-colors">
              Find Food
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-emerald-100 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" /> Live GPS tracking
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-300" /> Mobile Money & Card
            </span>
            <span className="flex items-center gap-1.5">
              <Bike className="h-4 w-4 text-emerald-300" /> Avg. 25 min delivery
            </span>
          </div>
        </div>

        {/* Hero Decorative Food Showcase */}
        <div className="hidden lg:block absolute -right-6 -bottom-6 w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl opacity-90 transform hover:scale-105 transition-transform duration-500">
          <img
            src="/images/jollof.webp"
            alt="Ghanaian Jollof Rice"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
            <span className="text-xs font-bold text-white bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-full">
              Authentic Firewood Jollof
            </span>
          </div>
        </div>
      </div>

      {/* ──────────────── Backend API Live Communication Tester ──────────────── */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">API Gateway & Centralised Service</h3>
              <p className="text-xs text-gray-600">
                Verify centralized Axios interceptors, auth headers, and response normalization.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="primary"
            isLoading={testResult.status === 'loading'}
            onClick={runBackendTest}
            leftIcon={<Activity className="h-4 w-4" />}
          >
            Ping Test Endpoint
          </Button>
        </div>

        {testResult.status === 'success' && (
          <div className="mt-4 p-3.5 rounded-xl bg-white border border-emerald-200 text-xs text-gray-800 space-y-1">
            <div className="flex items-center gap-2 font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>Backend Connected Successfully!</span>
            </div>
            <p className="text-gray-600">
              Response verified through centralized <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">ApiService.post</code>.
            </p>
            <pre className="text-[11px] text-gray-600 overflow-x-auto bg-gray-50 p-2.5 rounded-lg mt-1 font-mono">
              {JSON.stringify(testResult.data, null, 2)}
            </pre>
          </div>
        )}

        {testResult.status === 'error' && (
          <div className="mt-4 p-3 rounded-xl bg-white border border-red-200 text-xs text-red-700">
            <strong>Endpoint test returned error:</strong> {testResult.error}
          </div>
        )}
      </div>

      {/* ──────────────── Categories Section with Real Food Photos ──────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Explore Food Categories</h2>
            <p className="text-xs text-gray-500 mt-0.5">Fresh dishes prepared daily by trusted local kitchens</p>
          </div>
          <span
            onClick={() => navigate('/search')}
            className="text-xs font-bold text-emerald-600 cursor-pointer hover:underline flex items-center gap-1"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('/search')}
              className="group flex flex-col items-center p-3 bg-white rounded-2xl border border-gray-100 hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all duration-200 text-center"
            >
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden mb-2 shadow-sm group-hover:scale-105 transition-transform">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <span className="text-xs font-bold text-gray-900 line-clamp-1">{cat.name}</span>
              <span className="text-[10px] text-gray-400 mt-0.5">{cat.count} spots</span>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────── Trending Dishes (Direct Add to Cart) ──────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Trending Dishes Near You</h2>
              <p className="text-xs text-gray-500">Most ordered Ghanaian favorites right now</p>
            </div>
          </div>
          <span
            onClick={() => navigate('/search')}
            className="text-xs font-bold text-emerald-600 cursor-pointer hover:underline flex items-center gap-1"
          >
            See full menu <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingDishes.map((dish) => {
            const inCart = items.find((i) => i.id === dish.id);
            return (
              <div
                key={dish.id}
                onClick={() => navigate(`/merchant/${dish.merchantId}`)}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-200 cursor-pointer transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-800 shadow-sm flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{dish.rating}</span>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-white flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{dish.prepTime}</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <p className="text-[11px] font-medium text-emerald-700">{dish.merchant}</p>
                    <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {dish.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {dish.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                  <span className="text-base font-extrabold text-gray-900">
                    {formatCurrency(dish.price)}
                  </span>
                  <button
                    onClick={(e) => handleQuickAdd(dish, e)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inCart
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Added ({inCart.quantity})</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──────────────── Featured Merchants with Real Banners ──────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Featured Restaurants & Kitchens</h2>
              <p className="text-xs text-gray-500">Verified hygiene, top ratings, and fast pickup</p>
            </div>
          </div>
          <span
            onClick={() => navigate('/search')}
            className="text-xs font-bold text-emerald-600 cursor-pointer hover:underline flex items-center gap-1"
          >
            See all <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMerchants.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate(`/merchant/${m.id}`)}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              {/* Banner Area with Real Food Photo */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-900">
                <img
                  src={m.bannerImage}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-sm">
                    {m.tag}
                  </span>
                  <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{m.rating}</span>
                    <span className="text-gray-400 font-normal">({m.reviews})</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white shrink-0">
                    <img src={m.featuredThumb} alt="Dish" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-white text-xs">
                    <p className="text-emerald-300 text-[10px] uppercase font-bold tracking-wider">Top Seller</p>
                    <p className="font-semibold line-clamp-1">{m.featuredItem}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {m.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{m.category}</p>
                </div>

                <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{m.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-gray-900">
                    <Bike className="h-4 w-4 text-emerald-600" />
                    <span>{formatCurrency(m.deliveryFee)} delivery</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
