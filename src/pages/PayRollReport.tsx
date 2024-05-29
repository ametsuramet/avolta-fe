import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { PayRollReport } from '@/model/pay_roll_report';
import { Shop } from '@/model/shop';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { addPayRollReport, deletePayRollReport, getPayRollReports } from '@/repositories/pay_roll_report';
import { getIncentiveAutoNumber, getPayRollReportAutoNumber } from '@/repositories/setting';
import { getShops } from '@/repositories/shop';
import { confirmDelete, money } from '@/utils/helper';
import { EyeIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';
import { Badge, Button, Modal, TagPicker } from 'rsuite';
import DateRangePicker, { DateRange } from 'rsuite/esm/DateRangePicker';
import Swal from 'sweetalert2';

interface PayRollReportPageProps { }

const PayRollReportPage: FC<PayRollReportPageProps> = ({ }) => {
    const nav = useNavigate()
    const [mounted, setMounted] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [payRollReports, setPayRollReports] = useState<PayRollReport[]>([]);
    const [selectedPayRollReport, setSelectedPayRollReport] = useState<PayRollReport | null>(null);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>([moment().subtract(1, "months").startOf('month').toDate(), moment().subtract(1, "months").endOf('month').toDate()]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [reportNumber, setReportNumber] = useState("");
    const [shops, setShops] = useState<Shop[]>([]);
    const [shopIds, setShopIds] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true)

    }, []);

    useEffect(() => {
        getPayRollReportAutoNumber()
            .then(v => v.json())
            .then(v => setReportNumber(v.data))
        getShops({ page: 1, limit: 100 })
            .then(v => v.json())
            .then(v => setShops(v.data))
    }, [mounted]);
    useEffect(() => {
        if (!mounted) return
        getAllPayRollReports()


    }, [page, limit, search, mounted]);

    const getAllPayRollReports = async () => {
        setIsLoading(true)
        getPayRollReports({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setPayRollReports(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const save = async () => {
        try {
            setIsLoading(true)
            let resp = await addPayRollReport({
                description,
                report_number: reportNumber,
                start_date: selectedDateRange[0].toISOString(),
                end_date: selectedDateRange[1].toISOString(),
                shop_ids: shopIds,
            })
            let respJson = await resp.json()
            nav(`/report/pay_roll/${respJson.data.last_id}`)

        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_pay_roll_report'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-2 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Laporan Pay Roll"}</h3>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Tgl", "Nomor Laporan", "Keterangan","Grand Total" , "Status", ""]} headerClasses={["","","","","text-right"]} datasets={payRollReports.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (payRollReports.indexOf(e) + 1) },
                            {
                                data: <div className='flex '>
                                    <Moment format='HH:mm'>{e.start_date}</Moment> ~ <Moment format='HH:mm'>{e.end_date}</Moment>
                                </div>
                            },
                            { data: e.report_number },
                            { data: e.description },
                            { data: money(e.grand_total_take_home_pay, 0) , className:"text-right" },
                            {
                                data:
                                    <div>
                                        {e?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={e?.status} />}
                                        {e?.status == "PROCESSING" && <Badge className='text-center' color='blue' content={e?.status} />}
                                        {e?.status == "APPROVED" && <Badge className='text-center' color='green' content={e?.status} />}
                                        {e?.status == "REJECTED" && <Badge className='text-center' color='red' content={e?.status} />}
                                    </div>
                            },
                            {
                                data: <div className='flex cursor-pointer justify-end'>
                                    <EyeIcon onClick={() => {
                                        nav(`/report/pay_roll/${e.id}`)
                                        // setSelectedPayRollReport(e)
                                        // setName(e.name)
                                        // setDescription(e.description)
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deletePayRollReport(e.id).then(v => getAllPayRollReports())
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
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedPayRollReport ? "Edit Laporan Pay Roll" : "Tambah Laporan Pay Roll"}</h3>
                    <InlineForm title="No. Laporan">
                        <input placeholder='ex: 001' value={reportNumber} onChange={(el) => setReportNumber(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Rentang Tanggal">
                        <DateRangePicker className='w-full' value={selectedDateRange} onChange={(val) => setSelectedDateRange(val!)} placement="bottomEnd" format='dd/MM/yyyy' />
                    </InlineForm>
                    {/* <InlineForm title="Toko">
                        <TagPicker
                            searchable
                            valueKey='id'
                            labelKey='name'
                            onChange={(val) => {
                                setShopIds(val)
                            }}
                            value={shopIds}

                            data={shops} className=" block" />
                    </InlineForm> */}
                    <InlineForm title="Keterangan" style={{ alignItems: 'start' }}>
                        <textarea placeholder='ex: Pay Roll bulan mei ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedPayRollReport &&
                        <Button onClick={async () => {
                            setSelectedPayRollReport(null)
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
export default PayRollReportPage;