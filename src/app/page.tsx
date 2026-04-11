"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "Starters" | "Mains" | "Sides" | "Desserts";

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  emoji: string;
  gradient: string;
  popular?: boolean;
  spicy?: boolean;
};

const MENU: MenuItem[] = [
  // Starters
  { id: "s1", name: "Crispy Calamari", description: "Lightly battered, served with lemon aioli and fresh herbs.", price: 14, category: "Starters", emoji: "🦑", gradient: "from-amber-400 to-orange-500", popular: true },
  { id: "s2", name: "Heirloom Tomato Bruschetta", description: "Toasted sourdough, basil, garlic, aged balsamic.", price: 11, category: "Starters", emoji: "🍅", gradient: "from-rose-400 to-red-500" },
  { id: "s3", name: "Burrata & Prosciutto", description: "Creamy burrata, 24-month prosciutto, olive oil, grilled bread.", price: 16, category: "Starters", emoji: "🧀", gradient: "from-yellow-400 to-amber-500" },
  { id: "s4", name: "Spicy Tuna Tartare", description: "Sashimi-grade tuna, avocado, chili oil, crispy wontons.", price: 18, category: "Starters", emoji: "🐟", gradient: "from-red-400 to-rose-600", spicy: true },
  { id: "s5", name: "Garden Salad", description: "Local greens, shaved radish, white balsamic vinaigrette.", price: 10, category: "Starters", emoji: "🥗", gradient: "from-lime-400 to-emerald-500" },

  // Mains
  { id: "m1", name: "Wagyu Burger", description: "Dry-aged wagyu, smoked gouda, caramelized onion, brioche.", price: 22, category: "Mains", emoji: "🍔", gradient: "from-orange-500 to-red-600", popular: true },
  { id: "m2", name: "Wood-Fired Margherita", description: "San Marzano tomato, fresh mozzarella, basil, 48-hour dough.", price: 18, category: "Mains", emoji: "🍕", gradient: "from-red-500 to-rose-600", popular: true },
  { id: "m3", name: "Miso-Glazed Salmon", description: "Sustainable salmon, jasmine rice, baby bok choy, sesame.", price: 28, category: "Mains", emoji: "🐟", gradient: "from-pink-400 to-rose-500" },
  { id: "m4", name: "Short Rib Tagliatelle", description: "Hand-cut pasta, braised short rib, parmesan, gremolata.", price: 26, category: "Mains", emoji: "🍝", gradient: "from-amber-500 to-orange-600" },
  { id: "m5", name: "Nashville Hot Chicken", description: "Buttermilk-brined, Nashville spice, dill spears, Texas toast.", price: 20, category: "Mains", emoji: "🍗", gradient: "from-red-500 to-orange-600", spicy: true },
  { id: "m6", name: "Mushroom Risotto", description: "Arborio rice, truffle butter, wild mushrooms, parmesan.", price: 22, category: "Mains", emoji: "🍚", gradient: "from-stone-400 to-amber-600" },
  { id: "m7", name: "Thai Green Curry", description: "Coconut curry, tofu, jasmine rice, Thai basil, lime.", price: 19, category: "Mains", emoji: "🍛", gradient: "from-green-400 to-emerald-600", spicy: true },
  { id: "m8", name: "Ribeye Steak Frites", description: "12oz prime ribeye, garlic butter, duck fat fries.", price: 38, category: "Mains", emoji: "🥩", gradient: "from-red-600 to-rose-700" },

  // Sides
  { id: "si1", name: "Duck Fat Fries", description: "Crispy, golden, sea salt, truffle aioli.", price: 8, category: "Sides", emoji: "🍟", gradient: "from-yellow-400 to-amber-500" },
  { id: "si2", name: "Grilled Asparagus", description: "Charred, lemon, parmesan, flaky salt.", price: 9, category: "Sides", emoji: "🥬", gradient: "from-green-400 to-lime-500" },
  { id: "si3", name: "Mac & Cheese", description: "Five-cheese blend, crispy breadcrumb top.", price: 10, category: "Sides", emoji: "🧀", gradient: "from-yellow-500 to-orange-500" },
  { id: "si4", name: "Roasted Brussels", description: "Maple glaze, pecans, pomegranate.", price: 9, category: "Sides", emoji: "🥦", gradient: "from-green-500 to-emerald-600" },

  // Desserts
  { id: "d1", name: "Dark Chocolate Lava", description: "Molten center, vanilla bean ice cream, sea salt.", price: 11, category: "Desserts", emoji: "🍫", gradient: "from-amber-700 to-orange-800", popular: true },
  { id: "d2", name: "Lemon Tart", description: "Buttery crust, lemon curd, torched meringue.", price: 10, category: "Desserts", emoji: "🍋", gradient: "from-yellow-400 to-amber-400" },
  { id: "d3", name: "Seasonal Cheesecake", description: "New York style, fresh berry compote.", price: 10, category: "Desserts", emoji: "🍰", gradient: "from-pink-400 to-rose-500" },
];

