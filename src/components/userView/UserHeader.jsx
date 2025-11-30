import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserNavItems } from "../../config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header
      className="sticky top-0 bg-white z-50 w-full border-b border-border/40
      shadow-sm"
    >
      {/* bg-background/70 backdrop-blur-xl */}
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/user/home" className="flex items-center space-x-3 group">
          <span
            className="text-2xl font-bold tracking-tight 
          text-foreground group-hover:text-primary transition-colors"
          >
            AlumniConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {UserNavItems.map((item) =>
            item.type === "link" ? (
              <Link
                key={item.id}
                to={item.path}
                className={`text-[1.05rem] font-medium px-2 py-1 rounded-md transition-all
                ${
                  pathname === item.path
                    ? "text-primary underline"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <DropdownMenu key={item.id}>
                <DropdownMenuTrigger className="flex items-center text-[1.05rem] font-medium gap-1 text-muted-foreground hover:text-primary transition">
                  {item.label} <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-48 bg-white shadow-xl  border rounded-xl">
                  {item.items.map((child, idx) => (
                    <DropdownMenuItem key={idx}>
                      <Link
                        to={child.path}
                        className="w-full px-2 py-1 text-sm "
                      >
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          )}

          <Button className="ml-4 bg-blue-600 hover:bg-blue-800 cursor-pointer text-white px-6 py-2 rounded-lg shadow">
            Login
          </Button>
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="pt-10 space-y-3">
            {/* Mobile Nav */}
            {UserNavItems.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.id}
                  to={item.path}
                  className="block text-lg px-4 py-3 rounded-lg hover:bg-muted/40"
                >
                  {item.label}
                </Link>
              ) : (
                <div key={item.id} className="px-4">
                  <p className="font-semibold text-lg mb-2">{item.label}</p>
                  {item.items.map((child, idx) => (
                    <Link
                      key={idx}
                      to={child.path}
                      className="block text-[1rem] ml-3 py-2 text-muted-foreground hover:text-primary"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )
            )}

            <Button className="w-full py-5 bg-primary text-white rounded-xl">
              Login
            </Button>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
