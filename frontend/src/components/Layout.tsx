import { Link } from "react-router-dom";
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
        <span className="layout__badge">NCAA Softball</span>
      </header>
      <main className="layout__main">{children}</main>
    </div>
  );
}
