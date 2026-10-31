/**
 * KisanDirect Persistent Database Layer (Indian Agri-Marketplace)
 * Swiggy / Zomato style direct-to-consumer farm network in Indian Rupees (₹).
 */

import {
  User,
  FarmerProfile,
  Product,
  Order,
  HarvestCalendarItem,
  SurplusOffer,
  Review,
  AdminAuditLog,
  CartItem,
  OrderStatus
} from '../types';
import { hashPassword } from './crypto';

const STORAGE_KEYS = {
  USERS: 'kisandirect_users_v3',
  FARMERS: 'kisandirect_farmers_v3',
  PRODUCTS: 'kisandirect_products_v3',
  ORDERS: 'kisandirect_orders_v3',
  HARVEST_CALENDAR: 'kisandirect_harvest_v3',
  SURPLUS: 'kisandirect_surplus_v3',
  REVIEWS: 'kisandirect_reviews_v3',
  AUDIT_LOGS: 'kisandirect_audit_v3',
  CURRENT_USER: 'kisandirect_active_user_v3',
  CART: 'kisandirect_cart_v3',
};

// Generated high-res assets
export const ASSET_IMAGES = {
  hero: '/src/assets/images/hero_organic_harvest_1793440241264.jpg',
  tomatoes: '/src/assets/images/product_heirloom_tomatoes_1793440242901.jpg',
  apples: '/src/assets/images/product_honeycrisp_apples_1793440243196.jpg',
  honey: '/src/assets/images/product_wildflower_honey_1793440243706.jpg',
  farmLandscape: '/src/assets/images/farm_green_valley_landscape_1793440243709.jpg',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifyListeners() {
  listeners.forEach(cb => cb());
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return fallback;
  }
}

function writeStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners();
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
}

// ================= INITIAL INDIAN SEED DATA =================

