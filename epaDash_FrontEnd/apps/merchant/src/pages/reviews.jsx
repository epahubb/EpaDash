import { Star } from "lucide-react";
import { formatDate } from "@epadash/shared";
const customerReviews = [
  {
    id: "rev_1",
    customer: "Abena Kwakye",
    rating: 5,
    date: new Date(Date.now() - 2 * 864e5).toISOString(),
    comment: "The Assorted Jollof was incredible! Very generous portion of beef and goat meat. Delivered hot.",
    item: "Signature Assorted Meat Jollof"
  },
  {
    id: "rev_2",
    customer: "Kofi Mensah",
    rating: 5,
    date: new Date(Date.now() - 5 * 864e5).toISOString(),
    comment: "Banku texture was perfect and tilapia was well seasoned. Best pepper in Osu.",
    item: "Banku with Fresh Tilapia"
  },
  {
    id: "rev_3",
    customer: "David Coleman",
    rating: 4,
    date: new Date(Date.now() - 8 * 864e5).toISOString(),
    comment: "Delicious meal, arrived quickly. Kelewele could have been slightly spicier.",
    item: "Spicy Kelewele with Peanuts"
  }
];
function ReviewsPage() {
  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Customer Feedback & Reviews</h1><p className="text-xs text-gray-500">Diner ratings and feedback from verified delivery orders</p></div></div>{
    /* Rating Overview Banner */
  }<div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6"><div className="text-center sm:text-left sm:pr-8 sm:border-r border-gray-100"><div className="text-4xl font-extrabold text-gray-900">4.8</div><div className="flex items-center justify-center sm:justify-start gap-1 my-1 text-amber-400">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400" />)}</div><span className="text-xs text-gray-400">Based on 320 reviews</span></div><div className="flex-1 w-full space-y-1.5 text-xs text-gray-600"><div className="flex items-center gap-2"><span className="w-8">5★</span><div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-emerald-500 w-[85%]" /></div><span className="w-8 text-right font-semibold">85%</span></div><div className="flex items-center gap-2"><span className="w-8">4★</span><div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-emerald-500 w-[12%]" /></div><span className="w-8 text-right font-semibold">12%</span></div><div className="flex items-center gap-2"><span className="w-8">3★</span><div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-amber-400 w-[3%]" /></div><span className="w-8 text-right font-semibold">3%</span></div></div></div>{
    /* Reviews List */
  }<div className="space-y-3">{customerReviews.map((rev) => <div key={rev.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-2"><div className="flex items-center justify-between"><div><h4 className="text-sm font-bold text-gray-900">{rev.customer}</h4><span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  Ordered: {rev.item}</span></div><span className="text-xs text-gray-400">{formatDate(rev.date)}</span></div><div className="flex items-center gap-1 text-amber-400">{[...Array(rev.rating)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />)}</div><p className="text-xs text-gray-600 leading-relaxed pt-1">{rev.comment}</p></div>)}</div></div>;
}
export {
  ReviewsPage as default
};
