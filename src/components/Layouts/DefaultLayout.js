"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";
import axios from "axios";
import Loader from "../common/Loader";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import { setUser } from "../../redux/actions/setUserAction";

const DefaultLayout = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { setUser } = props;
    const router = useRouter();

    useEffect(() => {
        (async () => {
            try {
                fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}admin`, {
                    method: "GET",
                    credentials: "include"
                }).then(response => response.json())
                  .then(data => console.log(data));
                
                const { data } = await axios.get('admin');

                if (data.is_user === true) {
                    router.push('/login');
                } else {
                    props.setUser({
                        id: data.id,
                        nama: data.nama,
                        profile_pic: data.profile_pic,
                        username: data.username,
                        email: data.email,
                        is_user: data.is_user
                    });
                }
            } catch (error) {
                if (error.response && [401, 403, 404].includes(error.response.status)) {
                    router.push('/login');
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [setUser, router]);

    if (loading) {
        return <Loader />; // Replace with your loading spinner or component
    }
    return (
        <>
            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex">
                {/* <!-- ===== Sidebar Start ===== --> */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* <!-- ===== Sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col lg:ml-72.5">
                    {/* <!-- ===== Header Start ===== --> */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    {/* <!-- ===== Header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                            {props.children}
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: (user) => dispatch(setUser(user))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);