import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-background to-muted/30  border-t border-border/50">
      <div className="container px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg group-hover:shadow-lg transition-shadow duration-300">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">
                AlumniConnect
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting alumni worldwide, fostering meaningful relationships,
              and building a stronger community for generations to come.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/directory"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300"
                >
                  Alumni Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/news"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300"
                >
                  News
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300"
                >
                  Career Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300"
                >
                  Mentorship Program
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors inline-block hover:translate-x-1 duration-300"
                >
                  Give Back
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2 group">
                <Mail className="h-4 w-4 text-secondary group-hover:scale-110 transition-transform" />
                <span>alumni@university.edu</span>
              </li>
              <li className="flex items-center gap-2 group">
                <Phone className="h-4 w-4 text-secondary group-hover:scale-110 transition-transform" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2 group">
                <MapPin className="h-4 w-4 text-secondary mt-0.5 group-hover:scale-110 transition-transform" />
                <span>
                  123 University Ave
                  <br />
                  City, State 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AlumniConnect. All rights
              reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-secondary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-secondary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