const SEED_FARMERS: FarmerProfile[] = [
  {
    id: 'farmer_ramesh_1',
    userId: 'user_farmer_1',
    farmName: 'Annapurna Jaivik Khet (अन्नपूर्णा जैविक खेत)',
    tagline: '100% Desi Cow Compost & Natural Jivamrit Farming',
    bio: 'Fourth generation kisan family from the fertile Godavari basin. Cultivating native heirloom tomatoes, tender palak, methi, and traditional gourds without a single drop of synthetic pesticide.',
    city: 'Nashik',
    district: 'Nashik District',
    state: 'Maharashtra',
    distanceKm: 14.2,
    acreage: 26,
    establishedYear: 2004,
    practices: ['Jaivik Bharat Certified', 'Panchagavya & Jivamrit Living Soil', 'Subhash Palekar Natural Farming', 'Borewell Micro-Drip'],
    certifications: [
      { id: 'c1', name: 'NPOP India Organic (Jaivik Bharat)', issuingBody: 'APEDA India', yearCertified: 2012, badgeNumber: 'APEDA-ORG-9821', isVerified: true },
      { id: 'c2', name: 'PGS-India Green Certificate', issuingBody: 'Ministry of Agriculture', yearCertified: 2018, badgeNumber: 'PGS-MH-104', isVerified: true },
    ],
    bannerImage: ASSET_IMAGES.farmLandscape,
    avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    directStory: 'In the traditional Mandi, the dalal takes 60% of our hard-earned crop price, and payments are delayed for months. Through KisanDirect, customers in the city get morning-harvested produce while our family gets 85% paid directly to our bank account within 2 hours.',
    soilType: 'Black Cotton Regur Soil enriched with Desi Cow Dung',
    waterSource: 'Rainwater Catchment Check-Dam & Natural Open Well',
    contactPhone: '+91 98231 44520',
    contactEmail: 'ramesh.kisan@annapurna.in',
    rating: 4.94,
    reviewsCount: 312,
    isVerified: true,
    joinedDate: '2023-01-10',
    deliveryTimeEstimate: '⚡ Morning 6:00 AM Harvest Drop',
  },
  {
    id: 'farmer_gurpreet_2',
    userId: 'user_farmer_2',
    farmName: 'Doaba Natural Apiaries & Himachal Orchards',
    tagline: 'Pure Raw Himalayan Honey & Crisp Orchard Pluck',
    bio: 'Nestled between the apple orchards of Kotgarh (Himachal) and the mustard plains of Punjab. Gurpreet manages 180 bee colonies that pollinate wildflowers with zero sugar feeding.',
    city: 'Kotgarh',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    distanceKm: 42.0,
    acreage: 38,
    establishedYear: 2014,
    practices: ['Zero Sugar Syrup Adulteration', 'Cold Settled Honey Extraction', 'High Altitude Mountain Orchard', 'Solar Dehydrated Packing'],
    certifications: [
      { id: 'c3', name: 'FSSAI Pure Artisanal Organic', issuingBody: 'FSSAI Central', yearCertified: 2016, badgeNumber: 'FSSAI-1001-209', isVerified: true },
      { id: 'c4', name: 'Himachal Apple Growers Association A-Grade', issuingBody: 'HPMC', yearCertified: 2019, badgeNumber: 'HPMC-2019-88', isVerified: true },
    ],
    bannerImage: ASSET_IMAGES.hero,
    avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    directStory: 'Supermarkets sell sugar-syrup blended honey with glossy labels. We extract single-source raw mountain honey straight from honeycomb supers. When you taste it, the floral aroma of wild Himalayan blossoms bursts on your tongue.',
    soilType: 'Pine Mountain Loam Rich in Organic Minerals',
    waterSource: 'Glacial Himalayan Spring Stream',
    contactPhone: '+91 98765 89210',
    contactEmail: 'gurpreet@doabanatural.in',
    rating: 4.98,
    reviewsCount: 420,
    isVerified: true,
    joinedDate: '2023-03-15',
    deliveryTimeEstimate: '📦 24 Hr Farm Cold Express',
  },
  {
    id: 'farmer_lakshmi_3',
    userId: 'user_farmer_3',
    farmName: 'Cauvery Bio-Regenerative Dairy & Greens',
    tagline: 'Desi Gir Cow A2 Milk & Living Green Micro-Greens',
    bio: 'Lakshmi Ammal maintains a 30-head herd of free-grazing Gir and Hallikar cows. The manure fuels zero-chemical soil beds producing fresh palak, coriander, and living microgreens.',
    city: 'Mandya',
    district: 'Mandya',
    state: 'Karnataka',
    distanceKm: 28.5,
    acreage: 18,
    establishedYear: 2017,
    practices: ['Desi Gir Cow Grazing', 'Zero Hormone / Antibiotic Injection', '100% Unprocessed Cold A2 Milk', 'Drip Fertigation'],
    certifications: [
      { id: 'c5', name: 'Karnataka Organic Mission Certified', issuingBody: 'Jaivik Krishik Society', yearCertified: 2020, badgeNumber: 'KAS-ORG-442', isVerified: true },
    ],
    bannerImage: ASSET_IMAGES.farmLandscape,
    avatarImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    directStory: 'We chill raw A2 milk immediately after morning milking at 5:00 AM into sterilised glass bottles. It reaches your doorstep by 7:00 AM without pasteurisation heat damage, keeping all beneficial gut enzymes alive.',
    soilType: 'Red Alluvial Loam with Vermicompost',
    waterSource: 'Cauvery River Basin Canal Sub-channel',
    contactPhone: '+91 94481 01234',
    contactEmail: 'lakshmi@cauverybio.in',
    rating: 4.91,
    reviewsCount: 184,
    isVerified: true,
    joinedDate: '2023-08-01',
    deliveryTimeEstimate: '⚡ 45 Mins Express Drop',
  }
];

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod_desi_tamatar',
    farmerId: 'farmer_ramesh_1',
    farmerName: 'Rameshwar Patel',
    farmName: 'Annapurna Jaivik Khet',
    title: 'Desi Vine-Ripened Organic Tomatoes (देशी टमाटर)',
    hindiTitle: 'ताज़ा देशी टमाटर - खेत से सीधा',
    description: 'Juicy, sweet and tangy country heirloom tomatoes. Picked at sunrise when ripe on the vine. Rich in natural lycopene and free from artificial ripening ethylene gas.',
    category: 'Fresh Vegetables',
    price: 42, // ₹42 per kg
    unit: 'kg',
    stock: 65,
    minOrder: 1,
    harvestDate: '2026-10-31',
    shelfLifeDays: 5,
    imageUrl: ASSET_IMAGES.tomatoes,
    isOrganic: true,
    isDesi: true,
    isSurplus: true,
    surplusDiscountPercent: 25, // ₹32 per kg flash deal
    fairPrice: {
      farmerSharePercent: 85,
      packagingPercent: 4,
      coldChainLogisticsPercent: 6,
      platformFeePercent: 5,
      conventionalMandiFarmerShare: 18,
      farmerIncomePerUnit: 35.70, // In ₹
    },
    batchNumber: 'AP-NSK-TOM-088',
    originLocation: 'Nashik, Maharashtra (Khet 4)',
    rating: 4.95,
    reviewsCount: 142,
    status: 'active',
    deliveryEta: '35 mins from Nashik hub',
  },
  {
    id: 'prod_shimla_apples',
    farmerId: 'farmer_gurpreet_2',
    farmerName: 'Gurpreet Singh',
    farmName: 'Doaba Natural Apiaries & Orchards',
    title: 'Himachal Royal Crisp Apples (शिमला सेब)',
    hindiTitle: 'पहाड़ी रॉयल क्रिस्प सेब',
    description: 'Plucked from 7,500ft high altitude Kotgarh orchards. Naturally sweet, firm crunch with high natural juice content. Zero food wax coating or chemical shine.',
    category: 'Farm Fresh Fruits',
    price: 150, // ₹150 per kg
    unit: 'kg',
    stock: 90,
    minOrder: 1,
    harvestDate: '2026-10-29',
    shelfLifeDays: 20,
    imageUrl: ASSET_IMAGES.apples,
    isOrganic: true,
    isDesi: true,
    isSurplus: false,
    fairPrice: {
      farmerSharePercent: 86,
      packagingPercent: 3,
      coldChainLogisticsPercent: 6,
      platformFeePercent: 5,
      conventionalMandiFarmerShare: 22,
      farmerIncomePerUnit: 129.00,
    },
    batchNumber: 'DOA-KOT-APL-014',
    originLocation: 'Kotgarh Valley, Himachal Pradesh',
    rating: 4.98,
    reviewsCount: 198,
    status: 'active',
    deliveryEta: 'Tomorrow 6 AM Morning Harvest',
  },
  {
    id: 'prod_raw_honey',
    farmerId: 'farmer_gurpreet_2',
    farmerName: 'Gurpreet Singh',
    farmName: 'Doaba Natural Apiaries & Orchards',
    title: 'Pure Raw Forest Multiflora Honey (शुद्ध शहद)',
    hindiTitle: 'जंगली कच्चा प्राकृतिक शहद',
    description: '100% unpasteurised and cold-filtered raw honey with live medicinal enzymes and pollen grains. Contains natural comb essence with gentle floral hints.',
    category: 'Pure Raw Honey',
    price: 360, // ₹360 per 500g jar
    unit: 'jar',
    stock: 35,
    minOrder: 1,
    harvestDate: '2026-10-25',
    shelfLifeDays: 730,
    imageUrl: ASSET_IMAGES.honey,
    isOrganic: true,
    isDesi: true,
    isSurplus: false,
    fairPrice: {
      farmerSharePercent: 88,
      packagingPercent: 4,
      coldChainLogisticsPercent: 3,
      platformFeePercent: 5,
      conventionalMandiFarmerShare: 24,
      farmerIncomePerUnit: 316.80,
    },
    batchNumber: 'DOA-HNY-2026-92',
    originLocation: 'Shivalik Forest Hills',
    rating: 5.0,
    reviewsCount: 240,
    status: 'active',
    deliveryEta: '45 mins delivery',
  },
  {
    id: 'prod_desi_palak',
    farmerId: 'farmer_ramesh_1',
    farmerName: 'Rameshwar Patel',
    farmName: 'Annapurna Jaivik Khet',
    title: 'Fresh Desi Palak & Kasuri Methi (पालक व मेथी)',
    hindiTitle: 'देसी पालक और मेथी - ताज़ा कटी',
    description: 'Cut fresh at 5:00 AM while still moist with natural morning dew. Small tender leaves packed with iron and natural green aroma. 100% soil grown.',
    category: 'Fresh Vegetables',
    price: 24, // ₹24 per bunch
    unit: 'bunch',
    stock: 50,
    minOrder: 1,
    harvestDate: '2026-10-31',
    shelfLifeDays: 4,
    imageUrl: ASSET_IMAGES.hero,
    isOrganic: true,
    isDesi: true,
    isSurplus: false,
    fairPrice: {
      farmerSharePercent: 85,
      packagingPercent: 4,
      coldChainLogisticsPercent: 6,
      platformFeePercent: 5,
      conventionalMandiFarmerShare: 15,
      farmerIncomePerUnit: 20.40,
    },
    batchNumber: 'AP-PLK-2026-44',
    originLocation: 'Nashik Riverbed Fields',
    rating: 4.88,
    reviewsCount: 86,
    status: 'active',
    deliveryEta: '30 mins fast drop',
  },
  {
    id: 'prod_gir_milk',
    farmerId: 'farmer_lakshmi_3',
    farmerName: 'Lakshmi Ammal',
    farmName: 'Cauvery Bio-Regenerative Dairy & Greens',
    title: 'Desi Gir Cow Fresh A2 Raw Milk (गीर गाय का A2 दूध)',
    hindiTitle: 'शुद्ध A2 देशी गाय का दूध',
    description: 'Unprocessed, cold-chilled whole A2 milk from free-grazing Gir and Hallikar indigenous cows. Naturally sweet with golden cream top layer rich in A2 beta-casein protein.',
    category: 'A2 Dairy & Ghee',
    price: 76, // ₹76 per Litre
    unit: 'L',
    stock: 40,
    minOrder: 1,
    harvestDate: '2026-10-31',
    shelfLifeDays: 3,
    imageUrl: ASSET_IMAGES.farmLandscape,
    isOrganic: true,
    isDesi: true,
    isSurplus: false,
    fairPrice: {
      farmerSharePercent: 85,
      packagingPercent: 5,
      coldChainLogisticsPercent: 5,
      platformFeePercent: 5,
      conventionalMandiFarmerShare: 20,
      farmerIncomePerUnit: 64.60,
    },
    batchNumber: 'CAU-MLK-2026-10',
    originLocation: 'Mandya Pastures, Karnataka',
    rating: 4.96,
    reviewsCount: 165,
    status: 'active',
    deliveryEta: 'Morning 6:00 AM Delivery',
  },
  {
    id: 'prod_microgreens',
    farmerId: 'farmer_lakshmi_3',
    farmerName: 'Lakshmi Ammal',
    farmName: 'Cauvery Bio-Regenerative Dairy & Greens',
    title: 'Living Soil Methi & Radish Microgreens (माइक्रोग्रीन्स)',
    hindiTitle: 'सजीव माइक्रोग्रीन्स बॉक्स',
    description: 'Living soil tray harvested live with roots intact. Peppery crunch loaded with concentrated Vitamins A, C, and K. Perfect for daily salads and paratha stuffing.',
    category: 'Herbs & Microgreens',
    price: 55, // ₹55 per box
    unit: 'box',
    stock: 25,
    minOrder: 1,
    harvestDate: '2026-10-31',
    shelfLifeDays: 8,
    imageUrl: ASSET_IMAGES.hero,
    isOrganic: true,
    isDesi: true,
    isSurplus: true,
    surplusDiscountPercent: 20, // ₹44 flash deal
    fairPrice: {
      farmerSharePercent: 82,
      packagingPercent: 6,
      coldChainLogisticsPercent: 7,
      platformFeePercent: 5,
      conventionalMandiFarmerShare: 16,
      farmerIncomePerUnit: 45.10,
    },
    batchNumber: 'CAU-MIC-2026-07',
    originLocation: 'Mandya Polyhouse',
    rating: 4.90,
    reviewsCount: 54,
    status: 'active',
    deliveryEta: '45 mins delivery',
  }
];

