/**
 * store.ts — Supabase-backed data store with USA-localized circular commodities & live auctions
 */

import { supabase } from "@/lib/supabase";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type WasteCategory =
  | "Plastic" | "Paper" | "Metal" | "Glass" | "E-Waste"
  | "Textile" | "Organic" | "Industrial" | "Reclaimed Timber" | "Other";

export type ListingStatus = "active" | "paused" | "draft" | "sold";
export type RequestStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type TransactionStatus =
  | "confirmed" | "pickup_scheduled" | "in_transit"
  | "delivered" | "completed" | "cancelled";

export type USRegion =
  | "All" | "Midwest" | "Gulf Coast" | "West Coast" | "Northeast" | "Southeast" | "Southwest";

export const US_STATES = [
  "All", "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois",
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana",
  "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
  "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah",
  "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
] as const;

export interface MaterialSpecs {
  purity?: string;
  contamination?: string;
  moisture?: string;
  packaging?: string;
  freight_terms?: string;
  moq?: string;
  isri_code?: string;
  origin_zip?: string;
}

export interface BidItem {
  id: string;
  bidder_id: string;
  bidder_name: string;
  amount: number;
  created_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "buyer" | "seller" | "admin";
  phone?: string;
  location?: string;
  bio?: string;
  business_name?: string;
  active: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  seller_name: string;
  seller_business?: string;
  title: string;
  category: WasteCategory;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  currency: string;
  location: string;
  region?: USRegion;
  state?: string;
  image_url?: string;
  status: ListingStatus;
  is_auction?: boolean;
  auction_end_time?: string;
  current_bid?: number;
  bid_count?: number;
  min_bid_increment?: number;
  bids?: BidItem[];
  specs?: MaterialSpecs;
  verified_seller?: boolean;
  created_at: string;
}

export interface BuyerRequest {
  id: string;
  listing_id: string;
  listing_title: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  quantity: number;
  unit?: string;
  offered_price?: number;
  message?: string;
  status: RequestStatus;
  created_at: string;
}

export interface Transaction {
  id: string;
  request_id?: string;
  listing_id?: string;
  listing_title: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  category: WasteCategory;
  quantity: number;
  unit: string;
  price: number;
  total: number;
  currency?: string;
  location?: string;
  bol_number?: string;
  carrier_name?: string;
  tracking_step?: number;
  status: TransactionStatus;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  order_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: "buyer" | "seller" | "system";
  text: string;
  attachment_name?: string;
  attachment_type?: "image" | "document";
  attachment_url?: string;
  created_at: string;
}

export interface CommodityIndex {
  symbol: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  change24h: number;
  high24h: number;
  low24h: number;
  updated_at: string;
}

// ─── INITIAL US COMMODITY DATA ────────────────────────────────────────────────

export const LIVE_COMMODITY_INDICES: CommodityIndex[] = [
  { symbol: "OCC-11", name: "OCC #11 Baled Cardboard", category: "Paper", price: 145, unit: "Ton", change24h: +4.2, high24h: 148, low24h: 139, updated_at: "Just now" },
  { symbol: "HDPE-NAT", name: "HDPE #2 Natural Flakes", category: "Plastic", price: 0.58, unit: "lb", change24h: +2.1, high24h: 0.60, low24h: 0.56, updated_at: "Just now" },
  { symbol: "CU-BRIGHT", name: "Bare Bright Copper Millberry", category: "Metal", price: 3.85, unit: "lb", change24h: +1.4, high24h: 3.90, low24h: 3.80, updated_at: "Just now" },
  { symbol: "AL-6063", name: "Aluminum 6063 Clean Extrusion", category: "Metal", price: 0.92, unit: "lb", change24h: -0.8, high24h: 0.94, low24h: 0.91, updated_at: "Just now" },
  { symbol: "PET-CLR", name: "PET #1 Clear Bottle Flakes", category: "Plastic", price: 0.46, unit: "lb", change24h: +3.0, high24h: 0.48, low24h: 0.44, updated_at: "Just now" },
  { symbol: "SS-304", name: "Stainless Steel 304 Solids", category: "Metal", price: 0.68, unit: "lb", change24h: +0.5, high24h: 0.70, low24h: 0.67, updated_at: "Just now" },
];

