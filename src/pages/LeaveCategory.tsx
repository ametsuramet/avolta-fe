import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { LeaveCategory } from '@/model/leave_category';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addLeaveCategory, deleteLeaveCategory, editLeaveCategory, getLeaveCategories } from '@/repositories/leave_category';
import { confirmDelete } from '@/utils/helper';
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdAddCircleOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import Swal from 'sweetalert2';

interface LeaveCategoryPageProps { }

const LeaveCategoryPage: FC<LeaveCategoryPageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [leaveCategories, setLeaveCategories] = useState<LeaveCategory[]>([]);
    const [selectedLeaveCategory, setSelectedLeaveCategory] = useState<LeaveCategory | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        getAllLeaveCategories()

    }, [page, limit, search]);

    const getAllLeaveCategories = async () => {
        setIsLoading(true)
        getLeaveCategories({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setLeaveCategories(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)
            if (selectedLeaveCategory) {
                await editLeaveCategory(selectedLeaveCategory!.id, { name, description })
            } else {
                await addLeaveCategory({ name, description })
            }
            getAllLeaveCategories()
            setSelectedLeaveCategory(null)
            setName("")
            setDescription("")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_leave_category'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Kategori Cuti"}</h3>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Kategori Cuti", "Keterangan", ""]} headerClasses={[]} datasets={leaveCategories.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (leaveCategories.indexOf(e) + 1) },
                            { data: e.name },
                            { data: e.description },
                            {
                                data: <div className='flex cursor-pointer'>
                                    <EyeIcon onClick={() => {
                                        setSelectedLeaveCategory(e)
                                        setName(e.name)
                                        setDescription(e.description)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deleteLeaveCategory(e.id).then(v => getAllLeaveCategories())
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
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedLeaveCategory ? "Edit Kategori Cuti" : "Tambah Kategori Cuti"}</h3>
                    <InlineForm title="Kategori Cuti">
                        <input placeholder='ex: Manager Produksi' value={name} onChange={(el) => setName(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Keterangan" style={{alignItems: 'start'}}>
                        <textarea placeholder='ex: Manager produksi pabrik ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedLeaveCategory &&
                        <Button onClick={async () => {
                            setSelectedLeaveCategory(null)
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
export default LeaveCategoryPage;