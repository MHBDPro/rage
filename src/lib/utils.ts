import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind sınıflarını birleştirmek ve çakışmaları çözmek için yardımcı fonksiyon.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --------------------------------------------------------------------------
// TIMEZONE & DATE UTILS (ISTANBUL FIXED UTC+3)
// --------------------------------------------------------------------------

// Türkiye saati (TRT) UTC'den sabit 3 saat ileridedir ve yaz saati uygulaması yoktur.
const TR_OFFSET_HOURS = 3;
const TR_OFFSET_MS = TR_OFFSET_HOURS * 60 * 60 * 1000;

/**
 * Şu anki zamanı, sanki İstanbul'daymış gibi bileşenlerine (Yıl, Ay, Gün, Saat, Dakika) ayırır.
 * Bu fonksiyon, sunucunun saat dilimi ne olursa olsun doğru İstanbul tarihini bulmak için kullanılır.
 */
function getIstanbulDateComponents() {
  const now = new Date();
  
  // Mevcut UTC zamanına 3 saat ekleyerek "Sanal İstanbul Zamanı"nı buluyoruz.
  // Bu sayede UTC 22:00 (Gün 1) iken, İstanbul 01:00 (Gün 2) bilgisini doğru yakalarız.
  const istanbulTimeMs = now.getTime() + TR_OFFSET_MS;
  const istanbulDate = new Date(istanbulTimeMs);

  return {
    year: istanbulDate.getUTCFullYear(),
    month: istanbulDate.getUTCMonth(),
    day: istanbulDate.getUTCDate(),
    hours: istanbulDate.getUTCHours(),
    minutes: istanbulDate.getUTCMinutes(),
    // Karşılaştırma için günün toplam dakikası (0 - 1439)
    totalMinutes: (istanbulDate.getUTCHours() * 60) + istanbulDate.getUTCMinutes()
  };
}

/**
 * Hedeflenen saatin (örn: "15:00") İstanbul saatiyle bugünkü karşılığını
 * gerçek bir Date objesi (Timestamp) olarak döndürür.
 * 
 * @param timeStr "HH:mm" formatında saat stringi (örn: "15:00")
 */
export function getIstanbulTargetDate(timeStr: string): Date {
  // 1. Hedef saati parse et
  const [targetH, targetM] = timeStr.split(":").map(Number);

  // 2. İstanbul'da şu an hangi "Gün"de olduğumuzu bul
  const { year, month, day } = getIstanbulDateComponents();

  // 3. İstanbul'un bugününe ait hedef saati UTC timestamp olarak oluştur.
  // Date.UTC, verdiğimiz parametreleri UTC kabul eder.
  // Ancak bizim parametrelerimiz (year, month, day, targetH...) İstanbul saatine göre.
  const targetTimeInUTCContext = Date.UTC(year, month, day, targetH, targetM, 0);

  // 4. Bu yüzden oluşan süreden 3 saati çıkararak GERÇEK evrensel zamanı (UTC) buluyoruz.
  return new Date(targetTimeInUTCContext - TR_OFFSET_MS);
}

/**
 * Şu anki İstanbul saatinin, hedeflenen saati geçip geçmediğini kontrol eder.
 * Tarih karmaşasına girmeden doğrudan günün dakikaları üzerinden karşılaştırma yapar.
 * 
 * @param targetTimeStr "HH:mm" formatında hedef saat
 * @returns boolean (Eğer şu anki saat >= hedef saat ise true döner)
 */
export function isIstanbulTimeAfter(targetTimeStr: string): boolean {
  // 1. İstanbul'da şu an saat kaç? (Toplam dakika cinsinden)
  const { totalMinutes: currentTotalMinutes } = getIstanbulDateComponents();

  // 2. Hedef saat kaç? (Toplam dakika cinsinden)
  const [targetH, targetM] = targetTimeStr.split(":").map(Number);
  const targetTotalMinutes = (targetH * 60) + targetM;

  // 3. Karşılaştırma
  return currentTotalMinutes >= targetTotalMinutes;
}

/**
 * Hedeflenen saate İstanbul saatiyle ne kadar süre kaldığını milisaniye cinsinden döndürür.
 * Eğer süre geçmişse 0 döndürür.
 * 
 * @param targetTimeStr "HH:mm" formatında hedef saat
 */
export function getIstanbulTimeRemaining(targetTimeStr: string): number {
  const targetDate = getIstanbulTargetDate(targetTimeStr);
  const now = new Date();
  
  const diff = targetDate.getTime() - now.getTime();
  
  // Negatif değer dönmemesi için Math.max kullanılır
  return Math.max(0, diff);
}

// --------------------------------------------------------------------------
// SCRIM SESSION HELPERS
// --------------------------------------------------------------------------

export function parseIstanbulDateTime(datetimeLocal: string): Date {
  const [datePart, timePart] = datetimeLocal.split("T");
  if (!datePart || !timePart) {
    return new Date(datetimeLocal);
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const utcMs = Date.UTC(year, month - 1, day, hour, minute) - TR_OFFSET_MS;
  return new Date(utcMs);
}

export function formatIstanbulDateTimeInput(date: Date): string {
  const istanbulMs = date.getTime() + TR_OFFSET_MS;
  const istanbulDate = new Date(istanbulMs);

  const pad = (value: number) => value.toString().padStart(2, "0");

  return `${istanbulDate.getUTCFullYear()}-${pad(
    istanbulDate.getUTCMonth() + 1
  )}-${pad(istanbulDate.getUTCDate())}T${pad(
    istanbulDate.getUTCHours()
  )}:${pad(istanbulDate.getUTCMinutes())}`;
}

export function slugify(value: string): string {
  const normalized = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "scrim";
}

export function getIstanbulDateKey(date = new Date()): string {
  const istanbulMs = date.getTime() + TR_OFFSET_MS;
  const istanbulDate = new Date(istanbulMs);
  const year = istanbulDate.getUTCFullYear();
  const month = String(istanbulDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(istanbulDate.getUTCDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}