export const INITIAL_USA_LISTINGS: Listing[] = [
  {
    id: "us-lst-001",
    seller_id: "seller-gulf-01",
    seller_name: "Apex Recycled Polymers LLC",
    seller_business: "Apex Polymers North America",
    title: "Post-Consumer HDPE #2 Regrind Flakes (Natural / Translucent)",
    category: "Plastic",
    description: "Washed and optically sorted post-consumer HDPE bottle flakes. Ideal for blow molding, pipe extrusion, and masterbatch compounding. Certified low melt flow index with uniform flake geometry.",
    quantity: 44000,
    unit: "lbs",
    price: 0.58,
    currency: "USD",
    location: "Houston, TX",
    region: "Gulf Coast",
    state: "Texas",
    image_url: "/images/pvc-pipes.jpg",
    status: "active",
    is_auction: true,
    auction_end_time: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(),
    current_bid: 25520,
    bid_count: 14,
    min_bid_increment: 250,
    verified_seller: true,
    specs: {
      purity: "99.2% Pure Natural HDPE",
      contamination: "< 0.4% non-target polymers",
      moisture: "< 0.5%",
      packaging: "1,500 lb Super Sacks / Gaylords",
      freight_terms: "FOB Houston Yard / Rail Spur Available",
      moq: "22,000 lbs (Half Truckload)",
      isri_code: "ISRI-PL-HDPE-2",
      origin_zip: "77015",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: "us-lst-002",
    seller_id: "seller-mw-02",
    seller_name: "Midwest Paper Recovery Inc.",
    seller_business: "Midwest Fiber Logistics",
    title: "Grade #11 Corrugated Cardboard (OCC) Mill-Spec Bales",
    category: "Paper",
    description: "High-density clean export-grade OCC bales. Strict moisture control (<10%) and double-wire tied for high-speed container loading. Generated from primary dry distribution centers.",
    quantity: 65,
    unit: "Tons",
    price: 145,
    currency: "USD",
    location: "Chicago, IL",
    region: "Midwest",
    state: "Illinois",
    image_url: "https://images.unsplash.com/photo-1583316174775-bd6dc0e9f298?w=800&q=80",
    status: "active",
    is_auction: false,
    verified_seller: true,
    specs: {
      purity: "98.5% Clean Corrugated",
      contamination: "< 1.5% Prohibitive Materials",
      moisture: "8.5% Average",
      packaging: "High-Density Bales (1,400 lbs avg)",
      freight_terms: "FOB Chicago Distribution Hub",
      moq: "20 Tons (1 Full 53' Dry Van)",
      isri_code: "ISRI Grade #11 (OCC)",
      origin_zip: "60608",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "us-lst-003",
    seller_id: "seller-det-03",
    seller_name: "Great Lakes Metal Recycling Co.",
    seller_business: "Great Lakes Scrap Metals",
    title: "Clean 6063 Aluminum Extrusion Scrap (9-inch cuts)",
    category: "Metal",
    description: "Clean mill-finish 6063 aluminum profile drops from architectural window and door manufacturing. Zero paint, thermal break, or iron attachments. Ready for immediate induction furnace charge.",
    quantity: 38000,
    unit: "lbs",
    price: 0.92,
    currency: "USD",
    location: "Detroit, MI",
    region: "Midwest",
    state: "Michigan",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    status: "active",
    is_auction: true,
    auction_end_time: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    current_bid: 34960,
    bid_count: 22,
    min_bid_increment: 500,
    verified_seller: true,
    specs: {
      purity: "99.0% Alloy 6063",
      contamination: "< 0.1% Fe / Attachments",
      moisture: "Dry indoor storage",
      packaging: "Stacked bundled skids / Steel strapping",
      freight_terms: "FOB Detroit Facility",
      moq: "38,000 lbs (Full Flatbed)",
      isri_code: "ISRI 'TOTO / TATA'",
      origin_zip: "48209",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "us-lst-004",
    seller_id: "seller-pa-04",
    seller_name: "Keystone Non-Ferrous & Wire",
    seller_business: "Keystone Smelting Supply",
    title: "Bare Bright #1 Copper Wire Chops & Stripped Busbars",
    category: "Metal",
    description: "Premium uncoated, unalloyed #1 bare bright copper wire chops. Free of brittle burned wire, tinned copper, solder, or lacquer. Spark emission tested for 99.9% electrical conductivity grade.",
    quantity: 22500,
    unit: "lbs",
    price: 3.85,
    currency: "USD",
    location: "Pittsburgh, PA",
    region: "Northeast",
    state: "Pennsylvania",
    image_url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
    status: "active",
    is_auction: true,
    auction_end_time: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    current_bid: 86625,
    bid_count: 38,
    min_bid_increment: 750,
    verified_seller: true,
    specs: {
      purity: "99.9% Electrolytic Copper",
      contamination: "0.0% Non-metallics",
      moisture: "0.0%",
      packaging: "Heavy-Duty Steel Drums (2,000 lbs each)",
      freight_terms: "FOB Pittsburgh Secured Terminal",
      moq: "10,000 lbs",
      isri_code: "ISRI 'BARLEY / BERRY'",
      origin_zip: "15201",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: "us-lst-005",
    seller_id: "seller-atl-05",
    seller_name: "Southeast Pallet & Timber Surplus",
    seller_business: "Southeast Circular Timber",
    title: "Grade-A Heat Treated (HT) Reclaimed Hardwood Pallets (48x40)",
    category: "Reclaimed Timber",
    description: "Refurbished and certified 4-way entry #1 Grade A 48x40 GMA pallets. ISPM-15 stamped for international shipping and domestic distribution. Solid stringers, flush decks, rigorously load-tested.",
    quantity: 1200,
    unit: "Units",
    price: 7.25,
    currency: "USD",
    location: "Atlanta, GA",
    region: "Southeast",
    state: "Georgia",
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    status: "active",
    is_auction: false,
    verified_seller: true,
    specs: {
      purity: "Grade A 4-Way Entry",
      contamination: "Clean Hardwood / HT Stamped",
      moisture: "< 14% Kiln / Air Dried",
      packaging: "Stacked 20 high (Banded)",
      freight_terms: "FOB Atlanta Yard / Local Drop-trailer available",
      moq: "600 Units (1 Dedicated Dry Van)",
      isri_code: "NWPCA Grade A GMA",
      origin_zip: "30336",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 16).toISOString(),
  },
  {
    id: "us-lst-006",
    seller_id: "seller-tx-06",
    seller_name: "CircuitCycle ITAD Solutions",
    seller_business: "CircuitCycle Americas",
    title: "Tested & De-populated Telecom & Server Motherboards (High-Grade E-Scrap)",
    category: "E-Waste",
    description: "R2v3 and ISO 14001 compliant enterprise IT asset disposition scrap. Clean gold-pin connectors, server motherboards, and telecom backplanes with all lithium batteries safely removed.",
    quantity: 16000,
    unit: "lbs",
    price: 2.40,
    currency: "USD",
    location: "Austin, TX",
    region: "Southwest",
    state: "Texas",
    image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    status: "active",
    is_auction: true,
    auction_end_time: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    current_bid: 38400,
    bid_count: 19,
    min_bid_increment: 400,
    verified_seller: true,
    specs: {
      purity: "High-Yield Precious Metal Content (Au/Ag/Pd)",
      contamination: "Zero Batteries / Zero Capacitors",
      moisture: "0.0%",
      packaging: "Reinforced Gaylord Boxes with Wood Pallets",
      freight_terms: "FOB Austin Secure ITAD Depot",
      moq: "5,000 lbs",
      isri_code: "ISRI E-Scrap High-Grade Circuit Boards",
      origin_zip: "78744",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "us-lst-007",
    seller_id: "seller-oh-07",
    seller_name: "Buckeye Industrial Container Services",
    seller_business: "Buckeye Drum Reconditioning",
    title: "55-Gallon High-Molecular Weight (HMW) HDPE Blue Drums (Triple-Rinsed)",
    category: "Industrial",
    description: "Reconditioned 55-gallon tight-head and open-top blue industrial polyethylene drums. UN-rated, leak-tested to 200 kPa. Suitable for chemical storage, wastewater handling, or raw flake regrind.",
    quantity: 550,
    unit: "Units",
    price: 16.50,
    currency: "USD",
    location: "Cleveland, OH",
    region: "Midwest",
    state: "Ohio",
    image_url: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&q=80",
    status: "active",
    is_auction: false,
    verified_seller: true,
    specs: {
      purity: "HMW-HDPE Clean Food/Chemical Grade",
      contamination: "Decontaminated & Neutralized",
      moisture: "Dry / Plugged",
      packaging: "Palletized (4 per pallet) with stretch wrap",
      freight_terms: "FOB Cleveland Logistics Terminal",
      moq: "100 Units",
      isri_code: "RIPC UN 1H1 / 1H2",
      origin_zip: "44114",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    id: "us-lst-008",
    seller_id: "seller-ca-08",
    seller_name: "Pacific Tire Recycling & Crumb Inc.",
    seller_business: "Pacific Tire Materials",
    title: "Commercial Truck Tire 2-inch TDF Shred & Baled Casings",
    category: "Industrial",
    description: "Tire Derived Fuel (TDF) primary 2-inch shred and radial truck casings. High BTU energy rating with 92% wire extraction. Used for asphalt modification, playground surfaces, and cement kilns.",
    quantity: 80,
    unit: "Tons",
    price: 85,
    currency: "USD",
    location: "Los Angeles, CA",
    region: "West Coast",
    state: "California",
    image_url: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=800&q=80",
    status: "active",
    is_auction: true,
    auction_end_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    current_bid: 6800,
    bid_count: 9,
    min_bid_increment: 200,
    verified_seller: true,
    specs: {
      purity: "100% Commercial Truck Tires",
      contamination: "< 2.0% Bead Wire Residue",
      moisture: "< 3.0%",
      packaging: "Bulk Walking Floor Trailer / 1-Ton Super Sacks",
      freight_terms: "FOB Los Angeles Processing Yard",
      moq: "24 Tons (1 Walking-Floor Truckload)",
      isri_code: "ASTM D6270 / ISRI Tire Shred",
      origin_zip: "90058",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: "us-lst-009",
    seller_id: "seller-nc-09",
    seller_name: "Carolinas Poly-Clean Recyclers",
    seller_business: "Carolinas Polymer Group",
    title: "Post-Consumer Clean Clear PET Flakes (Intrinsic Viscosity > 0.76)",
    category: "Plastic",
    description: "Hot-washed caustic-cleaned PET clear bottle flakes with low PVC (< 20 ppm) and low AA. Ideal for rPET bottle-to-bottle preforms, strapping, and polyester staple fiber production.",
    quantity: 45000,
    unit: "lbs",
    price: 0.46,
    currency: "USD",
    location: "Charlotte, NC",
    region: "Southeast",
    state: "North Carolina",
    image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    status: "active",
    is_auction: false,
    verified_seller: true,
    specs: {
      purity: "99.8% Clear PET",
      contamination: "< 20 ppm PVC / < 50 ppm Polyolefin",
      moisture: "< 0.8%",
      packaging: "2,000 lb Lined Bulk Bags on Pallets",
      freight_terms: "FOB Charlotte Rail Depot",
      moq: "45,000 lbs (Full 53ft Van)",
      isri_code: "ISRI Clear Bottle Flake Grade A",
      origin_zip: "28208",
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 32).toISOString(),
  }
];

// ─── LOCAL STORAGE PERSISTENCE HELPERS ────────────────────────────────────────

const STORAGE_KEYS = {
  LISTINGS: "encorb_usa_listings",
  REQUESTS: "encorb_usa_requests",
  TRANSACTIONS: "encorb_usa_transactions",
  NOTIFICATIONS: "encorb_usa_notifications",
  CHATS: "encorb_usa_order_chats",
};

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// ─── LISTINGS API ─────────────────────────────────────────────────────────────

export async function getListings(): Promise<Listing[]> {
  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Merge with enriched specs and images if DB has base listings
      return data as Listing[];
    }
  } catch {
    // fallback to local storage
  }

  const local = getLocal<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_USA_LISTINGS);
  if (!local || local.length === 0) {
    setLocal(STORAGE_KEYS.LISTINGS, INITIAL_USA_LISTINGS);
    return INITIAL_USA_LISTINGS;
  }
  return local.filter((l) => l.status === "active");
}

export async function getListingById(id: string): Promise<Listing | null> {
  try {
    const { data } = await supabase.from("listings").select("*").eq("id", id).single();
    if (data) return data as Listing;
  } catch {}

  const all = getLocal<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_USA_LISTINGS);
  return all.find((l) => l.id === id) || null;
}

export async function getListingsBySeller(sellerId: string): Promise<Listing[]> {
  try {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data as Listing[];
  } catch {}

  const all = getLocal<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_USA_LISTINGS);
  return all.filter((l) => l.seller_id === sellerId);
}

export async function createListing(
  payload: Omit<Listing, "id" | "created_at">
): Promise<Listing | null> {
  const newListing: Listing = {
    ...payload,
    id: `us-lst-${Date.now()}`,
    currency: payload.currency || "USD",
    status: payload.status || "active",
    created_at: new Date().toISOString(),
  };

  try {
    const { data, error } = await supabase
      .from("listings")
      .insert([{
        seller_id: payload.seller_id,
        seller_name: payload.seller_name,
        seller_business: payload.seller_business,
        title: payload.title,
        category: payload.category,
        description: payload.description,
        quantity: payload.quantity,
        unit: payload.unit,
        price: payload.price,
        currency: payload.currency || "USD",
        location: payload.location,
        image_url: payload.image_url,
        status: payload.status || "active",
      }])
      .select()
      .single();

    if (!error && data) {
      return data as Listing;
    }
  } catch {}

  const all = getLocal<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_USA_LISTINGS);
  all.unshift(newListing);
  setLocal(STORAGE_KEYS.LISTINGS, all);
  return newListing;
}

export async function updateListing(id: string, updates: Partial<Listing>): Promise<void> {
  try {
    await supabase.from("listings").update(updates).eq("id", id);
  } catch {}

  const all = getLocal<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_USA_LISTINGS);
  const idx = all.findIndex((l) => l.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal(STORAGE_KEYS.LISTINGS, all);
  }
}

