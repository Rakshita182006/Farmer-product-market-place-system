/**
 * KisanDirect Authentication & Role-Based Access Control (RBAC) Service
 */

import { User, UserRole, FarmerProfile } from '../types';
import { db, ASSET_IMAGES } from './db';
import { hashPassword, verifyPassword } from './crypto';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
  };
  // Farmer-specific details
  farmName?: string;
  farmCity?: string;
  farmDistrict?: string;
  farmState?: string;
  farmBio?: string;
  acreage?: number;
  kisanCardNumber?: string;
  farmingPractices?: string[];
}

export const auth = {
  /**
   * Register a new user with cryptographic password hashing (salt + SHA-256)
   */
  register: async (dto: RegisterDTO): Promise<User> => {
    const existing = db.getUserByEmail(dto.email);
    if (existing) {
      throw new Error(`An account with email ${dto.email} already exists.`);
    }

    if (dto.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const { hash, salt } = await hashPassword(dto.password);
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    let farmerProfileId: string | undefined = undefined;

    // If registering as a farmer, create the linked farmer profile
    if (dto.role === 'farmer') {
      farmerProfileId = 'farmer_' + Date.now();
      const farmerProfile: FarmerProfile = {
        id: farmerProfileId,
        userId: userId,
        farmName: dto.farmName || `${dto.name}'s Jaivik Khet`,
        tagline: '100% Desi Cow Natural Farming',
        bio: dto.farmBio || 'Dedicated to zero-pesticide natural farming and direct-to-kitchen fair pricing.',
        city: dto.farmCity || dto.address?.city || 'Nashik',
        district: dto.farmDistrict || 'Nashik District',
        state: dto.farmState || dto.address?.state || 'Maharashtra',
        distanceKm: Math.floor(Math.random() * 25) + 8,
        acreage: dto.acreage || 15,
        establishedYear: new Date().getFullYear(),
        practices: dto.farmingPractices && dto.farmingPractices.length > 0 
          ? dto.farmingPractices 
          : ['Jaivik Bharat Certified', 'Jivamrit Living Soil', 'Zero Synthetic Chemical Spray'],
        certifications: [
          {
            id: 'cert_' + Date.now(),
            name: 'PGS-India Green Organic Certificate',
            issuingBody: 'Ministry of Agriculture, Govt. of India',
            yearCertified: new Date().getFullYear(),
            badgeNumber: 'PGS-IN-' + Math.floor(1000 + Math.random() * 9000),
            isVerified: false, // Requires admin/mandi board verification
          }
        ],
        bannerImage: ASSET_IMAGES.farmLandscape,
        avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
        directStory: 'We joined KisanDirect so that our crops are delivered fresh to consumers while saving our family from middleman Mandi deductions.',
        soilType: 'Rich Regur Black Soil with Compost',
        waterSource: 'Rainwater Check-Dam & Natural Well',
        contactPhone: dto.phone || '+91 98000 00000',
        contactEmail: dto.email,
        rating: 5.0,
        reviewsCount: 0,
        isVerified: false,
        joinedDate: new Date().toISOString().split('T')[0],
        deliveryTimeEstimate: '⚡ 45 Mins Express Drop',
      };

      db.addFarmerProfile(farmerProfile);
    }

    const newUser: User = {
      id: userId,
      name: dto.name,
      email: dto.email.toLowerCase().trim(),
      role: dto.role,
      passwordHash: hash,
      salt: salt,
      phone: dto.phone,
      address: dto.address,
      farmerProfileId,
      kisanCardNumber: dto.kisanCardNumber,
      createdAt: new Date().toISOString(),
    };

    db.addUser(newUser);
    db.setCurrentUser(newUser);
    return newUser;
  },

  /**
   * Log in an existing user with cryptographic password verification
   */
  login: async (email: string, password: string): Promise<User> => {
    const user = db.getUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isValid = await verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      throw new Error('Invalid email or password.');
    }

    db.setCurrentUser(user);
    db.addAuditLog('USER_LOGIN', user.email, `User ${user.name} (${user.role}) logged in with verified credentials`);
    return user;
  },

  /**
   * Log out active session
   */
  logout: (): void => {
    const current = db.getCurrentUser();
    if (current) {
      db.addAuditLog('USER_LOGOUT', current.email, `User ${current.name} logged out`);
    }
    db.setCurrentUser(null);
  },

  /**
   * Switch persona effortlessly for demonstration
   */
  switchPersona: (role: UserRole): User | null => {
    const users = db.getUsers();
    let target = users.find(u => u.role === role);
    if (target) {
      db.setCurrentUser(target);
      return target;
    }
    return null;
  },

  getCurrentUser: (): User | null => db.getCurrentUser(),

  isAuthenticated: (): boolean => db.getCurrentUser() !== null,

  isCustomer: (user?: User | null): boolean => (user ?? db.getCurrentUser())?.role === 'customer',
  isFarmer: (user?: User | null): boolean => (user ?? db.getCurrentUser())?.role === 'farmer',
  isAdmin: (user?: User | null): boolean => (user ?? db.getCurrentUser())?.role === 'admin',
};
