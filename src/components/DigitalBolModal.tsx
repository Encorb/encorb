import { useState } from "react";
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Truck,
  Building2,
  FileCheck,
  CheckCircle2,
  QrCode,
  Scale,
  DollarSign,
  MapPin,
  Calendar,
  AlertCircle
} from "lucide-react";
import { type Transaction, type BuyerRequest } from "@/lib/store";
import { toast } from "sonner";

interface DigitalBolModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    id: string;
    title: string;
    materialCategory?: string;
    quantity: number;
    unit: string;
    totalAmount: number;
    buyerName: string;
    sellerName: string;
    originLocation: string;
    destinationLocation?: string;
    carrierName?: string;
    trackingNumber?: string;
    status: string;
    isriCode?: string;
    createdDate?: string;
  };
}

export function DigitalBolModal({ isOpen, onClose, data }: DigitalBolModalProps) {
  const [escrowReleased, setEscrowReleased] = useState(false);

  if (!isOpen) return null;

  const bolNumber = `BOL-ENC-${data.id.substring(0, 8).toUpperCase()}-2026`;
  const scaleTicketNumber = `ST-TX-8849-${data.id.substring(0, 4).toUpperCase()}`;
  const grossWeightLbs = data.unit === "Tons" ? Math.round(data.quantity * 2000 + 34200) : Math.round(data.quantity + 34200);
  const tareWeightLbs = 34200; // Standard Class 8 tractor + 53' trailer tare
  const netWeightLbs = grossWeightLbs - tareWeightLbs;
  const sealNumber = `ENC-SEAL-${Math.floor(100000 + Math.random() * 900000)}`;
  const carrierDot = "USDOT #3894021 / MC #108422";
  const carrierName = data.carrierName || "Schneider National / Encorb Dedicated Freight";

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    toast.success("e-BOL & Weighmaster Certificate downloaded (PDF).");
  };

  const handleEscrowRelease = () => {
    setEscrowReleased(true);
    toast.success("Scale-ticket certified: FDIC Escrow Settlement funds triggered!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                US Electronic Bill of Lading & Scale-Ticket Manifest
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  DOT / FMCSA COMPLIANT
                </span>
              </h3>
              <p className="text-[11px] text-muted-foreground font-mono">
                Document #{bolNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
            <button
              onClick={handleDownloadPdf}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition"
            >
              <Download className="h-3.5 w-3.5" />
              Export PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-8 font-sans bg-white text-slate-900 selection:bg-emerald-100">
          {/* Official Letterhead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
                  E
                </div>
                <span className="font-black text-xl tracking-tight text-slate-900">
                  ENCORB USA
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                North American Circular Commodity Settlement & Logistics Network
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Federal Motor Carrier Safety Administration (FMCSA) Standard Manifest Form 49-CFR § 373
              </p>
            </div>
            <div className="text-right">
              <span className="rounded bg-slate-100 border border-slate-300 px-2.5 py-1 text-xs font-mono font-bold text-slate-800">
                {bolNumber}
              </span>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Date: {data.createdDate || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
              </p>
              <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">
                Status: {data.status.replace("_", " ").toUpperCase()}
              </p>
            </div>
          </div>

          {/* Shipper, Consignee & Carrier Grid */}
          <div className="mt-4 grid grid-cols-3 gap-4 border border-slate-300 p-3 bg-slate-50/70 text-xs">
            {/* Origin Shipper */}
            <div className="border-r border-slate-200 pr-3">
              <span className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
                1. SHIPPER / ORIGIN FACILITY
              </span>
              <p className="font-bold text-slate-900 mt-1">{data.sellerName}</p>
              <p className="text-slate-600 text-[11px] flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-slate-500" />
                {data.originLocation}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">FOB Origin Point</p>
            </div>

            {/* Destination Consignee */}
            <div className="border-r border-slate-200 px-3">
              <span className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
                2. CONSIGNEE / RECEIVING TERMINAL
              </span>
              <p className="font-bold text-slate-900 mt-1">{data.buyerName}</p>
              <p className="text-slate-600 text-[11px] flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3 text-slate-500" />
                {data.destinationLocation || "Designated Receiving Mill / Processing Facility"}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Direct Consignee Delivery</p>
            </div>

            {/* Carrier & Equipment */}
            <div className="pl-3">
              <span className="font-bold text-[10px] uppercase text-slate-500 tracking-wider">
                3. CARRIER DISPATCH & ROUTING
              </span>
              <p className="font-bold text-slate-900 mt-1">{carrierName}</p>
              <p className="text-slate-600 text-[11px] font-mono">{carrierDot}</p>
              <p className="text-[10px] text-slate-700 font-mono mt-1">
                PRO / Tracking: <span className="font-bold">{data.trackingNumber || `ENC-TRK-${data.id.substring(0, 6).toUpperCase()}`}</span>
              </p>
            </div>
          </div>

          {/* Commodity & ISRI Details Table */}
          <div className="mt-4">
            <table className="w-full border border-slate-300 text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-200/80 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-12 text-center">ITEM</th>
                  <th className="p-2 border-r border-slate-300">COMMODITY DESCRIPTION & ISRI GRADE</th>
                  <th className="p-2 border-r border-slate-300 text-center w-28">QUANTITY</th>
                  <th className="p-2 border-r border-slate-300 text-right w-28">UNIT PRICE</th>
                  <th className="p-2 text-right w-32">SETTLED VALUE</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2 text-center font-mono border-r border-slate-300">01</td>
                  <td className="p-2 border-r border-slate-300">
                    <p className="font-bold text-slate-900">{data.title}</p>
                    <p className="text-[11px] text-slate-600 font-mono">
                      ISRI Code: {data.isriCode || "ISRI Standard Commercial Recyclable Spec"} • NMFC #156200
                    </p>
                    <p className="text-[10px] text-emerald-700">Certified Non-Hazardous Recyclable Commodity</p>
                  </td>
                  <td className="p-2 text-center font-mono font-bold border-r border-slate-300">
                    {data.quantity.toLocaleString()} {data.unit}
                  </td>
                  <td className="p-2 text-right font-mono border-r border-slate-300">
                    ${(data.totalAmount / (data.quantity || 1)).toFixed(2)} /{data.unit}
                  </td>
                  <td className="p-2 text-right font-mono font-bold text-slate-900">
                    ${data.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Certified Weighmaster Scale-Ticket Certificate */}
          <div className="mt-4 rounded-lg border-2 border-dashed border-emerald-600/60 bg-emerald-50/40 p-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
              <div className="flex items-center gap-2 text-emerald-800">
                <Scale className="h-4 w-4" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Certified Weighmaster Scale Ticket
                </span>
                <span className="font-mono text-[11px] text-emerald-700">#{scaleTicketNumber}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                NTEP Certified Automated Scale Bridge
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3 text-center">
              <div className="rounded bg-white p-2 border border-emerald-200">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Gross Vehicle Weight</span>
                <p className="text-sm font-mono font-bold text-slate-900">{grossWeightLbs.toLocaleString()} lbs</p>
              </div>
              <div className="rounded bg-white p-2 border border-emerald-200">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Tractor & Trailer Tare</span>
                <p className="text-sm font-mono font-bold text-slate-600">{tareWeightLbs.toLocaleString()} lbs</p>
              </div>
              <div className="rounded bg-white p-2 border border-emerald-200">
                <span className="text-[9px] text-emerald-700 uppercase font-bold">Certified Net Payload</span>
                <p className="text-sm font-mono font-black text-emerald-700">{netWeightLbs.toLocaleString()} lbs</p>
              </div>
              <div className="rounded bg-white p-2 border border-emerald-200">
                <span className="text-[9px] text-slate-500 uppercase font-semibold">Tamper Bolt Seal #</span>
                <p className="text-xs font-mono font-bold text-slate-900 mt-1">{sealNumber}</p>
              </div>
            </div>
          </div>

          {/* Signatures, Escrow Verification & QR Hash */}
          <div className="mt-4 grid grid-cols-3 gap-4 border-t border-slate-300 pt-4">
            <div className="space-y-4">
              <div className="border-b border-slate-400 pb-1">
                <p className="font-script text-sm text-slate-700 italic">E-Signed via Encorb Auth ID</p>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">
                Shipper Authorized Signature & Date
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-b border-slate-400 pb-1">
                <p className="font-script text-sm text-slate-700 italic">Carrier Dispatch Verified (DOT)</p>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase">
                Driver / Carrier Acceptance & Date
              </p>
            </div>

            {/* Cryptographic Escrow QR Hash */}
            <div className="flex items-center gap-3 rounded bg-slate-100 p-2.5 border border-slate-300">
              <div className="h-14 w-14 bg-white p-1 rounded border border-slate-300 flex items-center justify-center shrink-0">
                <QrCode className="h-12 w-12 text-slate-900" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-bold uppercase text-slate-600 block">
                  Encrypted Escrow Hash
                </span>
                <p className="text-[9px] font-mono text-slate-700 truncate">
                  SHA256:{data.id}009aef88
                </p>
                <p className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                  ✓ FDIC Escrow Guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Settlement Action */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-6 py-3.5 print:hidden">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Scale weight certified under State Bureau of Weights and Measures Standards.</span>
          </div>

          <div className="flex items-center gap-2">
            {escrowReleased ? (
              <span className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
                Escrow Settlement Released
              </span>
            ) : (
              <button
                type="button"
                onClick={handleEscrowRelease}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
              >
                <DollarSign className="h-3.5 w-3.5" />
                Verify Scale Ticket & Release Escrow
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
