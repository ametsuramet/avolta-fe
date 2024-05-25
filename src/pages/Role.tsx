import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Permissions } from '@/model/permission';
import { Role } from '@/model/role';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { getPermissions } from '@/repositories/permissions';
import { addRole, deleteRole, editRole, getRoles } from '@/repositories/role';
import { confirmDelete, groupedPermissions, titleCase } from '@/utils/helper';
import { CheckBadgeIcon, EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsCheck2Circle, BsCheckAll, BsFloppy2 } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, Toggle } from 'rsuite';
import Swal from 'sweetalert2';

interface RolePageProps { }

const RolePage: FC<RolePageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [leaveCategories, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [allPermissions, setAllPermissions] = useState<Permissions[]>([]);
    const [groupeds, setGroupeds] = useState<Record<string, Permissions[]> | null>(null);

    useEffect(() => {
        getPermissions({ page: 1, limit: 1000 })
            .then(v => v.json())
            .then(v => {
                setAllPermissions(v.data)
            })
    }, []);

    useEffect(() => {
        const grouped = groupedPermissions(allPermissions)
        // console.log(grouped)
        setGroupeds(grouped)
    }, [allPermissions]);

    useEffect(() => {
        getAllRoles()
    }, [page, limit, search]);



    const getAllRoles = async () => {
        setIsLoading(true)
        getRoles({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setRoles(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)
            if (selectedRole) {
                await editRole(selectedRole!.id, { name, description, is_super_admin: isSuperAdmin, permissions: isSuperAdmin ? [] : permissions })
            } else {
                await addRole({ name, description, is_super_admin: isSuperAdmin, permissions: isSuperAdmin ? [] : permissions })
            }
            getAllRoles()
            setSelectedRole(null)
            setName("")
            setDescription("")
            setIsSuperAdmin(false)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_role'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Hak Akses"}</h3>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Hak Akses", "Keterangan", "Akses", ""]} headerClasses={[]} datasets={leaveCategories.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (leaveCategories.indexOf(e) + 1) },
                            { data: e.name },
                            { data: e.description },
                            { data: e.is_super_admin ? "Semua Akses" : `${e.permissions.length} akses` },
                            {
                                data: !e.is_super_admin && <div className='flex cursor-pointer'>
                                    <EyeIcon onClick={() => {
                                        setSelectedRole(e)
                                        setName(e.name)
                                        setDescription(e.description)
                                        setIsSuperAdmin(e.is_super_admin)
                                        setPermissions(e.permissions)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deleteRole(e.id).then(v => getAllRoles())
                                            })
                                        }}
                                    />
                                </div>
                            }
                        ]
                    }))} />
            </div>
            <div className='col-span-1'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-4'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedRole ? "Edit Hak Akses" : "Tambah Hak Akses"}</h3>
                    <InlineForm title="Hak Akses">
                        <input placeholder='ex: Manager Produksi' value={name} onChange={(el) => setName(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Super Admin">
                        <Toggle onChange={(checked) => {
                            setIsSuperAdmin(checked)
                        }} checked={isSuperAdmin} />
                    </InlineForm>
                    <InlineForm title="Keterangan" style={{ alignItems: 'start' }}>
                        <textarea placeholder='ex: Manager produksi pabrik ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedRole &&
                        <Button onClick={async () => {
                            setSelectedRole(null)
                            setName("")
                            setDescription("")
                        }}>
                            <XMarkIcon className='mr-2 w-5' /> Batal
                        </Button>
                    }
                </div>
                {!isSuperAdmin && selectedRole && groupeds &&
                    <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                        <h3 className='font-bold mb-4 text-black text-lg'>Akses</h3>
                        {Object.keys(groupeds).map(e => (<div className=' mb-4' key={e}>
                            <div className='justify-between flex'>
                                <h3 className='font-bold'>{titleCase(e)}</h3>
                                <div className='flex items-center'>
                                    <BsCheck2Circle onClick={() => {
                                        setPermissions([...permissions, ...groupeds[e].map(p => p.key)])
                                    }} className=' cursor-pointer hover:text-blue-400' />
                                    <XMarkIcon onClick={() => {
                                        setPermissions([...permissions.filter(p => !groupeds[e].map(g => g.key).includes(p))])
                                    }} className=' w-4 ml-1 cursor-pointer hover:text-red-400' />
                                </div>
                            </div>
                            <ul>
                                {groupeds[e].map(permission =>
                                    <li key={permission.key}>
                                        <Checkbox onChange={(val, checked, _) => {
                                            if (checked) {
                                                setPermissions([...permissions, permission.key])
                                            } else {
                                                setPermissions([...permissions.filter(p => p != permission.key)])
                                            }
                                        }} checked={permissions.includes(permission.key)} /> {permission.name}
                                    </li>
                                )}

                            </ul>
                        </div>))}

                        <Button className='mr-2 mt-4' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    </div>
                }

            </div>
        </div>

    </DashboardLayout>);
}
export default RolePage;