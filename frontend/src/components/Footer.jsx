import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Truck, Clock, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* Value Propositions */}
      <div className="border-b border-slate-800 py-10 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-sky-950 text-sky-400 rounded-xl border border-sky-800/50">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Tentative Delivery Dates</h4>
              <p className="text-xs text-slate-400 mt-1">Accurate shipping timelines for all book purchases.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-indigo-950 text-indigo-400 rounded-xl border border-indigo-800/50">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">48-Hour Free Cancellation</h4>
              <p className="text-xs text-slate-400 mt-1">Cancel anytime within 48 hours directly from order history.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-amber-950 text-amber-400 rounded-xl border border-amber-800/50">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Redeem Gift Points</h4>
              <p className="text-xs text-slate-400 mt-1">Earn reward points on orders and save on checkout.</p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Secure Payment Options</h4>
              <p className="text-xs text-slate-400 mt-1">Multiple payment channels including Credit & Debit cards.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold">BookHaven</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Cloud FullStack Capstone Project. A modern eCommerce bookstore featuring Spring Boot 3, PostgreSQL, React, and containerized Docker orchestration.
          </p>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Explore Categories</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/catalogue?categoryId=1" className="hover:text-white transition-colors">Technology & Programming</Link></li>
            <li><Link to="/catalogue?categoryId=2" className="hover:text-white transition-colors">Fiction & Literature</Link></li>
            <li><Link to="/catalogue?categoryId=3" className="hover:text-white transition-colors">Business & Management</Link></li>
            <li><Link to="/catalogue?categoryId=4" className="hover:text-white transition-colors">Science & Nature</Link></li>
            <li><Link to="/catalogue?categoryId=5" className="hover:text-white transition-colors">Self-Help & Productivity</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Customer Features</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/orders" className="hover:text-white transition-colors">Order History & "Buy It Again"</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">48-Hour Order Cancellation</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Smart Basket & Recommendations</Link></li>
            <li><Link to="/catalogue" className="hover:text-white transition-colors">Publisher & Brand Catalogues</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white text-sm font-semibold mb-3">Project Architecture</h4>
          <p className="text-xs text-slate-400 mb-2">
            Built using REST APIs, JPA entities, OpenAPI 3.0 specification, and lightweight multi-stage Docker deployment.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-sky-400 border border-slate-700">React 18</span>
            <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-emerald-400 border border-slate-700">Spring Boot 3</span>
            <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-blue-400 border border-slate-700">PostgreSQL</span>
            <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-cyan-400 border border-slate-700">Tailwind CSS</span>
            <span className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-purple-400 border border-slate-700">Docker Compose</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 BookHaven E-Commerce Platform. Cloud FullStack Capstone Project.</p>
      </div>
    </footer>
  );
};

export default Footer;
