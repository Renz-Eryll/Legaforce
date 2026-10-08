import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

const CHUNK_RELOAD_KEY = "chunk_reload_attempted";

// After a new deploy, old hashed chunks no longer exist and lazy() imports fail
const isChunkLoadError = (error: Error) =>
  error.name === "ChunkLoadError" ||
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(
    error.message,
  );

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Reload once to pick up the new deploy; the flag prevents a reload loop
    if (isChunkLoadError(error) && !sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
      sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
      window.location.reload();
      return;
    }
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  componentDidMount() {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="max-w-md text-muted-foreground">
          An unexpected error occurred. Please reload the page — if the problem continues, contact support.
        </p>
        <Button onClick={() => window.location.reload()}>Reload page</Button>
      </div>
    );
  }
}
