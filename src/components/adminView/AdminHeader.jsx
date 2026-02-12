import React, { useState } from "react";
import { Button } from "../ui/button";
import { LogOut, Menu, UserRound } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../store/authSlice/authSlice";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const AdminHeader = ({ setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-16 bg-white border-b">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="lg:hidden"
      >
        <Menu />
      </Button>

      <div
        className="ml-auto relative"
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        {/* Avatar */}
        <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {user?.username?.[0]?.toUpperCase() || "A"}
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-3 bg-white rounded-md shadow-xl min-w-[200px] overflow-hidden border"
            >
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">
                  {user?.username || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || ""}
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/profile")}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition"
              >
                <UserRound className="w-4 h-4 mr-2" />
                Profile
              </button>

              <button
                onClick={() => dispatch(logoutUser())}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-blue-600 hover:text-white transition"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default AdminHeader;