const SEED_HARVEST_CALENDAR: HarvestCalendarItem[] = [
  {
    id: 'harv_1',
    farmerId: 'farmer_ramesh_1',
    farmerName: 'Rameshwar Patel',
    farmName: 'Annapurna Jaivik Khet',
    cropName: 'Desi Pili Sarson & Palak Saag (सरसों व पालक)',
    hindiCropName: 'देसी पीली सरसों व साग',
    category: 'Fresh Vegetables',
    variety: 'Kharif Native Heirloom',
    plantingDate: '2026-09-10',
    expectedHarvestStart: '2026-11-05',
    expectedHarvestEnd: '2026-11-25',
    estimatedYield: 500,
    unit: 'kg',
    status: 'ready_soon',
    preOrderAvailable: true,
    notes: 'Late autumn dew hardening the leaves with intense mustard aroma. Ready for winter makki roti!',
  },
  {
    id: 'harv_2',
    farmerId: 'farmer_ramesh_1',
    farmerName: 'Rameshwar Patel',
    farmName: 'Annapurna Jaivik Khet',
    cropName: 'Desi Tamatar (Native Country Tomatoes)',
    hindiCropName: 'देसी खट्टे टमाटर',
    category: 'Fresh Vegetables',
    variety: 'Nashik Heirloom Goldridge',
    plantingDate: '2026-08-01',
    expectedHarvestStart: '2026-10-20',
    expectedHarvestEnd: '2026-11-15',
    estimatedYield: 850,
    unit: 'kg',
    status: 'harvesting_now',
    preOrderAvailable: false,
    notes: 'Heavy bumper yield this week! Surplus rescue discounts active to prevent any wastage.',
  },
  {
    id: 'harv_3',
    farmerId: 'farmer_gurpreet_2',
    farmerName: 'Gurpreet Singh',
    farmName: 'Doaba Natural Apiaries & Orchards',
    cropName: 'Himachal Golden Delicious Apples',
    hindiCropName: 'गोल्डन सेब',
    category: 'Farm Fresh Fruits',
    variety: 'Shimla High Ridge Graft',
    plantingDate: '2022-02-15',
    expectedHarvestStart: '2026-10-18',
    expectedHarvestEnd: '2026-11-10',
    estimatedYield: 1400,
    unit: 'kg',
    status: 'harvesting_now',
    preOrderAvailable: true,
    notes: 'Daily picking in progress. High natural sugar brix count of 14.5.',
  },
  {
    id: 'harv_4',
    farmerId: 'farmer_lakshmi_3',
    farmerName: 'Lakshmi Ammal',
    farmName: 'Cauvery Bio-Regenerative Dairy & Greens',
    cropName: 'Organic Traditional Basmati Paddy (बासमती धान)',
    hindiCropName: 'देसी ताराओरी बासमती',
    category: 'Organic Dal & Millets',
    variety: 'Taraori Traditional Aromatic',
    plantingDate: '2026-06-25',
    expectedHarvestStart: '2026-11-15',
    expectedHarvestEnd: '2026-12-05',
    estimatedYield: 1800,
    unit: 'kg',
    status: 'growing',
    preOrderAvailable: true,
    notes: 'Golden grain ears turning mature under the Deccan sun. Aromatic heirloom quality.',
  }
];

