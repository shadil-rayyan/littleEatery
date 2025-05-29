'use client';
import React, { useEffect, useState } from "react";

interface ShortListInfoData {
  delivery: {
    title: string;
    time: string;
  };
  location: {
    title: string;
    subtitle: string;
  };
  phone: {
    number: string;
    subtitle: string;
  };
}

const ShortListInfo: React.FC = () => {
  const [data, setData] = useState<ShortListInfoData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => setData(json.shortListInfo))
      .catch((err) => console.error("Failed to load data.json", err));
  }, []);

  if (!data) {
    return <div>Loading...</div>; // or a spinner/loading placeholder
  }

  const { delivery, location, phone } = data;

  return (
    <div
      className="flex md:flex-row flex-col justify-center w-full md:h-[250px] h-auto mb-10 p-6 gap-6 md:gap-0 mt-10"
      style={{ boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.2)" }}
    >
      {/* Delivery */}
      <div className="w-full md:w-[32%] h-full flex flex-col justify-center items-center gap-2">
        <div className="rounded-full bg-[#EC994B] p-1">
          {/* SVG omitted for brevity */}
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <b>Delivery Available</b>
        <p className="text-gray-600 font-poppins">{delivery.time}</p>
      </div>

      {/* Location */}
      <div className="w-full md:w-[32%] h-full flex flex-col justify-center items-center md:border-r md:border-l border-r-0 border-l-0 border-t border-b md:border-t-0 md:border-b-0 border-gray-300 gap-2 md:py-0 py-6">
        <div className="rounded-full bg-[#EC994B] p-1">
          {/* SVG omitted for brevity */}
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"
            />
          </svg>
        </div>
        <b className="text-center">{location.title}</b>
        <p className="text-gray-600">Our location</p>
      </div>

      {/* Phone */}
      <div className="w-full md:w-[32%] h-full flex flex-col justify-center items-center gap-2">
        <div className="rounded-full bg-[#EC994B] p-1">
          {/* SVG omitted for brevity */}
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z" />
          </svg>
        </div>
        <b>{phone.number}</b>
        <p className="text-gray-600">Phone Number</p>
      </div>
    </div>
  );
};

export default ShortListInfo;
