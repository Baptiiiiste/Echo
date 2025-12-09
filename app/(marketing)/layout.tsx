import { NavBar } from "@/components/shared/layout/navbar";
import { SiteFooter } from "@/components/shared/layout/site-footer";
import { NavMobile } from "@/components/shared/layout/mobile-nav";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavMobile />
      <NavBar scroll={true} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
