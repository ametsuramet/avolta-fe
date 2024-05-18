import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { JobTitle } from '@/model/job_title';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addJobTitle, deletetJobTitle, editJobTitle, getJobTitles } from '@/repositories/job_title';
import { confirmDelete } from '@/utils/helper';
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdAddCircleOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import Swal from 'sweetalert2';

interface JobTitlePageProps { }

const JobTitlePage: FC<JobTitlePageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState<JobTitle | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        getAllJobTitles()

    }, [page, limit, search]);

    const getAllJobTitles = async () => {
        setIsLoading(true)
        getJobTitles({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setJobTitles(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(false)
            if (selectedJobTitle) {
                await editJobTitle(selectedJobTitle!.id, { name, description })
            } else {
                await addJobTitle({ name, description })
            }
            getAllJobTitles()
            setSelectedJobTitle(null)
            setName("")
            setDescription("")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_job_title'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Jabatan / Posisi"}</h3>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Jabatan / Posisi", "Keterangan", ""]} headerClasses={[]} datasets={jobTitles.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (jobTitles.indexOf(e) + 1) },
                            { data: e.name },
                            { data: e.description },
                            {
                                data: <div className='flex cursor-pointer'>
                                    <EyeIcon onClick={() => {
                                        setSelectedJobTitle(e)
                                        setName(e.name)
                                        setDescription(e.description)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deletetJobTitle(e.id).then(v => getAllJobTitles())
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
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedJobTitle ? "Edit Jabatan / Posisi" : "Tambah Jabatan / Posisi"}</h3>
                    <InlineForm title="Jabatan / Posisi">
                        <input placeholder='ex: Manager Produksi' value={name} onChange={(el) => setName(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Keterangan" style={{alignItems: 'start'}}>
                        <textarea placeholder='ex: Manager produksi pabrik ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedJobTitle &&
                        <Button onClick={async () => {
                            setSelectedJobTitle(null)
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
export default JobTitlePage;