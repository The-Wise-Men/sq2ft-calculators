// Performance optimization utilities
class PerformanceOptimizer {
    constructor() {
        this.observers = new Map()
        this.lazyImages = []
        this.debounceTimers = new Map()
        this.init()
    }

    init() {
        this.setupIntersectionObserver()
        this.setupLazyLoading()
        this.setupDebouncing()
        this.optimizeAnimations()
        this.preloadCriticalResources()
    }

    // Intersection Observer for lazy loading
    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadLazyElement(entry.target)
                            this.intersectionObserver.unobserve(entry.target)
                        }
                    })
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.1
                }
            )
        }
    }

    // Lazy load images and components
    setupLazyLoading() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]')
        images.forEach(img => {
            if (this.intersectionObserver) {
                this.intersectionObserver.observe(img)
            } else {
                // Fallback for older browsers
                this.loadLazyElement(img)
            }
        })

        // Lazy load calculator components
        const calculators = document.querySelectorAll('[data-lazy-calculator]')
        calculators.forEach(calc => {
            if (this.intersectionObserver) {
                this.intersectionObserver.observe(calc)
            }
        })
    }

    loadLazyElement(element) {
        if (element.tagName === 'IMG' && element.dataset.src) {
            element.src = element.dataset.src
            element.removeAttribute('data-src')
            element.classList.add('loaded')
        }

        if (element.dataset.lazyCalculator) {
            this.loadCalculator(element.dataset.lazyCalculator)
        }
    }

    // Load calculator scripts on demand
    async loadCalculator(calculatorName) {
        try {
            const script = document.createElement('script')
            script.src = `${calculatorName}-calculator.js`
            script.async = true
            document.head.appendChild(script)
            
            console.log(`Loaded calculator: ${calculatorName}`)
        } catch (error) {
            console.error(`Failed to load calculator ${calculatorName}:`, error)
        }
    }

    // Debounce function calls
    setupDebouncing() {
        // Debounce resize events
        this.debounce('resize', () => {
            this.handleResize()
        }, 250)

        // Debounce scroll events
        this.debounce('scroll', () => {
            this.handleScroll()
        }, 100)
    }

    debounce(key, func, delay) {
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key))
        }
        
        const timer = setTimeout(() => {
            func()
            this.debounceTimers.delete(key)
        }, delay)
        
        this.debounceTimers.set(key, timer)
    }

    // Optimize animations based on user preferences
    optimizeAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        
        if (prefersReducedMotion) {
            // Disable animations
            document.documentElement.style.setProperty('--animation-duration', '0s')
            document.documentElement.style.setProperty('--transition-duration', '0s')
        }

        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations()
            } else {
                this.resumeAnimations()
            }
        })
    }

    pauseAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused')
    }

    resumeAnimations() {
        document.documentElement.style.setProperty('--animation-play-state', 'running')
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            '/styles.css',
            '/script.js',
            '/calculator-base.js'
        ]

        criticalResources.forEach(resource => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.href = resource
            link.as = resource.endsWith('.css') ? 'style' : 'script'
            document.head.appendChild(link)
        })
    }

    // Handle resize events
    handleResize() {
        // Recalculate layouts that depend on viewport size
        this.updateResponsiveElements()
    }

    // Handle scroll events
    handleScroll() {
        // Update scroll-based animations
        this.updateScrollAnimations()
    }

    // Update responsive elements
    updateResponsiveElements() {
        // Update calculator grid layouts
        const grids = document.querySelectorAll('.results-grid')
        grids.forEach(grid => {
            this.updateGridLayout(grid)
        })
    }

    updateGridLayout(grid) {
        const containerWidth = grid.offsetWidth
        const items = grid.children
        const itemWidth = 150 // Minimum item width
        
        const columns = Math.max(1, Math.floor(containerWidth / itemWidth))
        
        grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`
    }

    // Update scroll-based animations
    updateScrollAnimations() {
        // Update AOS animations if available
        if (window.AOS) {
            window.AOS.refresh()
        }
    }

    // Performance monitoring
    measurePerformance(name, fn) {
        const start = performance.now()
        const result = fn()
        const end = performance.now()
        
        console.log(`${name} took ${end - start} milliseconds`)
        return result
    }

    // Memory usage monitoring
    getMemoryUsage() {
        if ('memory' in performance) {
            return {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            }
        }
        return null
    }

    // Cleanup
    destroy() {
        // Clear all observers
        this.observers.forEach(observer => observer.disconnect())
        this.observers.clear()

        // Clear all timers
        this.debounceTimers.forEach(timer => clearTimeout(timer))
        this.debounceTimers.clear()

        // Disconnect intersection observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect()
        }
    }
}

// Initialize performance optimizer
let performanceOptimizer

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        performanceOptimizer = new PerformanceOptimizer()
    })
} else {
    performanceOptimizer = new PerformanceOptimizer()
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceOptimizer
}