const CATEGORIES: Category[] = ["Starters", "Mains", "Sides", "Desserts"];

type CartEntry = { item: MenuItem; qty: number };

const SAMPLE_ADDRESS = {
  name: "",
  phone: "",
  street: "142 Beacon Street",
  apt: "",
  city: "Boston",
  state: "MA",
  zip: "02116",
  instructions: "",
};

export default function RestaurantOrder() {
  const [dark, setDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("Starters");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [step, setStep] = useState<"menu" | "checkout" | "placed">("menu");
  const [address, setAddress] = useState(SAMPLE_ADDRESS);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [tip, setTip] = useState<number>(20);

  useEffect(() => {
    const saved = localStorage.getItem("solaris-theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
    const savedCart = localStorage.getItem("solaris-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("solaris-cart", JSON.stringify(cart));
  }, [cart]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("solaris-theme", next ? "dark" : "light");
  };

  const cartEntries: CartEntry[] = useMemo(() => {
    return Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([id, qty]) => ({ item: MENU.find((m) => m.id === id)!, qty }))
      .filter((e) => e.item);
  }, [cart]);

  const subtotal = cartEntries.reduce((s, e) => s + e.item.price * e.qty, 0);
  const deliveryFee = fulfillment === "delivery" && subtotal > 0 ? 4.99 : 0;
  const tax = subtotal * 0.0625;
  const tipAmount = (subtotal * tip) / 100;
  const total = subtotal + deliveryFee + tax + tipAmount;
  const itemCount = cartEntries.reduce((s, e) => s + e.qty, 0);

  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const sub = (id: string) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }));

  const canPlace =
    cartEntries.length > 0 &&
    address.name.trim().length > 1 &&
    address.phone.trim().length > 6 &&
    (fulfillment === "pickup" || address.street.trim().length > 0);

  const filteredItems = MENU.filter((m) => m.category === activeCategory);

  if (step === "placed") {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-5xl dark:bg-orange-500/10">
          🎉
        </div>
        <h1 className="mt-6 text-3xl font-semibold">Order placed!</h1>
        <p className="mt-3 max-w-md text-stone-600 dark:text-stone-400">
          Thanks {address.name.split(" ")[0] || "friend"} — your order is in the kitchen.
          You&apos;ll get SMS updates on{" "}
          <span className="font-semibold text-stone-900 dark:text-white">{address.phone}</span>.
        </p>
        <div className="mt-6 w-full rounded-2xl border border-stone-200 bg-white p-5 text-left dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-500 dark:text-stone-400">Estimated {fulfillment === "delivery" ? "delivery" : "pickup"}</span>
            <span className="font-semibold">
              {fulfillment === "delivery" ? "35–45 min" : "20–25 min"}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-stone-500 dark:text-stone-400">Total</span>
            <span className="font-semibold">${total.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-stone-500 dark:text-stone-400">Items</span>
            <span className="font-semibold">{itemCount}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setCart({});
            setStep("menu");
          }}
          className="mt-8 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-red-500"
        >
          Order again
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 text-lg font-bold text-white shadow-lg shadow-orange-500/30">
            🔥
          </span>
          <div className="leading-tight">
            <div className="text-base font-semibold">Solaris Kitchen</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              Seasonal · Boston
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
          >
            <span>🛒</span>
            <span>{itemCount === 0 ? "Cart" : `${itemCount} item${itemCount > 1 ? "s" : ""}`}</span>
            {subtotal > 0 && (
              <span className="ml-2 text-stone-900 dark:text-white">${subtotal.toFixed(2)}</span>
            )}
          </button>
          <button
            type="button"
            onClick={toggleDark}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
            aria-label="Toggle dark mode"
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {step === "menu" && (
        <>
          <section className="mb-8 rounded-3xl border border-stone-200 bg-gradient-to-br from-orange-500 via-red-500 to-rose-600 p-8 text-white shadow-lg dark:border-stone-800 sm:p-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Open now · 11:30am – 10:00pm
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Wood-fired, locally sourced, delivered hot.
              </h1>
              <p className="mt-3 text-white/80">
                20 dishes on the menu tonight. Free delivery on orders over $40.
              </p>
            </div>
          </section>

          <nav className="mb-6 flex gap-2 overflow-x-auto border-b border-stone-200 pb-1 dark:border-stone-800">
            {CATEGORIES.map((c) => {
              const active = c === activeCategory;
              const count = MENU.filter((m) => m.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  className={`relative whitespace-nowrap rounded-t-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "text-stone-900 dark:text-white"
                      : "text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                  }`}
                >
                  {c}
                  <span className="ml-1.5 text-xs text-stone-400">{count}</span>
                  {active && (
                    <span className="absolute -bottom-[5px] left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600" />
                  )}
                </button>
              );
            })}
          </nav>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => {
              const qty = cart[item.id] ?? 0;
              return (
                <article
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
                >
                  <div
                    className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${item.gradient} text-6xl`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
                    <span className="relative drop-shadow-lg">{item.emoji}</span>
                    <div className="absolute left-3 top-3 flex gap-1.5">
                      {item.popular && (
                        <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-900 backdrop-blur">
                          🔥 Popular
                        </span>
                      )}
                      {item.spicy && (
                        <span className="rounded-full bg-red-500/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                          🌶 Spicy
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold leading-tight">{item.name}</h3>
                      <span className="shrink-0 font-semibold text-stone-900 dark:text-white">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">
                      {item.description}
                    </p>
                    <div className="mt-auto">
                      {qty === 0 ? (
                        <button
                          type="button"
                          onClick={() => add(item.id)}
                          className="w-full rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-white dark:text-stone-900 dark:hover:bg-stone-100"
                        >
                          Add to cart
                        </button>
                      ) : (
                        <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 p-1 dark:border-stone-700 dark:bg-stone-800">
                          <button
                            type="button"
                            onClick={() => sub(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-semibold text-stone-700 hover:bg-white dark:text-stone-300 dark:hover:bg-stone-700"
                            aria-label="Remove one"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold">
                            {qty} in cart
                          </span>
                          <button
                            type="button"
                            onClick={() => add(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-lg font-semibold text-stone-700 hover:bg-white dark:text-stone-300 dark:hover:bg-stone-700"
                            aria-label="Add one"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      {step === "checkout" && (
        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <button
              type="button"
              onClick={() => setStep("menu")}
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
            >
              ← Back to menu
            </button>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Checkout</h1>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
              <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                How would you like it?
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(["delivery", "pickup"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFulfillment(f)}
                    className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                      fulfillment === f
                        ? "border-orange-500 bg-orange-500/10 text-orange-700 ring-2 ring-orange-500/30 dark:text-orange-300"
                        : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-400"
                    }`}
                  >
                    {f === "delivery" ? "🚗 Delivery" : "🏃 Pickup"}
                    <div className="mt-1 text-xs font-normal text-stone-500 dark:text-stone-400">
                      {f === "delivery" ? "35–45 min · $4.99" : "20–25 min · Free"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
              <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Your info
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  placeholder="Full name"
                  className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-stone-700 dark:bg-stone-950"
                />
                <input
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="Phone"
                  className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-stone-700 dark:bg-stone-950"
                />
              </div>
              {fulfillment === "delivery" && (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <input
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="Street"
                    className="sm:col-span-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-stone-700 dark:bg-stone-950"
                  />
                  <input
                    value={address.apt}
                    onChange={(e) => setAddress({ ...address, apt: e.target.value })}
                    placeholder="Apt / Suite"
                    className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-stone-700 dark:bg-stone-950"
                  />
                  <input
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City"
                    className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-stone-700 dark:bg-stone-950"
                  />
                  <input
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State"
                    className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-stone-700 dark:bg-stone-950"
                  />
                  <input
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    placeholder="ZIP"
                    className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-stone-700 dark:bg-stone-950"
                  />
                </div>
              )}
              <textarea
                rows={2}
                value={address.instructions}
                onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                placeholder="Delivery instructions (optional) — e.g. Leave at door"
                className="mt-3 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 dark:border-stone-700 dark:bg-stone-950"
              />
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
              <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                Tip your driver
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[15, 18, 20, 25].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTip(t)}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      tip === t
                        ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-300"
                    }`}
                  >
                    {t}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
            <div className="mb-4 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Your order
            </div>
            <ul className="flex flex-col gap-3">
              {cartEntries.map(({ item, qty }) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} text-xl`}
                  >
                    {item.emoji}
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-stone-500 dark:text-stone-400">
                      ${item.price.toFixed(2)} × {qty}
                    </div>
                  </div>
                  <div className="text-sm font-semibold">${(item.price * qty).toFixed(2)}</div>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 border-t border-stone-200 pt-4 text-sm dark:border-stone-800">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              {fulfillment === "delivery" && (
                <Row label="Delivery" value={`$${deliveryFee.toFixed(2)}`} />
              )}
              <Row label="Tax" value={`$${tax.toFixed(2)}`} />
              <Row label={`Tip (${tip}%)`} value={`$${tipAmount.toFixed(2)}`} />
              <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3 text-base font-semibold dark:border-stone-800">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              disabled={!canPlace}
              onClick={() => setStep("placed")}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-red-500 disabled:cursor-not-allowed disabled:from-stone-300 disabled:to-stone-300 disabled:shadow-none"
            >
              Place order · ${total.toFixed(2)}
            </button>
          </aside>
        </section>
      )}

      {cartOpen && step === "menu" && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col border-l border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 p-5 dark:border-stone-800">
              <div>
                <div className="font-semibold">Your cart</div>
                <div className="text-xs text-stone-500 dark:text-stone-400">
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cartEntries.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-stone-500 dark:text-stone-400">
                  <div className="text-4xl">🍽</div>
                  Your cart is empty. Add something delicious.
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
                  {cartEntries.map(({ item, qty }) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient} text-2xl`}
                      >
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-stone-500 dark:text-stone-400">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg border border-stone-200 px-2 py-1 dark:border-stone-700">
                        <button
                          type="button"
                          onClick={() => sub(item.id)}
                          className="h-6 w-6 text-lg font-semibold text-stone-700 dark:text-stone-300"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold">{qty}</span>
                        <button
                          type="button"
                          onClick={() => add(item.id)}
                          className="h-6 w-6 text-lg font-semibold text-stone-700 dark:text-stone-300"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {cartEntries.length > 0 && (
              <div className="border-t border-stone-200 p-5 dark:border-stone-800">
                <div className="mb-4 flex items-center justify-between font-semibold">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCartOpen(false);
                    setStep("checkout");
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-red-500"
                >
                  Go to checkout
                </button>
              </div>
            )}
          </aside>
        </div>
      )}

      <footer className="mt-16 text-center text-xs text-stone-400">
        Demo product — fictional menu, fictional restaurant. © {new Date().getFullYear()} Solaris Kitchen.
      </footer>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-stone-500 dark:text-stone-400">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
