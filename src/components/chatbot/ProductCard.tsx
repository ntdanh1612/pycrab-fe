import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  onSelect: () => void;
}

export const ProductCard = ({ image, name, price, rating, reviewCount, onSelect }: ProductCardProps) => {
  return (
    <div className="flex-none w-48 bg-white rounded-lg shadow-sm border border-teal-light overflow-hidden group">
      <div className="aspect-square w-full bg-gray-100 relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <button
          onClick={onSelect}
          className="absolute bottom-2 right-2 bg-teal-dark text-cream p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-teal-medium transform translate-y-2 group-hover:translate-y-0"
          aria-label="Select product"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-teal-dark line-clamp-2 mb-1">{name}</h3>
        <div className="flex items-center gap-1 mb-1">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-600">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({reviewCount})</span>
        </div>
        <p className="text-sm font-semibold text-teal-dark">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}; 