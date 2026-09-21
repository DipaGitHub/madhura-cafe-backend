import { initialBanners, initialCategories, initialMenuItems, initialReservations, initialInquiries } from '../data/seedData.js';

class DataStore {
  constructor() {
    this.banners = [...initialBanners];
    this.categories = [...initialCategories];
    this.menuItems = [...initialMenuItems];
    this.reservations = [...initialReservations];
    this.inquiries = [...initialInquiries];
  }

  // Menu Items
  getMenuItems(filters = {}) {
    let items = [...this.menuItems];
    if (filters.category) {
      items = items.filter(i => i.category === filters.category);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) || 
        i.description.toLowerCase().includes(q) ||
        (i.healthBenefits && i.healthBenefits.some(b => b.toLowerCase().includes(q)))
      );
    }
    return items;
  }

  getMenuItemById(id) {
    return this.menuItems.find(i => i.id === id);
  }

  createMenuItem(data) {
    const newItem = {
      id: `dish-${Date.now()}`,
      ...data,
      price: Number(data.price),
      rating: data.rating || 5.0,
      isAvailable: data.isAvailable !== false,
      isPopular: Boolean(data.isPopular),
      healthBenefits: Array.isArray(data.healthBenefits) ? data.healthBenefits : (data.healthBenefits ? data.healthBenefits.split(',').map(s => s.trim()) : []),
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : (data.ingredients ? data.ingredients.split(',').map(s => s.trim()) : []),
      dietary: Array.isArray(data.dietary) ? data.dietary : (data.dietary ? data.dietary.split(',').map(s => s.trim()) : [])
    };
    this.menuItems.unshift(newItem);
    return newItem;
  }

  updateMenuItem(id, updates) {
    const idx = this.menuItems.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.menuItems[idx] = {
      ...this.menuItems[idx],
      ...updates,
      price: updates.price ? Number(updates.price) : this.menuItems[idx].price
    };
    return this.menuItems[idx];
  }

  deleteMenuItem(id) {
    const idx = this.menuItems.findIndex(i => i.id === id);
    if (idx === -1) return false;
    this.menuItems.splice(idx, 1);
    return true;
  }

  // Banners
  getBanners() {
    return this.banners;
  }

  createBanner(data) {
    const newBanner = {
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...data
    };
    this.banners.push(newBanner);
    return newBanner;
  }

  updateBanner(id, updates) {
    const idx = this.banners.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.banners[idx] = { ...this.banners[idx], ...updates };
    return this.banners[idx];
  }

  deleteBanner(id) {
    const idx = this.banners.findIndex(b => b.id === id);
    if (idx === -1) return false;
    this.banners.splice(idx, 1);
    return true;
  }

  // Categories
  getCategories() {
    return this.categories;
  }

  createCategory(data) {
    const newCat = {
      id: `cat-${Date.now()}`,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      ...data
    };
    this.categories.push(newCat);
    return newCat;
  }

  deleteCategory(id) {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.categories.splice(idx, 1);
    return true;
  }

  // Reservations
  getReservations() {
    return this.reservations;
  }

  createReservation(data) {
    const newRes = {
      id: `res-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...data
    };
    this.reservations.unshift(newRes);
    return newRes;
  }

  updateReservationStatus(id, status) {
    const res = this.reservations.find(r => r.id === id);
    if (!res) return null;
    res.status = status;
    return res;
  }

  deleteReservation(id) {
    const idx = this.reservations.findIndex(r => r.id === id);
    if (idx === -1) return false;
    this.reservations.splice(idx, 1);
    return true;
  }

  // Inquiries
  getInquiries() {
    return this.inquiries;
  }

  createInquiry(data) {
    const newInq = {
      id: `inq-${Date.now()}`,
      status: 'Unread',
      createdAt: new Date().toISOString(),
      ...data
    };
    this.inquiries.unshift(newInq);
    return newInq;
  }

  // Statistics
  getStats() {
    return {
      totalMenuItems: this.menuItems.length,
      totalCategories: this.categories.length,
      totalReservations: this.reservations.length,
      pendingReservations: this.reservations.filter(r => r.status === 'Pending').length,
      confirmedReservations: this.reservations.filter(r => r.status === 'Confirmed').length,
      totalInquiries: this.inquiries.length
    };
  }
}

export const db = new DataStore();
