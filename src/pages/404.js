import Link from "next/link.js";
import SEO from "@/components/SEO.js";
export default function Custom404() {
    const pageTitle = `404 Not Found | ${process.env.siteTitle}`;

    return (
        <>
            <SEO title={pageTitle} />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
                <h1 className="text-6xl font-bold text-red-600">404</h1>
                <p className="text-xl mt-4">Oops! Page Not Found</p>
                <p className="mt-2 text-gray-600">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                    Go Back to Home
                </Link>
            </div>
        </>
    );
}
