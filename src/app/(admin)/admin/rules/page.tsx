"use client";

import * as React from "react";
import {
  Clock,
  Users,
  Shield,
  Target,
  Trophy,
  CheckCircle,
  XCircle,
  Save,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRulesConfig, updateRulesConfig } from "@/lib/actions/admin";
import {
  DEFAULT_RULES_CONFIG,
  type RulesConfig,
  type RuleCard,
  type PointSystemItem,
} from "@/lib/db/rules-types";

// Icon mapping for rule cards
const iconMap = {
  clock: Clock,
  users: Users,
  shield: Shield,
  target: Target,
};

const iconLabels = {
  clock: "Saat",
  users: "Kullanıcılar",
  shield: "Kalkan",
  target: "Hedef",
};

// Reusable List Editor Component
function ListEditor({
  title,
  icon: Icon,
  iconColor,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const addItem = () => onChange([...items, ""]);
  const removeItem = (index: number) =>
    onChange(items.filter((_, i) => i !== index));
  const updateItem = (index: number, value: string) => {
    const updated = [...items];
    updated[index] = value;
    onChange(updated);
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${iconColor}`}>
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={placeholder}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                disabled={items.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ekle
        </Button>
      </CardContent>
    </Card>
  );
}

// Point System Editor Component
function PointSystemEditor({
  items,
  onChange,
}: {
  items: PointSystemItem[];
  onChange: (items: PointSystemItem[]) => void;
}) {
  const addRow = () => {
    onChange([...items, { position: "", points: 0 }]);
  };

  const removeRow = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateRow = (
    index: number,
    field: keyof PointSystemItem,
    value: string | number
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-400">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Puan Sistemi
        </CardTitle>
        <CardDescription>Sıralama puanlarını düzenleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={item.position}
                onChange={(e) => updateRow(index, "position", e.target.value)}
                placeholder="Sıra (ör: 1. Sıra)"
                className="flex-1"
              />
              <Input
                type="number"
                value={item.points}
                onChange={(e) =>
                  updateRow(index, "points", parseInt(e.target.value) || 0)
                }
                placeholder="Puan"
                className="w-24"
                min={0}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(index)}
                disabled={items.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="mt-4"
        >
          <Plus className="mr-2 h-4 w-4" />
          Sıra Ekle
        </Button>
      </CardContent>
    </Card>
  );
}

// Rule Cards Editor Component
function RuleCardsEditor({
  cards,
  onChange,
}: {
  cards: RuleCard[];
  onChange: (cards: RuleCard[]) => void;
}) {
  const updateCard = (
    index: number,
    field: keyof RuleCard,
    value: string
  ) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Kural Kartları
        </CardTitle>
        <CardDescription>
          Ana kural kartlarının başlık ve açıklamalarını düzenleyin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cards.map((card, index) => {
            const IconComponent = iconMap[card.iconKey];
            return (
              <div
                key={index}
                className="rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <IconComponent className="h-4 w-4 text-primary" />
                  <span>{iconLabels[card.iconKey]}</span>
                </div>
                <div className="space-y-3">
                  <Input
                    value={card.title}
                    onChange={(e) => updateCard(index, "title", e.target.value)}
                    placeholder="Başlık"
                  />
                  <textarea
                    value={card.description}
                    onChange={(e) =>
                      updateCard(index, "description", e.target.value)
                    }
                    placeholder="Açıklama"
                    rows={2}
                    className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminRulesPage() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [formValues, setFormValues] =
    React.useState<RulesConfig>(DEFAULT_RULES_CONFIG);

  const loadRulesConfig = React.useCallback(async () => {
    const data = await getRulesConfig();
    setFormValues(data);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadRulesConfig();
  }, [loadRulesConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.set("rulesConfig", JSON.stringify(formValues));
      const result = await updateRulesConfig(null, formData);
      if (result.success) {
        toast.success(result.message);
        await loadRulesConfig();
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("Kurallar güncellenemedi");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="h-12 w-48 skeleton rounded-lg" />
            <div className="h-96 skeleton rounded-lg" />
            <div className="h-64 skeleton rounded-lg" />
            <div className="h-64 skeleton rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-rajdhani)] uppercase tracking-wider">
            Kurallar & Puan Sistemi
          </h1>
          <p className="text-muted-foreground">
            Kurallar sayfasındaki içerikleri düzenleyin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rule Cards */}
          <RuleCardsEditor
            cards={formValues.ruleCards}
            onChange={(ruleCards) =>
              setFormValues((prev) => ({ ...prev, ruleCards }))
            }
          />

          {/* Do's and Don'ts */}
          <div className="grid gap-6 md:grid-cols-2">
            <ListEditor
              title="Yapılması Gerekenler"
              icon={CheckCircle}
              iconColor="text-green-400"
              items={formValues.dos}
              onChange={(dos) => setFormValues((prev) => ({ ...prev, dos }))}
              placeholder="Yapılması gereken kural"
            />
            <ListEditor
              title="Yapılmaması Gerekenler"
              icon={XCircle}
              iconColor="text-red-400"
              items={formValues.donts}
              onChange={(donts) =>
                setFormValues((prev) => ({ ...prev, donts }))
              }
              placeholder="Yapılmaması gereken kural"
            />
          </div>

          {/* Point System */}
          <PointSystemEditor
            items={formValues.pointSystem}
            onChange={(pointSystem) =>
              setFormValues((prev) => ({ ...prev, pointSystem }))
            }
          />

          {/* Save Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Kaydediliyor..." : "Kuralları Kaydet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
