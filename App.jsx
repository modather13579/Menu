
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ProductCard } from "@/components/ProductCard";
import { CartSlide } from "@/components/CartSlide";
import { useSpring, animated } from "@react-spring/web";

const categories = {
  arabicBreakfast: {
    en: "Arabic Breakfast",
    ar: "إفطار عربي",
    color: "#D2B48C"
  },
  easternBreakfast: {
    en: "Eastern Breakfast",
    ar: "إفطار شرقي",
    color: "#A78A7F"
  },
  snacks: {
    en: "Snacks",
    ar: "سناك",
    color: "#C4A484"
  },
  drinks: {
    en: "Drinks",
    ar: "مشروبات",
    color: "#D8B5A6"
  }
};

const products = {
  arabicBreakfast: [
    {
      id: "arabic-breakfast",
      name: { en: "Arabic Breakfast", ar: "إفطار عربي" },
      price: 26,
      options: {
        main: {
          en: "Main Dish",
          ar: "الطبق الرئيسي",
          choices: [
            { en: "Sunny Side Up Eggs", ar: "بيض عيون" },
            { en: "Boiled Eggs", ar: "بيض مسلوق" },
            { en: "Shakshuka", ar: "شكشوكة" },
            { en: "Omelette", ar: "أملت" }
          ]
        },
        drink: {
          en: "Drink",
          ar: "المشروب",
          choices: [
            { en: "Tea", ar: "شاي" },
            { en: "Juice", ar: "عصير" }
          ]
        }
      },
      includes: [
        { en: "Fresh Bread", ar: "خبز طازج" },
        { en: "Cream", ar: "قشطة" },
        { en: "Honey", ar: "عسل" }
      ]
    }
  ],
  easternBreakfast: [
    {
      id: "eastern-breakfast",
      name: { en: "Eastern Breakfast", ar: "إفطار شرقي" },
      price: 26,
      options: {
        main: {
          en: "Main Dish",
          ar: "الطبق الرئيسي",
          choices: [
            { en: "Foul with Tahini", ar: "فول بطحينة وزيت وكمون" },
            { en: "Foul with Tomatoes", ar: "فول بالطماطم" }
          ]
        },
        drink: {
          en: "Drink",
          ar: "المشروب",
          choices: [
            { en: "Tea", ar: "شاي" },
            { en: "Juice", ar: "عصير" }
          ]
        }
      },
      includes: [
        { en: "Fresh Bread", ar: "خبز طازج" },
        { en: "Cheese", ar: "جبن" },
        { en: "Hummus", ar: "حمص" }
      ]
    }
  ],
  snacks: [
    {
      id: "kitkat",
      name: { en: "KitKat", ar: "كتكات" },
      price: 2
    },
    {
      id: "twix",
      name: { en: "Twix", ar: "توكس" },
      price: 2
    },
    {
      id: "galaxy-fingers",
      name: { en: "Galaxy Fingers", ar: "جلاكسي صوابع" },
      price: 3
    },
    {
      id: "galaxy",
      name: { en: "Galaxy", ar: "جلاكسي" },
      price: 3
    },
    {
      id: "snickers",
      name: { en: "Snickers", ar: "سنيكرز" },
      price: 3
    }
  ],
  drinks: [
    {
      id: "orange-juice",
      name: { en: "Almarai Orange Juice", ar: "عصير مراعي بالبرتقال" },
      price: 1
    },
    {
      id: "mango-juice",
      name: { en: "Almarai Mango Juice", ar: "عصير مانجو مراعي" },
      price: 1
    },
    {
      id: "apple-juice",
      name: { en: "Almarai Apple Juice", ar: "عصير تفاح مراعي" },
      price: 1
    },
    {
      id: "mixed-juice",
      name: { en: "Almarai Mixed Fruit Juice", ar: "عصير مشكل فواكه مراعي" },
      price: 1
    }
  ]
};

export default function App() {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "ar";
  });
  const [activeCategory, setActiveCategory] = useState("arabicBreakfast");
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, options = {}) => {
    setCart(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && 
        JSON.stringify(item.options) === JSON.stringify(options)
      );

      if (existingItem) {
        return prev.map(item =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1, options }];
    });

    toast({
      title: language === "ar" ? "تمت الإضافة للسلة" : "Added to cart",
      description: product.name[language],
    });
  };

  const updateQuantity = (productId, options, delta) => {
    setCart(prev => {
      return prev.reduce((acc, item) => {
        if (item.id === productId && JSON.stringify(item.options) === JSON.stringify(options)) {
          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return acc;
          return [...acc, { ...item, quantity: newQuantity }];
        }
        return [...acc, item];
      }, []);
    });
  };

  const removeFromCart = (productId, options) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && JSON.stringify(item.options) === JSON.stringify(options))
    ));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const headerSpring = useSpring({
    from: { opacity: 0, y: -50 },
    to: { opacity: 1, y: 0 },
    config: { tension: 300, friction: 20 }
  });

  return (
    <div className={`min-h-screen ${language === "ar" ? "rtl" : "ltr"} bg-gradient-to-b from-[#F5F5DC] to-white`}>
      <animated.header style={headerSpring} className="bg-white/80 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-[#D2B48C] to-[#5A4A42] bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {language === "ar" ? "فندق عبير" : "Abeer Hotel"}
            </motion.h1>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setLanguage(prev => prev === "ar" ? "en" : "ar")}
                className="border-[#D2B48C] text-[#D2B48C] hover:bg-[#D2B48C] hover:text-white transition-colors"
              >
                <Globe className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsCartOpen(true)}
                className="relative border-[#D2B48C] text-[#D2B48C] hover:bg-[#D2B48C] hover:text-white transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-[#D2B48C] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </motion.span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </animated.header>

      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="flex flex-wrap gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {Object.entries(categories).map(([key, category], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-1 min-w-[150px]"
            >
              <Button
                onClick={() => setActiveCategory(key)}
                className={`w-full text-white transition-all duration-300 transform hover:scale-105`}
                style={{
                  background: `linear-gradient(to right, ${category.color}, ${category.color}CC)`,
                  opacity: activeCategory === key ? 1 : 0.7
                }}
              >
                {category[language]}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products[activeCategory].map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              language={language}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </main>

      <CartSlide
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        language={language}
        totalAmount={totalAmount}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />
      
      <Toaster />
    </div>
  );
}
