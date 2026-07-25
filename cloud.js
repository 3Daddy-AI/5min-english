// クラウド同期（Supabase）— 設定前や読み込み失敗時は window.FluentCloud が
// 存在しないだけなので、app.js 側の `?.` 呼び出しにより常に安全に無視される。

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://rkfsgebnqacddkdfgast.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_7bZuLThN7EUi999L7eJrmQ_-S0mT_0-";

const isConfigured = /^https:\/\/.+\.supabase\.co$/.test(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 20;

const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const PENDING_CONSENT_KEY = "fluentPathPendingConsent";

let latestSession = null;
let sessionResolved = false;
let syncTimer = null;
const authListeners = [];

function notifyAuthListeners() {
  authListeners.forEach((callback) => callback(latestSession));
}

function onAuthChange(callback) {
  authListeners.push(callback);
  if (sessionResolved) callback(latestSession);
}

async function applyPendingConsent(session) {
  const pending = localStorage.getItem(PENDING_CONSENT_KEY);
  if (pending === null) return;
  localStorage.removeItem(PENDING_CONSENT_KEY);
  const { error } = await supabase
    .from("profiles")
    .update({ marketing_opt_in: pending === "true" })
    .eq("id", session.user.id);
  if (error) console.warn("[FluentCloud] 同意設定の保存に失敗しました", error);
}

async function boot() {
  if (!supabase) {
    sessionResolved = true;
    notifyAuthListeners();
    return;
  }

  const { data } = await supabase.auth.getSession();
  latestSession = data.session;
  sessionResolved = true;
  notifyAuthListeners();

  supabase.auth.onAuthStateChange((_event, session) => {
    const justSignedIn = !latestSession && session;
    latestSession = session;
    notifyAuthListeners();
    if (justSignedIn) applyPendingConsent(session);
  });
}

async function signInWithEmail(email, marketingOptIn) {
  if (!supabase) return { error: { message: "Supabaseが未設定です" } };
  localStorage.setItem(PENDING_CONSENT_KEY, String(marketingOptIn));
  return supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + window.location.pathname }
  });
}

async function signInWithGoogle(marketingOptIn) {
  if (!supabase) return { error: { message: "Supabaseが未設定です" } };
  localStorage.setItem(PENDING_CONSENT_KEY, String(marketingOptIn));
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + window.location.pathname }
  });
}

async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

async function hasCloudRow() {
  if (!supabase || !latestSession) return false;
  const { data, error } = await supabase
    .from("progress")
    .select("user_id")
    .eq("user_id", latestSession.user.id)
    .maybeSingle();
  if (error) {
    console.warn("[FluentCloud] hasCloudRow でエラー", error);
    return false;
  }
  return Boolean(data);
}

async function pullCloudState() {
  if (!supabase || !latestSession) return null;
  const { data, error } = await supabase
    .from("progress")
    .select("state")
    .eq("user_id", latestSession.user.id)
    .maybeSingle();
  if (error) {
    console.warn("[FluentCloud] pullCloudState でエラー", error);
    return null;
  }
  return data ? data.state : null;
}

async function pushCloudState(state) {
  if (!supabase || !latestSession) return;
  const { error } = await supabase
    .from("progress")
    .upsert({ user_id: latestSession.user.id, state, updated_at: new Date().toISOString() });
  if (error) console.warn("[FluentCloud] pushCloudState でエラー", error);
}

function scheduleSync(state) {
  if (!supabase || !latestSession) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => pushCloudState(state), 1500);
}

boot();

window.FluentCloud = {
  isConfigured,
  onAuthChange,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  hasCloudRow,
  pullCloudState,
  pushCloudState,
  scheduleSync
};
