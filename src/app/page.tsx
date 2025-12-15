"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  ShoppingCart,
  Trophy,
  Zap,
  Users,
  Star,
  Gift,
  ChevronRight,
  Eye,
  Heart,
  MessageCircle,
  Volume2,
  Crown,
  Shield,
  Flame,
  Target,
  Award,
  Sparkles,
  Menu,
  X,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  LogOut,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "@/components/CheckoutForm";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/AuthModal";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const featuredStreams = [
  {
    id: 1,
    title: "VALORANT Championship Finals",
    streamer: "NexusKing",
    viewers: 45200,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop",
    game: "VALORANT",
    isLive: true,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    title: "Speed Run World Record Attempt",
    streamer: "GhostRunner",
    viewers: 28900,
    thumbnail: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=450&fit=crop",
    game: "Elden Ring",
    isLive: true,
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    title: "Pro League Scrims",
    streamer: "CyberPhoenix",
    viewers: 19500,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop",
    game: "CS2",
    isLive: true,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    title: "Building the Ultimate Base",
    streamer: "PixelMaster",
    viewers: 12300,
    thumbnail: "https://images.unsplash.com/photo-1493711662062-fa541f7f2f60?w=800&h=450&fit=crop",
    game: "Minecraft",
    isLive: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
];

const merchProducts = [
  {
    id: 1,
    name: "Nexus Elite Gaming Headset",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 2847,
    badge: "Best Seller",
    xpReward: 150,
  },
  {
    id: 2,
    name: "RGB Mechanical Keyboard",
    price: 129.99,
    originalPrice: 169.99,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 1923,
    badge: "New",
    xpReward: 130,
  },
  {
    id: 3,
    name: "Pro Gaming Mouse",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 3102,
    badge: "Hot",
    xpReward: 80,
  },
  {
    id: 4,
    name: "Nexus Arena Jersey",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 892,
    badge: "Limited",
    xpReward: 60,
  },
  {
    id: 5,
    name: "Gaming Chair Titan",
    price: 349.99,
    originalPrice: 449.99,
    image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 1456,
    badge: "Premium",
    xpReward: 350,
  },
  {
    id: 6,
    name: "LED Desk Mat XL",
    price: 49.99,
    originalPrice: 69.99,
    image: "https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 2341,
    badge: null,
    xpReward: 50,
  },
];

const userBadges = [
  { id: 1, name: "Early Adopter", icon: Star, color: "#00f0ff", unlocked: true },
  { id: 2, name: "Stream Legend", icon: Crown, color: "#ff00aa", unlocked: true },
  { id: 3, name: "Top Spender", icon: Trophy, color: "#39ff14", unlocked: true },
  { id: 4, name: "Community Hero", icon: Shield, color: "#9945ff", unlocked: false },
  { id: 5, name: "Fire Starter", icon: Flame, color: "#ff6600", unlocked: false },
  { id: 6, name: "Sharpshooter", icon: Target, color: "#00f0ff", unlocked: false },
];

const dailyChallenges = [
  { id: 1, title: "Watch 30 minutes of streams", progress: 25, target: 30, xp: 50, completed: false },
  { id: 2, title: "Send 10 chat messages", progress: 10, target: 10, xp: 30, completed: true },
  { id: 3, title: "Follow 3 new streamers", progress: 2, target: 3, xp: 40, completed: false },
];

