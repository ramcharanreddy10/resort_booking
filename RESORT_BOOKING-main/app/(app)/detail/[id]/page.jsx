"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import {
  MapPin,
  Wifi,
  Tv,
  Coffee,
  Wind,
  Droplet,
  Check,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { bookingAction } from "../../../serverActions/bookingAction";
import CalendarComponent from "../../../components/Calender";

const DynamicProduct = () => {
  const [resortRoom, setResortRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [error, setError] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    dynamicProductHandler();
  }, [id]);

  const dynamicProductHandler = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/product/${id}`);
      if (!response.ok) throw new Error("Could not fetch product.");
      const data = await response.json();
      setResortRoom(data.product);
      console.log("Fetched Product:", data.product);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const bookingHandler = async () => {
    console.log("Booking resort room...", resortRoom);
    if (!selectedDates || !selectedDates.startDate || !selectedDates.endDate) {
      alert("Please select start and end dates before booking.");
      return;
    }
    
    console.log("Selected Dates:", selectedDates);
    
    try {
      const bookingData = {
        resortRoom: resortRoom._id,
        startDate: new Date(selectedDates.startDate),
        endDate: new Date(selectedDates.endDate),
        productName: resortRoom.title,
        price: totalAmount,
        offer: resortRoom.offer || null,
        image: resortRoom.image,
      };
      
      const result = await bookingAction(bookingData);
      
      if (result.success) {
        alert("Booking request submitted successfully! Check 'My Reservations' to track your booking status.");
        // Reset form
        setSelectedDates(null);
        setTotalAmount(0);
        setShowCalendar(false);
      } else {
        alert(result.message || "Booking failed");
      }
      
      console.log("Booking result:", result);
    } catch (err) {
      console.log("Booking Error:", err);
      alert("An error occurred during booking");
    }
  };

  const handleDateChange = (range) => {
    setSelectedDates(range);

    if (range.startDate && range.endDate) {
      const nights = (range.endDate - range.startDate) / (1000 * 60 * 60 * 24);
      setTotalAmount(nights * resortRoom.price);
    }
  };

  const getAmenityIcon = (amenity) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="w-5 h-5" />;
    if (lowerAmenity.includes("tv")) return <Tv className="w-5 h-5" />;
    if (lowerAmenity.includes("breakfast")) return <Coffee className="w-5 h-5" />;
    if (lowerAmenity.includes("ac")) return <Wind className="w-5 h-5" />;
    if (lowerAmenity.includes("geyser")) return <Droplet className="w-5 h-5" />;
    return <Check className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!resortRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600">No product found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="text-indigo-600 hover:text-indigo-800 font-medium mb-4 flex items-center gap-2"
          >
            ← Back to Listings
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {resortRoom.title}
          </h1>

          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span>Premium Resort Room</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="aspect-video w-full bg-gradient-to-br from-indigo-400 to-purple-500 relative">
                <img
                  src={resortRoom.image}
                  alt={resortRoom.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4">About This Room</h2>
              <p className="text-gray-700 text-lg">{resortRoom.desc}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-6">Amenities</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {resortRoom.amen?.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-800 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Notice */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-2">
                    Booking Process
                  </h3>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Submit your booking request with your preferred dates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Admin will review and approve your request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Track your booking status in "My Reservations"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Complete payment after approval</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1 space-y-6 sticky top-8">
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-indigo-600">
                  ₹{resortRoom.price}
                </div>
                <div className="text-gray-500">per night</div>
              </div>

              {/* Calendar Toggle */}
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="w-full px-4 py-3 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-indigo-200 transition-colors mb-4"
              >
                <Calendar size={18} />
                {showCalendar ? "Hide Calendar" : "Select Dates"}
              </button>

              {/* Calendar */}
              {showCalendar && (
                <div className="mb-4 border rounded-xl p-4 shadow-sm bg-gray-50">
                  <CalendarComponent onDateChange={handleDateChange} />

                  {totalAmount > 0 && (
                    <div className="mt-3 p-4 bg-green-100 border border-green-400 rounded-lg text-green-700 font-semibold text-center">
                      Total: ₹{totalAmount}
                      <p className="text-xs text-green-600 mt-1">
                        {selectedDates && (
                          <>
                            {Math.ceil((selectedDates.endDate - selectedDates.startDate) / (1000 * 60 * 60 * 24))} night(s)
                          </>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Book Button */}
              <button
                className={`w-full py-4 rounded-2xl font-bold transition-all ${
                  totalAmount > 0
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={bookingHandler}
                disabled={totalAmount === 0}
              >
                {totalAmount > 0 ? "Request Booking" : "Select Dates First"}
              </button>

              {totalAmount === 0 && (
                <p className="text-sm text-gray-500 text-center mt-2">
                  Choose your check-in and check-out dates
                </p>
              )}

              {/* Offer Display */}
              {resortRoom.offer && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                  <p className="text-sm text-orange-800 font-semibold">
                    🎉 Special Offer: {resortRoom.offer}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-3xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Important Information</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Free cancellation up to 24 hours before check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Check-in: 2:00 PM | Check-out: 11:00 AM</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Payment required after admin approval</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Valid ID proof required at check-in</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicProduct;