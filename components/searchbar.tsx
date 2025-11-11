"use client"

import { exchangeList } from "@/lib/exchanges"
import { useState, useEffect } from "react"

export function SearchBar({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (value.length === 0) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = exchangeList.filter((exchange) => exchange.toLowerCase().includes(value.toLowerCase()))

    setSuggestions(filtered)
    setShowSuggestions(true)
  }, [value])

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion)
    setShowSuggestions(false)
  }

  const handleClear = () => {
    onChange("")
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search exchanges..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
          className="w-full pl-10 pr-8 py-2 bg-input border border-border rounded-md text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        {value && (
          <button
            title="Clear search"
            onClick={handleClear}
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors border-b border-border last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2m0 0v-8m0 8H3m18 0h-3"
                    />
                  </svg>
                  {suggestion}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showSuggestions && value.length > 0 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 p-3">
          <p className="text-xs text-muted-foreground text-center">No exchanges found</p>
        </div>
      )}
    </div>
  )
}
