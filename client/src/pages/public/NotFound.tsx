import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-accent">404</h1>
        </div>
        <h2 className="text-2xl font-bold mb-4">{t("notFound.title", "Page Not Found")}</h2>
        <p className="text-muted-foreground mb-8">
          {t("notFound.description", "Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.")}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button variant="premium">
              <Home className="mr-2 h-4 w-4" />
              {t("notFound.goHome", "Go Home")}
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("notFound.goBack", "Go Back")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
