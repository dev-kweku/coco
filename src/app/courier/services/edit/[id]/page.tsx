    import { ServiceForm } from "@/components/courier/service-form";
    import { notFound } from "next/navigation";
    import { getService } from "@/lib/services";
    import { ObjectId } from "mongodb";

    interface EditServicePageProps {
    params: {
        id: string;
    };
    }

    export default async function EditServicePage({ params }: EditServicePageProps) {
    // Validate the ID format
    if (!ObjectId.isValid(params.id)) {
        notFound();
    }

    const service = await getService(params.id);

    if (!service) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
            <h1 className="text-3xl font-bold">Edit Service</h1>
            <p className="text-muted-foreground">
                Update your service information
            </p>
            </div>
            <ServiceForm service={service} />
        </div>
        </div>
    );
    }