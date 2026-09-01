"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  /** Section name shown in the fallback UI */
  section?: string;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

/**
 * Wraps a portfolio section so a runtime crash stays isolated.
 * The rest of the page renders normally; only this section shows a fallback.
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      void import("@sentry/nextjs").then((Sentry) => {
        Sentry.captureException(error, {
          extra: { section: this.props.section, componentStack: info.componentStack },
        });
      });
    }
    console.error(`[SectionErrorBoundary] ${this.props.section ?? "Unknown"}:`, error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-[200px] items-center justify-center px-6 py-14">
        <div className="flex max-w-sm flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">
              {this.props.section ? `${this.props.section} failed to load` : "Something went wrong"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              This section encountered an error. The rest of the page is unaffected.
            </p>
          </div>
          <button
            onClick={this.handleRetry}
            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
}
