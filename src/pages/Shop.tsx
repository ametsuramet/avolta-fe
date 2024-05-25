import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Shop } from '@/model/shop';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addShop, deleteShop, editShop, getShops } from '@/repositories/shop';
import { confirmDelete } from '@/utils/helper';
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdAddCircleOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import Swal from 'sweetalert2';

interface ShopPageProps { }

const ShopPage: FC<ShopPageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [jobTitles, setShops] = useState<Shop[]>([]);
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        getAllShops()

    }, [page, limit, search]);

    const getAllShops = async () => {
        setIsLoading(true)
        getShops({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setShops(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)
            if (selectedShop) {
                await editShop(selectedShop!.id, { name, description, code })
            } else {
                await addShop({ name, description, code })
            }
            getAllShops()
            setSelectedShop(null)
            setName("")
            setCode("")
            setDescription("")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_shop'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Toko"}</h3>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Nama Toko","Kode Toko", "Keterangan", ""]} headerClasses={[]} datasets={jobTitles.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (jobTitles.indexOf(e) + 1) },
                            { data: e.name },
                            { data: e.code },
                            { data: e.description },
                            {
                                data: <div className='flex cursor-pointer justify-end'>
                                    <EyeIcon onClick={() => {
                                        setSelectedShop(e)
                                        setName(e.name)
                                        setCode(e.code)
                                        setDescription(e.description)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deleteShop(e.id).then(v => getAllShops())
                                            })
                                        }}
                                    />
                                </div>
                            }
                        ]
                    }))} />
            </div>
            <div className='col-span-1'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedShop ? "Edit  Toko" : "Tambah  Toko"}</h3>
                    <InlineForm title="Nama Toko">
                        <input placeholder='ex: Toko Utama' value={name} onChange={(el) => setName(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Kode Toko">
                        <input placeholder='ex: TK-001' value={code} onChange={(el) => setCode(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Keterangan" style={{alignItems: 'start'}}>
                        <textarea placeholder='ex: Toko bandung selatan ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedShop &&
                        <Button onClick={async () => {
                            setSelectedShop(null)
                            setName("")
                            setDescription("")
                        }}>
                            <XMarkIcon className='mr-2 w-5' /> Batal
                        </Button>
                    }
                </div>
            </div>
        </div>

    </DashboardLayout>);
}
export default ShopPage;