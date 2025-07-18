# TryneX - Premium Gift Collection

## Overview

TryneX is a modern e-commerce website specializing in premium gift collections. The platform features a comprehensive product catalog with 50+ items across 11 categories, including mugs, t-shirts, keychains, water bottles, and luxury gift hampers. The site is designed with a golden (#d4af37), white, and black color scheme to convey premium quality and luxury.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static Website**: Pure HTML, CSS, and JavaScript implementation
- **Responsive Design**: Mobile-first approach with breakpoints at 320px, 768px, 1024px, and 1440px
- **Single Page Application Elements**: Dynamic content loading and modal-based interactions
- **Modern UI/UX**: 2025 design trends with advanced animations, gradients, and 3D effects

### Backend Architecture
- **Serverless**: Static site hosted on Netlify
- **Client-Side Storage**: LocalStorage for cart, orders, and promo codes
- **Content Management**: Netlify CMS integration for admin functionality
- **No Traditional Backend**: All logic handled client-side with external service integrations

## Key Components

### Core Pages
- **index.html**: Main landing page with hero section, product showcase, and all primary features
- **products.html**: Dedicated product catalog page with advanced filtering and sorting
- **track-order.html**: Order tracking interface for customers
- **admin/index.html**: Admin panel for content management

### JavaScript Modules (script.js)
- **Cart Management**: Add/remove items, calculate totals, persist to localStorage
- **Order Management**: Generate unique order IDs (TXR-YYYYMMDD-XXX format)
- **Product Catalog**: 50+ products across 11 categories with detailed information
- **Search & Filter**: Live search with predictive suggestions and category filtering
- **Promo Code System**: Real-time validation and discount application
- **WhatsApp Integration**: Optional direct ordering via WhatsApp

### CSS Architecture (styles.css)
- **CSS Custom Properties**: Consistent theming with CSS variables
- **Component-Based Styling**: Modular approach for maintainability
- **Advanced Animations**: Fade-in, slide-in, parallax, and 3D tilt effects
- **Responsive Grid System**: Flexbox and CSS Grid for layout management

## Data Flow

### Product Management
1. Products stored in JavaScript array with detailed metadata
2. Admin panel (Netlify CMS) allows CRUD operations on product data
3. Real-time updates reflected across all pages

### Cart & Order Flow
1. User adds items to cart → stored in localStorage
2. Cart modal displays items with totals and promo code application
3. "Proceed to Order" generates unique order ID
4. Order data stored locally and can be tracked via order ID
5. Optional WhatsApp integration for direct communication

### Content Management
1. Admin accesses Netlify CMS panel
2. Content changes pushed to repository
3. Netlify auto-deploys updated site
4. Real-time content updates without downtime

## External Dependencies

### CDN Resources
- **Google Fonts**: Poppins font family for typography
- **Font Awesome**: Icon library for UI elements
- **Netlify Identity**: Authentication for admin panel access

### Third-Party Services
- **Netlify CMS**: Content management system
- **WhatsApp Business API**: Optional order communication (8801747292277)
- **Placeholder Images**: via.placeholder.com for product images

### Development Tools
- **Netlify**: Hosting and deployment platform
- **Git/GitHub**: Version control and repository management

## Deployment Strategy

### Netlify Configuration
- **Build Settings**: 
  - Branch: `main`
  - Base directory: `/` (root)
  - Build command: (blank - static site)
  - Publish directory: `/`

### Admin Panel Setup
- **Netlify CMS**: Configured via admin/config.yml
- **Collections**: Products, Categories, Orders, Promo Codes, Banners
- **Authentication**: Netlify Identity for admin access

### Environment Variables
- **WHATSAPP_NUMBER**: 8801747292277 (stored securely in Netlify)
- **CMS Configuration**: Admin panel access credentials

### Performance Optimization
- **Lazy Loading**: Images loaded on demand
- **Minified Assets**: CSS and JS optimization
- **Efficient Rendering**: Optimized DOM manipulation
- **Caching Strategy**: Netlify CDN for static assets

### Content Collections (admin/config.yml)
- **Products**: title, price, category, image, description
- **Categories**: name, slug, display order
- **Orders**: order_id, status, payment_method, payment_status, instructions, delivery_address
- **Promo Codes**: code, discount_type, discount_value, expiry_date, active_status
- **Banners**: title, image, link, active_status, display_order

The application is designed for easy maintenance and scalability, with clear separation of concerns between presentation, business logic, and data management.