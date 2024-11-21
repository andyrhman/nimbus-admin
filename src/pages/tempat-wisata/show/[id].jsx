import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { GoogleMap, Marker, LoadScript, StreetViewPanorama } from '@react-google-maps/api';
import Link from "next/link";
import axios from "axios";
import DefaultLayout from "../../../components/Layouts/DefaultLayout";
import Layout from '../../../components/Layout';
import SEO from "../../../components/SEO";
import Image from "next/image";
import * as sanitizeHtml from 'sanitize-html';
import 'react-toastify/dist/ReactToastify.css';

const ShowTempatWisata = () => {
    const [nama, setNama] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [alamat, setAlamat] = useState('');
    const [website, setWebsite] = useState('');
    const [google_link, setGoogleLink] = useState('');
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [review_total, setReviewTotal] = useState('');
    const [average_rating, setAverageRating] = useState('');
    const [provinsi_id, setProvinsiId] = useState('');
    const [categoryWisata_id, setCategoryWisataId] = useState('');

    const [showStreetView, setShowStreetView] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    // * Show data
    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [router, id]);

    const fetchData = async () => {
        try {
            const { data } = await axios.get(`admin/tempat-wisata/${id}`);
            setNama(data.nama);
            setDeskripsi(data.deskripsi);
            setThumbnail(data.thumbnail);
            setAlamat(data.alamat);
            setWebsite(data.website);
            setGoogleLink(data.google_link);
            setLongitude(parseFloat(data.longitude));
            setLatitude(parseFloat(data.latitude));
            setReviewTotal(data.review_total);
            setAverageRating(data.average_rating);
            setProvinsiId(data.provinsi.nama);
            setCategoryWisataId(data.categoryWisata.nama);

        } catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                router.push('/login');
            }
        }
    };

    const mapContainerStyle = {
        width: '100%',
        height: '400px',
    };

    const center = {
        lat: latitude || 0, // Default to 0, in case latitude is null
        lng: longitude || 0, // Default to 0, in case longitude is null
    };

    const handleToggleStreetView = () => {
        setShowStreetView((prev) => !prev);
    };

    const pageTitle = `${sanitizeHtml(nama)} | ${process.env.siteTitle}`;

    return (
        <Layout>
            <SEO title={pageTitle} />
            <DefaultLayout>
                <div className="mb-6 flex sm:flex-row sm:items-center">
                    <Link href="/tempat-wisata" className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                        <span>Kembali</span>
                    </Link>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-6">
                        <div className="rounded-sm bg-white">
                            <div className="flex flex-col gap-5.5 p-6.5">
                                <div className="relative flex justify-center items-center">
                                    <div className="relative flex items-center justify-center drop-shadow-2">
                                        <Image
                                            src={thumbnail}
                                            width={600}
                                            height={600}
                                            className="object-cover"
                                            alt={nama}
                                        />

                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Nama tempat wisata
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <h3 className="font-medium text-black dark:text-white">
                                            {nama}
                                        </h3>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Deskripsi
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <p className="font-medium text-black dark:text-white">
                                            {deskripsi}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Alamat
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <h3 className="font-medium text-black dark:text-white">
                                            {alamat}
                                        </h3>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Website
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <Link href={website} className="font-medium text-black dark:text-white">
                                            {website}
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Google Link
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <Link href={google_link} className="font-medium text-black dark:text-white">
                                            {google_link}
                                        </Link>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Longitude
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <h3 className="font-medium text-black dark:text-white">
                                            {longitude}
                                        </h3>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Latitude
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <h3 className="font-medium text-black dark:text-white">
                                            {latitude}
                                        </h3>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Review Total
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <h3 className="font-medium text-black dark:text-white">
                                            {review_total}
                                        </h3>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Average Rating
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <h3 className="font-medium text-black dark:text-white">
                                            {average_rating}
                                        </h3>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Provinsi
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <h3 className="font-medium text-black dark:text-white">
                                            {provinsi_id}
                                        </h3>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Category Wisata
                                    </label>
                                    <div className="w-full rounded border border-stroke bg-gray py-3 pl-2 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary">
                                        <h3 className="font-medium text-black dark:text-white">
                                            {categoryWisata_id}
                                        </h3>
                                    </div>
                                </div>
                                {latitude && longitude ? (
                                    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                                        <div style={{ marginBottom: '10px' }}>
                                            <button
                                                onClick={handleToggleStreetView}
                                                style={{
                                                    padding: '10px 20px',
                                                    backgroundColor: '#007BFF',
                                                    color: '#FFF',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {showStreetView ? 'Map View' : 'Street View'}
                                            </button>
                                        </div>

                                        <GoogleMap
                                            mapContainerStyle={mapContainerStyle}
                                            center={center}
                                            zoom={15}
                                        >
                                            {!showStreetView && <Marker position={center} />}
                                            {showStreetView && (
                                                <StreetViewPanorama
                                                    position={center}
                                                    visible={showStreetView}
                                                    options={{
                                                        enableCloseButton: false,
                                                        pov: {
                                                            heading: 100,
                                                            pitch: 0,
                                                        },
                                                    }}
                                                />
                                            )}
                                        </GoogleMap>
                                    </LoadScript>
                                ) : (
                                    <p>Loading map...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </Layout>
    );
};

export default ShowTempatWisata;