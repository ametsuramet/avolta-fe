import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Product } from '@/model/product';
import { ProductCategory } from '@/model/product_category';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addProduct, deleteProduct, editProduct, getProducts } from '@/repositories/product';
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
import { Button, Drawer, Modal, SelectPicker, Uploader } from 'rsuite';
import { ItemDataType } from 'rsuite/esm/MultiCascadeTree';
import Swal from 'sweetalert2';

interface ProductPageProps { }

const ProductPage: FC<ProductPageProps> = ({ }) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [products, setProducts] = useState<Product[]>([]);
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [mounted, setMounted] = useState(false);

    const [name, setName] = useState("")
    const [sku, setSku] = useState("")
    const [barcode, setBarcode] = useState("")
    const [sellingPrice, setSellingPrice] = useState(0)
    const [productCategory, setProductCategory] = useState<ItemDataType<ProductCategory> | string | null>(null)
    const [selectedProductCategory, setSelectedProductCategory] = useState<ItemDataType<ProductCategory> | string | null>(null)
    const [modalOpen, setmodalOpen] = useState(false);
    const [openWithHeader, setOpenWithHeader] = useState(false);
    const [token, setToken] = useState("");
    useEffect(() => {
        setMounted(true)
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
    }, []);

    useEffect(() => {
        if (!mounted) return

        getAllProductCategories("")
    }, [mounted]);

    useEffect(() => {
        getAllProducts()
    }, [page, limit, search, selectedProductCategory]);

    const getAllProductCategories = async (s: string) => {
        getProductCategories({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setProductCategories(v.data))
    }
    const getAllProducts = async () => {
        try {
            setIsLoading(true)
            let resp = await getProducts({ page, limit, search }, {product_category_id: selectedProductCategory ? `${selectedProductCategory}` : null})
            let respJson = await resp.json()
            setProducts(respJson.data)
            setPagination(respJson.pagination)

        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)

        }
    }

    const create = async () => {
        // console.log("productCategory", productCategory)
        // return
        try {
            setIsLoading(true)
            if (selectedProduct) {
                await editProduct(selectedProduct.id!, {
                    name,
                    sku,
                    barcode,
                    selling_price: sellingPrice,
                    product_category_id: `${productCategory}`,
                })
            } else {

                await addProduct({
                    name,
                    sku,
                    barcode,
                    selling_price: sellingPrice,
                    product_category_id: `${productCategory}`,
                })
            }
            getAllProducts()
            clearForm()
            setmodalOpen(false)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)

        }
    }

    const clearForm = () => {
        setName("")
        setSku("")
        setBarcode("")
        setSellingPrice(0)
        setProductCategory(null)
        setSelectedProduct(null)
    }
    return (<DashboardLayout permission='read_product'>
        <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
            <div className='flex justify-between'>
                <h3 className='font-bold mb-4 text-black text-lg'>{"Produk"}</h3>
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
                <Button className='mr-2' onClick={() => setmodalOpen(true)}><PlusIcon className='w-4 mr-1' /> Tambah Produk</Button>
                <Button onClick={() => setOpenWithHeader(true)}><FunnelIcon className='w-4 mr-1' /> Filter</Button>
                </div>
            }
                switchHeader
                headers={["No", "Nama", "SKU", "Barcode", "Kategori", "Haga", ""]} headerClasses={[]} datasets={products.map(e => ({
                    cells: [
                        { data: ((page - 1) * limit) + (products.indexOf(e) + 1) },
                        { data: e.name },
                        {
                            data:
                                <div>
                                    {e.sku}

                                </div>
                        },
                        { data: <Barcode width={1} height={48} value={e.barcode} fontSize={10} /> },
                        { data: e.product_category_name },
                        { data: money(e.selling_price) },

                        {
                            data: <div className='flex cursor-pointer justify-end'>
                                <EyeIcon onClick={async () => {
                                    // nav(`/product/${e.id}`)
                                    setSelectedProduct(e)
                                    setName(e.name)
                                    setSku(e.sku)
                                    setBarcode(e.barcode)
                                    setSellingPrice(e.selling_price)
                                    setProductCategory(e.product_category_id)
                                    setmodalOpen(true)
                                }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                <TrashIcon
                                    className=" h-5 w-5 text-red-400 hover:text-red-600"
                                    aria-hidden="true"
                                    onClick={() => {
                                        confirmDelete(() => {
                                            deleteProduct(e.id).then(v => getAllProducts())
                                        })
                                    }}
                                />
                            </div>
                        }
                    ]
                }))} />
        </div>

        <Modal open={modalOpen} onClose={() => {
            setmodalOpen(false)
        }}>
            <Modal.Header>
                {selectedProduct ? "Edit Produk" : "Tambah Produk"}
            </Modal.Header>
            <Modal.Body>
                <InlineForm title="Nama Produk">
                    <input type="text" className='form-control' value={name} onChange={(el) => setName(el.target.value)} />
                </InlineForm>

                <InlineForm title="Kategori">
                    <SelectPicker<ItemDataType<ProductCategory> | string>

                        labelKey="name"
                        onClean={() => setProductCategory(null)}
                        valueKey="id"
                        onSearch={(val) => getAllProductCategories(val)}
                        placeholder="Kategori" searchable={true} data={productCategories} value={productCategory} onSelect={(val) => setProductCategory(val)} block />
                </InlineForm>
                <InlineForm title="SKU">
                    <input type="text" className='form-control' value={sku} onChange={(el) => setSku(el.target.value)} />
                </InlineForm>
                <InlineForm title="Barcode">
                    <input type="text" className='form-control' value={barcode} onChange={(el) => setBarcode(el.target.value)} />
                </InlineForm>
                <InlineForm title="Harga">
                    <CurrencyInput
                        className='form-control'
                        groupSeparator="."
                        decimalSeparator=","
                        value={sellingPrice}
                        onValueChange={(value, _, values) => {
                            setSellingPrice(values?.float ?? 0)
                        }}

                    />
                </InlineForm>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={create} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
            </Modal.Footer>
        </Modal>

        <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
            <Drawer.Header>
                <Drawer.Title>Filter & Tool</Drawer.Title>
                <Drawer.Actions>
                    <Button onClick={() => {
                        setOpenWithHeader(false)
                        setSelectedProductCategory(null)
                    }} >
                        <XMarkIcon className='w-4 mr-2' />
                        Clear Filter
                    </Button>
                </Drawer.Actions>
            </Drawer.Header>
            <Drawer.Body className='p-8'>
                <h3 className=' text-2xl text-black'>Filter</h3>
                <InlineForm title="Karyawan">
                    <SelectPicker<ItemDataType<ProductCategory> | string>
                        labelKey="name"
                        onClean={() => setSelectedProductCategory(null)}
                        valueKey="id"
                        onSearch={(val) => getAllProductCategories(val)}
                        placeholder="Kategori" searchable={true} data={productCategories} value={selectedProductCategory} onSelect={(val) => setSelectedProductCategory(val)} block />
                </InlineForm>

                <Button onClick={async () => {

                    try {
                        setIsLoading(true)
                        var resp = await getProducts({ page, limit, search }, {download: true, product_category_id: selectedProductCategory ? `${selectedProductCategory}` : null})
                        let filename = resp.headers.get("Content-Description")
                        var respBlob = await resp.blob()

                        saveAs(respBlob, filename ?? "download.xlsx")
                        // getAllProducts()
                    } catch (error) {
                        Swal.fire(`Perhatian`, `${error}`, 'error')
                    } finally {
                        setIsLoading(false)

                    }


                }} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Laporan</Button>
                <div className='mb-4'></div>

                <hr className='h-line' />
                <h3 className=' text-2xl text-black'>Unggah Data Absensi</h3>
                <p className='mb-4'>Silakan download terlebih dahulu templat data produk</p>
                <Uploader
                    onSuccess={async (resp) => {
                        getAllProducts()
                        successToast("Unggah File Berhasil")

                    }}
                    headers={{
                        authorization: `Bearer ${token}`
                    }}
                    onChange={(files) => {
                    }} draggable action={`${import.meta.env.VITE_API_URL}/admin/product/import`}>
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span>Click or Drag files to this area to upload</span>
                    </div>
                </Uploader>
                <Button onClick={() => window.open(`/file/sample_product.xlsx`)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Template</Button>
                {/* <Button className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800'><RiFileUploadFill className='text-blue-600 mr-2' /> Unggah Data Karyawan</Button> */}
            </Drawer.Body>
        </Drawer>


    </DashboardLayout>);
}
export default ProductPage;