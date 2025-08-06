    import Link from "next/link";

    export function Footer() {
    return (
        <footer className="bg-muted py-8">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">CourierGH</h3>
                <p className="text-muted-foreground">
                Connecting you with reliable courier services across Ghana.
                </p>
            </div>
            <div>
                <h4 className="font-medium mb-4">Quick Links</h4>
                <ul className="space-y-2">
                <li><Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link></li>
                <li><Link href="/services" className="text-muted-foreground hover:text-foreground">Services</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-medium mb-4">For Couriers</h4>
                <ul className="space-y-2">
                <li><Link href="/register" className="text-muted-foreground hover:text-foreground">Register</Link></li>
                <li><Link href="/courier/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link></li>
                <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="font-medium mb-4">Contact Us</h4>
                <address className="not-italic text-muted-foreground">
                <p>123 Main Street, Accra</p>
                <p>Email: info@couriergh.com</p>
                <p>Phone: +233 50 123 4567</p>
                </address>
            </div>
            </div>
            <div className="border-t mt-8 pt-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} CourierGH. All rights reserved.</p>
            </div>
        </div>
        </footer>
    );
    }