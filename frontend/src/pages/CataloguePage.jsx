import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookApi, taxonomyApi } from '../api/apiClient';
import BookCard from '../components/BookCard';
import { Filter, Search, RotateCcw, SlidersHorizontal, BookOpen } from 'lucide-react';

const CataloguePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const selectedCategory = searchParams.get('categoryId') || '';
  const selectedBrand = searchParams.get('publisherId') || '';
  const searchQuery = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'price-low', 'price-high', 'title'

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          taxonomyApi.getCategories(),
          taxonomyApi.getBrands()
        ]);
        setCategories(catRes.data);
        setBrands(brandRes.data);
      } catch (err) {
        console.error('Failed to load taxonomy:', err);
      }
    };
    fetchTaxonomy();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory) params.categoryId = selectedCategory;
        if (selectedBrand) params.publisherId = selectedBrand;
        if (searchQuery) params.search = searchQuery;

        const res = await bookApi.getBooks(params);
        setBooks(res.data);
      } catch (err) {
        console.error('Failed to load books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [selectedCategory, selectedBrand, searchQuery]);

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('categoryId', catId);
    } else {
      newParams.delete('categoryId');
    }
    setSearchParams(newParams);
  };

  const handleBrandChange = (brandId) => {
    const newParams = new URLSearchParams(searchParams);
    if (brandId) {
      newParams.set('publisherId', brandId);
    } else {
      newParams.delete('publisherId');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const sortedBooks = [...books].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;
    if (sortBy === 'price-low') return priceA - priceB;
    if (sortBy === 'price-high') return priceB - priceA;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Book Catalogue</h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing {sortedBooks.length} titles available with tentative delivery estimates
          </p>
        </div>

        {/* Sort & Quick Filter */}
        <div className="flex items-center space-x-3">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Categories & Brands (Slide 6 Wireframe Requirement) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Filter className="w-4 h-4 text-sky-600" />
                <span>Filter Books</span>
              </div>
              {(selectedCategory || selectedBrand || searchQuery) && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-red-600 hover:text-red-700 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Categories Filter (Slide 6: Select the Category of products) */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    !selectedCategory ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id.toString())}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === cat.id.toString()
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands / Publishers Filter (Slide 6: Browse the brands) */}
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Brands & Publishers</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleBrandChange('')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    !selectedBrand ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All Publishers
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandChange(brand.id.toString())}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedBrand === brand.id.toString()
                        ? 'bg-sky-50 text-sky-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Books Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : sortedBooks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 p-8">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No books found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No titles matched your selected category or publisher filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CataloguePage;
