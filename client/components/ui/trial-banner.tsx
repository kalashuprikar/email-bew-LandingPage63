import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/utils";

export type TrialState = {
  daysUsed: number;
  totalDays: number;
};

export type TrialBannerProps = {
  className?: string;
  daysUsed?: number;
  totalDays?: number;
  trialStartDate?: string | Date;
  trialLengthDays?: number;
  endAt?: Date | string;
  fetcher?: () => Promise<TrialState>;
  onClose?: () => void;
};

function diffDays(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

export default function TrialBanner(props: TrialBannerProps) {
  const [trial, setTrial] = useState<TrialState | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    let done = false;
    (async () => {
      if (props.fetcher) {
        const t = await props.fetcher();
        if (!done) setTrial(t);
        return;
      }
      if (
        typeof props.daysUsed === "number" &&
        typeof props.totalDays === "number"
      ) {
        setTrial({ daysUsed: props.daysUsed, totalDays: props.totalDays });
        return;
      }
      if (props.trialStartDate && props.trialLengthDays) {
        const start = new Date(props.trialStartDate);
        const used = diffDays(start, new Date());
        setTrial({
          daysUsed: Math.min(used, props.trialLengthDays),
          totalDays: props.trialLengthDays,
        });
        return;
      }
      const ls =
        typeof window !== "undefined"
          ? localStorage.getItem("trialInfo")
          : null;
      if (ls) {
        try {
          const parsed = JSON.parse(ls) as {
            startISO: string;
            totalDays: number;
          };
          const used = diffDays(new Date(parsed.startISO), new Date());
          setTrial({
            daysUsed: Math.min(used, parsed.totalDays),
            totalDays: parsed.totalDays,
          });
          return;
        } catch {}
      }
      setTrial(null);
    })();
    return () => {
      done = true;
    };
  }, [
    props.fetcher,
    props.daysUsed,
    props.totalDays,
    props.trialStartDate,
    props.trialLengthDays,
  ]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const expired = useMemo(() => {
    if (!trial) return false;
    return trial.daysUsed >= trial.totalDays;
  }, [trial]);

  if (!trial) return null;

  const daysLeft = Math.max(0, trial.totalDays - trial.daysUsed);
  const endAt: number = props.endAt
    ? new Date(props.endAt).getTime()
    : Date.now() + daysLeft * 24 * 60 * 60 * 1000;
  const msLeft = Math.max(0, endAt - now);
  const d = Math.floor(msLeft / 86400000);
  const h = Math.floor((msLeft % 86400000) / 3600000);
  const m = Math.floor((msLeft % 3600000) / 60000);
  const s = Math.floor((msLeft % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");

  const messagePrefix = "Your free trial ends in";
  const countdownText = `${d} day${d === 1 ? "" : "s"} ${pad(h)}:${pad(m)}:${pad(s)}`;
  const messageSuffix = ", Unlock full AI-powered insights today!";

  const onClose = () => {
    try {
      localStorage.setItem("trialBannerDismissed", "1");
    } catch {}
    props.onClose?.();
  };

  return (
    <div
      className={cn(
        "w-full relative",
        "bg-gradient-to-r",
        expired
          ? "from-indigo-600 to-purple-600"
          : "from-valasys-orange to-valasys-orange-light",
        "text-white",
        "px-4 lg:px-6 py-2",
        "text-sm",
        props.className,
      )}
      role="status"
      aria-live="polite"
    >
      <button
        type="button"
        aria-label="Close trial banner"
        onClick={onClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-center">
        <Clock className="w-4 h-4" />
        {expired ? (
          <span className="font-medium">Your trial has expired.</span>
        ) : (
          <>
            <span className="font-medium">{messagePrefix}</span>
            <span className="inline-flex items-center font-mono text-[13px] sm:text-sm font-semibold bg-white/20 text-white rounded-full px-2.5 py-0.5 shadow-sm ring-1 ring-white/40">
              {countdownText}
            </span>
            <span className="font-medium">{messageSuffix}</span>
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="h-7 px-3 text-xs font-medium bg-white/90 text-valasys-orange hover:bg-white"
            >
              <Link to="/support" className="inline-flex items-center gap-1.5">
                Subscribe now
                <ArrowRight className="w-4 h-4 subscribe-icon-animate" />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