const SEED_SURPLUS: SurplusOffer[] = [
  {
    id: 'surplus_1',
    productId: 'prod_desi_tamatar',
    cropName: 'Desi Vine-Ripened Tomatoes (देशी टमाटर)',
    farmerId: 'farmer_ramesh_1',
    farmerName: 'Rameshwar Patel',
    farmName: 'Annapurna Jaivik Khet',
    originalPrice: 42,
    discountedPrice: 31.50, // ₹31.50/kg
    discountPercent: 25,
    quantityAvailable: 35,
    unit: 'kg',
    expiresAt: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    imageUrl: ASSET_IMAGES.tomatoes,
    reason: 'Sudden sunny spell in Nashik caused simultaneous ripening of 35 crates. Help our kisan prevent food waste and get supreme sweet tomatoes at 25% discount!',
  },
  {
    id: 'surplus_2',
    productId: 'prod_microgreens',
    cropName: 'Living Soil Methi & Radish Microgreens',
    farmerId: 'farmer_lakshmi_3',
    farmerName: 'Lakshmi Ammal',
    farmName: 'Cauvery Bio-Regenerative Dairy & Greens',
    originalPrice: 55,
    discountedPrice: 44, // ₹44/box
    discountPercent: 20,
    quantityAvailable: 15,
    unit: 'box',
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    imageUrl: ASSET_IMAGES.hero,
    reason: 'Polyhouse tray rotation. Fresh crunchy shoots ready for immediate dinner seasoning.',
  }
];

