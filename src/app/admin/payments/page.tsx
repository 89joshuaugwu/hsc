"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Eye, Check, X as XIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/utils";
import { toast } from "sonner";

interface Tx { id: string; donorName: string; donorEmail: string; donorPhone: string; amount: number; giveType: string; method: string; status: string; reference: string; screenshotUrl: string; createdAt: { toDate: () => Date }; }

const TABS = ["All", "Pending", "Verified", "Rejected"];
const PER_PAGE = 20;

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [page, setPage] = useState(0);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Tx));
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = tab === "All" ? items : items.filter((t) => t.status === tab.toLowerCase());
  const paginated = filtered.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const handleVerify = async (id: string) => {
    setProcessing(id);
    try {
      const r = await fetch("/api/admin/payments/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transactionId: id }) });
      if (r.ok) { toast.success("Payment verified!"); } else { const d = await r.json(); toast.error(d.error || "Failed."); }
    } catch { toast.error("Error verifying."); } finally { setProcessing(null); }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Rejection reason:");
    if (!reason) return;
    setProcessing(id);
    try {
      const r = await fetch("/api/admin/payments/reject", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ transactionId: id, reason }) });
      if (r.ok) { toast.success("Payment rejected."); } else toast.error("Failed.");
    } catch { toast.error("Error."); } finally { setProcessing(null); }
  };

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-lg font-bold text-navy-500">Payments</h2>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => { setTab(t); setPage(0); }} className={cn("px-4 py-2 rounded-lg font-body text-sm font-semibold whitespace-nowrap transition-all", tab === t ? "bg-chapel-400 text-white" : "bg-white border border-border/60 text-text-muted")}>{t}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="border-b border-border/40 bg-ivory/50">
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Donor</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Email</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Amount</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Type</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Method</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Status</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Date</th>
              <th className="px-4 py-3 font-body text-xs font-bold text-text-muted">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-border/40">
              {loading ? <tr><td colSpan={8} className="px-4 py-8 text-center font-body text-sm text-text-light">Loading...</td></tr>
              : paginated.length === 0 ? <tr><td colSpan={8} className="px-4 py-8 text-center font-body text-sm text-text-light">No payments found.</td></tr>
              : paginated.map((tx) => (
                <tr key={tx.id} className="hover:bg-ivory/30">
                  <td className="px-4 py-3 font-body text-sm font-semibold text-navy-500">{tx.donorName}</td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{tx.donorEmail}</td>
                  <td className="px-4 py-3 font-body text-sm font-bold text-navy-500">{formatNaira(tx.amount)}</td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{tx.giveType}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-ivory-dark font-body text-[0.65rem] font-bold rounded-full">{tx.method}</span></td>
                  <td className="px-4 py-3"><span className={cn("px-2 py-0.5 font-body text-[0.65rem] font-bold rounded-full uppercase", tx.status === "verified" && "bg-green-100 text-green-700", tx.status === "pending" && "bg-amber-100 text-amber-700", tx.status === "rejected" && "bg-red-100 text-red-600")}>{tx.status}</span></td>
                  <td className="px-4 py-3 font-body text-xs text-text-muted">{tx.createdAt?.toDate?.()?.toLocaleDateString("en-NG") || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {tx.method === "bank_transfer" && tx.screenshotUrl && (
                        <button onClick={() => setProofUrl(tx.screenshotUrl)} className="p-1.5 rounded text-text-light hover:text-chapel-400 hover:bg-chapel-50" title="View Proof"><Eye size={14} /></button>
                      )}
                      {tx.status === "pending" && (
                        <>
                          <button onClick={() => handleVerify(tx.id)} disabled={processing === tx.id} className="p-1.5 rounded text-text-light hover:text-green-600 hover:bg-green-50" title="Verify">{processing === tx.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}</button>
                          <button onClick={() => handleReject(tx.id)} disabled={processing === tx.id} className="p-1.5 rounded text-text-light hover:text-red-500 hover:bg-red-50" title="Reject"><XIcon size={14} /></button>
                        </>
                      )}
                      {tx.reference && <span className="font-body text-[0.6rem] text-text-light ml-1">ref: {tx.reference.slice(0, 10)}...</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
            <span className="font-body text-xs text-text-muted">Page {page + 1} of {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1 rounded border border-border font-body text-xs disabled:opacity-40">Prev</button>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1 rounded border border-border font-body text-xs disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>

      {proofUrl && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setProofUrl(null)}>
          <div className="relative max-w-2xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setProofUrl(null)} className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow"><XIcon size={16} /></button>
            <Image src={proofUrl} alt="Payment proof" width={600} height={800} className="rounded-xl max-h-[85vh] w-auto object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