export async function deleteListing(id: string): Promise<void> {
  try {
    await supabase.from("listings").delete().eq("id", id);
  } catch {}

  const all = getLocal<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_USA_LISTINGS);
  const filtered = all.filter((l) => l.id !== id);
  setLocal(STORAGE_KEYS.LISTINGS, filtered);
}

// ─── BIDDING API (AUCTIONS) ───────────────────────────────────────────────────

export async function placeBid(
  listingId: string,
  bidderId: string,
  bidderName: string,
  bidAmount: number
): Promise<{ success: boolean; message: string; listing?: Listing }> {
  const all = getLocal<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_USA_LISTINGS);
  const idx = all.findIndex((l) => l.id === listingId);
  if (idx === -1) return { success: false, message: "Listing not found" };

  const listing = all[idx];
  const minRequired = (listing.current_bid || listing.price) + (listing.min_bid_increment || 50);
  if (bidAmount < minRequired) {
    return {
      success: false,
      message: `Minimum required bid is $${minRequired.toLocaleString()}`,
    };
  }

  const bidItem: BidItem = {
    id: `bid-${Date.now()}`,
    bidder_id: bidderId,
    bidder_name: bidderName,
    amount: bidAmount,
    created_at: new Date().toISOString(),
  };

  const updatedBids = [bidItem, ...(listing.bids || [])];
  listing.current_bid = bidAmount;
  listing.bid_count = (listing.bid_count || 0) + 1;
  listing.bids = updatedBids;

  all[idx] = listing;
  setLocal(STORAGE_KEYS.LISTINGS, all);

  // Add notification to seller
  await createNotification({
    user_id: listing.seller_id,
    type: "new_bid",
    title: "New Auction Bid Placed",
    message: `${bidderName} placed a bid of $${bidAmount.toLocaleString()} on "${listing.title}".`,
  });

  return { success: true, message: "Bid placed successfully!", listing };
}

