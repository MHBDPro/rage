"use server";

import { signToken, setAuthCookie, removeAuthCookie, getSession } from "@/lib/auth/jwt";
import { db, admins } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Kullanıcı adı gereklidir"),
  password: z.string().min(1, "Şifre gereklidir"),
});

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function loginAdmin(
  _prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    const parsed = loginSchema.safeParse(rawData);
    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0].message,
      };
    }

    const { username, password } = parsed.data;

    // Check against environment variable for initial setup
    // In production, you'd check against hashed password in database
    if (username === "admin" && password === process.env.ADMIN_PASSWORD) {
      const token = await signToken({ username });
      await setAuthCookie(token);
      return {
        success: true,
        message: "Giriş başarılı",
      };
    }

    // Check database for admin user
    const admin = await db
      .select()
      .from(admins)
      .where(eq(admins.username, username))
      .limit(1);

    if (admin.length === 0) {
      return {
        success: false,
        message: "Geçersiz kimlik bilgileri",
      };
    }

    // In production, use bcrypt to compare password hash
    // For simplicity, we're doing direct comparison here
    // You should replace this with proper password hashing
    if (admin[0].passwordHash !== password) {
      return {
        success: false,
        message: "Geçersiz kimlik bilgileri",
      };
    }

    const token = await signToken({ username });
    await setAuthCookie(token);
    return {
      success: true,
      message: "Giriş başarılı",
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "Giriş sırasında bir hata oluştu",
    };
  }
}

export async function logoutAdmin(): Promise<ActionResponse> {
  try {
    await removeAuthCookie();
    return {
      success: true,
      message: "Başarıyla çıkış yapıldı",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      message: "Çıkış sırasında bir hata oluştu",
    };
  }
}

export async function checkAuth(): Promise<{
  isAuthenticated: boolean;
  username?: string;
}> {
  const session = await getSession();
  if (!session) {
    return { isAuthenticated: false };
  }
  return {
    isAuthenticated: true,
    username: session.username,
  };
}
