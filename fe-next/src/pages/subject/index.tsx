import React, { FC, useEffect, useState } from "react";
import AuthenticatedLayout from "../../layouts/authenticatedLayout";
import Link from "next/link";
import { EditSvg, EyeSvg, TrashSvg } from "../../components/svgCompt";
import { LinkSuccess } from "../../components/buttonCompt";
import { ConfrimModalEl } from "@/components/OtherCompt";

interface DataApi {
    id: string;
    name: string;
    credits: string;
}

interface DataDialog {
    id: string;
    message: string;
    isLoading: boolean;
}
const index = () => {
    const [data, setData] = useState<DataApi[]>([]);

    const [dialog, setDialog] = useState<DataDialog>({
        id: "",
        message: "",
        isLoading: false,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        await fetch("http://localhost:8000/api/v1/subject", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: "include",
        })
            .then((res) => res.json())
            .then((res) => {
                // console.log(res);
                setData(res?.data?.subjects);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDialog = (message: string, isLoading: boolean, id: string) => {
        setDialog({
            message,
            isLoading,
            //Update
            id,
        });
    };

    const handleDelete = async (id: string, name: string) => {
        handleDialog(name, true, id);
    };

    const areUSureDelete = (choose: boolean) => {
        console.log(dialog?.id);
        if (choose) {
            fetch("http://localhost:8000/api/v1/subject/" + dialog?.id, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
            })
                .then((res) => res.json())
                .then((res) => {
                    fetchData();
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
            handleDialog("", false, "0");
        } else {
            handleDialog("", false, "0");
        }
    };

    return (
        <AuthenticatedLayout>
            {dialog.isLoading && <ConfrimModalEl onDialog={areUSureDelete} message={dialog.message} />}
            <div className="w-full bg-white rounded-md p-5">
                <div className="flex items-center justify-between mb-5">
                    <p>Data Subject</p>
                    <LinkSuccess icon="icc" title="Tambah Subject" href="/subject/create" />
                </div>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <span className="">Show</span>
                        <select name="" id="" className="border border-gray-200 mx-2">
                            <option value="">10</option>
                            <option value="">30</option>
                            <option value="">50</option>
                        </select>
                        <span className="">entries</span>
                    </div>

                    <div>
                        <span>Search: </span>
                        <input type="text" className="border border-gray-200" />
                    </div>
                </div>
                <table className="min-w-full border-collapse ">
                    <thead>
                        <tr className="border-b border-b-gray-300 h-[62px] px-[16px] py-[4px] font-medium">
                            <td>No</td>
                            <td>Nama</td>
                            <td>Credits</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((d, i) => (
                            <tr key={i} className="border-b border-b-gray-300 h-[62px] px-[16px] py-[4px]">
                                <td>{i + 1}</td>
                                <td>{d?.name}</td>
                                <td>{d?.credits}</td>
                                <td>
                                    <div className="flex items-center ">
                                        <Link
                                            href={{
                                                pathname: "/subject/edit",
                                                query: {
                                                    id: d?.id,
                                                    name: d?.name,
                                                    credits: d?.credits,
                                                },
                                            }}
                                            className="bg-ungu rounded-[4px] p-[8px] gap-[10px]  w-[30px] h-[30px] flex  items-center mr-2"
                                        >
                                            <EditSvg />
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(d?.id, d?.name)}
                                            className="bg-danger rounded-[4px] p-[8px] gap-[10px]  w-[30px] h-[30px] flex  items-center"
                                        >
                                            <TrashSvg />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex items-center justify-between py-5">
                    <p>Showing 1 to 2 of 2 entries</p>

                    <div>
                        <ul className="flex items-center justify-center">
                            <li>
                                <a href="">Previous</a>
                            </li>
                            <li>
                                <button className="bg-[#255188] w-[27px] h-[27px] flex items-center justify-center text-white rounded-[4px] px-[6px] py-[12px] mx-[4px]">
                                    1
                                </button>
                            </li>

                            <li>
                                <a href="">Next</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default index;
