import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { IncentiveSetting } from '@/model/incentive_setting';
import { ProductCategory } from '@/model/product_category';
import { Shop } from '@/model/shop';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addIncentiveSetting, deleteIncentiveSetting, editIncentiveSetting, getIncentiveSettings } from '@/repositories/incentive_setting';
import { getProductCategories } from '@/repositories/product_category';
import { getShopDetail, getShops } from '@/repositories/shop';
import { TOKEN } from '@/utils/constant';
import { asyncLocalStorage, confirmDelete, money } from '@/utils/helper';
import { successToast } from '@/utils/helperUi';
import { EyeIcon, FunnelIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import saveAs from 'file-saver';
import { useContext, useEffect, useState, type FC } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { BsFloppy2 } from 'react-icons/bs';
import { IoAddCircleOutline } from 'react-icons/io5';
import { MdAddCircleOutline } from 'react-icons/md';
import { RiFileDownloadFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Button, Drawer, Modal, SelectPicker, Uploader } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/MultiCascadeTree';
import Swal from 'sweetalert2';


interface IncentiveSettingPageProps { }

const IncentiveSettingPage: FC<IncentiveSettingPageProps> = ({ }) => {
    const nav = useNavigate()
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [shops, setShops] = useState<Shop[]>([]);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [incentive_settings, setIncentiveSettings] = useState<IncentiveSetting[]>([]);
    const [selectedIncentiveSetting, setSelectedIncentiveSetting] = useState<IncentiveSetting | null>(null);
    const [shop_name, setName] = useState("");
    const [shop_id, setShopId] = useState("");
    const [product_category_id, setProductCategoryId] = useState("");
    const [minimum_sales_target, setMinimumSalesTarget] = useState(0)
    const [maximum_sales_target, setMaximumSalesTarget] = useState(0)
    const [minimum_sales_commission, setMinimumSalesCommission] = useState(0)
    const [maximum_sales_commission, setMaximumSalesCommission] = useState(0)
    const [sick_leave_threshold, setSickLeaveThreshold] = useState(0)
    const [other_leave_threshold, setOtherLeaveThreshold] = useState(0)
    const [absent_threshold, setAbsentThreshold] = useState(0)
    const [selectedProductCategory, setSelectedProductCategory] = useState<ItemDataType<ProductCategory> | string | null>(null)
    const [selectedShop, setSelectedShop] = useState<ItemDataType<Shop> | string | null>(null)
    const [mountedValue, setMountedValue] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [openWithHeader, setOpenWithHeader] = useState(false);
    const [token, setToken] = useState("");

    const [selectedFilterProductCategory, setSelectedFilterProductCategory] = useState<ItemDataType<ProductCategory> | string | null>(null)
    const [selectedFilterShop, setSelectedFilterShop] = useState<ItemDataType<Shop> | string | null>(null)

    const getAllProductCategories = async (s: string) => {
        getProductCategories({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setProductCategories(v.data))
    }

    const getAllShops = async (s: string) => {
        getShops({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setShops(v.data))
    }


    useEffect(() => {
        // setMounted(true)
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
        getAllProductCategories("")
        getAllShops("")

    }, []);



    useEffect(() => {
        getAllIncentiveSettings()

    }, [page, limit, search, selectedFilterProductCategory, selectedFilterShop]);

    const getAllIncentiveSettings = async () => {
        setIsLoading(true)
        getIncentiveSettings({ page, limit, search }, {
            product_category_id: selectedFilterProductCategory ? `${selectedFilterProductCategory}` : null,
            shop_id: selectedFilterShop ? `${selectedFilterShop}` : null,
        })
            .then(v => v.json())
            .then(v => {
                setIncentiveSettings(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)
            if (!selectedShop) throw Error("Pilih toko terlebih dahulu")
            if (!selectedProductCategory) throw Error("Pilih kategori terlebih dahulu")
            if (selectedIncentiveSetting) {
                await editIncentiveSetting(selectedIncentiveSetting!.id, {
                    shop_id: `${selectedShop}`,
                    product_category_id: `${selectedProductCategory}`,
                    minimum_sales_target,
                    maximum_sales_target,
                    minimum_sales_commission: minimum_sales_commission / 100,
                    maximum_sales_commission: maximum_sales_commission / 100,
                    sick_leave_threshold,
                    other_leave_threshold,
                    absent_threshold,
                })
            } else {
                await addIncentiveSetting({
                    shop_id: `${selectedShop}`,
                    product_category_id: `${selectedProductCategory}`,
                    minimum_sales_target,
                    maximum_sales_target,
                    minimum_sales_commission: minimum_sales_commission / 100,
                    maximum_sales_commission: maximum_sales_commission / 100,
                    sick_leave_threshold,
                    other_leave_threshold,
                    absent_threshold,
                })
            }
            getAllIncentiveSettings()
            setSelectedIncentiveSetting(null)
            clearForm()
            setModalOpen(false)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }

    const clearForm = () => {
        setShopId("")
        setProductCategoryId("")
        setMinimumSalesTarget(0)
        setMaximumSalesTarget(0)
        setMinimumSalesCommission(0)
        setMaximumSalesCommission(0)
        setSickLeaveThreshold(0)
        setOtherLeaveThreshold(0)
        setAbsentThreshold(0)
        setSelectedProductCategory(null)
        setSelectedShop(null)
    }


    return (<DashboardLayout permission='read_incentive_setting'>
        <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
            <div className='flex justify-between '>
                <h3 className='font-bold mb-4 text-black text-lg'>{"Pengaturan Insentif"}</h3>
                <div>
                    <Button className='mr-2' onClick={() => setModalOpen(true)}><PlusIcon className='w-4 mr-1' /> Tambah Pengaturan</Button>
                    <Button onClick={() => setOpenWithHeader(true)}><FunnelIcon className='w-4 mr-1' /> Filter</Button>
                </div>
            </div>
            <CustomTable
                className='mt-8'
                pagination
                total={pagination?.total_records}
                limit={limit}
                activePage={page}
                setActivePage={(v) => setPage(v)}
                changeLimit={(v) => setLimit(v)}
                headers={["No", "Toko", "Kategori", "T. Penjualan Min", "T. Penjualan Max", "Komisi Min", "Komisi Max", ""]} headerClasses={[]} datasets={incentive_settings.map(e => ({
                    cells: [
                        { data: ((page - 1) * limit) + (incentive_settings.indexOf(e) + 1) },
                        { data: e.shop_name },
                        { data: e.product_category_name },
                        { data: money(e.minimum_sales_target) },
                        { data: money(e.maximum_sales_target) },
                        { data: `${money(e.minimum_sales_commission * 100)}%` },
                        { data: `${money(e.maximum_sales_commission * 100)}%` },
                     
                        {
                            data: <div className='flex cursor-pointer'>
                                <EyeIcon onClick={() => {
                                    setSelectedIncentiveSetting(e)
                                    setSelectedShop(e.shop_id)
                                    setSelectedProductCategory(e.product_category_id)
                                    setMinimumSalesTarget(e.minimum_sales_target)
                                    setMaximumSalesTarget(e.maximum_sales_target)
                                    setMinimumSalesCommission(e.minimum_sales_commission * 100)
                                    setMaximumSalesCommission(e.maximum_sales_commission * 100)
                                    setSickLeaveThreshold(e.sick_leave_threshold)
                                    setOtherLeaveThreshold(e.other_leave_threshold)
                                    setAbsentThreshold(e.absent_threshold)
                                    setModalOpen(true)
                                }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                <TrashIcon
                                    className=" h-5 w-5 text-red-400 hover:text-red-600"
                                    aria-hidden="true"
                                    onClick={() => {
                                        confirmDelete(() => {
                                            deleteIncentiveSetting(e.id).then(v => getAllIncentiveSettings())
                                        })
                                    }}
                                />
                            </div>
                        }
                    ]
                }))} />
        </div>

        <Modal open={modalOpen} onClose={() => {
            setModalOpen(false)
            clearForm()
        }}>
            <Modal.Header>
                {selectedIncentiveSetting ? "Edit Pengaturan Insentif" : "Tambah Pengaturan Insentif"}
            </Modal.Header>
            <Modal.Body>
                <InlineForm title="Toko">
                    <SelectPicker<ItemDataType<Shop> | string>
                        labelKey="name"
                        onClean={() => setSelectedShop(null)}
                        valueKey="id"
                        onSearch={(val) => {
                            if (val)
                                getAllShops(val)
                        }}
                        placeholder="Toko" searchable={true} data={shops} value={selectedShop} onSelect={(val) => setSelectedShop(val)} block />
                </InlineForm>
                <InlineForm title="Kategori">
                    <SelectPicker<ItemDataType<ProductCategory> | string>
                        labelKey="name"
                        onClean={() => setSelectedProductCategory(null)}
                        valueKey="id"
                        onSearch={(val) => {
                            if (val)
                                getAllProductCategories(val)
                        }}
                        placeholder="Kategori" searchable={true} data={productCategories} value={selectedProductCategory} onSelect={(val) => setSelectedProductCategory(val)} block />
                </InlineForm>
                <InlineForm title="Target Penjualan Minimal">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            value={minimum_sales_target}
                            onValueChange={(value, _, values) => {
                                setMinimumSalesTarget(values?.float ?? 0)
                            }}

                        />
                    }
                </InlineForm>
                <InlineForm title="Target Penjualan Maksimal">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            value={maximum_sales_target}
                            onValueChange={(value, _, values) => {
                                setMaximumSalesTarget(values?.float ?? 0)
                            }}

                        />
                    }
                </InlineForm>
                <InlineForm title="Komisi Penjualan Minimal (%)">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            defaultValue={minimum_sales_commission}
                            onValueChange={(value, _, values) => {
                                setMinimumSalesCommission(values?.float ?? 0)
                            }}
                        />
                    }
                </InlineForm>
                <InlineForm title="Komisi Penjualan Maksimal (%)">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            defaultValue={maximum_sales_commission}
                            onValueChange={(value, _, values) => {
                                setMaximumSalesCommission(values?.float ?? 0)
                            }}
                        />
                    }
                </InlineForm>
{/* 
                <InlineForm title="Batas Sakit (Hari)">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            value={sick_leave_threshold}
                            onValueChange={(value, _, values) => {
                                setSickLeaveThreshold(values?.float ?? 0)
                            }}
                        />
                    }
                </InlineForm>

                <InlineForm title="Batas Izin (Hari)">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            value={other_leave_threshold}
                            onValueChange={(value, _, values) => {
                                setOtherLeaveThreshold(values?.float ?? 0)
                            }}
                        />
                    }
                </InlineForm>
                <InlineForm title="Batas Alpa (Hari)">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            value={absent_threshold}
                            onValueChange={(value, _, values) => {
                                setAbsentThreshold(values?.float ?? 0)
                            }}
                        />
                    }
                </InlineForm> */}
            </Modal.Body>
            <Modal.Footer>
                <Button className='mr-2' appearance='primary' onClick={save}>
                    <BsFloppy2 className='mr-2' /> Simpan
                </Button>
            </Modal.Footer>
        </Modal>

        <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
            <Drawer.Header>
                <Drawer.Title>Filter & Tool</Drawer.Title>
                <Drawer.Actions>
                    <Button onClick={() => {
                        // setOpenWithHeader(false)
                        setSelectedFilterProductCategory(null)
                        setSelectedFilterShop(null)
                        // setSelectedEmployee(null)

                    }} >
                        <XMarkIcon className='w-4 mr-2' />
                        Clear Filter
                    </Button>
                </Drawer.Actions>
            </Drawer.Header>
            <Drawer.Body className='p-8'>
                <h3 className=' text-2xl text-black'>Filter</h3>

                <InlineForm title="Kategori">
                    <SelectPicker<ItemDataType<ProductCategory> | string>
                        labelKey="name"
                        onClean={() => setSelectedFilterProductCategory(null)}
                        valueKey="id"
                        onSearch={(val) => {
                            if (val)
                                getAllProductCategories(val)
                        }}
                        placeholder="Kategori" searchable={true} data={productCategories} value={selectedFilterProductCategory} onSelect={(val) => setSelectedFilterProductCategory(val)} block />
                </InlineForm>

                <InlineForm title="Toko">
                    <SelectPicker<ItemDataType<Shop> | string>
                        labelKey="name"
                        onClean={() => setSelectedFilterShop(null)}
                        valueKey="id"
                        onSearch={(val) => {
                            if (val)
                                getAllShops(val)
                        }}
                        placeholder="Toko" searchable={true} data={shops} value={selectedFilterShop} onSelect={(val) => setSelectedFilterShop(val)} block />
                </InlineForm>

                <Button onClick={async () => {

                    try {
                        setIsLoading(true)
                        const resp = await getIncentiveSettings({ page, limit, search }, { download: true, product_category_id: selectedFilterProductCategory ? `${selectedFilterProductCategory}` : null })
                        const filename = resp.headers.get("Content-Description")
                        const respBlob = await resp.blob()

                        saveAs(respBlob, filename ?? "download.xlsx")
                        // getAllSale()
                    } catch (error) {
                        Swal.fire(`Perhatian`, `${error}`, 'error')
                    } finally {
                        setIsLoading(false)

                    }


                }} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Laporan</Button>
                <div className='mb-4'></div>

                <hr className='h-line' />
                <h3 className=' text-2xl text-black'>Unggah Pengaturan Insentif</h3>
                <p className='mb-4'>Silakan download terlebih dahulu templat Pengaturan Insentif</p>
                <Uploader
                    onSuccess={async (resp) => {
                        getAllIncentiveSettings()
                        successToast("Unggah File Berhasil")

                    }}
                    headers={{
                        authorization: `Bearer ${token}`
                    }}
                    onChange={(files) => {
                    }} draggable action={`${import.meta.env.VITE_API_URL}/admin/incentiveSetting/import`}>
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Click or Drag files to this area to upload</span>
                    </div>
                </Uploader>
                <Button onClick={() => window.open(`/file/sample_incentive_setting.xlsx`)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Template</Button>
                {/* <Button className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800'><RiFileUploadFill className='text-blue-600 mr-2' /> Unggah Data Karyawan</Button> */}
            </Drawer.Body>
        </Drawer>
    </DashboardLayout>);
}
export default IncentiveSettingPage;