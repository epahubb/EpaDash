import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextInput,
  SelectInput,
  menuItemSchema,
  validateWithZod,
  useNotificationStore,
} from '@epadash/shared';
import { ArrowLeft, Save, Image as ImageIcon, Check } from 'lucide-react';

const availableImages = [
  { label: 'Authentic Party Jollof', path: '/images/jollof.webp' },
  { label: 'Banku with Grilled Tilapia', path: '/images/banku.webp' },
  { label: 'Traditional Banku & Okro Stew', path: '/images/bank2.webp' },
  { label: 'Fufu with Light Soup', path: '/images/fufu.jpg' },
  { label: 'Fufu with Groundnut Soup', path: '/images/fufu-3.webp' },
  { label: 'Assorted Fried Rice Platter', path: '/images/firedrice.webp' },
  { label: 'Crispy Wings & Yam Chips', path: '/images/fried.webp' },
  { label: 'Street-Style Indomie Noodles', path: '/images/indomie.jpg' },
  { label: 'Flaky Beef Meat Pie', path: '/images/pie.webp' },
  { label: 'Spicy Peppered Gizzard', path: '/images/zizard.webp' },
  { label: 'Gourmet Cheese Burger', path: '/images/cheese.webp' },
  { label: 'Chef Platter Delicious Grill', path: '/images/delicious.jpg' },
  { label: 'Chilled Hibiscus Sobolo', path: '/images/bels.jpg' },
];

export default function MenuItemFormPage({ mode }) {
  const navigate = useNavigate();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [formData, setFormData] = useState({
    name: mode === 'edit' ? 'Signature Assorted Meat Jollof' : '',
    category: mode === 'edit' ? 'Jollof & Rice' : 'Jollof & Rice',
    price: mode === 'edit' ? 65 : 45,
    description:
      mode === 'edit'
        ? 'Smoky firewood Ghanaian party jollof with goat meat, beef, and shito.'
        : '',
    prepTimeMinutes: mode === 'edit' ? 18 : 15,
    imageUrl: mode === 'edit' ? '/images/jollof.webp' : '/images/jollof.webp',
    isAvailable: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = validateWithZod(menuItemSchema, formData);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      addNotification({
        type: 'success',
        title: mode === 'create' ? 'Dish Created' : 'Dish Updated',
        message: `${formData.name} successfully saved to menu catalog with selected dish photo.`,
      });
      navigate('/menu');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-16 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/menu')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to menu catalog
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Add New Dish to Menu' : 'Edit Dish Details'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Choose high quality dish photography and set accurate preparation times for customer orders.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Dish Image Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-emerald-600" />
              Select Dish Photo
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-200">
              {availableImages.map((img) => {
                const isSelected = formData.imageUrl === img.path;
                return (
                  <div
                    key={img.path}
                    onClick={() => setFormData({ ...formData, imageUrl: img.path })}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-square group ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img.path}
                      alt={img.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-emerald-700/40 flex items-center justify-center">
                        <div className="bg-white text-emerald-700 rounded-full p-1 shadow-md">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-gray-500 mt-1.5">
              Selected: <span className="font-mono text-gray-700">{formData.imageUrl}</span>
            </p>
          </div>

          <TextInput
            label="Dish Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Red Red with Fried Fish & Plantain"
            error={errors.name}
            required
          />

          <SelectInput
            label="Menu Category"
            options={[
              { label: 'Jollof & Rice Dishes', value: 'Jollof & Rice' },
              { label: 'Swallows & Traditional Soups', value: 'Swallows & Soups' },
              { label: 'Sides, Grills & Kelewele', value: 'Sides & Grills' },
              { label: 'Chilled Drinks & Juices', value: 'Drinks' },
            ]}
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Price (GH₵)"
              type="number"
              step="0.5"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              placeholder="e.g. 55.00"
              error={errors.price}
              required
            />
            <TextInput
              label="Est. Prep Time (mins)"
              type="number"
              value={formData.prepTimeMinutes || ''}
              onChange={(e) =>
                setFormData({ ...formData, prepTimeMinutes: parseInt(e.target.value, 10) || 15 })
              }
              placeholder="15"
              error={errors.prepTimeMinutes}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Dish Description & Ingredients
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Describe seasonings, sides included, portion size..."
              required
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            isLoading={loading}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {mode === 'create' ? 'Create Dish in Catalog' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </div>
  );
}
