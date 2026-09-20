import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Paperclip,
  ShieldCheck,
  Truck,
  CheckCheck,
  FileText,
  Clock,
  Sparkles,
  Building2,
  AlertCircle,
  FileCheck,
  Scale,
  Maximize2
} from "lucide-react";
import {
  getOrderChatMessages,
  sendOrderChatMessage,
  subscribeToOrderChat,
  type ChatMessage
} from "@/lib/store";
import { toast } from "sonner";

interface OrderChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    title: string;
    buyerName: string;
    sellerName: string;
    status: string;
    bolNumber?: string;
    totalAmount?: number;
    quantity?: number;
    unit?: string;
    location?: string;
  } | null;
  currentUser: {
    id: string;
    name: string;
    role: "buyer" | "seller";
  };
}

export function OrderChatModal({
  isOpen,
  onClose,
  order,
  currentUser
}: OrderChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const counterpartyName =
    currentUser.role === "buyer"
      ? order?.sellerName || "Supplier Facility"
      : order?.buyerName || "Commercial Buyer";

  const counterpartyRole = currentUser.role === "buyer" ? "Verified Supplier" : "Commercial Consignee";

  // Fetch initial messages & subscribe to live updates
  useEffect(() => {
    if (!isOpen || !order) return;

    let mounted = true;
    getOrderChatMessages(order.id).then((data) => {
      if (mounted) {
        setMessages(data);
      }
    });

    const unsubscribe = subscribeToOrderChat(order.id, (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      setIsTyping(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [isOpen, order?.id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!isOpen || !order) return null;

  const handleSendMessage = async (customText?: string, attachment?: { name: string; type: "image" | "document" }) => {
    const text = customText !== undefined ? customText : inputText.trim();
    if (!text && !attachment) return;

    setIsSending(true);
    setInputText("");

    try {
      await sendOrderChatMessage(order.id, {
        order_id: order.id,
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_role: currentUser.role,
        text: text || `Shared attachment: ${attachment?.name}`,
        attachment_name: attachment?.name,
        attachment_type: attachment?.type,
        attachment_url: attachment ? "#" : undefined,
      });

      // Simulate counterparty smart response in demo mode after 1.8 seconds
      const simulatedCounterRole: "buyer" | "seller" = currentUser.role === "buyer" ? "seller" : "buyer";
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(async () => {
          let replyText = "Received and acknowledged. Our dispatch team is on it!";
          if (text.toLowerCase().includes("scale") || text.toLowerCase().includes("slip") || text.toLowerCase().includes("ticket")) {
            replyText = "Weighmaster scale slip confirmed. Certified net weight matches order manifest.";
          } else if (text.toLowerCase().includes("eta") || text.toLowerCase().includes("driver") || text.toLowerCase().includes("time")) {
            replyText = "Driver is on schedule. Gate pass and dock bay assignment are verified.";
          } else if (text.toLowerCase().includes("bay") || text.toLowerCase().includes("dock")) {
            replyText = "Loading Bay 4 confirmed. Driver should check in with dispatch office on arrival.";
          } else if (text.toLowerCase().includes("escrow") || text.toLowerCase().includes("payment")) {
            replyText = "FDIC Escrow settlement authorized. Funds will disburse upon scale-ticket certification.";
          }

          await sendOrderChatMessage(order.id, {
            order_id: order.id,
            sender_id: simulatedCounterRole === "seller" ? "seller-gulf-01" : "buyer-01",
            sender_name: counterpartyName,
            sender_role: simulatedCounterRole,
            text: replyText,
          });
          setIsTyping(false);
        }, 1600);
      }, 700);

    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachScaleSlip = () => {
    handleSendMessage("Attaching Certified Weighmaster Scale Ticket certificate for verification.", {
      name: `ScaleTicket_${order.id.toUpperCase()}_Slip.pdf`,
      type: "document",
    });
    toast.success("Scale ticket attached to chat.");
  };

  const handleAttachDockPhoto = () => {
    handleSendMessage("Uploading loading dock departure inspection photo.", {
      name: "Dock_Bay4_Loading_Verification.jpg",
      type: "image",
    });
    toast.success("Dock verification photo attached.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/60 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-foreground">
                  {counterpartyName}
                </h3>
                <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {counterpartyRole}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-md">
                Order #{order.id} • {order.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Order Channel
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              title="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Order Info Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-5 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Truck className="h-3 w-3 text-emerald-600" />
              {order.location || "US Logistics Corridor"}
            </span>
            {order.bolNumber && (
              <span className="font-mono bg-background px-1.5 py-0.5 rounded border border-border">
                {order.bolNumber}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {order.totalAmount && (
              <span className="font-bold text-foreground font-mono">
                ${order.totalAmount.toLocaleString()} USD
              </span>
            )}
            <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
              {order.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Quick Action Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/50 bg-background/50 px-5 py-2 no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1 shrink-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-emerald-600" /> Quick:
          </span>
          <button
            type="button"
            onClick={() => handleSendMessage("Could you provide the driver ETA and scheduled arrival dock window?")}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-emerald-500/50 hover:bg-muted transition shrink-0"
          >
            Request Driver ETA
          </button>
          <button
            type="button"
            onClick={handleAttachScaleSlip}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-emerald-500/50 hover:bg-muted transition shrink-0 flex items-center gap-1"
          >
            <Scale className="h-3 w-3 text-emerald-600" />
            Attach Scale Slip
          </button>
          <button
            type="button"
            onClick={() => handleSendMessage("Loading bay 4 is assigned and forklift crew is ready for pickup.")}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-emerald-500/50 hover:bg-muted transition shrink-0"
          >
            Confirm Dock Bay
          </button>
          <button
            type="button"
            onClick={handleAttachDockPhoto}
            className="rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-emerald-500/50 hover:bg-muted transition shrink-0"
          >
            Attach Dock Photo
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-background">
          {/* Security & Escrow Banner */}
          <div className="mx-auto max-w-md rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-2.5 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Messages in this order room are logged to the transaction audit trail.</span>
          </div>

          {messages.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
              <FileText className="h-10 w-10 opacity-30 mb-2" />
              <p className="font-semibold text-xs text-foreground">No messages yet</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Send a message to coordinate pickup timing, scale slips, or delivery instructions.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSelf = msg.sender_role === currentUser.role || msg.sender_id === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-baseline gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-foreground">
                      {isSelf ? "You" : msg.sender_name}
                    </span>
                    <span className="text-[9px] text-muted-foreground">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-sm ${
                      isSelf
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-card border border-border text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.text}
                    </p>

                    {/* Render attachment card if present */}
                    {msg.attachment_name && (
                      <div
                        className={`mt-2 flex items-center gap-2 rounded-xl p-2 text-xs border ${
                          isSelf
                            ? "bg-emerald-700/60 border-emerald-500/40 text-emerald-100"
                            : "bg-muted/70 border-border text-foreground"
                        }`}
                      >
                        {msg.attachment_type === "document" ? (
                          <FileCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                        ) : (
                          <Scale className="h-4 w-4 shrink-0 text-emerald-400" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-[11px] truncate">{msg.attachment_name}</p>
                          <span className="text-[9px] opacity-80">Verified Order Attachment</span>
                        </div>
                        <span className="rounded bg-black/20 px-1.5 py-0.5 text-[9px] font-bold">
                          PDF/IMG
                        </span>
                      </div>
                    )}

                    <div className="mt-1 flex items-center justify-end gap-1 text-[9px] opacity-70">
                      {isSelf && <CheckCheck className="h-3 w-3 text-emerald-200" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground text-xs pl-2 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>{counterpartyName} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="border-t border-border bg-card p-3 sm:p-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAttachScaleSlip}
              title="Attach certified scale slip or document"
              className="rounded-xl border border-border bg-background p-2.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${counterpartyName} (driver ETA, dock bay, scale slips)...`}
              className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
            />

            <button
              type="button"
              disabled={!inputText.trim() || isSending}
              onClick={() => handleSendMessage()}
              className="flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2.5 font-bold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground text-center">
            Press <kbd className="font-mono bg-muted px-1 rounded text-foreground">Enter</kbd> to send • Real-time dispatch synchronization active
          </p>
        </div>
      </div>
    </div>
  );
}