// ─── REQUESTS (RFQ / PURCHASE INQUIRY) ────────────────────────────────────────

const INITIAL_REQUESTS: BuyerRequest[] = [
  {
    id: "req-001",
    listing_id: "us-lst-001",
    listing_title: "Post-Consumer HDPE #2 Regrind Flakes (Natural)",
    buyer_id: "buyer-01",
    buyer_name: "EcoExtrusions Ohio",
    seller_id: "seller-gulf-01",
    seller_name: "Apex Recycled Polymers LLC",
    quantity: 44000,
    unit: "lbs",
    offered_price: 0.58,
    message: "We need 1 full dry van scheduled for pickup on the 1st of next month. Certificates of Analysis (COA) required before loading.",
    status: "accepted",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  }
];

export async function createRequest(
  payload: Omit<BuyerRequest, "id" | "created_at">
): Promise<BuyerRequest | null> {
  const newReq: BuyerRequest = {
    ...payload,
    id: `req-${Date.now()}`,
    status: payload.status || "pending",
    created_at: new Date().toISOString(),
  };

  try {
    const { data } = await supabase
      .from("buyer_requests")
      .insert([payload])
      .select()
      .single();
    if (data) return data as BuyerRequest;
  } catch {}

  const all = getLocal<BuyerRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  all.unshift(newReq);
  setLocal(STORAGE_KEYS.REQUESTS, all);

  await createNotification({
    user_id: payload.seller_id,
    type: "new_request",
    title: "New Buyer Inquiry Received",
    message: `${payload.buyer_name} requested ${payload.quantity.toLocaleString()} ${payload.unit || "units"} for "${payload.listing_title}".`,
  });

  return newReq;
}

