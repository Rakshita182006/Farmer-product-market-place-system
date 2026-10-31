import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Layers, ArrowRight, Play, Sparkles } from 'lucide-react';
import { UserRole } from '../types';
import { auth } from '../services/auth';

interface StageNavigatorProps {
  activeView: string;
  setActiveView: (view: string) => void;
  openAuthModal: () => void;
}

export const StageNavigator: React.FC<StageNavigatorProps> = ({
  activeView,
  setActiveView,
  openAuthModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const stages = [
    {
      num: 1,
      title: 'Project Structure, Database & Theme',
      desc: 'Reactive local database, seed data, Plus Jakarta Sans & Playfair Display fonts, earthy palette.',
      targetView: 'marketplace',
      actionRole: null,
    },
    {
      num: 2,
      title: 'Auth, Password Hashing & RBAC',
      desc: 'WebCrypto SHA-256 with 16-byte random salt, customer/farmer/admin roles & quick demo switcher.',
      targetView: 'marketplace',
      actionRole: null,
      customAction: openAuthModal,
      actionLabel: 'Test Auth Dialog',
    },
    {
      num: 3,
      title: 'Farmer Profiles & Product Management',
      desc: 'Certified grower stories, soil types, acreage, batch codes, organic/regenerative tags.',
      targetView: 'farms',
      actionRole: null,
    },
    {
      num: 4,
      title: 'Marketplace, Search & Product Details',
      desc: 'Filter by freshness/price/organic, fair price breakdown, reviews, and stock limits.',
      targetView: 'marketplace',
      actionRole: null,
    },
    {
      num: 5,
      title: 'Cart, Checkout & Inventory Decrement',
      desc: 'Farm-grouped basket, harvest delivery slots, payment modes, and transactional stock updates.',
      targetView: 'orders',
      actionRole: 'customer' as UserRole,
    },
    {
      num: 6,
      title: 'Farmer & Administrator Dashboards',
      desc: 'Grower inventory editor, order fulfillment, farm verification center, and security audit logs.',
      targetView: 'farmer-dashboard',
      actionRole: 'farmer' as UserRole,
    },
    {
      num: 7,
      title: 'Harvest Calendar, Surplus & Fair Pricing',
      desc: 'Crop ripening schedule, 20–30% surplus flash deals, and interactive supermarket markup explorer.',
      targetView: 'fair-price',
      actionRole: null,
    },
    {
      num: 8,
      title: 'End-to-End Workflow & Demonstration',
      desc: 'Full cycle: register farmer -> list produce -> customer cart -> order tracking -> fulfillment.',
      targetView: 'marketplace',
      actionRole: null,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 text-slate-700 text-xs shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span className="font-bold text-slate-800">8-Stage Implementation Roadmap:</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Stages 1–8 Active & Verified</span>
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100 border border-slate-200/80 font-medium"
        >
          <span>{isExpanded ? 'Hide Stage Blueprint' : 'View Mini-Project 8 Stages'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/70">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {stages.map(stage => (
              <div
                key={stage.num}
                className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-500/60 hover:shadow-xs transition-all flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-700 text-[11px]">Stage {stage.num}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-xs mt-0.5">{stage.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">{stage.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (stage.actionRole) {
                        auth.switchPersona(stage.actionRole);
                      }
                      setActiveView(stage.targetView);
                    }}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect Feature</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  {stage.customAction && (
                    <button
                      onClick={stage.customAction}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-medium border border-slate-200"
                    >
                      {stage.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
