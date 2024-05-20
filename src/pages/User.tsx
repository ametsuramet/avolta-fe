import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Role } from '@/model/role';
import { User } from '@/model/user';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { getRoles } from '@/repositories/role';
import { addUser, deleteUser, editUser, getUsers } from '@/repositories/user';
import { confirmDelete } from '@/utils/helper';
import { CheckBadgeIcon, EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Button, SelectPicker, Toggle } from 'rsuite';
import Swal from 'sweetalert2';

interface UserPageProps { }

const UserPage: FC<UserPageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [jobTitles, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [full_name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setAdmin] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [roleId, setRoleId] = useState("");

    useEffect(() => {
        getRoles({ page: 1, limit: 1000 })
            .then(v => v.json())
            .then(v => {
                setRoles(v.data)
            })
    }, []);

    useEffect(() => {
        getAllUsers()

    }, [page, limit, search]);

    const getAllUsers = async () => {
        setIsLoading(true)
        getUsers({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setUsers(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)
            if (selectedUser) {
                await editUser(selectedUser!.id, { full_name, email, is_admin: isAdmin, role_id: roleId })
            } else {
                await addUser({ full_name, email, is_admin: isAdmin , password, role_id: roleId})
            }
            getAllUsers()
            setSelectedUser(null)
            setName("")
            setEmail("")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_user'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Pengguna"}</h3>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Pengguna", "Email", "Admin", "Hak Akses", ""]} headerClasses={[]} datasets={jobTitles.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (jobTitles.indexOf(e) + 1) },
                            { data: e.full_name },
                            { data: e.email },
                            { data: e.is_admin && <CheckBadgeIcon className='w-4 text-green-400' /> },
                            { data: e.role_name },
                            {
                                data: <div className='flex cursor-pointer'>
                                    <EyeIcon onClick={() => {
                                        setSelectedUser(e)
                                        setName(e.full_name)
                                        setEmail(e.email)
                                        setRoleId(e.role_id)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deleteUser(e.id).then(v => getAllUsers())
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
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedUser ? "Edit Pengguna" : "Tambah Pengguna"}</h3>
                    <InlineForm title="Pengguna">
                        <input placeholder='Nama Lengkap' value={full_name} onChange={(el) => setName(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Email" style={{}}>
                        <input placeholder='ex: email@company.com ....' value={email} onChange={(el) => setEmail(el.target.value)} className="form-control" />
                    </InlineForm>
                    {!selectedUser &&
                        <InlineForm title="Password" style={{}}>
                            <input type='password' placeholder='* * * * * * * ' value={password} onChange={(el) => setPassword(el.target.value)} className="form-control" />
                        </InlineForm>
                    }
                    <InlineForm title="Admin">
                        <Toggle onChange={(checked) => {
                            setAdmin(checked)
                        }} checked={isAdmin} />
                    </InlineForm>
                    <InlineForm title="Hak Akses">
                        <SelectPicker placeholder="Hak Akses" searchable={false}
                            data={[
                                {value: "", label: "Pilih Hak Akses"},
                                ...roles.map(e => ({ value: e.id, label: e.name }))
                            ]} value={roleId} onSelect={(val) => setRoleId(val)} block />
                    </InlineForm>

                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedUser &&
                        <Button onClick={async () => {
                            setSelectedUser(null)
                            setName("")
                            setEmail("")
                        }}>
                            <XMarkIcon className='mr-2 w-5' /> Batal
                        </Button>
                    }
                </div>
            </div>
        </div>

    </DashboardLayout>);
}
export default UserPage;