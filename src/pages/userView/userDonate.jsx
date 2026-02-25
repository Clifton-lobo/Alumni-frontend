import React from "react";
import { Heart, CreditCard, ShieldCheck, Users, Building2 } from "lucide-react";

const UserDonation = () => {
  return (
    <div className="min-h-screen bg-[#F5F6F8]">

      {/* ───────── HERO SECTION ───────── */}
      <div className="bg-[#152A5D] text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
            <Heart className="h-4 w-4 text-[#EBAB09]" />
            Support Our Alumni Community
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Give Back. Build Futures.
          </h1>

          <p className="mt-6 text-white/80 max-w-2xl mx-auto text-lg">
            Your contribution helps support scholarships, campus development,
            alumni networking initiatives, and student success programs.
          </p>

          <button className="mt-8 bg-[#EBAB09] hover:bg-[#d49a00] text-black font-semibold px-8 py-3 rounded-xl shadow-lg transition-all">
            Donate Now
          </button>
        </div>
      </div>

      {/* ───────── IMPACT SECTION ───────── */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#152A5D] text-center mb-12">
          Your Impact
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <Users className="mx-auto h-8 w-8 text-[#EBAB09]" />
            <h3 className="mt-4 text-xl font-semibold text-[#152A5D]">
              Scholarships
            </h3>
            <p className="mt-3 text-gray-600 text-sm">
              Support deserving students with financial assistance and
              academic opportunities.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <Building2 className="mx-auto h-8 w-8 text-[#EBAB09]" />
            <h3 className="mt-4 text-xl font-semibold text-[#152A5D]">
              Campus Development
            </h3>
            <p className="mt-3 text-gray-600 text-sm">
              Help enhance infrastructure, labs, libraries, and learning
              facilities.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <Heart className="mx-auto h-8 w-8 text-[#EBAB09]" />
            <h3 className="mt-4 text-xl font-semibold text-[#152A5D]">
              Alumni Programs
            </h3>
            <p className="mt-3 text-gray-600 text-sm">
              Fund networking events, mentorship programs, and career support
              initiatives.
            </p>
          </div>
        </div>
      </div>

      {/* ───────── DONATION CARD SECTION ───────── */}
      <div className="bg-white py-16">
        <div className="max-w-xl mx-auto px-6">
          <div className="rounded-3xl shadow-2xl p-10 border border-gray-100">

            <h2 className="text-2xl font-bold text-[#152A5D] text-center mb-8">
              Make a Contribution
            </h2>

            {/* Amount Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {["₹500", "₹1,000", "₹5,000", "₹10,000", "₹25,000", "Custom"].map((amt) => (
                <button
                  key={amt}
                  className="border border-gray-300 rounded-xl py-3 font-semibold text-sm hover:border-[#EBAB09] hover:bg-amber-50 transition-all"
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#152A5D]"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#152A5D]"
              />
              <textarea
                placeholder="Message (Optional)"
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#152A5D]"
              />
            </div>

            {/* Donate Button */}
            <button className="w-full mt-8 bg-[#EBAB09] hover:bg-[#d49a00] text-black font-semibold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
              <CreditCard className="h-4 w-4" />
              Proceed to Payment
            </button>

            {/* Secure Notice */}
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Secure payment processing
            </div>

          </div>
        </div>
      </div>

      {/* ───────── CTA FOOTER ───────── */}
      <div className="bg-[#152A5D] text-white py-12 text-center">
        <h3 className="text-2xl font-bold">
          Together, We Strengthen Our Legacy.
        </h3>
        <p className="text-white/70 mt-3">
          Thank you for supporting our alumni community.
        </p>
      </div>

    </div>
  );
};

export default UserDonation;