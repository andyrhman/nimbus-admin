import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumbs";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import Layout from '../../components/Layout';
import SEO from "../../components/SEO";
import TablePagination from '@mui/material/TablePagination';
import DeleteNotification from "../../components/Modals/Delete";
import Image from "next/image";
import Link from "next/link.js";
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Provinsi = () => {
    const pageTitle = `Provinsi | ${process.env.siteTitle}`;
    const [provinsi, setProvinsi] = useState([]);

    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [loading, setLoading] = useState(false);
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
        (
            async () => {
                try {
                    const { data } = await axios.get('user/provinsi');
                    setProvinsi(data);
                    setPage(0);
                } catch (error) {
                    if (error.response && [401, 403].includes(error.response.status)) {
                        router.push('/login');
                    }
                }

            }
        )();
    }, [router])

    const [provinsiId, setProvinsiId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const handleOpenDialog = () => setOpenDialog(!openDialog);

    const handleConfirmDelete = async () => {
        setLoading(true);

        try {
            await axios.delete(`admin/provinsi/${provinsiId}`);
            setProvinsi(provinsi.filter((p) => p.id !== provinsiId));
            handleOpenDialog();
            sessionStorage.setItem('deleteSuccess', '1');
            window.location.reload();
        } catch (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                router.push('/provinsi');
            }
        } finally {
            setLoading(false);
        }
    };

    const del = (id) => {
        setProvinsiId(id);
        handleOpenDialog();
    };

    return (
        <Layout>
            <SEO title={pageTitle} />
            <DefaultLayout>
                <Breadcrumb pageName="Provinsi" />
                <DeleteNotification open={openDialog} handleOpenDelete={handleOpenDialog} handleConfirmDelete={handleConfirmDelete} loading={loading}/>
                <div className="flex flex-col gap-10">
                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                        <div className="flex items-center justify-between mb-3">
                            <Link href={'/provinsi/create'} className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-2 xl:px-2">
                                Tambah Provinsi
                            </Link>
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            {provinsi.length > 0 ? (
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                            <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                                Thumbnail
                                            </th>
                                            <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                                Nama
                                            </th>
                                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {provinsi.slice(page * perPage, (page + 1) * perPage).map((prov, index) => (
                                            <tr key={index}>
                                                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                    <Image
                                                        src={prov.thumbnail}
                                                        width={50}
                                                        height={50}
                                                        className="rounded-full max-w-full h-auto"
                                                        style={{
                                                            width: "auto",
                                                            height: "auto",
                                                        }}
                                                        alt={prov.nama}
                                                    />
                                                </td>
                                                <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                                    <h5 className="font-medium text-black dark:text-white">
                                                        {prov.nama}
                                                    </h5>
                                                </td>
                                                <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                                    <div className="flex items-center space-x-3.5">
                                                        <Link href={`/provinsi/edit/${prov.id}`} className="hover:text-primary">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 17 17">
                                                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                            </svg>
                                                        </Link>
                                                        <button className="hover:text-primary" onClick={() => del(prov.id)}>
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
                                            <TablePagination
                                                count={provinsi.length}
                                                page={page}
                                                onPageChange={(e, newPage) => setPage(newPage)}
                                                rowsPerPage={perPage}
                                                rowsPerPageOptions={[10, 25, 50, 100]}
                                                onRowsPerPageChange={(e) => setPerPage(parseInt(e.target.value))}
                                            />
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

export default Provinsi;