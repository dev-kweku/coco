    import { ServiceForm } from "@/components/courier/service-form";

    export default function NewServicePage() {
    return (
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
            <h1 className="text-3xl font-bold">Create New Service</h1>
            <p className="text-muted-foreground">
                Add a new delivery service to your profile
            </p>
            </div>
            <ServiceForm />
        </div>
        </div>
    );
    }