export async function getRequestsByBuyer(buyerId: string): Promise<BuyerRequest[]> {
  try {
    const { data } = await supabase
      .from("buyer_requests")
      .select("*")
      .eq("buyer_id", buyerId)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data as BuyerRequest[];
  } catch {}

  const all = getLocal<BuyerRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  return all.filter((r) => r.buyer_id === buyerId);
}

export async function getRequestsBySeller(sellerId: string): Promise<BuyerRequest[]> {
  try {
    const { data } = await supabase
      .from("buyer_requests")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data as BuyerRequest[];
  } catch {}

  const all = getLocal<BuyerRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  return all.filter((r) => r.seller_id === sellerId);
}

export async function updateRequest(id: string, updates: Partial<BuyerRequest>): Promise<void> {
  try {
    await supabase.from("buyer_requests").update(updates).eq("id", id);
  } catch {}

  const all = getLocal<BuyerRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  const idx = all.findIndex((r) => r.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal(STORAGE_KEYS.REQUESTS, all);
  }
}

// ─── TRANSACTIONS & LOGISTICS ─────────────────────────────────────────────────

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-us-9042",
    request_id: "req-001",
    listing_id: "us-lst-001",
    listing_title: "Post-Consumer HDPE #2 Regrind Flakes (Natural)",
    buyer_id: "buyer-01",
    buyer_name: "EcoExtrusions Ohio",
    seller_id: "seller-gulf-01",
    seller_name: "Apex Recycled Polymers LLC",
    category: "Plastic",
    quantity: 44000,
    unit: "lbs",
    price: 0.58,
    total: 25520,
    currency: "USD",
    location: "Houston, TX → Columbus, OH",
    bol_number: "BOL-ENC-77015-882",
    carrier_name: "FreightQuote / Estes Express",
    tracking_step: 3,
    status: "in_transit",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "tx-us-9038",
    listing_title: "Grade #11 Corrugated Cardboard (OCC) Mill-Spec Bales",
    buyer_id: "buyer-01",
    buyer_name: "EcoExtrusions Ohio",
    seller_id: "seller-mw-02",
    seller_name: "Midwest Paper Recovery Inc.",
    category: "Paper",
    quantity: 40,
    unit: "Tons",
    price: 145,
    total: 5800,
    currency: "USD",
    location: "Chicago, IL → Detroit, MI",
    bol_number: "BOL-MID-60608-419",
    carrier_name: "Schneider National",
    tracking_step: 5,
    status: "completed",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
  }
];

