import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumbs";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import Layout from '../../components/Layout';
import SEO from "../../components/SEO";
import DeleteNotification from "../../components/Modals/Delete";
import Image from "next/image";
import Link from "next/link.js";
import SelectTabCategory from "@/components/SelectTab/SelectTabCategory.js";
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TempatWisataProvinsi = () => {
    const pageTitle = `Tempat Wisata | ${process.env.siteTitle}`;
    const [tempatWisata, setTempatWisata] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [selectedCategoryWisata, setSelectedCategoryWisata] = useState('Pantai');
    const router = useRouter();

    useEffect(() => {
        const deleteSuccess = sessionStorage.getItem('deleteSuccess');
        if (deleteSuccess === '1') {
            toast.success('Berhasil Dihapus!', {
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
            sessionStorage.removeItem('deleteSuccess');
        }
    }, []);

    useEffect(() => {
        const fetchTempatWisata = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data } = await axios.get(`user/tempat-wisata/category/${selectedCategoryWisata}`, {
                    params: { search: searchTerm, page },
                });

                setTempatWisata(data.data);
                setHasMore(data.data.length === 10);
            } catch (err) {
                if (err.response && [401, 403].includes(err.response.status)) {
                    router.push('/login');
                } else {
                    setError('Failed to fetch data. Please try again.');
                    console.log(err)
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTempatWisata();
    }, [searchTerm, page, router, selectedCategoryWisata]);

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const [tempatWisataId, setTempatWisataId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => setOpenDialog(!openDialog);

    const handleConfirmDelete = async () => {
        setLoading(true);

        try {
            await axios.delete(`admin/tempat-wisata/${tempatWisataId}`);
            setTempatWisata(tempatWisata.filter((tw) => tw.id !== tempatWisataId));
            handleOpenDialog();
            sessionStorage.setItem('deleteSuccess', '1');
            window.location.reload();
        } catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                router.push('/tempat-wisata');
            }
        } finally {
            setLoading(false);
        }
    };

    const del = (id) => {
        setTempatWisataId(id);
        handleOpenDialog();
    };

    return (
        <Layout>
            <SEO title={pageTitle} />
            <DefaultLayout>
                <Breadcrumb pageName="Tempat Wisata" />

                <SelectTabCategory onSelectCategoryWisata={setSelectedCategoryWisata} />

                <DeleteNotification open={openDialog} handleOpenDelete={handleOpenDialog} handleConfirmDelete={handleConfirmDelete} loading={loading} />
                <div className="flex flex-col gap-10">
                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                        <div className="flex items-center justify-between mb-3">
                            <input
                                type="text"
                                placeholder="Cari Tempat Wisata"
                                className="rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <Link href={'/tempat-wisata/create'} className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-2 xl:px-2">
                                Tambah Tempat Wisata
                            </Link>
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            {loading ? (
                                <div>Loading...</div>
                            ) : error ? (
                                <div>{error}</div>
                            ) : tempatWisata.length > 0 ? (
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                            <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                                Thumbnail
                                            </th>
                                            <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                                Nama
                                            </th>
                                            <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                                Average Rating
                                            </th>
                                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tempatWisata.map((tw, index) => (
                                            <tr key={index}>
                                                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                    <Image
                                                        src={tw.thumbnail}
                                                        width={50}
                                                        height={50}
                                                        style={{
                                                            width: "auto",
                                                            height: "auto",
                                                        }}
                                                        alt={tw.nama}
                                                    />
                                                </td>
                                                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-medium text-black dark:text-white">
                                                        {tw.nama}
                                                    </h5>
                                                </td>
                                                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-medium text-black dark:text-white flex items-center gap-2">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            fill="#FFC107"
                                                            className="bi bi-star-fill"
                                                            viewBox="0 0 16 16"
                                                        >
                                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                                        </svg>
                                                        {tw.average_rating} &nbsp;
                                                        {`(${tw.review_total})`}
                                                    </h5>
                                                </td>
                                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                    <div className="flex items-center space-x-3.5">
                                                        <Link href={`/tempat-wisata/show/${tw.id}`} className="hover:text-primary">
                                                            <svg
                                                                className="fill-current"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 18 18"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                                                    fill=""
                                                                />
                                                                <path
                                                                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                                                    fill=""
                                                                />
                                                            </svg>
                                                        </Link>
                                                        <Link href={`/tempat-wisata/edit/${tw.id}`} className="hover:text-primary">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 17 17">
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                            </svg>
                                                        </Link>
                                                        <button className="hover:text-primary" onClick={() => del(tw.id)}>
                                                            <svg
                                                                className="fill-current"
                                                                width="18"
                                                                height="18"
                                                                viewBox="0 0 18 18"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                                                    fill=""
                                                                />
                                                                <path
                                                                    d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                                                    fill=""
                                                                />
                                                                <path
                                                                    d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                                                    fill=""
                                                                />
                                                                <path
                                                                    d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                                                                    fill=""
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan="100%">
                                                <div className="flex justify-between items-center mt-4">
                                                    <button
                                                        disabled={page === 1}
                                                        onClick={() => handlePageChange(page - 1)}
                                                        className={`px-4 py-2 text-white rounded ${page === 1 ? 'bg-graydark cursor-not-allowed' : 'bg-primary hover:bg-primary'
                                                            }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
                                                        </svg>
                                                    </button>

                                                    <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                                        {page}
                                                    </span>

                                                    <button
                                                        disabled={!hasMore}
                                                        onClick={() => handlePageChange(page + 1)}
                                                        className={`px-4 py-2 text-white rounded ${!hasMore ? 'bg-graydark cursor-not-allowed' : 'bg-primary hover:bg-primary'
                                                            }`}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tfoot>

                                </table>
                            ) : (
                                <div className='flex flex-col justify-center items-center text-center py-10'>
                                    <Image src="/not-found.png" alt="Not Found" width={120} height={120} priority />
                                    <h4>Data Tidak Ditemukan</h4>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </Layout >
    );
};

export default TempatWisataProvinsi;