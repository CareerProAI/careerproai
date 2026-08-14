import React from 'react';

interface TopNavSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function TopNavSearchBar({ searchQuery, setSearchQuery }: TopNavSearchBarProps) {
  return (
    <div className="relative w-full max-w-xs md:max-w-md text-on-surface-variant focus-within:text-primary transition-colors">
      <span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm">search</span>
      <label htmlFor="input-navbar-search" className="visually-hidden">
        Search jobs by title, company, or skills
      </label>
      <input
        id="input-navbar-search"
        type="search"
        name="q"
        autoComplete="off"
        placeholder="Search jobs by title, company, or skills..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-surface-container-low dark:bg-surface-container border border-transparent focus:border-outline-variant rounded-full pl-10 pr-4 py-1.5 text-sm text-on-surface placeholder-on-surface-variant/70 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs hover:text-primary"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </div>
  );
}