const SEED_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    productId: 'prod_desi_tamatar',
    customerId: 'user_cust_1',
    customerName: 'Ananya Sharma (Bengaluru)',
    rating: 5,
    comment: 'The tomato curry tasted divine! You cannot get this real desi aroma in ordinary supermarket plastic bags. Arrived within 40 minutes with green stems still attached.',
    createdAt: '2026-10-30T10:15:00Z',
  },
  {
    id: 'rev_2',
    productId: 'prod_raw_honey',
    customerId: 'user_cust_1',
    customerName: 'Ananya Sharma (Bengaluru)',
    rating: 5,
    comment: 'Real raw honey without sugar syrup. Even crystallises gently in cold weather as authentic raw honey should. Delighted to see ₹316 go straight to Gurpreet ji!',
    createdAt: '2026-10-28T09:30:00Z',
  },
  {
    id: 'rev_3',
    productId: 'prod_gir_milk',
    customerId: 'user_cust_2',
    customerName: 'Rohit Verma (Indiranagar)',
    rating: 5,
    comment: 'Pure golden cream layer on boiling. Reminded us of our village in Haryana. Kids drink it without adding sugar.',
    createdAt: '2026-10-29T17:20:00Z',
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'KD-BLR-9842',
    customerId: 'user_cust_1',
    customerName: 'Ananya Sharma',
    customerEmail: 'ananya.bengaluru@gmail.com',
    customerPhone: '+91 98450 12890',
    deliveryAddress: {
      street: '#402, Green Glen Layout',
      area: 'Bellandur / Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
    },
    deliverySlot: '⚡ Express Morning Slot (6:00 AM - 7:30 AM)',
    deliveryNotes: 'Please ring bell and leave in cooler bag by door.',
    paymentMethod: 'upi',
    isPaid: true,
    items: [
      {
        productId: 'prod_desi_tamatar',
        product: SEED_PRODUCTS[0],
        quantity: 2,
        unitPrice: 31.50, // Surplus price ₹31.50
      },
      {
        productId: 'prod_gir_milk',
        product: SEED_PRODUCTS[4],
        quantity: 2,
        unitPrice: 76,
      }
    ],
    subtotal: 215.00,
    deliveryFee: 0, // Free delivery above threshold
    kisanDirectPayout: 183.00, // ₹183 to farmers
    total: 215.00,
    status: 'dispatched',
    riderName: 'Manjunath (Farm-to-Door Cold Express)',
    riderPhone: '+91 97412 55901',
    createdAt: '2026-10-31T05:30:00Z',
    timeline: [
      { status: 'pending', timestamp: '2026-10-31T05:30:00Z', note: 'Order placed directly via UPI. Assigned to Annapurna and Cauvery farm clusters.' },
      { status: 'harvested', timestamp: '2026-10-31T06:00:00Z', note: 'Desi tomatoes packed in breathable jute crates & A2 milk cold sealed.' },
      { status: 'dispatched', timestamp: '2026-10-31T06:35:00Z', note: 'Rider Manjunath out for delivery via Temperature Controlled Eco-Van.' },
    ],
  }
];

const SEED_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log_1',
    action: 'KISAN_VERIFIED',
    actor: 'Mandi Board Director Vikram',
    details: 'Verified Annapurna Jaivik Khet PGS-India Organic Certification with APEDA database.',
    timestamp: '2026-10-25T11:00:00Z',
  },
  {
    id: 'log_2',
    action: 'MANDI_PRICE_BENCHMARK_UPDATED',
    actor: 'Agri Informatics Engine',
    details: 'APMC Azadpur and Vashi Mandi average farmer margin audited at 17.8% vs KisanDirect 85.2%.',
    timestamp: '2026-10-30T06:00:00Z',
  }
];

