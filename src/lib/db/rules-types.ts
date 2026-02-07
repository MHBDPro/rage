// Rule card with icon key (maps to Lucide icon at render time)
export interface RuleCard {
  iconKey: "clock" | "users" | "shield" | "target";
  title: string;
  description: string;
}

// Point system entry
export interface PointSystemItem {
  position: string;
  points: number;
}

// Full rules config type
export interface RulesConfig {
  ruleCards: RuleCard[];
  dos: string[];
  donts: string[];
  pointSystem: PointSystemItem[];
}

// Default rules configuration (matches current hardcoded values)
export const DEFAULT_RULES_CONFIG: RulesConfig = {
  ruleCards: [
    {
      iconKey: "clock",
      title: "Kayıt Zamanı",
      description:
        "Slot kaydı her gün belirlenen saatte açılır. İlk gelen ilk alır esasına göre. IP adresi başına günde bir kayıt.",
    },
    {
      iconKey: "users",
      title: "Takım Gereksinimleri",
      description:
        "Her takımın doğrulama için geçerli bir takım adı ve Instagram hesabı olmalıdır. Takım isimleri uygun olmalı ve saldırgan içerik barındırmamalıdır.",
    },
    {
      iconKey: "shield",
      title: "Adil Oyun",
      description:
        "Hile, hack veya herhangi bir haksız avantaj kesinlikle yasaktır. İhlal edenler gelecekteki tüm maçlardan kalıcı olarak yasaklanacaktır.",
    },
    {
      iconKey: "target",
      title: "Maç Davranışı",
      description:
        "Tüm oyuncular özel odaya zamanında katılmalıdır. Ek süre içinde katılamayan takımlar slotlarını kaybedecektir.",
    },
  ],
  dos: [
    "Doğru takım bilgileriyle kayıt olun",
    "Son tarihten önce özel odaya katılın",
    "Tüm oyunculara saygı gösterin ve sportmenliği koruyun",
    "Hataları veya sorunları yöneticilere bildirin",
    "Güncellemeler ve duyurular için Instagram'ı takip edin",
  ],
  donts: [
    "Hile, hack veya exploitleri kullanmayın",
    "Birden fazla kayıt oluşturmayın (IP başına bir)",
    "Uygunsuz takım isimleri kullanmayın",
    "Geçerli bir neden olmadan maçtan erken ayrılmayın",
    "Toksik davranış veya tacizde bulunmayın",
  ],
  pointSystem: [
    { position: "1. Sıra", points: 10 },
    { position: "2. Sıra", points: 6 },
    { position: "3. Sıra", points: 5 },
    { position: "4. Sıra", points: 4 },
    { position: "5. Sıra", points: 3 },
    { position: "6", points: 2 },
    { position: "7. Sıra", points: 1 },
    { position: "8. Sıra", points: 1 },
    { position: "Her Öldürme", points: 1 },
  ],
};
