import React from 'react'
import eventPageAlumniEvent from "../../../assets/evenPageAlumniEvent2.png";

const UserEvents = () => {
  return (
    <div>
      <div className="relative w-full h-[280px] md:h-[380px] lg:h-[420px] overflow-hidden rounded-xl shadow-lg">
        {/* Background Image */}
        <img
          src={eventPageAlumniEvent}
          alt="Events Banner"
          className="w-full h-full object-cover"
        />

        {/* Soft Overlay */}
        <div className="absolute inset-0 bg-black/40 b" />

        {/* Title + Subtitle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl">
            <span className="bg-gradient-to-r from-pink-300 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-shine">
              Alumni Events
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/90 mt-3 max-w-2xl font-light leading-relaxed">
            Explore the latest updates, celebrations, reunions, and special
            moments from our vibrant alumni community 💫
          </p>
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className="max-w-6xl mx-auto px-6 mt-10 flex items-center gap-3">
        <div className="w-full">
          <label className="text-sm text-neutral-700">
            Search by event title
          </label>
          <input
            type="text"
            placeholder="Search events…"
            className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-red-600 outline-none shadow-sm"
          />
        </div>

        {/* Search Icon Button */}
        <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-md transition">
          🔍
        </button>
      </div>

      {/* FILTER + EVENTS WRAPPER */}
      <div className="max-w-6xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-10">
        {/* LEFT FILTER BAR */}
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">Filter by</h2>

          <hr className="mt-4 mb-4 border-neutral-300" />

          {/* DATE FILTER */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-800">Date</h3>
              <button className="text-sm text-red-600 hover:underline">
                Reset filter
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* Radio List */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="dateFilter"
                  className="accent-red-600"
                />
                <span className="text-neutral-700">All</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="dateFilter"
                  className="accent-red-600"
                />
                <span className="text-neutral-700">Next 7 Days</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="dateFilter"
                  className="accent-red-600"
                />
                <span className="text-neutral-700">Next 30 Days</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="dateFilter"
                  className="accent-red-600"
                />
                <span className="text-neutral-700">Next 60 Days</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="dateFilter"
                  className="accent-red-600"
                />
                <span className="text-neutral-700">Custom</span>
              </label>

              {/* Custom Date Fields */}
              <div className="mt-4 space-y-4 pl-6">
                <div>
                  <label className="block text-sm text-neutral-600 mb-1">
                    Start
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 shadow-sm focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-neutral-600 mb-1">
                    End
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 shadow-sm focus:ring-2 focus:ring-red-600 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — Events List */}
        <div>
          {/* Map events here later */}
          <p className="text-neutral-500">Events will appear here…</p>
        </div>
      </div>
    </div>
  );
}

export default UserEvents