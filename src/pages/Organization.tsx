import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Organization } from '@/model/organization';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addOrganization, deleteOrganization, editOrganization, getOrganizations } from '@/repositories/organization';
import { confirmDelete } from '@/utils/helper';
import { SelectOption, TreeNode, colourStyles } from '@/utils/style';
import { EyeIcon, PencilIcon, PlusCircleIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Button, Tree, TreePicker } from 'rsuite';
import Swal from 'sweetalert2';
import Select, { SingleValue } from 'react-select';
import { toolTip } from '@/utils/helperUi';

interface OrganizationPageProps { }

const OrganizationPage: FC<OrganizationPageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selOrganizations, setSelOrganizations] = useState<Organization[]>([]);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [code, setCode] = useState("");
    const [selectedParentOrg, setSelectedParentOrg] = useState<string | number | undefined>();

    useEffect(() => {
        getAllOrganizations()

    }, [page, limit, search]);

    const getAllOrganizations = async () => {
        setIsLoading(true)
        getOrganizations({ page: 1, limit: 5 })
            .then(v => v.json())
            .then(v => {
                setSelOrganizations(v.data)
            })
        getOrganizations({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setOrganizations(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)

            if (selectedOrganization) {
                if (selectedParentOrg == selectedOrganization?.id && selectedOrganization?.id != "") {
                    throw Error("Induk Organisasi Tidak boleh sama")
                }
                await editOrganization(selectedOrganization!.id, { name, description, code, parent_id: selectedParentOrg ?? null })
            } else {
                await addOrganization({ name, description, code, parent_id: selectedParentOrg ?? null })
            }
            getAllOrganizations()
            setSelectedOrganization(null)
            setSelectedParentOrg("")
            setName("")
            setDescription("")
            setCode("")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }

    const mappingData = (items: Organization[]): TreeNode[] => {
        return items.map(item => ({
            value: item.id,
            label: item.name,
            data: item,
            children: mappingData(item.sub_organizations ?? [])
        }))
    }


    return (<DashboardLayout permission='read_organization'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Organisasi"}</h3>
                </div>
                <Tree
                    //     draggable
                    //   onDrop={({ createUpdateDataFunction }, event) => {
                    //       console.log(event.target)
                    //     console.log(createUpdateDataFunction(mappingData(organizations)))
                    //   }}
                    onSelectItem={(val) => {
                        const item = val.data as Organization
                        setSelectedOrganization(item)
                        setName(item.name)
                        setSelectedParentOrg(item.parent_id ?? "")
                        setDescription(item.description)
                        setCode(item.code)
                    }}
                    data={mappingData(organizations)}
                    showIndentLine
                    defaultExpandAll={true}
                    renderTreeNode={node => {
                        return (
                            <div className='flex justify-between'>
                                {node.label}  <div className='flex items-center'>
                                    {toolTip("Tambah Sub Org", <PlusCircleIcon
                                        className=" h-3 w-3 text-green-600 hover:text-green-800 ml-2"
                                        aria-hidden="true"
                                        onClick={() => {
                                            const item = node.data as Organization
                                            setSelectedOrganization(null)
                                            setSelectedParentOrg(item.id)
                                        }}
                                    />)}

                                    {toolTip("Hapus", <TrashIcon
                                        className=" h-3 w-3 text-red-400 hover:text-red-600 ml-2"
                                        aria-hidden="true"
                                        onClick={() => {
                                            const item = node.data as Organization
                                            confirmDelete(() => {
                                                deleteOrganization(item.id).then(v => getAllOrganizations())
                                            })
                                        }}
                                    />)}
                                </div>

                            </div>
                        );
                    }}
                />
                {/* <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Nama", "Kode", "Keterangan", ""]} headerClasses={[]} datasets={organizations.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (organizations.indexOf(e) + 1) },
                            { data: e.name },
                            { data: e.code },
                            { data: e.description },
                            {
                                data: <div className='flex cursor-pointer'>
                                    <EyeIcon onClick={() => {
                                        setSelectedOrganization(e)
                                        setName(e.name)
                                        setDescription(e.description)
                                        setCode(e.code)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deleteOrganization(e.id).then(v => getAllOrganizations())
                                            })
                                        }}
                                    />
                                </div>
                            }
                        ]
                    }))} /> */}
            </div>
            <div className='col-span-1'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedOrganization ? "Edit Organisasi" : `Tambah ${selectedParentOrg ? 'Sub' : ''} Organisasi`}</h3>
                    <InlineForm title="Organisasi">
                        <input placeholder='ex: Div Produksi' value={name} onChange={(el) => setName(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Induk Organisasi">
                        <TreePicker value={selectedParentOrg} onSelectItem={(val) => {
                            setSelectedParentOrg(val.value)

                        }} defaultExpandAll data={mappingData(organizations)} className='w-full' />
                        {/* <Select< SelectOption, false> styles={colourStyles}
                            options={[
                                { value: "", label: "Pilih Induk Perusahaan" },
                                ...selOrganizations.map(e => ({ value: e.id, label: e.name }))
                            ]}
                            value={selectedParentOrg}
                            onChange={(option: SingleValue<SelectOption>): void => {
                                setSelectedParentOrg(option!)
                            }}
                            onInputChange={(val) => {
                                getOrganizations({ page: 1, limit: 5, search: val })
                                    .then(v => v.json())
                                    .then(v => {
                                        setSelOrganizations(v.data)
                                    })
                            }}
                        /> */}
                    </InlineForm>
                    <InlineForm title="Kode Organisasi">
                        <input placeholder='ex: PROD' value={code} onChange={(el) => setCode(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Keterangan" style={{ alignItems: 'start' }}>
                        <textarea placeholder='ex: Manager produksi pabrik ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {(selectedOrganization || selectedParentOrg) &&
                        <Button onClick={async () => {
                            setSelectedOrganization(null)
                            setName("")
                            setDescription("")
                            setCode("")
                            setSelectedParentOrg("")
                        }}>
                            <XMarkIcon className='mr-2 w-5' /> Batal
                        </Button>
                    }
                </div>
            </div>
        </div>

    </DashboardLayout>);
}
export default OrganizationPage;

