import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand/BrandMark";
import { DiamondMark } from "@/components/marketing";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <DiamondMark className="absolute -right-32 bottom-[-160px] h-[600px] w-[600px] text-primary/[0.04] dark:text-white/[0.03]" />
      <header className="container flex h-16 items-center">
        <BrandMark />
      </header>

      <main className="container relative flex flex-1 items-center py-16">
        <div className="max-w-2xl">
          <p className="eyebrow">Error 404</p>
          <h1 className="mt-5 font-display text-[64px] font-extrabold uppercase leading-[0.9] sm:text-8xl">
            {t("notFound.title", "Page Not Found")}
          </h1>

          <div className="mt-8 flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="diamond bg-primary dark:bg-accent" aria-hidden="true" />
            <span className="truncate">{location.pathname}</span>
            <span className="h-0 w-16 shrink-0 border-t-2 border-dashed border-border-strong sm:w-28" aria-hidden="true" />
            <span className="diamond border-2 border-border-strong" aria-hidden="true" />
            <span>?</span>
          </div>

          <p className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t(
              "notFound.description",
              "Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.",
            )}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/">
                <Home />
                {t("notFound.goHome", "Go Home")}
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.history.back()}>
              <ArrowLeft />
              {t("notFound.goBack", "Go Back")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
