import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookApi, taxonomyApi } from '../api/apiClient';
import BookCard from '../components/BookCard';
import CategoryCard from '../components/CategoryCard';
import { ArrowRight, Sparkles, BookOpen, Truck, ShieldCheck, Flame } from 'lucide-react';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, featRes] = await Promise.all([
          taxonomyApi.getCategories(),
          bookApi.getFeaturedBooks()
        ]);
        setCategories(catRes.data);
        setFeaturedBooks(featRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Banner Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white overflow-hidden p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Spring Boot + React + PostgreSQL E-Commerce Stack</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Discover Your Next <span className="bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">Great Read</span> Today.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Browse our curated catalogue of top technical books, timeless fiction, science, and leadership titles. Enjoy tentative delivery tracking and risk-free 48-hour order cancellation.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/catalogue"
              className="px-6 py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/catalogue?categoryId=1"
              className="px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center space-x-2"
            >
              <span>Tech & Programming</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid (Slide 6 Wireframe requirement) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Categories</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Browse by Category</h2>
          </div>
          <Link to="/catalogue" className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Books Showcase */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-amber-500">
              <Flame className="w-4 h-4 fill-current" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Featured Releases</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Trending & Bestsellers</h2>
          </div>
          <Link to="/catalogue" className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center">
            <span>See Full Store</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
