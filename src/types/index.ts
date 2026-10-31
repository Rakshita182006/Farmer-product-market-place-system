/**
 * KisanDirect - Comprehensive Domain Types (Indian Agricultural Marketplace)
 */

export type UserRole = 'customer' | 'farmer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  salt: string;
  phone?: string;
  address?: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  farmerProfileId?: string;
  kisanCardNumber?: string;
  createdAt: string;
}

export interface FarmCertification {
  id: string;
  name: string;
  issuingBody: string;
  yearCertified: number;
  badgeNumber: string;
  isVerified: boolean;
}

export interface FarmerProfile {
  id: string;
  userId: string;
  farmName: string;
  tagline: string;
  bio: string;
  city: string;
  district: string;
  state: string;
  distanceKm: number;
  acreage: number;
  establishedYear: number;
  practices: string[];
  certifications: FarmCertification[];
  bannerImage: string;
  avatarImage: string;
  directStory: string;
  soilType: string;
  waterSource: string;
  contactPhone: string;
  contactEmail: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  joinedDate: string;
  deliveryTimeEstimate: string; // e.g. "Tomorrow 6:00 AM Harvest Drop" or "45 Mins Express"
}

export type ProductCategory = 
  | 'Fresh Vegetables'
  | 'Farm Fresh Fruits'
  | 'A2 Dairy & Ghee'
  | 'Pure Raw Honey'
  | 'Organic Dal & Millets'
  | 'Herbs & Microgreens';

export interface FairPriceBreakdown {
  farmerSharePercent: number; // e.g. 85%
  packagingPercent: number;   // e.g. 4%
  coldChainLogisticsPercent: number; // e.g. 6%
  platformFeePercent: number; // e.g. 5%
  conventionalMandiFarmerShare: number; // e.g. 18-22% (Mandi Dalal / middleman takes 75%)
  farmerIncomePerUnit: number; // In ₹
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  title: string;
  hindiTitle?: string; // e.g. "देसी हाइब्रिड टमाटर"
  description: string;
  category: ProductCategory;
  price: number; // In Indian Rupees (₹)
  unit: 'kg' | 'g' | 'bunch' | 'L' | 'jar' | 'box' | 'carton' | 'pack';
  stock: number;
  minOrder: number;
  harvestDate: string; // ISO date
  shelfLifeDays: number;
  imageUrl: string;
  isOrganic: boolean;
  isDesi: boolean;
  isSurplus: boolean;
  surplusDiscountPercent?: number;
  fairPrice: FairPriceBreakdown;
  batchNumber: string;
  originLocation: string;
  rating: number;
  reviewsCount: number;
  status: 'active' | 'sold_out' | 'upcoming';
  deliveryEta: string; // e.g. "30-45 mins" or "Morning 6 AM"
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = 'pending' | 'harvested' | 'dispatched' | 'delivered' | 'cancelled';
export type PaymentMethod = 'upi' | 'cod' | 'card' | 'netbanking';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  deliverySlot: string;
  deliveryNotes?: string;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  items: CartItem[];
  subtotal: number; // in ₹
  deliveryFee: number; // in ₹
  kisanDirectPayout: number; // in ₹ (directly to kisan)
  total: number; // in ₹
  status: OrderStatus;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  timeline: OrderTimelineEvent[];
}

export type CropGrowthStatus = 'growing' | 'ready_soon' | 'harvesting_now' | 'season_ended';

export interface HarvestCalendarItem {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  cropName: string;
  hindiCropName?: string;
  category: ProductCategory;
  variety: string;
  plantingDate: string;
  expectedHarvestStart: string;
  expectedHarvestEnd: string;
  estimatedYield: number;
  unit: string;
  status: CropGrowthStatus;
  preOrderAvailable: boolean;
  notes: string;
}

export interface SurplusOffer {
  id: string;
  productId: string;
  cropName: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  originalPrice: number; // in ₹
  discountedPrice: number; // in ₹
  discountPercent: number;
  quantityAvailable: number;
  unit: string;
  expiresAt: string;
  imageUrl: string;
  reason: string;
}

export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}
