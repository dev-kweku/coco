    "use client";

    import { Component, ReactNode } from "react";

    interface Props {
    children: ReactNode;
    }

    interface State {
    hasError: boolean;
    }

    export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
                We're sorry, but there was an error loading this page.
            </p>
            <button 
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded"
            >
                Try again
            </button>
            </div>
        );
        }

        return this.props.children;
    }
    }