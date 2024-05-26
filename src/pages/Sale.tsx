import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Sale } from '@/model/sale';
import { ProductCategory } from '@/model/product_category';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addSale, deleteSale, editSale, getSales } from '@/repositories/sale';
import { getProductCategories, getProductCategoryDetail } from '@/repositories/product_category';
import { TOKEN } from '@/utils/constant';
import { asyncLocalStorage, confirmDelete, money } from '@/utils/helper';
import { successToast } from '@/utils/helperUi';
import { EyeIcon, TrashIcon } from '@heroicons/react/16/solid';
import { FunnelIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import saveAs from 'file-saver';
import { useContext, useEffect, useState, type FC } from 'react';
import Barcode from 'react-barcode';
import CurrencyInput from 'react-currency-input-field';
import { BsFloppy2, BsFunnel } from 'react-icons/bs';
import { RiFileDownloadFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { Button, DatePicker, Drawer, Modal, SelectPicker, Uploader } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/MultiCascadeTree';
import Swal from 'sweetalert2';
import { Employee } from '@/model/employee';
import { Shop } from '@/model/shop';
import Moment from 'react-moment';
import DateRangePicker, { DateRange } from 'rsuite/esm/DateRangePicker';
import moment from 'moment';
import { getEmployees } from '@/repositories/employee';
import { getShops } from '@/repositories/shop';
import { getProductDetail, getProducts } from '@/repositories/product';
import { Product } from '@/model/product';

interface SalePageProps { }

const SalePage: FC<SalePageProps> = ({ }) => {
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [sales, setSales] = useState<Sale[]>([]);
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [shops, setShops] = useState<Shop[]>([]);
    const [mounted, setMounted] = useState(false);

    const [name, setName] = useState("")
    const [sku, setSku] = useState("")
    const [barcode, setBarcode] = useState("")
    const [sellingPrice, setSellingPrice] = useState(0)
    const [saleCategory, setProductCategory] = useState<ItemDataType<ProductCategory> | string | null>(null)
    const [selectedProductCategory, setSelectedProductCategory] = useState<ItemDataType<ProductCategory> | string | null>(null)
    const [selectedProduct, setSelectedProduct] = useState<ItemDataType<Product> | string | null>(null)
    const [selectedEmployee, setSelectedEmployee] = useState<ItemDataType<Employee> | string | null>(null)
    const [selectedInputEmployee, setSelectedInputEmployee] = useState<ItemDataType<Employee> | string | null>(null)
    const [selectedInputShop, setSelectedInputShop] = useState<ItemDataType<Shop> | string | null>(null)
    const [selectedShop, setSelectedShop] = useState<ItemDataType<Shop> | string | null>(null)
    const [modalOpen, setmodalOpen] = useState(false);
    const [openWithHeader, setOpenWithHeader] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | null>([moment().subtract(1, 'months').toDate(), moment().add(1, "days").toDate()]);
    const [date, setDate] = useState<Date>(moment().add(1, "days").toDate());
    const [token, setToken] = useState("");
    const [openSaleForm, setOpenSaleForm] = useState(false);
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [mountedValue, setMountedValue] = useState(true);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        setMounted(true)
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
    }, []);

    useEffect(() => {
        if (!mounted) return

        getAllProductCategories("")
        getAllProducts("")
        getAllEmployees("")
        getAllShops("")
    }, [mounted]);

    useEffect(() => {
        getAllSale()
    }, [page, limit, search, selectedProductCategory, selectedEmployee, selectedShop, dateRange]);

    const getAllProductCategories = async (s: string) => {
        getProductCategories({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setProductCategories(v.data))
    }
    const getAllProducts = async (s: string) => {
        getProducts({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setProducts(v.data))
    }
    const getAllEmployees = async (s: string) => {
        getEmployees({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setEmployees(v.data))
    }
    const getAllShops = async (s: string) => {
        getShops({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setShops(v.data))
    }
    const getAllSale = async () => {
        try {
            setIsLoading(true)
            const resp = await getSales({ page, limit, search }, {
                product_category_id: selectedProductCategory ? `${selectedProductCategory}` : null,
                employee_id: selectedEmployee ? `${selectedEmployee}` : null,
                shop_id: selectedShop ? `${selectedShop}` : null,
                dateRange,
            })
            const respJson = await resp.json()
            setSales(respJson.data)
            setPagination(respJson.pagination)

        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)

        }
    }

    useEffect(() => {
        let discountAmount = price * qty * (discount / 100)
        setDiscountAmount(discountAmount)
        setTotal(price * qty - discountAmount)
    }, [qty, discount, discountAmount, price]);

    useEffect(() => {
        if (!selectedSale) return
        setDate(moment(selectedSale?.date).toDate())
        setSelectedInputEmployee(selectedSale?.employee_id)
        setSelectedInputShop(selectedSale?.shop_id)
        setSelectedProduct(selectedSale?.product_id)
        setPrice(selectedSale?.price)
        setQty(selectedSale?.qty)
        setDiscount(selectedSale?.discount * 100)
        setDiscountAmount(selectedSale?.discount_amount)
        setTotal(selectedSale?.total)
    }, [selectedSale]);

    const create = async () => {
        // console.log("saleCategory", saleCategory)
        // return
        try {
            if (!selectedProduct) throw Error("Pilih produk terlebih dahulu")
            if (!selectedInputEmployee) throw Error("Pilih salesman terlebih dahulu")
            if (!selectedInputShop) throw Error("Pilih toko terlebih dahulu")
            setIsLoading(true)
            if (selectedSale) {
                await editSale(selectedSale.id, {
                    date: date.toISOString(),
                    product_id: `${selectedProduct}`,
                    shop_id: `${selectedInputShop}`,
                    qty,
                    price,
                    sub_total: qty * price,
                    discount: discount / 100,
                    discount_amount: discountAmount,
                    total: total,
                    employee_id: `${selectedInputEmployee}`,
                })
            } else {
                await addSale({
                    date: date.toISOString(),
                    product_id: `${selectedProduct}`,
                    shop_id: `${selectedInputShop}`,
                    qty,
                    price,
                    sub_total: qty * price,
                    discount: discount / 100,
                    discount_amount: discountAmount,
                    total: total,
                    employee_id: `${selectedInputEmployee}`,
                })
            }

            getAllSale()
            clearForm()
            setOpenSaleForm(false)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)

        }
    }

    useEffect(() => {
        if (!selectedProduct) return
        getProductDetail(`${selectedProduct}`)
            .then(v => v.json())
            .then(v => setPrice(v.data.selling_price))
    }, [selectedProduct]);

    const clearForm = () => {
        setName("")
        setSku("")
        setBarcode("")
        setSellingPrice(0)
        setProductCategory(null)
        setSelectedSale(null)
        setSelectedInputEmployee(null)
        setSelectedInputShop(null)
        setSelectedProduct(null)
    }

    const refreshInput = () => {
        setMountedValue(false)
        setTimeout(() => {
            setMountedValue(true)

        }, 50);
    }
    return (<DashboardLayout permission='read_sale'>
        <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
            <div className='flex justify-between'>
                <h3 className='font-bold mb-4 text-black text-lg'>{"Penjualan"}</h3>
            </div>
            <CustomTable
                pagination
                total={pagination?.total_records}
                limit={limit}
                activePage={page}
                setActivePage={(v) => setPage(v)}
                changeLimit={(v) => setLimit(v)}
                onSearch={(val) => setSearch(val)}
                searchHeader={
                    <div>
                        <Button className='mr-2' onClick={() => setOpenSaleForm(true)}><PlusIcon className='w-4 mr-1' /> Tambah Penjualan</Button>
                        <Button onClick={() => setOpenWithHeader(true)}><FunnelIcon className='w-4 mr-1' /> Filter</Button>
                    </div>
                }
                switchHeader
                headers={["No", "Tgl", "Produk", "Qty", "Harga", "Total", "Salesman", "Toko", ""]} headerClasses={["", "", "", "text-right", "text-right", "text-right"]} datasets={sales.map(e => ({
                    cells: [
                        { data: ((page - 1) * limit) + (sales.indexOf(e) + 1) },
                        {
                            data:
                                <Moment format='DD/MM/YYYY'>
                                    {e.date}
                                </Moment>
                        },
                        { data: e.product_name },
                        { data: money(e.qty), className: "text-right" },
                        { data: money(e.price), className: "text-right" },
                        { data: money(e.total), className: "text-right" },
                        { data: <div className=' hover:font-bold cursor-pointer' onClick={() => nav(`/employee/${e.employee_id}`)}>
                            {e.employee_name}
                        </div> },
                        { data: e.shop_name },
                        {
                            data: <div className='flex cursor-pointer justify-end'>
                                {!e.incentive_id &&
                                    <EyeIcon onClick={async () => {
                                        // nav(`/sale/${e.id}`)
                                        setSelectedSale(e)
                                        setOpenSaleForm(true)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                }
                                <TrashIcon
                                    className=" h-5 w-5 text-red-400 hover:text-red-600"
                                    aria-hidden="true"
                                    onClick={() => {
                                        confirmDelete(() => {
                                            deleteSale(e.id).then(v => getAllSale())
                                        })
                                    }}
                                />
                            </div>
                        }
                    ]
                }))} />
        </div>



        <Drawer open={openSaleForm} onClose={() => setOpenSaleForm(false)}>
            <Drawer.Header>
                <Drawer.Title>Form Penjualan</Drawer.Title>
                <Drawer.Actions>
                    <Button className='mr-2' appearance='primary' onClick={create}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                </Drawer.Actions>
            </Drawer.Header>
            <Drawer.Body className='p-8'>
                <InlineForm title="Tanggal">
                    <DatePicker className='w-full' value={date} onChange={(val) => setDate(val!)} placement="bottomEnd" format='dd/MM/yyyy' />
                </InlineForm>
                <InlineForm title="Salesman">
                    <SelectPicker<ItemDataType<Employee> | string>
                        labelKey="full_name"
                        onClean={() => setSelectedInputEmployee(null)}
                        valueKey="id"
                        onSearch={(val) => {
                            if (val)
                                getAllEmployees(val)
                        }}
                        placeholder="Salesman" searchable={true} data={employees} value={selectedInputEmployee} onSelect={(val) => setSelectedInputEmployee(val)} block />
                </InlineForm>
                <InlineForm title="Toko">
                    <SelectPicker<ItemDataType<Shop> | string>
                        labelKey="name"
                        onClean={() => setSelectedInputShop(null)}
                        valueKey="id"
                        onSearch={(val) => {
                            if (val)
                                getAllShops(val)
                        }}
                        placeholder="Toko" searchable={true} data={shops} value={selectedInputShop} onSelect={(val) => setSelectedInputShop(val)} block />
                </InlineForm>
                <InlineForm title="Produk">
                    <SelectPicker<ItemDataType<Product> | string>
                        labelKey="name"
                        onClean={() => setSelectedProduct(null)}
                        valueKey="id"
                        onSearch={(val) => {
                            if (val)
                                getAllProducts(val)
                        }}
                        placeholder="Produk" searchable={true} data={products} value={selectedProduct} onSelect={(val) => setSelectedProduct(val)} block />
                </InlineForm>
                <InlineForm title="Harga">
                    <div className='px-4 text-right'>
                        {money(price)}
                    </div>
                </InlineForm>
                <InlineForm title="Qty">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            value={qty}
                            onValueChange={(value, _, values) => {
                                setQty(values?.float ?? 0)
                            }}

                        />
                    }
                </InlineForm>
                <InlineForm title="Sub Total">
                    <div className='px-4 text-right'>
                        {money(price * qty)}
                    </div>
                </InlineForm>
                <InlineForm title="Diskon" subtitle="persen(%)">
                    {mountedValue &&
                        <CurrencyInput
                            className='form-control text-right'
                            groupSeparator="."
                            decimalSeparator=","
                            value={discount}
                            onValueChange={(value, _, values) => {
                                if ((values?.float ?? 0) > 100) {
                                    setDiscount(100)
                                    refreshInput()
                                    return
                                }
                                setDiscount(values?.float ?? 0)
                            }}

                        />
                    }
                </InlineForm>
                <InlineForm title="Total">
                    <div className='px-4 text-right'>
                        {money(total)}
                    </div>
                </InlineForm>

            </Drawer.Body>

        </Drawer>
        <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
            <Drawer.Header>
                <Drawer.Title>Filter & Tool</Drawer.Title>
                <Drawer.Actions>
                    <Button onClick={() => {
                        setOpenWithHeader(false)
                        setSelectedProductCategory(null)
                        setSelectedEmployee(null)
                        setSelectedShop(null)
                        setDateRange([moment().subtract(1, 'months').toDate(), moment().add(1, "days").toDate()])

                    }} >
                        <XMarkIcon className='w-4 mr-2' />
                        Clear Filter
                    </Button>
                </Drawer.Actions>
            </Drawer.Header>
            <Drawer.Body className='p-8'>
                <h3 className=' text-2xl text-black'>Filter</h3>
                <InlineForm title="Rentang Tanggal">
                    <DateRangePicker className='w-full' value={dateRange} onChange={(val) => setDateRange(val)} placement="bottomEnd" format='dd/MM/yyyy' />
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
                <InlineForm title="Salesman">
                    <SelectPicker<ItemDataType<Employee> | string>
                        labelKey="full_name"
                        onClean={() => setSelectedEmployee(null)}
                        valueKey="id"
                        onSearch={(val) => {
                            if (val)
                                getAllEmployees(val)
                        }}
                        placeholder="Salesman" searchable={true} data={employees} value={selectedEmployee} onSelect={(val) => setSelectedEmployee(val)} block />
                </InlineForm>
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

                <Button onClick={async () => {

                    try {
                        setIsLoading(true)
                        const resp = await getSales({ page, limit, search }, { download: true, product_category_id: selectedProductCategory ? `${selectedProductCategory}` : null })
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
                <h3 className=' text-2xl text-black'>Unggah Data Penjualan</h3>
                <p className='mb-4'>Silakan download terlebih dahulu templat data penjualan</p>
                <Uploader
                    onSuccess={async (resp) => {
                        getAllSale()
                        successToast("Unggah File Berhasil")

                    }}
                    headers={{
                        authorization: `Bearer ${token}`
                    }}
                    onChange={(files) => {
                    }} draggable action={`${import.meta.env.VITE_API_URL}/admin/sale/import`}>
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Click or Drag files to this area to upload</span>
                    </div>
                </Uploader>
                <Button onClick={() => window.open(`/file/sample_sales.xlsx`)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Template</Button>
                {/* <Button className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800'><RiFileUploadFill className='text-blue-600 mr-2' /> Unggah Data Karyawan</Button> */}
            </Drawer.Body>
        </Drawer>


    </DashboardLayout>);
}
export default SalePage;
function adddProduct(arg0: { name: string; sku: string; barcode: string; selling_price: number; product_category_id: string; }) {
    throw new Error('Function not implemented.');
}

