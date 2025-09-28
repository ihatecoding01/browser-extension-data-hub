"use client";

import { useState, useMemo } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarTrigger,
  SidebarRail } from
"@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer } from
"recharts";
import {
  LineChart as LineChartIcon,
  Star as StarIcon,
  BarChart3 as BarChartIcon,
  Sparkles as SparklesIcon,
  BellRing,
  Search } from
"lucide-react";
import { I18nProvider, useI18n, formatCurrencyINR } from "@/lib/i18n";

// Views for sidebar navigation
type View = "price" | "reviews" | "analytics" | "keywords";

export default function DashboardPage() {
  const [view, setView] = useState<View>("price");

  return (
    <I18nProvider>
      <SidebarProvider>
        <div className="min-h-svh w-full">
          <Sidebar collapsible="icon" variant="sidebar" className="border-r">
            <SidebarHeader className="p-3">
              <div className="flex items-center gap-2 px-1">
                <div className="size-6 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] grid place-items-center font-semibold">R</div>
                <div className="text-sm font-semibold">ReviewInsight</div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenuLocalized view={view} setView={setView} />
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter>
              <div className="px-2 w-full group-data-[state=collapsed]:hidden group-data-[collapsible=offcanvas]:hidden">
                <OpenExtensionButton />
              </div>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>

          <SidebarInset>
            <TopBar onViewChange={setView} />
            <main className="flex-1 p-4 md:p-6 grid gap-4 md:gap-6">
              {view === "price" && <PriceTrackingSection />}
              {view === "reviews" && <ReviewSummarySection />}
              {view === "analytics" && <AnalyticsSection />}
              {view === "keywords" && <KeywordsSection />}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </I18nProvider>
  );

}

function OpenExtensionButton() {
  const { t } = useI18n();
  return (
    <Button className="w-full h-8 group-data-[collapsible=icon]:hidden" size="sm" variant="default">
      {t("open_extension")}
    </Button>
  );
}

// New: localized sidebar content to avoid calling t() in DashboardPage
function SidebarMenuLocalized({ view, setView }: { view: View; setView: (v: View) => void }) {
  const { t } = useI18n();
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>{t("dashboard")}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setView("price")}
              isActive={view === "price"}
              tooltip={t("price_tracking")}>
              <LineChartIcon className="size-4" />
              <span>{t("price_tracking")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setView("reviews")}
              isActive={view === "reviews"}
              tooltip={t("reviews")}>
              <StarIcon className="size-4" />
              <span>{t("reviews")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setView("analytics")}
              isActive={view === "analytics"}
              tooltip={t("analytics")}>
              <BarChartIcon className="size-4" />
              <span>{t("analytics")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setView("keywords")}
              isActive={view === "keywords"}
              tooltip={t("keywords")}>
              <SparklesIcon className="size-4" />
              <span>{t("keywords")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

function TopBar({ onViewChange }: {onViewChange: (v: View) => void;}) {
  const { t, setLocale } = useI18n();
  return (
    <div className="border-b bg-background/60 sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-4 md:px-6 h-14">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-6" />
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder={t("search_placeholder")} className="pl-8" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Language selector */}
          <Select onValueChange={(v) => setLocale(v as any)}>
            <SelectTrigger className="h-8 w-[110px]"><SelectValue placeholder="EN" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
              <SelectItem value="bn">বাংলা</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
              <SelectItem value="te">తెలుగు</SelectItem>
            </SelectContent>
          </Select>
          <Badge className="hidden sm:flex" variant="secondary">{t("connected")}</Badge>
          <Button size="sm" variant="outline">
            <BellRing className="size-4 mr-1.5" /> {t("alerts")}
          </Button>
        </div>
      </div>
    </div>);

}

