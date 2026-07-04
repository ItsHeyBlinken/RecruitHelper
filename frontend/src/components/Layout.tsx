import { Link, NavLink } from "react-router-dom";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout">
      <div className="layout__bg" aria-hidden="true" />
      <header className="layout__header">
        <Link to="/" className="layout__brand">
          <span className="layout__logo" aria-hidden="true">
            RC
          </span>
          <span className="layout__name">RecruitConnect</span>
        </Link>
        <nav className="layout__nav" aria-label="Main">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "layout__nav-link layout__nav-link--active" : "layout__nav-link"
            }
          >
            Schools
          </NavLink>
          <NavLink
            to="/templates"
            className={({ isActive }) =>
              isActive ? "layout__nav-link layout__nav-link--active" : "layout__nav-link"
            }
          >
            Templates
          </NavLink>
        </nav>
      </header>
      <main className="layout__main">{children}</main>
    </div>
  );
}
