
import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ProductCard({ product, language, onAddToCart }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
    >
      <Card className="overflow-hidden bg-white/80 backdrop-blur-sm border-0">
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
            whileHover={{ opacity: 1 }}
          />
          <div className="aspect-w-16 aspect-h-9 w-full">
            {product.id === "arabic-breakfast" && (
              <img  alt="Arabic breakfast spread" className="w-full h-64 object-cover rounded-t-xl" src="https://images.unsplash.com/photo-1490924016451-45d1f75330b0" />
            )}
            {/* Similar image replacements for other products */}
          </div>
        </div>

        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-bold">{product.name[language]}</CardTitle>
          <p className="text-lg font-semibold text-[#D2B48C]">{product.price} SAR</p>
        </CardHeader>

        <CardContent>
          {product.options && (
            <div className="space-y-4">
              {Object.entries(product.options).map(([key, option]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium">{option[language]}</label>
                  <select className="w-full p-2 rounded-md border border-[#D2B48C] bg-transparent focus:ring-2 focus:ring-[#D2B48C] transition-all">
                    {option.choices.map((choice, i) => (
                      <option key={i} value={choice[language]}>
                        {choice[language]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          {product.includes && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">
                {language === "ar" ? "يشمل" : "Includes"}:
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {product.includes.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600">
                    {item[language]}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full bg-gradient-to-r from-[#D2B48C] to-[#C4A484] hover:from-[#C4A484] hover:to-[#D2B48C] text-white transition-all duration-300"
            onClick={() => onAddToCart(product)}
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === "ar" ? "إضافة للسلة" : "Add to Cart"}
            </motion.span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
