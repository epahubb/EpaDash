import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, Button, useNotificationStore } from '@epadash/shared';
import { Plus, Edit2, Power, Clock, Search } from 'lucide-react';

const initialMenuItems = [
  {
    id: 'm_1',
    name: 'Signature Assorted Meat Jollof',
    description: 'Smoky firewood Ghanaian party jollof with goat meat, beef, and shito.',
    price: 65,
    category: 'Jollof & Rice',
    isAvailable: true,
    prepTime: '15-20 min',
    imageUrl: '/images/jollof.webp',
  },
  {
    id: 'm_2',
    name: 'Banku with Fresh Tilapia & Hot Pepper',
    description: 'Steamed corn and cassava dough served with grilled spicy tilapia and fresh pepper.',
    price: 75,
    category: 'Swallows & Soups',
    isAvailable: true,
    prepTime: '20-25 min',
    imageUrl: '/images/banku.webp',
  },
  {
    id: 'm_3',
    name: 'Special Assorted Fried Rice Platter',
    description: 'Fragrant wok-tossed fried rice with chicken chunks, beef, scrambled eggs, and salad.',
    price: 60,
    category: 'Jollof & Rice',
    isAvailable: true,
    prepTime: '15 min',
    imageUrl: '/images/firedrice.webp',
  },
  {
    id: 'm_4',
    name: 'Silky Fufu with Goat Meat Light Soup',
    description: 'Hand-pounded cassava & plantain fufu served with rich tomato-ginger goat meat light soup.',
    price: 70,
    category: 'Swallows & Soups',
    isAvailable: true,
    prepTime: '20 min',
    imageUrl: '/images/fufu.jpg',
  },
  {
    id: 'm_5',
    name: 'Traditional Banku with Rich Okro Stew',
    description: 'Smooth banku paired with thick crab, wele, and smoked fish okro soup.',
    price: 58,
    category: 'Swallows & Soups',
    isAvailable: true,
    prepTime: '20 min',
    imageUrl: '/images/bank2.webp',
  },
  {
    id: 'm_6',
    name: 'Pounded Fufu with Rich Groundnut Soup',
    description: 'Silky fufu immersed in rich roasted peanut soup prepared with smoked salmon and beef.',
    price: 68,
    category: 'Swallows & Soups',
    isAvailable: true,
    prepTime: '25 min',
    imageUrl: '/images/fufu-3.webp',
  },
  {
    id: 'm_7',
    name: 'Crispy Fried Chicken Wings & Yam Chips',
    description: 'Golden chicken wings marinated in spices, served with deep-fried pona yam chips.',
    price: 55,
    category: 'Sides & Grills',
    isAvailable: true,
    prepTime: '15 min',
    imageUrl: '/images/fried.webp',
  },
  {
    id: 'm_8',
    name: 'Street-Style Loaded Indomie Special',
    description: 'Noodles stir-fried with hot chili, fried egg, diced sausages, and sweet peppers.',
    price: 35,
    category: 'Sides & Grills',
    isAvailable: true,
    prepTime: '10 min',
    imageUrl: '/images/indomie.jpg',
  },
  {
    id: 'm_9',
    name: 'Spicy Peppered Gizzard Skewers',
    description: 'Tender chicken gizzards tossed in fiery bell pepper relish with fried sweet plantain.',
    price: 45,
    category: 'Sides & Grills',
    isAvailable: true,
    prepTime: '15 min',
    imageUrl: '/images/zizard.webp',
  },
  {
    id: 'm_10',
    name: 'Flaky Golden Beef Meat Pie (2 pcs)',
    description: 'Freshly baked pastry filled with seasoned minced beef, potatoes, and onions.',
    price: 24,
    category: 'Sides & Grills',
    isAvailable: true,
    prepTime: '5 min',
    imageUrl: '/images/pie.webp',
  },
  {
    id: 'm_11',
    name: 'Gourmet Double Cheese Burger',
    description: 'Double beef patty with melted cheddar cheese, caramelized onions, and fries.',
    price: 65,
    category: 'Sides & Grills',
    isAvailable: false,
    prepTime: '20 min',
    imageUrl: '/images/cheese.webp',
  },
  {
    id: 'm_12',
    name: 'Chilled Hibiscus Sobolo (500ml)',
    description: 'Natural dried roselle with crushed pineapple juice, cloves, and ginger.',
    price: 18,
    category: 'Drinks',
    isAvailable: true,
    prepTime: '2 min',
    imageUrl: '/images/bels.jpg',
  },
];

export default function MenuPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(initialMenuItems);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const addNotification = useNotificationStore((s) => s.addNotification);

  const toggleAvailability = (id) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const nextState = !item.isAvailable;
          addNotification({
            type: nextState ? 'success' : 'warning',
            title: nextState ? 'Item Available' : 'Item Marked Sold Out',
            message: `${item.name} is now ${
              nextState ? 'active on customer menus' : 'hidden from customer orders'
            }.`,
          });
          return { ...item, isAvailable: nextState };
        }
        return item;
      })
    );
  };

  const categories = ['All', 'Jollof & Rice', 'Swallows & Soups', 'Sides & Grills', 'Drinks'];

  const filtered = items.filter((i) => {
    const matchesCat = categoryFilter === 'All' ? true : i.category === categoryFilter;
    const matchesSearch =
      search.trim() === ''
        ? true
        : i.name.toLowerCase().includes(search.toLowerCase()) ||
          i.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Catalog</h1>
          <p className="text-xs text-gray-500">
            Manage your dishes, dish photography, real-time pricing, and kitchen stock status
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/menu/new')}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Add New Dish
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish by name..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
          />
        </div>
      </div>

      {/* Items Grid with Food Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`p-4 sm:p-5 rounded-3xl border transition-all bg-white shadow-sm flex flex-col justify-between ${
              item.isAvailable ? 'border-gray-100 hover:border-emerald-200 hover:shadow-md' : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="flex gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-1 truncate">{item.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-extrabold text-emerald-700 text-base">
                      {formatCurrency(item.price)}
                    </span>
                    <p className="text-[10px] text-gray-400 flex items-center justify-end gap-1 mt-0.5">
                      <Clock className="h-3 w-3" /> {item.prepTime}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.description}</p>
              </div>
            </div>

            <div className="pt-3.5 mt-3.5 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => toggleAvailability(item.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  item.isAvailable
                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                <Power className="h-3.5 w-3.5" />
                <span>{item.isAvailable ? 'In Stock (Live)' : 'Sold Out (Hidden)'}</span>
              </button>

              <button
                onClick={() => navigate(`/menu/${item.id}/edit`)}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-gray-600 hover:text-emerald-700 hover:bg-gray-100 transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Dish</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
