import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Tractor, ShieldCheck, HeartHandshake, KeyRound, CheckCircle2, MapPin } from 'lucide-react';
import { UserRole } from '../types';
import { auth, RegisterDTO } from '../services/auth';
import { useToast } from './Toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'customer',
}) => {
  const { success, error } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Farmer specific fields
  const [farmName, setFarmName] = useState('');
  const [farmDistrict, setFarmDistrict] = useState('');
  const [acreage, setAcreage] = useState<number>(20);
  const [farmBio, setFarmBio] = useState('');
  const [kisanCardNumber, setKisanCardNumber] = useState('');
  const [practiceOrganic, setPracticeOrganic] = useState(true);
  const [practiceJivamrit, setPracticeJivamrit] = useState(true);
  const [practiceZeroChemical, setPracticeZeroChemical] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickDemoFill = (targetRole: UserRole) => {
    setMode('login');
    if (targetRole === 'farmer') {
      setEmail('ramesh.kisan@annapurna.in');
      setPassword('farmer123');
    } else if (targetRole === 'admin') {
      setEmail('admin@kisandirect.gov.in');
      setPassword('admin123');
    } else {
      setEmail('ananya.bengaluru@gmail.com');
      setPassword('customer123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await auth.login(email, password);
        success(`Welcome, ${user.name}!`, `Logged in as ${user.role} with verified credentials.`);
        onClose();
      } else {
        const practices: string[] = [];
        if (practiceOrganic) practices.push('Jaivik Bharat Certified');
        if (practiceJivamrit) practices.push('Desi Cow Jivamrit Soil');
        if (practiceZeroChemical) practices.push('Zero Synthetic Pesticides');

        const dto: RegisterDTO = {
          name,
          email,
          password,
          role,
          phone,
          address: {
            street,
            area,
            city,
            state,
            pincode,
          },
          ...(role === 'farmer' && {
            farmName,
            farmCity: city,
            farmDistrict,
            farmState: state,
            acreage,
            farmBio,
            kisanCardNumber,
            farmingPractices: practices,
          }),
        };

        const user = await auth.register(dto);
        success(`Account Created!`, `Registered as ${user.role} with cryptographic salt & SHA-256 hash.`);
        onClose();
      }
    } catch (err: any) {
      error('Authentication Error', err.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 text-slate-800 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`pb-3 text-sm font-bold transition-colors flex-1 text-center border-b-2 ${
              mode === 'login'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Sign In (लॉग इन)
          </button>
          <button
            onClick={() => setMode('register')}
            className={`pb-3 text-sm font-bold transition-colors flex-1 text-center border-b-2 ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Create Account (नया खाता)
          </button>
        </div>

        {/* 3 Distinct Login Credentials Info Box */}
        <div className="mb-6 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-900 font-bold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Distinct 3-Role Demo Credentials:</span>
            </span>
            <span className="text-emerald-700 font-semibold text-[11px]">Click to auto-fill</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('customer')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-emerald-100 text-slate-800 font-bold text-center border border-emerald-200 transition-colors shadow-2xs truncate"
            >
              🛒 Consumer (Ananya)
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoFill('farmer')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-amber-100 text-amber-900 font-bold text-center border border-amber-200 transition-colors shadow-2xs truncate"
            >
              👨‍🌾 Kisan (Rameshwar)
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoFill('admin')}
              className="py-1.5 px-2 rounded-lg bg-white hover:bg-purple-100 text-purple-900 font-bold text-center border border-purple-200 transition-colors shadow-2xs truncate"
            >
              🏛️ Mandi Admin
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-emerald-200/60 text-[11px] text-slate-600 grid grid-cols-1 gap-1">
            <p><strong>Consumer:</strong> ananya.bengaluru@gmail.com / customer123</p>
            <p><strong>Kisan:</strong> ramesh.kisan@annapurna.in / farmer123</p>
            <p><strong>Admin:</strong> admin@kisandirect.gov.in / admin123</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Your Account Role:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'customer'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <HeartHandshake className="w-4 h-4 mb-1 text-emerald-600" />
                    <p className="text-xs font-bold">Consumer</p>
                    <p className="text-[10px] text-slate-500">Order in ₹</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'farmer'
                        ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Tractor className="w-4 h-4 mb-1 text-amber-600" />
                    <p className="text-xs font-bold">Kisan</p>
                    <p className="text-[10px] text-slate-500">Sell harvests</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'admin'
                        ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 mb-1 text-purple-600" />
                    <p className="text-xs font-bold">Mandi Admin</p>
                    <p className="text-[10px] text-slate-500">Oversight</p>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Rameshwar Patel"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Farmer Specific Fields */}
              {role === 'farmer' && (
                <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                  <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Tractor className="w-3.5 h-3.5 text-amber-700" />
                    <span>Kisan Kendra Registration Details</span>
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Khet / Farm Name</label>
                    <input
                      type="text"
                      required
                      value={farmName}
                      onChange={e => setFarmName(e.target.value)}
                      placeholder="e.g. Annapurna Jaivik Khet"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">District / Mandi</label>
                      <input
                        type="text"
                        required
                        value={farmDistrict}
                        onChange={e => setFarmDistrict(e.target.value)}
                        placeholder="e.g. Nashik District"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">PM-Kisan / Card No</label>
                      <input
                        type="text"
                        value={kisanCardNumber}
                        onChange={e => setKisanCardNumber(e.target.value)}
                        placeholder="e.g. PMK-MH-994"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@domain.in"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password {mode === 'register' && <span className="text-slate-400">(Hashed via SHA-256)</span>}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 text-xs uppercase tracking-wide mt-2"
          >
            {isLoading
              ? 'Verifying...'
              : mode === 'login'
              ? 'Sign In to KisanDirect'
              : `Register as ${role === 'farmer' ? 'Kisan Producer' : role === 'admin' ? 'Mandi Admin' : 'Consumer'}`}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              New to KisanDirect?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-emerald-700 hover:underline font-bold"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-emerald-700 hover:underline font-bold"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