export async function initializeDatabase(): Promise<void> {
  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!existingUsers) {
    const saltRamesh = 'salt_kisan_ramesh_771';
    const saltAnanya = 'salt_cust_ananya_312';
    const saltAdmin = 'salt_admin_vikram_998';
    
    // Passwords for the 3 distinct personas:
    // Farmer: 'farmer123'
    // Customer: 'customer123'
    // Admin: 'admin123'
    const [hashRamesh, hashAnanya, hashAdmin] = await Promise.all([
      hashPassword('farmer123', saltRamesh),
      hashPassword('customer123', saltAnanya),
      hashPassword('admin123', saltAdmin),
    ]);

    const initialUsers: User[] = [
      {
        id: 'user_farmer_1',
        name: 'Rameshwar Patel (Kisan Producer)',
        email: 'ramesh.kisan@annapurna.in',
        role: 'farmer',
        passwordHash: hashRamesh.hash,
        salt: hashRamesh.salt,
        phone: '+91 98231 44520',
        farmerProfileId: 'farmer_ramesh_1',
        kisanCardNumber: 'PM-KISAN-MH-440192',
        address: { street: 'Godavari Basin Agro Road', area: 'Dindori', city: 'Nashik', state: 'Maharashtra', pincode: '422003' },
        createdAt: '2023-01-10T08:00:00Z',
      },
      {
        id: 'user_cust_1',
        name: 'Ananya Sharma (City Consumer)',
        email: 'ananya.bengaluru@gmail.com',
        role: 'customer',
        passwordHash: hashAnanya.hash,
        salt: hashAnanya.salt,
        phone: '+91 98450 12890',
        address: { street: '#402, Green Glen Layout', area: 'Bellandur', city: 'Bengaluru', state: 'Karnataka', pincode: '560103' },
        createdAt: '2024-02-14T12:00:00Z',
      },
      {
        id: 'user_admin_1',
        name: 'Vikramaditya Rao (Mandi Board Director & Admin)',
        email: 'admin@kisandirect.gov.in',
        role: 'admin',
        passwordHash: hashAdmin.hash,
        salt: hashAdmin.salt,
        phone: '+91 80 2200 4500',
        address: { street: 'Krishi Bhavan, Nrupathunga Road', area: 'Ambedkar Veedhi', city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
        createdAt: '2022-11-01T09:00:00Z',
      }
    ];

    writeStorage(STORAGE_KEYS.USERS, initialUsers);
    writeStorage(STORAGE_KEYS.FARMERS, SEED_FARMERS);
    writeStorage(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
    writeStorage(STORAGE_KEYS.ORDERS, SEED_ORDERS);
    writeStorage(STORAGE_KEYS.HARVEST_CALENDAR, SEED_HARVEST_CALENDAR);
    writeStorage(STORAGE_KEYS.SURPLUS, SEED_SURPLUS);
    writeStorage(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    writeStorage(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);

    // Default to Customer Ananya for Swiggy/Zomato style immediate browsing
    writeStorage(STORAGE_KEYS.CURRENT_USER, initialUsers[1]);
  }
}

// ================= DATABASE CRUD OPERATIONS =================

export const db = {
  subscribe,

  // Users
  getUsers: (): User[] => readStorage<User[]>(STORAGE_KEYS.USERS, []),
  getUserById: (id: string): User | undefined => db.getUsers().find(u => u.id === id),
  getUserByEmail: (email: string): User | undefined => 
    db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase().trim()),
  addUser: (user: User): void => {
    const users = db.getUsers();
    users.push(user);
    writeStorage(STORAGE_KEYS.USERS, users);
    db.addAuditLog('USER_REGISTERED', user.email, `New ${user.role} onboarded: ${user.name}`);
  },
  updateUser: (updatedUser: User): void => {
    const users = db.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    writeStorage(STORAGE_KEYS.USERS, users);
    const active = db.getCurrentUser();
    if (active && active.id === updatedUser.id) {
      writeStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
    }
  },

  // Active User / Session
  getCurrentUser: (): User | null => readStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: (user: User | null): void => {
    writeStorage(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Farmer Profiles
  getFarmers: (): FarmerProfile[] => readStorage<FarmerProfile[]>(STORAGE_KEYS.FARMERS, []),
  getFarmerById: (id: string): FarmerProfile | undefined => db.getFarmers().find(f => f.id === id),
  getFarmerByUserId: (userId: string): FarmerProfile | undefined => db.getFarmers().find(f => f.userId === userId),
  addFarmerProfile: (profile: FarmerProfile): void => {
    const farmers = db.getFarmers();
    farmers.push(profile);
    writeStorage(STORAGE_KEYS.FARMERS, farmers);
  },
  updateFarmerProfile: (profile: FarmerProfile): void => {
    const farmers = db.getFarmers().map(f => f.id === profile.id ? profile : f);
    writeStorage(STORAGE_KEYS.FARMERS, farmers);
  },
  verifyFarmer: (farmerId: string, isVerified: boolean): void => {
    const farmers = db.getFarmers().map(f => f.id === farmerId ? { ...f, isVerified } : f);
    writeStorage(STORAGE_KEYS.FARMERS, farmers);
    db.addAuditLog('KISAN_VERIFICATION_STATUS', 'Mandi Board', `Farmer ${farmerId} verification marked ${isVerified ? 'VERIFIED' : 'PENDING'}`);
  },

  // Products
  getProducts: (): Product[] => readStorage<Product[]>(STORAGE_KEYS.PRODUCTS, []),
  getProductById: (id: string): Product | undefined => db.getProducts().find(p => p.id === id),
  getProductsByFarmer: (farmerId: string): Product[] => db.getProducts().filter(p => p.farmerId === farmerId),
  addProduct: (product: Product): void => {
    const products = db.getProducts();
    products.unshift(product);
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
    db.addAuditLog('CROP_LISTED', product.farmerName, `Published fresh harvest: ${product.title} at ₹${product.price}/${product.unit}`);
  },
  updateProduct: (product: Product): void => {
    const products = db.getProducts().map(p => p.id === product.id ? product : p);
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
  },
  deleteProduct: (id: string): void => {
    const products = db.getProducts().filter(p => p.id !== id);
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
    db.addAuditLog('CROP_DELETED', 'Farmer', `Removed product ID: ${id}`);
  },
  updateProductStock: (id: string, newStock: number): void => {
    const products = db.getProducts().map(p => {
      if (p.id === id) {
        return {
          ...p,
          stock: Math.max(0, newStock),
          status: newStock <= 0 ? 'sold_out' as const : 'active' as const,
        };
      }
      return p;
    });
    writeStorage(STORAGE_KEYS.PRODUCTS, products);
  },

  // Cart
  getCart: (): CartItem[] => readStorage<CartItem[]>(STORAGE_KEYS.CART, []),
  setCart: (items: CartItem[]): void => {
    writeStorage(STORAGE_KEYS.CART, items);
  },
  addToCart: (product: Product, quantity = 1): void => {
    const cart = db.getCart();
    const existingIndex = cart.findIndex(item => item.productId === product.id);
    const unitPrice = product.isSurplus && product.surplusDiscountPercent
      ? Number((product.price * (1 - product.surplusDiscountPercent / 100)).toFixed(2))
      : product.price;

    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        throw new Error(`Only ${product.stock} ${product.unit} available in today's harvest.`);
      }
      cart[existingIndex].quantity = newQty;
      cart[existingIndex].unitPrice = unitPrice;
    } else {
      if (quantity > product.stock) {
        throw new Error(`Only ${product.stock} ${product.unit} available.`);
      }
      cart.push({
        productId: product.id,
        product,
        quantity,
        unitPrice,
      });
    }
    db.setCart(cart);
  },
  updateCartQuantity: (productId: string, quantity: number): void => {
    const cart = db.getCart();
    if (quantity <= 0) {
      db.setCart(cart.filter(item => item.productId !== productId));
      return;
    }
    const product = db.getProductById(productId);
    if (product && quantity > product.stock) {
      throw new Error(`Cannot exceed farm inventory of ${product.stock} ${product.unit}.`);
    }
    const updated = cart.map(item => item.productId === productId ? { ...item, quantity } : item);
    db.setCart(updated);
  },
  removeFromCart: (productId: string): void => {
    const cart = db.getCart().filter(item => item.productId !== productId);
    db.setCart(cart);
  },
  clearCart: (): void => {
    db.setCart([]);
  },

  // Orders & Inventory Transactions
  getOrders: (): Order[] => readStorage<Order[]>(STORAGE_KEYS.ORDERS, []),
  getOrderById: (id: string): Order | undefined => db.getOrders().find(o => o.id === id),
  getOrdersByCustomer: (customerId: string): Order[] => 
    db.getOrders().filter(o => o.customerId === customerId),
  getOrdersForFarmer: (farmerId: string): Order[] => {
    return db.getOrders().filter(order => 
      order.items.some(item => item.product.farmerId === farmerId)
    );
  },
  createOrder: (order: Order): Order => {
    const products = db.getProducts();
    for (const item of order.items) {
      const prod = products.find(p => p.id === item.productId);
      if (!prod) throw new Error(`Product ${item.product.title} not found.`);
      if (prod.stock < item.quantity) {
        throw new Error(`Insufficient harvest stock for ${prod.title}. Only ${prod.stock} ${prod.unit} left.`);
      }
    }

    // Decrement stock
    for (const item of order.items) {
      const prod = products.find(p => p.id === item.productId)!;
      prod.stock -= item.quantity;
      if (prod.stock <= 0) {
        prod.status = 'sold_out';
      }
    }
    writeStorage(STORAGE_KEYS.PRODUCTS, products);

    // Save order
    const orders = db.getOrders();
    orders.unshift(order);
    writeStorage(STORAGE_KEYS.ORDERS, orders);

    // Clear cart
    db.clearCart();

    db.addAuditLog('ORDER_PLACED', order.customerName, `Order ${order.id} placed for ₹${order.total.toFixed(2)} (${order.items.length} items)`);
    return order;
  },
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string): void => {
    const orders = db.getOrders().map(order => {
      if (order.id === orderId) {
        const timeline = [...order.timeline];
        timeline.push({
          status,
          timestamp: new Date().toISOString(),
          note: note || `Status updated to ${status}.`,
        });
        return {
          ...order,
          status,
          timeline,
        };
      }
      return order;
    });
    writeStorage(STORAGE_KEYS.ORDERS, orders);
    db.addAuditLog('ORDER_STATUS_CHANGED', 'Delivery Route', `Order ${orderId} updated to ${status}`);
  },

  // Harvest Calendar
  getHarvestCalendar: (): HarvestCalendarItem[] => readStorage<HarvestCalendarItem[]>(STORAGE_KEYS.HARVEST_CALENDAR, []),
  addHarvestItem: (item: HarvestCalendarItem): void => {
    const list = db.getHarvestCalendar();
    list.push(item);
    writeStorage(STORAGE_KEYS.HARVEST_CALENDAR, list);
    db.addAuditLog('HARVEST_PLAN_ADDED', item.farmerName, `Scheduled seasonal crop: ${item.cropName}`);
  },
  updateHarvestItem: (item: HarvestCalendarItem): void => {
    const list = db.getHarvestCalendar().map(i => i.id === item.id ? item : i);
    writeStorage(STORAGE_KEYS.HARVEST_CALENDAR, list);
  },
  deleteHarvestItem: (id: string): void => {
    const list = db.getHarvestCalendar().filter(i => i.id !== id);
    writeStorage(STORAGE_KEYS.HARVEST_CALENDAR, list);
  },

  // Surplus Offers
  getSurplusOffers: (): SurplusOffer[] => readStorage<SurplusOffer[]>(STORAGE_KEYS.SURPLUS, []),
  addSurplusOffer: (offer: SurplusOffer): void => {
    const list = db.getSurplusOffers();
    list.unshift(offer);
    writeStorage(STORAGE_KEYS.SURPLUS, list);
    const prod = db.getProductById(offer.productId);
    if (prod) {
      db.updateProduct({
        ...prod,
        isSurplus: true,
        surplusDiscountPercent: offer.discountPercent,
      });
    }
    db.addAuditLog('SURPLUS_OFFER_POSTED', offer.farmerName, `Kisan Surplus Bachao deal: ${offer.cropName} (${offer.discountPercent}% off)`);
  },
  deleteSurplusOffer: (id: string): void => {
    const offer = db.getSurplusOffers().find(o => o.id === id);
    const list = db.getSurplusOffers().filter(o => o.id !== id);
    writeStorage(STORAGE_KEYS.SURPLUS, list);
    if (offer) {
      const prod = db.getProductById(offer.productId);
      if (prod) {
        db.updateProduct({
          ...prod,
          isSurplus: false,
          surplusDiscountPercent: undefined,
        });
      }
    }
  },

  // Reviews
  getReviews: (productId?: string): Review[] => {
    const all = readStorage<Review[]>(STORAGE_KEYS.REVIEWS, []);
    return productId ? all.filter((r: Review) => r.productId === productId) : all;
  },
  addReview: (review: Review): void => {
    const reviews = readStorage<Review[]>(STORAGE_KEYS.REVIEWS, []);
    reviews.unshift(review);
    writeStorage(STORAGE_KEYS.REVIEWS, reviews);

    const prodReviews = reviews.filter((r: Review) => r.productId === review.productId);
    const avg = prodReviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / prodReviews.length;
    const prod = db.getProductById(review.productId);
    if (prod) {
      db.updateProduct({
        ...prod,
        rating: Number(avg.toFixed(2)),
        reviewsCount: prodReviews.length,
      });
    }
  },

  // Audit Logs
  getAuditLogs: (): AdminAuditLog[] => readStorage<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []),
  addAuditLog: (action: string, actor: string, details: string): void => {
    const logs = db.getAuditLogs();
    logs.unshift({
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      action,
      actor,
      details,
      timestamp: new Date().toISOString(),
    });
    if (logs.length > 100) logs.length = 100;
    writeStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  // Reset to Factory Default Seed
  resetDatabase: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.FARMERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.HARVEST_CALENDAR);
    localStorage.removeItem(STORAGE_KEYS.SURPLUS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.CART);
    initializeDatabase();
    notifyListeners();
  }
};
