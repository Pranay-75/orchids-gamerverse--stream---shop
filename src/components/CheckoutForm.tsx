"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutFormProps {
  amount: number;
  xpReward: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function CheckoutForm({
  amount,
  xpReward,
  onSuccess,
  onError,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setPaymentStatus("error");
      setErrorMessage(submitError.message || "Validation failed");
      setIsProcessing(false);
      onError(submitError.message || "Validation failed");
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      setPaymentStatus("error");
      setErrorMessage(error.message || "Payment failed");
      setIsProcessing(false);
      onError(error.message || "Payment failed");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setPaymentStatus("success");
      setIsProcessing(false);
      onSuccess();
    } else {
      setPaymentStatus("error");
      setErrorMessage("Unexpected payment status");
      setIsProcessing(false);
      onError("Unexpected payment status");
    }
  };

  if (paymentStatus === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#39ff14] to-[#00f0ff] flex items-center justify-center"
        >
          <CheckCircle className="w-10 h-10 text-[#0a0a0f]" />
        </motion.div>
        <h3 className="font-orbitron font-bold text-xl text-[#39ff14] mb-2">
          Payment Successful!
        </h3>
        <p className="text-[#8888a0] font-rajdhani mb-4">
          Thank you for your purchase
        </p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="inline-flex items-center gap-2 bg-[#39ff14]/20 px-4 py-2 rounded-full border border-[#39ff14]/30"
        >
          <Sparkles className="w-5 h-5 text-[#39ff14]" />
          <span className="font-orbitron font-bold text-[#39ff14]">
            +{xpReward} XP Earned!
          </span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-[#1a1a25] rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-rajdhani text-[#8888a0]">Order Total</span>
          <span className="font-orbitron font-bold text-[#00f0ff]">
            ${(amount / 100).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-rajdhani text-[#8888a0]">XP Reward</span>
          <span className="font-orbitron font-bold text-[#39ff14] flex items-center gap-1">
            <Sparkles className="w-4 h-4" />+{xpReward}
          </span>
        </div>
      </div>

      <div className="bg-[#1a1a25] rounded-lg p-4 max-h-[300px] overflow-y-auto">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-rajdhani">{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-gradient-to-r from-[#00f0ff] to-[#9945ff] font-orbitron font-bold text-[#0a0a0f] h-12 disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </span>
        ) : (
          <span>Pay ${(amount / 100).toFixed(2)}</span>
        )}
      </Button>

      <p className="text-xs text-center text-[#8888a0] font-rajdhani">
        Secure payment powered by Stripe
      </p>
    </form>
  );
}
