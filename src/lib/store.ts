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

export const INITIAL_USA_LISTINGS: Listing[] = [];

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
    const { data, error } = await timedQuery(supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false }));

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

const timedQuery = async <T>(promise: PromiseLike<T>, timeoutMs = 1500): Promise<T> => {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Supabase Query Timeout")), timeoutMs)),
  ]);
};

const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

// ─── REQUESTS (RFQ / PURCHASE INQUIRY) ────────────────────────────────────────

const INITIAL_REQUESTS: BuyerRequest[] = [];

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
  if (isUUID(buyerId)) {
    try {
      const { data } = await timedQuery(
        supabase
          .from("buyer_requests")
          .select("*")
          .eq("buyer_id", buyerId)
          .order("created_at", { ascending: false })
      );
      if (data && data.length > 0) return data as BuyerRequest[];
    } catch {}
  }

  const all = getLocal<BuyerRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  return all.filter((r) => r.buyer_id === buyerId);
}

export async function getRequestsBySeller(sellerId: string): Promise<BuyerRequest[]> {
  if (isUUID(sellerId)) {
    try {
      const { data } = await timedQuery(supabase
        .from("buyer_requests")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false }));
      if (data && data.length > 0) return data as BuyerRequest[];
    } catch {}
  }

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

const INITIAL_TRANSACTIONS: Transaction[] = [];

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
  if (isUUID(buyerId)) {
    try {
      const { data } = await timedQuery(supabase
        .from("transactions")
        .select("*")
        .eq("buyer_id", buyerId)
        .order("created_at", { ascending: false }));
      if (data && data.length > 0) return data as Transaction[];
    } catch {}
  }

  const all = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  return all.filter((t) => t.buyer_id === buyerId);
}

export async function getTransactionsBySeller(sellerId: string): Promise<Transaction[]> {
  if (isUUID(sellerId)) {
    try {
      const { data } = await timedQuery(supabase
        .from("transactions")
        .select("*")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false }));
      if (data && data.length > 0) return data as Transaction[];
    } catch {}
  }

  const all = getLocal<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  return all.filter((t) => t.seller_id === sellerId);
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
  if (isUUID(userId)) {
    try {
      const { data } = await timedQuery(supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }));
      if (data && data.length > 0) return data as Notification[];
    } catch {}
  }

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

  return [];
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
  if (!isUUID(userId)) return () => {};
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
  if (!isUUID(userId)) return () => {};
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

const INITIAL_CHATS: Record<string, ChatMessage[]> = {};

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


