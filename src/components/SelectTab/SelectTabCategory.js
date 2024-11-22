import React, { useState, useEffect } from 'react'
import axios from 'axios';

const SelectTabCategory = ({ onSelectCategoryWisata }) => {
    const [categoryWisata, setCategoryWisata] = useState([]);
    const [activeCategoryWisata, setActiveCategoryWisata] = useState('Pantai'); // Default active province

    useEffect(() => {

        (
            async () => {
                try {
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

    const handleClick = (provName) => {
        setActiveCategoryWisata(provName); // Set the active province
        onSelectCategoryWisata(provName); // Pass the selected province to the parent
    };

    return (
        <>
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                    {categoryWisata?.map((p) => (
                        <>
                            <li className="me-2">
                                <button
                                    onClick={() => handleClick(p.nama)}
                                    className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${activeCategoryWisata === p.nama
                                        ? 'text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                                        : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                        }`}
                                >
                                    {p.nama}
                                </button>
                            </li>
                        </>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default SelectTabCategory