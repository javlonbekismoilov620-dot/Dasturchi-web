/* Testlar uchun Supabase Auth admin yordamchisi (faqat server/CLI muhitida!).
 *
 * Kalit: SUPABASE_SECRET_KEY (sb_secret_…) yoki SUPABASE_SERVICE_ROLE_KEY (eski JWT).
 * Yangi formatdagi kalit faqat `apikey` sarlavhasida yuboriladi; eski JWT esa
 * `Authorization: Bearer` sifatida ham. Kalit hech qachon konsolga chiqarilmaydi.
 *
 * Bu modul faqat test skriptlari yaratgan hisoblarni boshqaradi: test pochtalari
 * `@dasturchi.test` domenida (haqiqiy xat yuborilmaydi — admin API xat jo'natmaydi). */

export const TEST_DOMAIN = "dasturchi.test";

export function supabaseAdminFromEnv() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) return null;
  const headers = { apikey: key, "content-type": "application/json" };
  if (!key.startsWith("sb_")) headers.authorization = `Bearer ${key}`;

  async function call(path, { method = "GET", body } = {}) {
    const res = await fetch(`${url}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    if (!res.ok) {
      const msg = (data && (data.msg || data.message || data.error_description || data.error)) || res.statusText;
      throw new Error(`${method} ${path.split("?")[0]} → ${res.status}: ${msg}`);
    }
    return data;
  }

  function assertTestEmail(email) {
    if (!email.toLowerCase().endsWith(`@${TEST_DOMAIN}`)) throw new Error(`Faqat @${TEST_DOMAIN} test hisoblari boshqariladi: ${email}`);
  }

  return {
    url,
    /** Pochta bo'yicha test foydalanuvchisini topish */
    async findUser(email) {
      assertTestEmail(email);
      for (let page = 1; page <= 20; page++) {
        const d = await call(`/auth/v1/admin/users?page=${page}&per_page=200`);
        const hit = d.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
        if (hit) return hit;
        if (d.users.length < 200) return null;
      }
      return null;
    },
    /** Tasdiqlangan foydalanuvchi yaratish (xat yuborilmaydi) */
    async createConfirmedUser(email, password, name) {
      assertTestEmail(email);
      return call("/auth/v1/admin/users", { method: "POST", body: { email, password, email_confirm: true, user_metadata: { full_name: name } } });
    },
    /** "Ro'yxatdan o'tdi, xat keldi" holatini taqlid qiladi: tasdiqlanmagan foydalanuvchi + bir martalik token (xat yuborilmaydi) */
    async generateSignupLink(email, password, name) {
      assertTestEmail(email);
      return call("/auth/v1/admin/generate_link", { method: "POST", body: { type: "signup", email, password, data: { full_name: name } } });
    },
    async deleteUser(id, email) {
      assertTestEmail(email);
      return call(`/auth/v1/admin/users/${id}`, { method: "DELETE" });
    },
    /** Test hisobini (agar oldingi ishga tushirishdan qolgan bo'lsa) o'chirish */
    async deleteIfExists(email) {
      const u = await this.findUser(email);
      if (u) await this.deleteUser(u.id, email);
      return Boolean(u);
    },
    /** Service role bilan PostgREST so'rovi (faqat tekshirish uchun o'qish) */
    async rest(pathAndQuery) {
      return call(`/rest/v1/${pathAndQuery}`);
    },
    async profileByEmail(email) {
      const rows = await call(`/rest/v1/profiles?select=id,email,role,name&email=eq.${encodeURIComponent(email.toLowerCase())}`);
      return rows[0] ?? null;
    },
  };
}
