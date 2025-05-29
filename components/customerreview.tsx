"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Review = {
  name: string;
  text: string;
};

const ReviewItem = ({ review }: { review: Review }) => {
  return (
    <div className="border-2 p-8 rounded-md relative flex flex-col items-center   ">
      <p className="lg:mb-5 md:mb-5 mb-8 text-md text-gray-700 leading-relaxed">
        {review.text}
      </p>
      <b className="text-gray-900 ">{review.name}</b>
    </div>
  );
};

const Reviews = () => {
  const [sliderRef, setSliderRef] = useState<Slider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("data.json");
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews from data.json:", error);
      }
    };

    fetchReviews();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="w-full relative h-auto text-center text-base text-dimgray font-inter my-20">
      <b className="leading-tight inline-block font-david-libre md:text-[40px] text-[28px]">
        Our Happy Customers
      </b>

      <Slider
        {...settings}
        ref={(slider) => setSliderRef(slider)}
        className="mt-12 mx-auto  lg:w-[40%] md:w-[60%] w-[75%]"
      >
        {reviews.map((review, index) => (
          <ReviewItem key={index} review={review} />
        ))}
      </Slider>

      <div className="absolute w-[95%] lg:w-[50%] md:w-[80%] top-[65%] left-1/2 -translate-x-1/2 flex justify-between items-center px-1">
      <button
          onClick={() => sliderRef?.slickPrev()}
          className="bg-white/80 p-2 rounded-full shadow-lg z-30 hover:bg-white transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => sliderRef?.slickNext()}
          className="bg-white/80 p-2 rounded-full shadow-lg z-30 hover:bg-white transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default Reviews;