export async function createTransaction(
  payload: Omit<Transaction, "id" | "created_at">
): Promise<Transaction | null> {
  const newTx: Transaction = {
    ...payload,
    id: `tx-us-${Math.floor(1000 + Math.random() * 9000)}`,
    currency: payload.currency || "USD",
    tracking_step: payload.tracking_step || 1,
    status: payload.status || "confirmed",
    created_at: new Date().toISOString(),
  };

  try {
    const { data } = await supabase
      .from("transactions")
      .insert([payload])
      .select()
      .single();
    if (data) return data as Transaction;
  } catch {}

  const all = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  all.unshift(newTx);
  setLocal(STORAGE_KEYS.TRANSACTIONS, all);
  return newTx;
}

export async function getTransactionsByBuyer(buyerId: string): Promise<Transaction[]> {
  try {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("buyer_id", buyerId)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data as Transaction[];
  } catch {}

  const all = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  return all.filter((t) => t.buyer_id === buyerId || t.buyer_id === "buyer-01");
}

export async function getTransactionsBySeller(sellerId: string): Promise<Transaction[]> {
  try {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data as Transaction[];
  } catch {}

  const all = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  return all.filter((t) => t.seller_id === sellerId || sellerId === "seller-gulf-01");
}

export async function getAllTransactions(): Promise<Transaction[]> {
  try {
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data as Transaction[];
  } catch {}

  return getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
}

