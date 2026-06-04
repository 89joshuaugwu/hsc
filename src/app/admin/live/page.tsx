"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLiveStatus } from "@/hooks/useLiveStatus";
import { useForm } from "react-hook-form";
import {
  Radio,
  Power,
  Trash2,
  Edit2,
  Plus,
  Clock,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LiveActivity } from "@/types/chapel.types";

export default function AdminLivePage() {
  const { isLive, liveStatus } = useLiveStatus();
  const [activities, setActivities] = useState<LiveActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [customName, setCustomName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue } = useForm<{
    name: string;
    description: string;
  }>();

  /* ── Fetch activity presets ── */
  useEffect(() => {
    async function fetchActivities() {
      try {
        const q = query(
          collection(db, "live_activities"),
          where("isActive", "==", true),
          orderBy("order", "asc")
        );
        const snap = await getDocs(q);
        setActivities(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }) as LiveActivity)
        );
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      }
    }
    fetchActivities();
  }, []);

  /* ── Go Live ── */
  const handleGoLive = async () => {
    const actName =
      selectedActivity === "custom"
        ? customName
        : activities.find((a) => a.id === selectedActivity)?.name || "Service";

    if (!actName.trim()) return;
    setProcessing(true);

    try {
      await updateDoc(doc(db, "live_status", "current"), {
        isLive: true,
        activityName: actName.trim(),
        startedAt: Timestamp.now(),
        startedBy: "admin",
      });
    } catch (error) {
      console.error("Go live error:", error);
    } finally {
      setProcessing(false);
    }
  };

  /* ── End Live ── */
  const handleEndLive = async () => {
    setProcessing(true);
    try {
      await updateDoc(doc(db, "live_status", "current"), {
        isLive: false,
        activityName: "",
        startedAt: null,
      });
    } catch (error) {
      console.error("End live error:", error);
    } finally {
      setProcessing(false);
    }
  };

  /* ── CRUD for activity presets ── */
  const onSaveActivity = async (data: { name: string; description: string }) => {
    try {
      if (editingId) {
        await updateDoc(doc(db, "live_activities", editingId), {
          name: data.name,
          description: data.description || "",
        });
        setActivities((prev) =>
          prev.map((a) =>
            a.id === editingId ? { ...a, name: data.name, description: data.description } : a
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "live_activities"), {
          name: data.name,
          description: data.description || "",
          order: activities.length + 1,
          isActive: true,
        });
        setActivities((prev) => [
          ...prev,
          {
            id: docRef.id,
            name: data.name,
            description: data.description,
            order: activities.length + 1,
            isActive: true,
          },
        ]);
      }
      reset();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error("Save activity error:", error);
    }
  };

  const handleEditActivity = (activity: LiveActivity) => {
    setEditingId(activity.id);
    setValue("name", activity.name);
    setValue("description", activity.description || "");
    setShowForm(true);
  };

  const handleDeleteActivity = async (id: string) => {
    if (!confirm("Delete this activity preset?")) return;
    try {
      await deleteDoc(doc(db, "live_activities", id));
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Delete activity error:", error);
    }
  };

  /* ── Time since live started ── */
  const liveStarted = liveStatus?.startedAt?.toDate?.();
  const liveDuration = liveStarted
    ? Math.floor((Date.now() - liveStarted.getTime()) / 60000)
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* ── Live Status Toggle ── */}
      <div
        className={cn(
          "rounded-2xl p-8 text-center border-2 transition-all",
          isLive
            ? "border-red-400 bg-red-50"
            : "border-green-400 bg-green-50"
        )}
      >
        {/* Large toggle visual */}
        <div
          className={cn(
            "w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 transition-all",
            isLive
              ? "bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-pulse"
              : "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          )}
        >
          <Power size={36} className="text-white" />
        </div>

        <h2 className="font-heading text-2xl font-bold text-navy-500">
          {isLive ? "LIVE NOW" : "OFFLINE"}
        </h2>

        {isLive && liveStatus && (
          <div className="mt-3 space-y-1">
            <p className="font-body text-base font-semibold text-red-600">
              {liveStatus.activityName}
            </p>
            <div className="flex items-center justify-center gap-2 text-text-muted">
              <Clock size={14} />
              <span className="font-body text-sm">
                {liveDuration}m since started
              </span>
            </div>
          </div>
        )}

        {isLive ? (
          <button
            onClick={handleEndLive}
            disabled={processing}
            className="mt-6 px-8 py-3 bg-red-500 text-white font-body font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {processing ? "Ending..." : "End Live"}
          </button>
        ) : (
          <div className="mt-6 space-y-4">
            {/* Activity selector */}
            <select
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value)}
              className="w-full max-w-sm mx-auto px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30"
            >
              <option value="">Select activity...</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
              <option value="custom">Custom...</option>
            </select>

            {selectedActivity === "custom" && (
              <input
                type="text"
                placeholder="Enter custom activity name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full max-w-sm mx-auto px-4 py-3 rounded-xl border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30"
              />
            )}

            <button
              onClick={handleGoLive}
              disabled={processing || (!selectedActivity && !customName)}
              className="px-8 py-3 bg-green-500 text-white font-body font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-60"
            >
              {processing ? "Starting..." : "Go Live"}
            </button>
          </div>
        )}
      </div>

      {/* ── Activity Presets ── */}
      <div className="bg-white rounded-xl border border-border/60 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <h3 className="font-heading text-sm font-bold text-navy-500">
            Activity Presets
          </h3>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              reset({ name: "", description: "" });
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-chapel-400 text-white font-body text-xs font-semibold hover:bg-chapel-500 transition-colors"
          >
            <Plus size={14} />
            Add
          </button>
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <form
            onSubmit={handleSubmit(onSaveActivity)}
            className="px-5 py-4 border-b border-border/40 bg-ivory/50 space-y-3"
          >
            <input
              {...register("name", { required: true })}
              placeholder="Activity name"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30"
            />
            <input
              {...register("description")}
              placeholder="Description (optional)"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-chapel-400/30"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-chapel-400 text-white font-body text-xs font-semibold hover:bg-chapel-500"
              >
                <Check size={14} />
                {editingId ? "Update" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  reset();
                }}
                className="px-4 py-2 rounded-lg border border-border text-text-muted font-body text-xs font-semibold hover:bg-ivory"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Presets list */}
        <div className="divide-y divide-border/40">
          {activities.length === 0 ? (
            <p className="px-5 py-8 text-center font-body text-sm text-text-light">
              No activity presets yet. Add one above.
            </p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-ivory/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Radio size={16} className="text-chapel-400" />
                  <div>
                    <p className="font-body text-sm font-semibold text-navy-500">
                      {activity.name}
                    </p>
                    {activity.description && (
                      <p className="font-body text-xs text-text-muted">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditActivity(activity)}
                    className="p-2 rounded-lg text-text-light hover:text-chapel-400 hover:bg-chapel-50 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteActivity(activity.id)}
                    className="p-2 rounded-lg text-text-light hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
