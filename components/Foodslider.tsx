"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FoodItem = {
  id: number;
  name: string;
  price: string;
  rating: string;
  img: string;
};

const FoodSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await fetch("data.json");
        const data = await response.json();
        setFoodItems(data.foodItems || []);
      } catch (error) {
        console.error("Failed to load food items from data.json", error);
      }
    };

    fetchFoodItems();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % foodItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + foodItems.length) % foodItems.length);
  };

  const getVisibleItems = () => {
    const items = [];
    const totalItems = foodItems.length;

    for (let i = 2; i > 0; i--) {
      const index = (currentIndex - i + totalItems) % totalItems;
      items.push({ ...foodItems[index], position: -i });
    }

    items.push({ ...foodItems[currentIndex], position: 0 });

    for (let i = 1; i <= 2; i++) {
      const index = (currentIndex + i) % totalItems;
      items.push({ ...foodItems[index], position: i });
    }

    return items;
  };

  if (foodItems.length === 0) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="pt-10 mb-10 px-4 overflow-hidden relative">
      <p className="text-center text-[#EC994B] md:text-[20px] text-[16px]">-Popular Delivery-</p>
      <h2 className="text-center md:text-[40px] text-[30px] font-bold mb-6">Trending Food</h2>

      <div className="relative h-[500px] max-w-6xl mx-auto">
        <div className="relative h-full flex items-center justify-center">
          {getVisibleItems().map((item) => {
            const position = item.position;

            let zIndex = 5 - Math.abs(position);

            let opacity, scale, translateX;

            if (Math.abs(position) === 0) {
              opacity = 1;
              scale = 1;
              translateX = "0%";
            } else if (Math.abs(position) === 1) {
              opacity = 0.9;
              scale = 0.85;
              translateX = position * 60 + "%";
            } else {
              opacity = 0.8;
              scale = 0.7;
              translateX = position * 63 + "%";
            }

            return (
              <div
                key={item.id}
                className="absolute transition-all ease-in-out duration-500 md:w-[500px]"
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  zIndex: zIndex,
                  opacity: opacity,
                }}
              >
                <div className="relative rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="h-[400px] w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 text-left">
                    <h3 className="text-3xl font-poppins font-semibold text-white">{item.name}</h3>
                    <p className="text-white text-xl">
                      {item.rating} {"⭐".repeat(Math.floor(parseFloat(item.rating)))}
                    </p>
                  </div>
                  <div className="absolute top-4 right-3 px-6 py-1 border-4 text-center rounded-full text-lg">
                    <p className="text-white">{item.price}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-30 hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg z-30 hover:bg-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute bottom-4 right-0 left-0 z-40">
        <div className="flex items-center justify-center gap-2">
          {foodItems.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`cursor-pointer transition-all w-2 h-2 rounded-full ${
                currentIndex === i ? "bg-[#EC994b] p-2" : "bg-gray-500 bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodSlider;
