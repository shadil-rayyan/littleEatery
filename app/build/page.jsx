'use client';
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function Admin() {
  const emptyFood = { id: Date.now(), name: "", price: "", rating: "", img: null };
  const emptyReview = { id: Date.now(), name: "", text: "" };

  const [formData, setFormData] = useState({
    images: { logo: null },
    documents: { menu: null },
    mainsection: {
      heading: "",
      subheading: "",
      googleMapLink: "",
      socialLinks: { facebook: "", instagram: "", twitter: "" },
      slides: [],
    },
    reviews: [emptyReview],
    foodItems: [emptyFood],
    footer: {
      logo: null,
      links: [
        { href: "/", label: "Contact Us" },
        { href: "/", label: "About us" },
        { href: "/", label: "Order Delivery" },
        { href: "/", label: "Terms of Services" },
      ],
      socialMedia: [
        { href: "/", icon: "facebook", color: "#f9803a", hoverColor: "#2761b8" },
        { href: "/", icon: "instagram", color: "#f9803a", hoverColor: "#cd2f8b" },
        { href: "/", icon: "twitter", color: "#EA6D27", hoverColor: "#2b6be3" },
        { href: "/", icon: "linkedin", color: "#EA6D27", hoverColor: "#2b6be3" },
      ],
    },
    shortListInfo: {
      delivery: { title: "", time: "" },
      location: { title: "", subtitle: "" },
      phone: { number: "", subtitle: "" },
    },
  });

  // Handle text input changes at nested paths
  function handleNestedChange(path, value) {
    setFormData((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let cur = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in cur)) cur[keys[i]] = {};
        cur = cur[keys[i]];
      }
      cur[keys[keys.length - 1]] = value;
      return newData;
    });
  }

  // Handle single file upload, store File object
  function handleFileChange(e, path) {
    const file = e.target.files[0];
    if (!file) return;
    handleNestedChange(path, file);
  }

  // Handle multiple file upload for slides
  function handleSlidesUpload(e) {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      mainsection: {
        ...prev.mainsection,
        slides: [...prev.mainsection.slides, ...files],
      },
    }));
  }

  // Remove slide image by index
  function removeSlide(index) {
    setFormData((prev) => {
      const slides = [...prev.mainsection.slides];
      slides.splice(index, 1);
      return {
        ...prev,
        mainsection: {
          ...prev.mainsection,
          slides,
        },
      };
    });
  }

  // Food items handlers
  function addFoodItem() {
    setFormData((prev) => ({
      ...prev,
      foodItems: [...prev.foodItems, { id: Date.now(), name: "", price: "", rating: "", img: null }],
    }));
  }
  function updateFoodItem(id, field, value) {
    setFormData((prev) => ({
      ...prev,
      foodItems: prev.foodItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }
  function removeFoodItem(id) {
    setFormData((prev) => ({
      ...prev,
      foodItems: prev.foodItems.filter((item) => item.id !== id),
    }));
  }

  // Reviews handlers
  function addReview() {
    setFormData((prev) => ({
      ...prev,
      reviews: [...prev.reviews, { id: Date.now(), name: "", text: "" }],
    }));
  }
  function updateReview(id, field, value) {
    setFormData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((rev) =>
        rev.id === id ? { ...rev, [field]: value } : rev
      ),
    }));
  }
  function removeReview(id) {
    setFormData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((rev) => rev.id !== id),
    }));
  }

  // Utility: convert File to Uint8Array for JSZip
  async function fileToUint8Array(file) {
    return new Uint8Array(await file.arrayBuffer());
  }

  // Handle Generate button
  async function handleGenerate() {
    const zip = new JSZip();

    // Folders
    const imagesFolder = zip.folder("images");
    const menuFolder = zip.folder("menu");

    // Add logo image
    if (formData.images.logo) {
      imagesFolder.file("logo.png", await fileToUint8Array(formData.images.logo));
    }

    // Add footer logo if any
    if (formData.footer.logo) {
      imagesFolder.file("footerlogo.png", await fileToUint8Array(formData.footer.logo));
    }

    // Add menu PDF
    if (formData.documents.menu) {
      menuFolder.file("menu.pdf", await fileToUint8Array(formData.documents.menu));
    }

    // Add slide images
    const slidePaths = [];
    for (let i = 0; i < formData.mainsection.slides.length; i++) {
      const file = formData.mainsection.slides[i];
      const ext = file.name.split(".").pop();
      const filename = `slide${i + 1}.${ext}`;
      slidePaths.push(`/images/${filename}`);
      imagesFolder.file(filename, await fileToUint8Array(file));
    }

    // Add food item images
    const foodItems = formData.foodItems.map((item, idx) => {
      let imgPath = "";
      if (item.img) {
        const ext = item.img.name.split(".").pop();
        const filename = `fooditem${idx + 1}.${ext}`;
        imagesFolder.file(filename, item.img);
        imgPath = `/images/${filename}`;
      }
      return {
        id: item.id,
        name: item.name,
        price: item.price,
        rating: item.rating,
        img: imgPath,
      };
    });

    // Build JSON
    const dataJson = {
      images: {
        logo: formData.images.logo ? "/images/logo.png" : "",
      },
      documents: {
        menu: formData.documents.menu ? "/menu/menu.pdf" : "",
      },
      mainsection: {
        heading: formData.mainsection.heading,
        subheading: formData.mainsection.subheading,
        googleMapLink: formData.mainsection.googleMapLink,
        socialLinks: formData.mainsection.socialLinks,
        slides: slidePaths,
      },
      reviews: formData.reviews.map(({ name, text }) => ({ name, text })),
      foodItems,
      footer: {
        logo: formData.footer.logo ? "/images/footerlogo.png" : "",
        links: formData.footer.links,
        socialMedia: formData.footer.socialMedia,
      },
      shortListInfo: formData.shortListInfo,
    };

    zip.file("data.json", JSON.stringify(dataJson, null, 2));

    // Generate ZIP and trigger download
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "public.zip");
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Restaurant Data Editor</h1>

      {/* Logo Upload */}
      <div>
        <label className="block font-semibold mb-1">Logo Image (PNG/JPG)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "images.logo")}
        />
        {formData.images.logo && (
          <img
            src={URL.createObjectURL(formData.images.logo)}
            alt="Logo Preview"
            className="mt-2 h-24"
          />
        )}
      </div>

      {/* Menu PDF Upload */}
      <div>
        <label className="block font-semibold mb-1">Menu PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFileChange(e, "documents.menu")}
        />
        {formData.documents.menu && (
          <p className="mt-1 text-sm">{formData.documents.menu.name}</p>
        )}
      </div>

      {/* Main Section */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Main Section</h2>
        <label className="block mb-1">Heading</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={formData.mainsection.heading}
          onChange={(e) => handleNestedChange("mainsection.heading", e.target.value)}
        />

        <label className="block mt-2 mb-1">Subheading</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={formData.mainsection.subheading}
          onChange={(e) => handleNestedChange("mainsection.subheading", e.target.value)}
        />

        <label className="block mt-2 mb-1">Google Map Link</label>
        <input
          type="text"
          className="border p-2 w-full rounded"
          value={formData.mainsection.googleMapLink}
          onChange={(e) => handleNestedChange("mainsection.googleMapLink", e.target.value)}
        />

        <div className="mt-3 space-y-2">
          <h3 className="font-semibold">Social Links</h3>
          {["facebook", "instagram", "twitter"].map((key) => (
            <input
              key={key}
              type="text"
              placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
              className="border p-2 w-full rounded"
              value={formData.mainsection.socialLinks[key]}
              onChange={(e) =>
                handleNestedChange(`mainsection.socialLinks.${key}`, e.target.value)
              }
            />
          ))}
        </div>

        {/* Slides Upload */}
        <div className="mt-4">
          <label className="block font-semibold mb-1">Slide Images (multiple)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleSlidesUpload}
          />
          <div className="flex flex-wrap gap-3 mt-2">
            {formData.mainsection.slides.map((file, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`slide-${idx + 1}`}
                  className="h-20 rounded"
                />
                <button
                  onClick={() => removeSlide(idx)}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Food Items */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Food Items</h2>
        {formData.foodItems.map((item, idx) => (
          <div
            key={item.id}
            className="border p-3 mb-3 rounded flex flex-col md:flex-row md:items-center md:space-x-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded flex-1 mb-2 md:mb-0"
              value={item.name}
              onChange={(e) => updateFoodItem(item.id, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Price"
              className="border p-2 rounded w-24 mb-2 md:mb-0"
              value={item.price}
              onChange={(e) => updateFoodItem(item.id, "price", e.target.value)}
            />
            <input
              type="text"
              placeholder="Rating"
              className="border p-2 rounded w-24 mb-2 md:mb-0"
              value={item.rating}
              onChange={(e) => updateFoodItem(item.id, "rating", e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="mb-2 md:mb-0"
              onChange={(e) => {
                if (e.target.files[0]) updateFoodItem(item.id, "img", e.target.files[0]);
              }}
            />
            {item.img && (
              <img
                src={URL.createObjectURL(item.img)}
                alt="food-item"
                className="h-16 rounded"
              />
            )}
            <button
              onClick={() => removeFoodItem(item.id)}
              className="ml-auto text-red-600 font-bold"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addFoodItem}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Add Food Item
        </button>
      </div>

      {/* Reviews */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Reviews</h2>
        {formData.reviews.map((rev, idx) => (
          <div
            key={rev.id}
            className="border p-3 mb-3 rounded flex flex-col md:flex-row md:items-center md:space-x-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="border p-2 rounded flex-1 mb-2 md:mb-0"
              value={rev.name}
              onChange={(e) => updateReview(rev.id, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Text"
              className="border p-2 rounded flex-1 mb-2 md:mb-0"
              value={rev.text}
              onChange={(e) => updateReview(rev.id, "text", e.target.value)}
            />
            <button
              onClick={() => removeReview(rev.id)}
              className="ml-auto text-red-600 font-bold"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addReview}
          className="bg-green-500 text-white px-3 py-1 rounded"
        >
          + Add Review
        </button>
      </div>

      {/* Footer Logo */}
      <div>
        <label className="block font-semibold mb-1">Footer Logo Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "footer.logo")}
        />
        {formData.footer.logo && (
          <img
            src={URL.createObjectURL(formData.footer.logo)}
            alt="Footer Logo Preview"
            className="mt-2 h-24"
          />
        )}
      </div>

      {/* Short List Info */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Short List Info</h2>
        {/* Delivery */}
        <label className="block mb-1 font-semibold">Delivery</label>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded mb-2 w-full"
          value={formData.shortListInfo.delivery.title}
          onChange={(e) => handleNestedChange("shortListInfo.delivery.title", e.target.value)}
        />
        <input
          type="text"
          placeholder="Time"
          className="border p-2 rounded w-full"
          value={formData.shortListInfo.delivery.time}
          onChange={(e) => handleNestedChange("shortListInfo.delivery.time", e.target.value)}
        />

        {/* Location */}
        <label className="block mt-4 mb-1 font-semibold">Location</label>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded mb-2 w-full"
          value={formData.shortListInfo.location.title}
          onChange={(e) => handleNestedChange("shortListInfo.location.title", e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtitle"
          className="border p-2 rounded w-full"
          value={formData.shortListInfo.location.subtitle}
          onChange={(e) => handleNestedChange("shortListInfo.location.subtitle", e.target.value)}
        />

        {/* Phone */}
        <label className="block mt-4 mb-1 font-semibold">Phone</label>
        <input
          type="text"
          placeholder="Number"
          className="border p-2 rounded mb-2 w-full"
          value={formData.shortListInfo.phone.number}
          onChange={(e) => handleNestedChange("shortListInfo.phone.number", e.target.value)}
        />
        <input
          type="text"
          placeholder="Subtitle"
          className="border p-2 rounded w-full"
          value={formData.shortListInfo.phone.subtitle}
          onChange={(e) => handleNestedChange("shortListInfo.phone.subtitle", e.target.value)}
        />
      </div>

      <button
        onClick={handleGenerate}
        className="w-full bg-blue-600 text-white py-3 rounded text-xl font-semibold hover:bg-blue-700 transition"
      >
        Generate New Public Folder ZIP
      </button>
    </div>
  );
}
