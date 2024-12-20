import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import DefaultLayout from '../../components/Layouts/DefaultLayout';
import UpdateError from '../../components/Alerts/UpdateError';
import ButtonSpinner from '../../components/common/ButtonSpinner';
import Link from 'next/link';
import Image from 'next/image.js';
import { useRouter } from 'next/router';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateTempatWisata = () => {
    const [nama, setNama] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [thumbnail, setThumbnail] = useState('https://storage.googleapis.com/nimbus-storage/tempat_wisata_thumbnails/d1b32fb1-1443-4bf9-99ca-f563aa0db19e_FRdq8ZbPetwNDRV9R3hYpP.jpg');
    const [alamat, setAlamat] = useState('');
    const [website, setWebsite] = useState('');
    const [google_link, setGoogleLink] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [review_total, setReviewTotal] = useState('');
    const [average_rating, setAverageRating] = useState('');
    const [provinsi_id, setProvinsiId] = useState('');
    const [categoryWisata_id, setCategoryWisataId] = useState('');

    const [provinsi, setProvinsi] = useState([]);
    const [categoryWisata, setCategoryWisata] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setThumbnail(file);
        }
    };

    useEffect(() => {

        (
            async () => {
                try {
                    const { data: prov } = await axios.get('user/provinsi');
                    setProvinsi(prov);

                    const { data: cw } = await axios.get('user/category-wisata');
                    setCategoryWisata(cw);
                } catch (error) {
                    if (error.response && [401, 403].includes(error.response.status)) {
                        router.push('/login');
                    }
                }
            }
        )()

    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append("nama", nama);
            formData.append("thumbnail", thumbnail);
            formData.append("deskripsi", deskripsi);
            formData.append("alamat", alamat);
            formData.append("website", website);
            formData.append("google_link", google_link);
            formData.append("longitude", longitude);
            formData.append("latitude", latitude);
            formData.append("review_total", review_total);
            formData.append("average_rating", average_rating);
            formData.append("provinsi_id", provinsi_id);
            formData.append("categoryWisata_id", categoryWisata_id);

            const { data } = await axios.post('admin/tempat-wisata', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (data) {
                toast.success('Tempat Wisata berhasil dibuat!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide
                });
                router.push('/tempat-wisata')
            } else {
                setError('Terjadi kesalahan, mohon ulang lagi sebentar.');
            }
        } catch (error) {
            console.error(error.response);
            if (error.response && error.response.data && error.response.data.message) {
                const errorMessage = error.response.data.message;
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }
    const pageTitle = `Tambah Tempat Wisata | ${process.env.siteTitle}`;
    return (
        <Layout>
            <SEO title={pageTitle} />
            <DefaultLayout>
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/tempat-wisata" className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                        <span>Kembali</span>
                    </Link>
                    <h2 className="text-title-md2 font-semibold text-black dark:text-white">
                        Tambah Tempat Wisata
                    </h2>
                </div>
                <div className="flex flex-col gap-10">
                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-16 dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-20">
                        <div className="rounded-sm bg-white">
                            <div className="flex flex-col gap-5.5 p-6.5">
                                <form onSubmit={submit}>
                                    <div className="relative flex justify-center items-center">
                                        <div className="relative flex items-center justify-center drop-shadow-2">
                                            {thumbnail &&
                                                (
                                                    <Image
                                                        src={thumbnail instanceof File ? URL.createObjectURL(thumbnail) : thumbnail}
                                                        width={500}
                                                        height={500}
                                                        className="object-cover"
                                                        alt="Logo"
                                                    />
                                                )
                                            }
                                            <label
                                                htmlFor="profile"
                                                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                                            >
                                                <svg
                                                    className="fill-current"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 14 14"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                                                        fill=""
                                                    />
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z"
                                                        fill=""
                                                    />
                                                </svg>
                                                <input
                                                    id="profile"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <UpdateError error={error} />
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Nama
                                        </label>
                                        <input
                                            onChange={(e) => setNama(e.target.value)}
                                            placeholder='Masukkan Nama Tempat Wisata'
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Deskripsi
                                        </label>
                                        <textarea
                                            className="w-full rounded border border-stroke bg-gray py-3 pl-6 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            name="deskripsi"
                                            id="deskripsi"
                                            rows={6}
                                            placeholder="Masukkan deskripsi tempat wisata di sini"
                                            onChange={(e) => setDeskripsi(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Alamat
                                        </label>
                                        <input
                                            onChange={(e) => setAlamat(e.target.value)}
                                            placeholder='Masukkan Alamat'
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Website
                                        </label>
                                        <input
                                            onChange={(e) => setWebsite(e.target.value)}
                                            placeholder='Masukkan Website'
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Google Link
                                        </label>
                                        <input
                                            onChange={(e) => setGoogleLink(e.target.value)}
                                            placeholder='Masukkan Google Link'
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Longitude
                                        </label>
                                        <input
                                            onChange={(e) => setLongitude(e.target.value)}
                                            placeholder='Masukkan Longitude'
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Latitude
                                        </label>
                                        <input
                                            onChange={(e) => setLatitude(e.target.value)}
                                            placeholder='Masukkan Latitude'
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Review Total
                                        </label>
                                        <input
                                            onChange={(e) => setReviewTotal(e.target.value)}
                                            placeholder='Masukkan Review Total'
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Average Rating
                                        </label>
                                        <input
                                            onChange={(e) => setAverageRating(e.target.value)}
                                            placeholder='Masukkan Average Rating'
                                            type="text"
                                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Provinsi
                                        </label>

                                        <div className="relative z-20 bg-white dark:bg-form-input">
                                            <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                                                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                                                </svg>
                                            </span>

                                            <select
                                                onChange={(e) => setProvinsiId(e.target.value)}
                                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black"
                                                value={`${provinsi_id}`}
                                            >
                                                <option value="">Pilih Provinsi</option>
                                                {provinsi.map((p) => (
                                                    <option key={p.id} value={p.id} className="text-body dark:text-bodydark">
                                                        {p.nama}
                                                    </option>
                                                ))}
                                            </select>

                                            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g opacity="0.8">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                            fill="#637381"
                                                        ></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Category Wisata
                                        </label>

                                        <div className="relative z-20 bg-white dark:bg-form-input">
                                            <span className="absolute left-4 top-1/2 z-30 -translate-y-1/2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tags" viewBox="0 0 16 16">
                                                    <path d="M3 2v4.586l7 7L14.586 9l-7-7zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586z" />
                                                    <path d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1m0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1z" />
                                                </svg>
                                            </span>

                                            <select
                                                onChange={(e) => setCategoryWisataId(e.target.value)}
                                                className="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input text-black"
                                                value={`${categoryWisata_id}`}
                                            >
                                                <option value="">Pilih Category Wisata</option>
                                                {categoryWisata.map((c) => (
                                                    <option key={c.id} value={c.id} className="text-body dark:text-bodydark">
                                                        {c.nama}
                                                    </option>
                                                ))}
                                            </select>

                                            <span className="absolute right-4 top-1/2 z-10 -translate-y-1/2">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <g opacity="0.8">
                                                        <path
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                                            fill="#637381"
                                                        ></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <br />
                                    <button
                                        type='submit'
                                        className="inline-flex items-center justify-center rounded-md bg-primary px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 w-full lg:w-full xl:w-full"
                                    >
                                        {loading ? <ButtonSpinner /> : "Terapkan"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </Layout>
    );
};

export default CreateTempatWisata;