const leaderboard = [
  { rank: 1, name: "DragonSlayer99", xp: 125000, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop" },
  { rank: 2, name: "NightHawk", xp: 118500, avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=50&h=50&fit=crop" },
  { rank: 3, name: "PixelPrincess", xp: 112300, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop" },
  { rank: 4, name: "CyberNinja", xp: 98700, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop" },
  { rank: 5, name: "StormBringer", xp: 87200, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop" },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  xpReward: number;
}

export default function Home() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showXPPopup, setShowXPPopup] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<typeof featuredStreams[0] | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "payment">("cart");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setShowAuthModal(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (profile) {
      setUserXP(profile.xp);
      setUserLevel(profile.level);
    }
  }, [profile]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00f0ff] mx-auto mb-4" />
          <p className="font-orbitron text-[#8888a0]">Loading Arena...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthModal isOpen={showAuthModal} onClose={() => {}} />;
  }

  const xpToNextLevel = 10000;
  const currentProgress = (userXP / xpToNextLevel) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedStream) {
      interval = setInterval(() => {
        setWatchTime((prev) => {
          const newTime = prev + 1;
          if (newTime % 60 === 0) {
            gainXP(10);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [selectedStream]);

  const gainXP = (amount: number) => {
    setXpGained(amount);
    setShowXPPopup(true);
    setUserXP((prev) => {
      const newXP = prev + amount;
      if (newXP >= xpToNextLevel) {
        setUserLevel((l) => l + 1);
        return newXP - xpToNextLevel;
      }
      return newXP;
    });
    setTimeout(() => setShowXPPopup(false), 2000);
  };

  const addToCart = (product: typeof merchProducts[0]) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    gainXP(Math.floor(product.xpReward / 10));
  };

  const updateCartQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartXP = cart.reduce((sum, item) => sum + item.xpReward * item.quantity, 0);

  const handleCheckout = async () => {
    setIsLoadingPayment(true);
    setPaymentError(null);

    try {
      const response = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, totalXP: cartXP }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      setClientSecret(data.clientSecret);
      setCheckoutStep("payment");
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Failed to initialize payment"
      );
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    gainXP(cartXP);
    setCart([]);
    setTimeout(() => {
      setCheckoutStep("cart");
      setClientSecret(null);
      setIsCartOpen(false);
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    setCheckoutStep("cart");
    setClientSecret(null);
    setPaymentError(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] overflow-hidden">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-50" />
      <div className="fixed inset-0 scanline pointer-events-none opacity-30" />

      <AnimatePresence>
        {showXPPopup && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-[#00f0ff] to-[#9945ff] px-6 py-3 rounded-full font-orbitron font-bold text-lg shadow-lg box-glow-cyan"
          >
            +{xpGained} XP
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#00f0ff]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#ff00aa] flex items-center justify-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#0a0a0f]" />
              </div>
              <span className="font-orbitron font-bold text-xl sm:text-2xl text-glow-cyan hidden sm:block">
                NEXUS ARENA
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              <NavLink href="#streams" icon={<Play className="w-4 h-4" />}>Live Streams</NavLink>
              <NavLink href="#shop" icon={<ShoppingCart className="w-4 h-4" />}>Shop</NavLink>
              <NavLink href="#rewards" icon={<Trophy className="w-4 h-4" />}>Rewards</NavLink>
              <NavLink href="#leaderboard" icon={<Award className="w-4 h-4" />}>Leaderboard</NavLink>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden sm:flex items-center gap-3 bg-[#12121a] px-4 py-2 rounded-full neon-border"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                  <span className="font-orbitron text-sm font-semibold">{userXP.toLocaleString()} XP</span>
                </div>
                <div className="w-px h-4 bg-[#00f0ff]/30" />
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-[#ff00aa]" />
                  <span className="font-orbitron text-sm font-semibold">LVL {userLevel}</span>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:p-3 rounded-full bg-[#12121a] neon-border"
              >
                <ShoppingCart className="w-5 h-5 text-[#00f0ff]" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff00aa] rounded-full text-xs font-bold flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={signOut}
                className="hidden sm:flex p-2 sm:p-3 rounded-full bg-[#12121a] neon-border"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 text-[#8888a0]" />
              </motion.button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-[#12121a] neon-border"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0f]/95 border-t border-[#00f0ff]/20"
            >
              <div className="px-4 py-4 space-y-3">
                <MobileNavLink href="#streams" icon={<Play className="w-4 h-4" />}>Live Streams</MobileNavLink>
                <MobileNavLink href="#shop" icon={<ShoppingCart className="w-4 h-4" />}>Shop</MobileNavLink>
                <MobileNavLink href="#rewards" icon={<Trophy className="w-4 h-4" />}>Rewards</MobileNavLink>
                <MobileNavLink href="#leaderboard" icon={<Award className="w-4 h-4" />}>Leaderboard</MobileNavLink>
                <div className="flex items-center gap-3 bg-[#12121a] px-4 py-3 rounded-xl neon-border">
                  <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                  <span className="font-orbitron text-sm">{userXP.toLocaleString()} XP</span>
                  <div className="w-px h-4 bg-[#00f0ff]/30" />
                  <Crown className="w-4 h-4 text-[#ff00aa]" />
                  <span className="font-orbitron text-sm">LVL {userLevel}</span>
                </div>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#12121a] font-rajdhani font-semibold text-[#8888a0] hover:text-[#ff00aa] hover:bg-[#1a1a25] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00f0ff]/5 via-transparent to-[#ff00aa]/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff00aa]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-[#ff00aa]/20 text-[#ff00aa] border-[#ff00aa]/30 font-rajdhani text-sm px-4 py-1">
              <Flame className="w-3 h-3 mr-2" /> LIVE NOW: 847 STREAMS
            </Badge>

            <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-tight">
              <span className="text-glow-cyan text-[#00f0ff]">ENTER THE</span>
              <br />
              <span className="bg-gradient-to-r from-[#ff00aa] via-[#9945ff] to-[#00f0ff] bg-clip-text text-transparent">
                NEXUS ARENA
              </span>
            </h1>

            <p className="font-rajdhani text-lg sm:text-xl md:text-2xl text-[#8888a0] max-w-2xl mx-auto mb-8">
              Watch elite gamers compete live, collect exclusive merch, and level up your gaming experience
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="#streams"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-[#00f0ff] to-[#9945ff] rounded-xl font-orbitron font-bold text-lg text-[#0a0a0f] flex items-center justify-center gap-2 box-glow-cyan"
              >
                <Play className="w-5 h-5" />
                Watch Live
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                href="#shop"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-[#12121a] rounded-xl font-orbitron font-bold text-lg neon-border flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5 text-[#ff00aa]" />
                Shop Merch
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            <StatCard icon={<Users className="w-5 h-5" />} value="2.4M" label="Active Users" />
            <StatCard icon={<Play className="w-5 h-5" />} value="847" label="Live Streams" />
            <StatCard icon={<Eye className="w-5 h-5" />} value="1.2M" label="Viewers Now" />
            <StatCard icon={<Gift className="w-5 h-5" />} value="$2.5M" label="Rewards Given" />
          </motion.div>
        </div>
      </section>

      <section id="streams" className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
          >
            <div>
              <h2 className="font-orbitron font-bold text-3xl sm:text-4xl mb-2">
                <span className="text-[#ff00aa]">LIVE</span> STREAMS
              </h2>
              <p className="text-[#8888a0] font-rajdhani text-lg">Watch the best gamers compete in real-time</p>
            </div>
            <Button variant="outline" className="neon-border font-rajdhani">
              View All Streams <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredStreams.map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => setSelectedStream(stream)}
                className="cursor-pointer group"
              >
                <div className="relative rounded-xl overflow-hidden bg-[#12121a] neon-border">
                  <div className="relative aspect-video">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-500 rounded text-xs font-bold flex items-center gap-1 animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full" /> LIVE
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#0a0a0f]/80 px-2 py-1 rounded text-xs">
                      <Eye className="w-3 h-3" /> {(stream.viewers / 1000).toFixed(1)}K
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="bg-[#9945ff]/20 text-[#9945ff] border-[#9945ff]/30 text-xs mb-2">
                        {stream.game}
                      </Badge>
                      <h3 className="font-rajdhani font-bold text-sm line-clamp-2">{stream.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 flex items-center gap-3">
                    <img
                      src={stream.avatar}
                      alt={stream.streamer}
                      className="w-8 h-8 rounded-full ring-2 ring-[#00f0ff]"
                    />
                    <span className="font-rajdhani font-semibold text-sm">{stream.streamer}</span>
                    <div className="ml-auto flex items-center gap-2 text-[#8888a0]">
                      <Heart className="w-4 h-4" />
                      <MessageCircle className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="relative py-20 sm:py-32 bg-gradient-to-b from-transparent via-[#12121a]/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl mb-2">
              GAMING <span className="text-[#00f0ff]">MERCH</span>
            </h2>
            <p className="text-[#8888a0] font-rajdhani text-lg">Gear up with exclusive merchandise & earn XP</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="relative bg-[#12121a] rounded-xl overflow-hidden neon-border">
                  <div className="relative aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <Badge
                          className={`font-rajdhani font-bold ${
                            product.badge === "Best Seller"
                              ? "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30"
                              : product.badge === "New"
                              ? "bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30"
                              : product.badge === "Hot"
                              ? "bg-[#ff6600]/20 text-[#ff6600] border-[#ff6600]/30"
                              : product.badge === "Limited"
                              ? "bg-[#ff00aa]/20 text-[#ff00aa] border-[#ff00aa]/30"
                              : "bg-[#9945ff]/20 text-[#9945ff] border-[#9945ff]/30"
                          }`}
                        >
                          {product.badge}
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[#0a0a0f]/80 px-2 py-1 rounded-full flex items-center gap-1 text-xs">
                      <Sparkles className="w-3 h-3 text-[#00f0ff]" />
                      <span className="text-[#00f0ff] font-bold">+{product.xpReward} XP</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-rajdhani font-bold text-lg mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{product.rating}</span>
                      </div>
                      <span className="text-xs text-[#8888a0]">({product.reviews.toLocaleString()} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-orbitron font-bold text-xl text-[#00f0ff]">${product.price}</span>
                        <span className="text-sm text-[#8888a0] line-through">${product.originalPrice}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart(product)}
                        className="p-2 bg-gradient-to-r from-[#00f0ff] to-[#9945ff] rounded-lg"
                      >
                        <Plus className="w-5 h-5 text-[#0a0a0f]" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="rewards" className="relative py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl mb-2">
              <span className="text-[#9945ff]">REWARDS</span> & PROGRESS
            </h2>
            <p className="text-[#8888a0] font-rajdhani text-lg">Complete challenges, earn XP, unlock badges</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-[#12121a] rounded-xl p-6 neon-border">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-orbitron font-bold text-xl">Your Progress</h3>
                  <Badge className="bg-[#ff00aa]/20 text-[#ff00aa] border-[#ff00aa]/30 font-orbitron">
                    Level {userLevel}
                  </Badge>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="font-rajdhani text-[#8888a0]">XP Progress</span>
                    <span className="font-orbitron text-sm">{userXP.toLocaleString()} / {xpToNextLevel.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <Progress value={currentProgress} className="h-4 bg-[#1a1a25]" />
                    <div
                      className="absolute inset-0 h-4 rounded-full bg-gradient-to-r from-[#00f0ff] to-[#9945ff] transition-all duration-500"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-[#8888a0] mt-2">
                    {(xpToNextLevel - userXP).toLocaleString()} XP to Level {userLevel + 1}
                  </p>
                </div>

                <h4 className="font-rajdhani font-bold text-lg mb-4">Daily Challenges</h4>
                <div className="space-y-4">
                  {dailyChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={`p-4 rounded-lg ${
                        challenge.completed ? "bg-[#39ff14]/10 border border-[#39ff14]/30" : "bg-[#1a1a25]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-rajdhani font-semibold">{challenge.title}</span>
                        <Badge
                          className={
                            challenge.completed
                              ? "bg-[#39ff14]/20 text-[#39ff14] border-[#39ff14]/30"
                              : "bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30"
                          }
                        >
                          +{challenge.xp} XP
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={(challenge.progress / challenge.target) * 100}
                          className="flex-1 h-2 bg-[#0a0a0f]"
                        />
                        <span className="text-xs text-[#8888a0]">
                          {challenge.progress}/{challenge.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-[#12121a] rounded-xl p-6 neon-border">
                <h3 className="font-orbitron font-bold text-xl mb-6">Your Badges</h3>
                <div className="grid grid-cols-3 gap-4">
                  {userBadges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.1 }}
                      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center p-2 ${
                        badge.unlocked
                          ? "bg-gradient-to-br from-[#1a1a25] to-[#0a0a0f]"
                          : "bg-[#1a1a25] opacity-40"
                      }`}
                      style={{
                        boxShadow: badge.unlocked ? `0 0 20px ${badge.color}30` : "none",
                        border: `1px solid ${badge.unlocked ? badge.color : "#333"}40`,
                      }}
                    >
                      <badge.icon
                        className="w-6 h-6 mb-1"
                        style={{ color: badge.unlocked ? badge.color : "#666" }}
                      />
                      <span className="text-[10px] text-center font-rajdhani leading-tight">
                        {badge.name}
                      </span>
                      {!badge.unlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/60 rounded-xl">
                          <Shield className="w-4 h-4 text-[#666]" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="leaderboard" className="relative py-20 sm:py-32 bg-gradient-to-b from-transparent via-[#12121a]/50 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl mb-2">
              TOP <span className="text-[#ff6600]">PLAYERS</span>
            </h2>
            <p className="text-[#8888a0] font-rajdhani text-lg">Compete for the top spot and eternal glory</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#12121a] rounded-xl overflow-hidden neon-border"
          >
            {leaderboard.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 border-b border-[#00f0ff]/10 last:border-0 ${
                  player.rank <= 3 ? "bg-gradient-to-r from-[#1a1a25] to-transparent" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-orbitron font-bold ${
                    player.rank === 1
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-[#0a0a0f]"
                      : player.rank === 2
                      ? "bg-gradient-to-br from-gray-300 to-gray-500 text-[#0a0a0f]"
                      : player.rank === 3
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-[#0a0a0f]"
                      : "bg-[#1a1a25] text-[#8888a0]"
                  }`}
                >
                  {player.rank}
                </div>
                <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full ring-2 ring-[#00f0ff]/30" />
                <span className="font-rajdhani font-bold flex-1">{player.name}</span>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                  <span className="font-orbitron text-sm text-[#00f0ff]">{player.xp.toLocaleString()} XP</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="relative py-12 border-t border-[#00f0ff]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#ff00aa] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#0a0a0f]" />
              </div>
              <span className="font-orbitron font-bold text-xl">NEXUS ARENA</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[#8888a0] font-rajdhani">
              <a href="#" className="hover:text-[#00f0ff] transition-colors">About</a>
              <a href="#" className="hover:text-[#00f0ff] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#00f0ff] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#00f0ff] transition-colors">Support</a>
            </div>
            <p className="text-sm text-[#8888a0] font-rajdhani">© 2024 Nexus Arena. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <Dialog open={!!selectedStream} onOpenChange={() => setSelectedStream(null)}>
        <DialogContent className="max-w-4xl bg-[#12121a] border-[#00f0ff]/30">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-xl flex items-center gap-3">
              <span className="px-2 py-1 bg-red-500 rounded text-xs font-bold flex items-center gap-1 animate-pulse">
                <span className="w-2 h-2 bg-white rounded-full" /> LIVE
              </span>
              {selectedStream?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedStream && (
            <div>
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <img
                  src={selectedStream.thumbnail}
                  alt={selectedStream.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]/50">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-20 h-20 rounded-full bg-[#00f0ff]/20 flex items-center justify-center"
                  >
                    <Play className="w-10 h-10 text-[#00f0ff]" />
                  </motion.div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedStream.avatar}
                      alt={selectedStream.streamer}
                      className="w-10 h-10 rounded-full ring-2 ring-[#00f0ff]"
                    />
                    <div>
                      <p className="font-rajdhani font-bold">{selectedStream.streamer}</p>
                      <p className="text-xs text-[#8888a0]">{selectedStream.game}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {(selectedStream.viewers / 1000).toFixed(1)}K
                    </span>
                    <span className="flex items-center gap-1 text-[#00f0ff]">
                      <Sparkles className="w-4 h-4" /> +{Math.floor(watchTime / 60) * 10} XP
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button className="flex-1 bg-gradient-to-r from-[#00f0ff] to-[#9945ff] font-rajdhani font-bold">
                  <Volume2 className="w-4 h-4 mr-2" /> Watch Now
                </Button>
                <Button variant="outline" className="neon-border font-rajdhani">
                  <Heart className="w-4 h-4 mr-2" /> Follow
                </Button>
                <Button variant="outline" className="neon-border font-rajdhani">
                  <Gift className="w-4 h-4 mr-2" /> Gift
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCartOpen} onOpenChange={handleCloseCart}>
        <DialogContent className="max-w-md bg-[#12121a] border-[#00f0ff]/30">
          <DialogHeader>
            <DialogTitle className="font-orbitron text-xl flex items-center gap-2">
              {checkoutStep === "payment" && (
                <button
                  onClick={() => {
                    setCheckoutStep("cart");
                    setClientSecret(null);
                    setPaymentError(null);
                  }}
                  className="p-1 hover:bg-[#1a1a25] rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-[#8888a0]" />
                </button>
              )}
              <ShoppingCart className="w-5 h-5 text-[#00f0ff]" />
              {checkoutStep === "cart" ? "Your Cart" : "Checkout"}
            </DialogTitle>
          </DialogHeader>

          {checkoutStep === "cart" ? (
            <>
              <div className="max-h-[60vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8 text-[#8888a0]">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-rajdhani">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-[#1a1a25] rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-rajdhani font-bold text-sm">{item.name}</p>
                          <p className="text-[#00f0ff] font-orbitron text-sm">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="p-1 rounded bg-[#0a0a0f] hover:bg-[#ff00aa]/20"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-orbitron">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="p-1 rounded bg-[#0a0a0f] hover:bg-[#00f0ff]/20"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-[#00f0ff]/20 pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-rajdhani text-[#8888a0]">Total</span>
                    <span className="font-orbitron font-bold text-[#00f0ff]">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="font-rajdhani text-[#8888a0]">XP Reward</span>
                    <span className="font-orbitron font-bold text-[#39ff14]">+{cartXP} XP</span>
                  </div>
                  {paymentError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-rajdhani">
                      {paymentError}
                    </div>
                  )}
                  <Button
                    className="w-full bg-gradient-to-r from-[#00f0ff] to-[#9945ff] font-orbitron font-bold"
                    onClick={handleCheckout}
                    disabled={isLoadingPayment}
                  >
                    {isLoadingPayment ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-2">
              {clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: "night",
                      variables: {
                        colorPrimary: "#00f0ff",
                        colorBackground: "#1a1a25",
                        colorText: "#f0f0f5",
                        colorDanger: "#ff4444",
                        fontFamily: "Rajdhani, sans-serif",
                        borderRadius: "8px",
                      },
                    },
                  }}
                >
                  <CheckoutForm
                    amount={Math.round(cartTotal * 100)}
                    xpReward={cartXP}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#00f0ff]" />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center gap-2 text-sm font-rajdhani font-semibold text-[#8888a0] hover:text-[#00f0ff] transition-colors"
    >
      {icon}
      {children}
    </a>
  );
}

function MobileNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#12121a] font-rajdhani font-semibold text-[#8888a0] hover:text-[#00f0ff] hover:bg-[#1a1a25] transition-colors"
    >
      {icon}
      {children}
    </a>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-[#12121a]/80 backdrop-blur-sm rounded-xl p-4 neon-border text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff] mb-2">
        {icon}
      </div>
      <p className="font-orbitron font-bold text-xl sm:text-2xl text-[#00f0ff]">{value}</p>
      <p className="font-rajdhani text-xs sm:text-sm text-[#8888a0]">{label}</p>
    </div>
  );
}