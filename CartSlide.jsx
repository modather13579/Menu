
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";

export function CartSlide({ isOpen, onClose, cart, language, totalAmount, updateQuantity, removeFromCart }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <motion.h2 
                  className="text-2xl font-bold"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  {language === "ar" ? "سلة التسوق" : "Shopping Cart"}
                </motion.h2>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="hover:rotate-90 transition-transform"
                >
                  ✕
                </Button>
              </div>

              <div className="flex-1 overflow-auto">
                <AnimatePresence>
                  {cart.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-gray-500 mt-10"
                    >
                      {language === "ar" ? "السلة فارغة" : "Cart is empty"}
                    </motion.p>
                  ) : (
                    <motion.div className="space-y-4">
                      {cart.map((item, index) => (
                        <motion.div
                          key={`${item.id}-${index}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-[#D2B48C]/20"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{item.name[language]}</h3>
                              <p className="text-sm text-[#D2B48C]">{item.price} SAR</p>
                              {item.options && Object.entries(item.options).map(([key, value]) => (
                                <p key={key} className="text-sm text-gray-600">
                                  {value[language]}
                                </p>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.options, -1)}
                                className="hover:bg-[#D2B48C]/10"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.options, 1)}
                                className="hover:bg-[#D2B48C]/10"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id, item.options)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                className="border-t pt-4 mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">
                    {language === "ar" ? "المجموع" : "Total"}:
                  </span>
                  <span className="font-bold text-[#D2B48C]">{totalAmount} SAR</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-[#D2B48C] to-[#C4A484] hover:from-[#C4A484] hover:to-[#D2B48C] text-white"
                  disabled={cart.length === 0}
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {language === "ar" ? "إتمام الطلب" : "Checkout"}
                  </motion.span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