export async function updateTransaction(id: string, updates: Partial<Transaction>): Promise<void> {
  try {
    await supabase.from("transactions").update(updates).eq("id", id);
  } catch {}

  const all = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  const idx = all.findIndex((t) => t.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    setLocal(STORAGE_KEYS.TRANSACTIONS, all);
  }
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

export async function createNotification(
  payload: Omit<Notification, "id" | "created_at" | "read">
): Promise<void> {
  const notif: Notification = {
    ...payload,
    id: `notif-${Date.now()}`,
    read: false,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from("notifications").insert([notif]);
  } catch {}

  const all = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  all.unshift(notif);
  setLocal(STORAGE_KEYS.NOTIFICATIONS, all);
}

export async function getNotificationsByUser(userId: string): Promise<Notification[]> {
  try {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (data && data.length > 0) return data as Notification[];
  } catch {}

  const all = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, [
    {
      id: "notif-init-1",
      user_id: userId,
      type: "platform",
      title: "Welcome to Encorb USA",
      message: "Verified trading platform for North American circular materials. Start bidding or list materials today.",
      read: false,
      created_at: new Date().toISOString(),
    }
  ]);
  return all.filter((n) => n.user_id === userId || !n.user_id);
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  } catch {}

  const all = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const idx = all.findIndex((n) => n.id === id);
  if (idx !== -1) {
    all[idx].read = true;
    setLocal(STORAGE_KEYS.NOTIFICATIONS, all);
  }
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  try {
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId);
  } catch {}

  const all = getLocal<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  all.forEach((n) => {
    if (n.user_id === userId) n.read = true;
  });
  setLocal(STORAGE_KEYS.NOTIFICATIONS, all);
}

// ─── PROFILES ─────────────────────────────────────────────────────────────────

export async function getAllProfiles(): Promise<Profile[]> {
  try {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) return data as Profile[];
  } catch {}

  return [
    {
      id: "buyer-01",
      name: "Michael Sterling",
      email: "sterling@ecoextrusions.com",
      role: "buyer",
      business_name: "EcoExtrusions Ohio LLC",
      location: "Columbus, OH",
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "seller-gulf-01",
      name: "David Vance",
      email: "vance@apexpolymers.com",
      role: "seller",
      business_name: "Apex Recycled Polymers LLC",
      location: "Houston, TX",
      active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: "admin-01",
      name: "Encorb Compliance Team",
      email: "admin@encorb.com",
      role: "admin",
      business_name: "Encorb Technologies Inc.",
      location: "Austin, TX",
      active: true,
      created_at: new Date().toISOString(),
    }
  ];
}

export async function updateProfile(id: string, updates: Partial<Profile>): Promise<void> {
  try {
    await supabase.from("profiles").update(updates).eq("id", id);
  } catch {}
}

// ─── REALTIME HELPERS ─────────────────────────────────────────────────────────