// -------- Price Tracking ---------
function PriceTrackingSection() {
  const { t } = useI18n();
  const priceData = useMemo(
    () => [
    { date: "Jan", price: 129, avg: 121 },
    { date: "Feb", price: 119, avg: 120 },
    { date: "Mar", price: 109, avg: 118 },
    { date: "Apr", price: 114, avg: 116 },
    { date: "May", price: 99, avg: 115 },
    { date: "Jun", price: 105, avg: 114 },
    { date: "Jul", price: 98, avg: 112 },
    { date: "Aug", price: 103, avg: 111 },
    { date: "Sep", price: 101, avg: 110 },
    { date: "Oct", price: 96, avg: 108 },
    { date: "Nov", price: 92, avg: 107 },
    { date: "Dec", price: 95, avg: 106 }],

    []
  );

  // Localize month abbreviations on chart axes
  const monthLabel = (m: string) => ({
    Jan: t("m_jan"),
    Feb: t("m_feb"),
    Mar: t("m_mar"),
    Apr: t("m_apr"),
    May: t("m_may"),
    Jun: t("m_jun"),
    Jul: t("m_jul"),
    Aug: t("m_aug"),
    Sep: t("m_sep"),
    Oct: t("m_oct"),
    Nov: t("m_nov"),
    Dec: t("m_dec"),
  } as Record<string, string>)[m] ?? m;

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{t("price_history")}</CardTitle>
              <CardDescription>{t("price_history_desc")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="last-12-months">
                <SelectTrigger size="sm" className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("range")}</SelectLabel>
                    <SelectItem value="last-30-days">{t("last_30_days")}</SelectItem>
                    <SelectItem value="last-90-days">{t("last_90_days")}</SelectItem>
                    <SelectItem value="last-12-months">{t("last_12_months")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              price: { label: t("price"), color: "var(--chart-1)" },
              avg: { label: t("avg"), color: "var(--chart-5)" }
            }}
            className="aspect-[16/7]">

            <ResponsiveContainer>
              <LineChart data={priceData} margin={{ left: 12, right: 12, top: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={monthLabel} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="avg" stroke="var(--color-avg)" strokeWidth={2} strokeDasharray="6 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("price_alerts")}</CardTitle>
          <CardDescription>{t("price_alerts_desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t("alert_below")}</div>
              <div className="text-xs text-muted-foreground">{t("send_alert_if_price_below") + " " + formatCurrencyINR(100)}</div>
            </div>
            <div className="flex items-center gap-3">
              <Input defaultValue={100} className="w-24" type="number" />
              <Switch defaultChecked id="alert-low" />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{t("alert_above")}</div>
              <div className="text-xs text-muted-foreground">{t("send_alert_if_price_above") + " " + formatCurrencyINR(140)}</div>
            </div>
            <div className="flex items-center gap-3">
              <Input defaultValue={140} className="w-24" type="number" />
              <Switch id="alert-high" />
            </div>
          </div>
          <Button className="w-full mt-2" size="sm">
            <BellRing className="size-4 mr-1.5" /> {t("save_alerts")}
          </Button>
        </CardContent>
      </Card>
    </div>);

}

// -------- Review Summary ---------
function ReviewSummarySection() {
  const { t } = useI18n();
  const ratingTrend = useMemo(
    () => [
    { month: "Jan", rating: 4.2 },
    { month: "Feb", rating: 4.1 },
    { month: "Mar", rating: 4.3 },
    { month: "Apr", rating: 4.4 },
    { month: "May", rating: 4.5 },
    { month: "Jun", rating: 4.4 },
    { month: "Jul", rating: 4.6 },
    { month: "Aug", rating: 4.5 },
    { month: "Sep", rating: 4.6 },
    { month: "Oct", rating: 4.7 },
    { month: "Nov", rating: 4.6 },
    { month: "Dec", rating: 4.7 }],

    []
  );

  const totalRatingsChange = useMemo(
    () => [
    { month: "Jan", count: 120 },
    { month: "Feb", count: 180 },
    { month: "Mar", count: 160 },
    { month: "Apr", count: 210 },
    { month: "May", count: 260 },
    { month: "Jun", count: 300 },
    { month: "Jul", count: 340 },
    { month: "Aug", count: 380 },
    { month: "Sep", count: 420 },
    { month: "Oct", count: 460 },
    { month: "Nov", count: 510 },
    { month: "Dec", count: 560 }],

    []
  );

  // Localize month abbreviations on chart axes
  const monthLabel = (m: string) => ({
    Jan: t("m_jan"),
    Feb: t("m_feb"),
    Mar: t("m_mar"),
    Apr: t("m_apr"),
    May: t("m_may"),
    Jun: t("m_jun"),
    Jul: t("m_jul"),
    Aug: t("m_aug"),
    Sep: t("m_sep"),
    Oct: t("m_oct"),
    Nov: t("m_nov"),
    Dec: t("m_dec"),
  } as Record<string, string>)[m] ?? m;

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("rating_trend")}</CardTitle>
          <CardDescription>{t("rating_trend_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ rating: { label: t("rating"), color: "var(--chart-1)" } }}>
            <ResponsiveContainer>
              <AreaChart data={ratingTrend} margin={{ left: 12, right: 12, top: 12 }}>
                <defs>
                  <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={monthLabel} />
                <YAxis domain={[3.5, 5]} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="rating" type="monotone" stroke="var(--color-rating)" fill="url(#ratingGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("total_ratings")}</CardTitle>
          <CardDescription>{t("total_ratings_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ count: { label: t("ratings"), color: "var(--chart-5)" } }}>
            <ResponsiveContainer>
              <BarChart data={totalRatingsChange} margin={{ left: 12, right: 12, top: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickFormatter={monthLabel} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{t("review_highlights")}</CardTitle>
              <CardDescription>{t("review_highlights_desc")}</CardDescription>
            </div>
            <Select defaultValue="last-100-reviews">
              <SelectTrigger size="sm" className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("scope")}</SelectLabel>
                  <SelectItem value="last-50-reviews">{t("last_50_reviews")}</SelectItem>
                  <SelectItem value="last-100-reviews">{t("last_100_reviews")}</SelectItem>
                  <SelectItem value="last-6-months">{t("last_6_months")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Highlight title={t("pros")} items={["Great battery life", "Bright display", "Fast performance"]} />
            <Highlight title={t("cons")} items={["Heavier than expected", "Noisy fan under load", "Limited color options"]} />
            <Highlight title={t("notes")} items={["Packaging improved", "Seller responds quickly", "Recent firmware fixed bugs"]} />
          </div>
        </CardContent>
      </Card>
    </div>);

}

function Highlight({ title, items }: {title: string;items: string[];}) {
  return (
    <div className="rounded-lg border p-4 bg-card">
      <div className="text-sm font-semibold mb-2">{title}</div>
      <ul className="text-sm space-y-1 list-disc pl-5 text-muted-foreground">
        {items.map((i) =>
        <li key={i}>{i}</li>
        )}
      </ul>
    </div>);

}

// -------- Analytics (additional features placeholder) ---------
function AnalyticsSection() {
  const { t } = useI18n();
  const convData = useMemo(
    () => [
    { date: "W1", views: 1200, conversions: 48 },
    { date: "W2", views: 1350, conversions: 52 },
    { date: "W3", views: 1510, conversions: 61 },
    { date: "W4", views: 1420, conversions: 58 }],

    []
  );

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">{t("analytics")}</CardTitle>
          <CardDescription>{t("weekly_views_vs_conversions")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ views: { label: t("views"), color: "var(--chart-4)" }, conversions: { label: t("conversions"), color: "var(--chart-1)" } }}>
            <ResponsiveContainer>
              <LineChart data={convData} margin={{ left: 12, right: 12, top: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line dataKey="views" stroke="var(--color-views)" strokeWidth={2} dot={false} />
                <Line dataKey="conversions" stroke="var(--color-conversions)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("benchmarks")}</CardTitle>
          <CardDescription>{t("category_comparison")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>{t("ctr")}</span>
              <Badge variant="secondary">3.4%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("conversion_rate")}</span>
              <Badge variant="secondary">4.1%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("refund_rate")}</span>
              <Badge variant="secondary">1.2%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

}

// -------- Keywords ---------
function KeywordsSection() {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">{t("keyword_extraction")}</CardTitle>
              <CardDescription>{t("keyword_extraction_desc")}</CardDescription>
            </div>
            <Button size="sm">{t("run_extraction")}</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="kw-source">{t("source")}</Label>
              <Select defaultValue="reviews-all">
                <SelectTrigger id="kw-source" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("data")}</SelectLabel>
                    <SelectItem value="reviews-all">{t("all_reviews")}</SelectItem>
                    <SelectItem value="reviews-recent">{t("recent_reviews")}</SelectItem>
                    <SelectItem value="qa">{t("qa")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kw-language">{t("language")}</Label>
              <Select defaultValue="en">
                <SelectTrigger id="kw-language" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("languages")}</SelectLabel>
                    <SelectItem value="en">{t("lang_en")}</SelectItem>
                    <SelectItem value="es">{t("lang_es")}</SelectItem>
                    <SelectItem value="de">{t("lang_de")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="kw-n-grams">{t("n_grams")}</Label>
              <Select defaultValue="uni-bi">
                <SelectTrigger id="kw-n-grams" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("combinations")}</SelectLabel>
                    <SelectItem value="uni">{t("unigrams")}</SelectItem>
                    <SelectItem value="bi">{t("bigrams")}</SelectItem>
                    <SelectItem value="uni-bi">{t("uni_bi")}</SelectItem>
                    <SelectItem value="uni-bi-tri">{t("uni_bi_tri")}</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="min-occ">{t("min_occurrences")}</Label>
              <Input id="min-occ" type="number" defaultValue={5} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stopwords">{t("stopwords")}</Label>
              <Input id="stopwords" placeholder={t("placeholder_stopwords")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="include">{t("must_include")}</Label>
              <Input id="include" placeholder={t("placeholder_include")} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="dedupe" defaultChecked />
              <Label htmlFor="dedupe">{t("deduplicate_terms")}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="brand" />
              <Label htmlFor="brand">{t("exclude_brand_terms")}</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("top_keywords")}</CardTitle>
          <CardDescription>{t("sorted_by_importance")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {[
            { k: "battery life", score: 0.91 },
            { k: "screen brightness", score: 0.84 },
            { k: "fan noise", score: 0.78 },
            { k: "build quality", score: 0.75 }].
            map((item) =>
            <div key={item.k} className="flex items-center justify-between">
                <span>{item.k}</span>
                <Badge variant="secondary">{Math.round(item.score * 100)}%</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>);

}