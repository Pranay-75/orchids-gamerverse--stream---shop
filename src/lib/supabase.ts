import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface User {
  id: string;
  username: string;
  email: string;
  xp: number;
  level: number;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_name: string;
  badge_icon: string;
  badge_color: string;
  unlocked: boolean;
  unlocked_at?: string;
  created_at: string;
}

export interface Challenge {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  progress: number;
  target: number;
  xp_reward: number;
  completed: boolean;
  completed_at?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  stripe_payment_intent_id?: string;
  total_amount: number;
  xp_reward: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  xp_reward: number;
  created_at: string;
}

export interface WatchSession {
  id: string;
  user_id: string;
  stream_id: number;
  streamer_name: string;
  duration_seconds: number;
  xp_earned: number;
  started_at: string;
  ended_at?: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export async function signUp(email: string, password: string, username: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("No user returned");

  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user.id,
    email,
    username,
    xp: 0,
    level: 1,
  });

  if (profileError) throw profileError;

  return authData;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}