export function subscribeToSellerRequests(
  sellerId: string,
  callback: (req: BuyerRequest) => void
) {
  const channel = supabase
    .channel(`seller_requests_${sellerId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "buyer_requests", filter: `seller_id=eq.${sellerId}` },
      (payload) => callback(payload.new as BuyerRequest)
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export function subscribeToTransactions(
  userId: string,
  side: "buyer" | "seller",
  callback: (txn: Transaction) => void
) {
  const filter = side === "buyer" ? `buyer_id=eq.${userId}` : `seller_id=eq.${userId}`;
  const channel = supabase
    .channel(`transactions_${side}_${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "transactions", filter },
      (payload) => callback(payload.new as Transaction)
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

export function subscribeToNotifications(
  userId: string,
  callback: (n: Notification) => void
) {
  const channel = supabase
    .channel(`notifications_${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
      (payload) => callback(payload.new as Notification)
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
}

// ─── ORDER CHAT & MESSAGING ───────────────────────────────────────────────────

const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  "tx-us-9042": [
    {
      id: "msg-001",
      order_id: "tx-us-9042",
      sender_id: "seller-gulf-01",
      sender_name: "Apex Recycled Polymers LLC",
      sender_role: "seller",
      text: "Hello EcoExtrusions team! Order confirmed for 44,000 lbs HDPE Regrind Flakes (Natural). The lot has cleared pre-shipment quality inspection at our Houston yard.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    },
    {
      id: "msg-002",
      order_id: "tx-us-9042",
      sender_id: "buyer-01",
      sender_name: "EcoExtrusions Ohio",
      sender_role: "buyer",
      text: "Thank you Apex! Our logistics team assigned carrier Estes Express / FreightQuote (BOL #BOL-ENC-77015-882). Target pickup window is Tuesday 08:30 AM CST.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
    {
      id: "msg-003",
      order_id: "tx-us-9042",
      sender_id: "seller-gulf-01",
      sender_name: "Apex Recycled Polymers LLC",
      sender_role: "seller",
      text: "Bay 4 is reserved for Estes Express. Certified weighmaster scale bridge slip and COA (MFI 0.65, contamination <100ppm) will be handed to the driver.",
      attachment_name: "COA_HDPE_Lot_9042.pdf",
      attachment_type: "document",
      attachment_url: "#",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    },
    {
      id: "msg-004",
      order_id: "tx-us-9042",
      sender_id: "buyer-01",
      sender_name: "EcoExtrusions Ohio",
      sender_role: "buyer",
      text: "Great! Once the driver weighs out with gross/tare slips, please upload the scale ticket here so our finance desk can authorize escrow release.",
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ],
};

export async function getOrderChatMessages(orderId: string): Promise<ChatMessage[]> {
  try {
    const { data } = await supabase
      .from("order_messages")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });
    if (data && data.length > 0) return data as ChatMessage[];
  } catch {}

  const allChats = getLocal<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHATS, INITIAL_CHATS);
  return allChats[orderId] || [];
}

export async function sendOrderChatMessage(
  orderId: string,
  payload: Omit<ChatMessage, "id" | "created_at">
): Promise<ChatMessage> {
  const newMsg: ChatMessage = {
    ...payload,
    id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    order_id: orderId,
    created_at: new Date().toISOString(),
  };

  try {
    const { data } = await supabase
      .from("order_messages")
      .insert([newMsg])
      .select()
      .single();
    if (data) return data as ChatMessage;
  } catch {}

  const allChats = getLocal<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHATS, INITIAL_CHATS);
  if (!allChats[orderId]) {
    allChats[orderId] = [];
  }
  allChats[orderId].push(newMsg);
  setLocal(STORAGE_KEYS.CHATS, allChats);

  // Dispatch browser custom event for instant reactive updates
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("encorb_order_chat_message", {
        detail: { orderId, message: newMsg },
      })
    );
  }

  return newMsg;
}

export function subscribeToOrderChat(
  orderId: string,
  callback: (msg: ChatMessage) => void
): () => void {
  const handleLocalEvent = (e: Event) => {
    const customEvent = e as CustomEvent<{ orderId: string; message: ChatMessage }>;
    if (customEvent.detail?.orderId === orderId) {
      callback(customEvent.detail.message);
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("encorb_order_chat_message", handleLocalEvent);
  }

  const channel = supabase
    .channel(`order_chat_${orderId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "order_messages",
        filter: `order_id=eq.${orderId}`,
      },
      (payload) => callback(payload.new as ChatMessage)
    )
    .subscribe();

  return () => {
    if (typeof window !== "undefined") {
      window.removeEventListener("encorb_order_chat_message", handleLocalEvent);
    }
    supabase.removeChannel(channel);
  };
}


