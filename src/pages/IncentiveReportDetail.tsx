import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Attendance, AttendanceSummary } from '@/model/attendance';
import { Employee } from '@/model/employee';
import { Incentive, IncentiveSummary } from '@/model/incentive';
import { IncentiveReport } from '@/model/incentive_report';
import { Leave } from '@/model/leave';
import { Sale } from '@/model/sale';
import { Setting } from '@/model/setting';
import { LoadingContext } from '@/objects/loading_context';
import { getAttendanceSummaries, getAttendances } from '@/repositories/attendance';
import { addEmployee, getEmployees } from '@/repositories/employee';
import { addEmployeeIncentiveReport, editIncentiveReport, getIncentiveReportDetail, updateItemIncentiveReport } from '@/repositories/incentive_report';
import { deleteIncentive, getIncentives } from '@/repositories/inventive';
import { getLeaves } from '@/repositories/leave';
import { addPayRoll } from '@/repositories/pay_roll';
import { addPayRollItem } from '@/repositories/pay_roll_item';
import { getSales } from '@/repositories/sale';
import { getAutoNumber, getSettingDetail } from '@/repositories/setting';
import { confirmDelete, countOverTime, money, numberToDuration, randomStr } from '@/utils/helper';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import saveAs from 'file-saver';
import moment from 'moment';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsCheck2, BsFloppy2, BsWallet2 } from 'react-icons/bs';
import { LuCalendarClock, LuWallet2 } from 'react-icons/lu';
import { RiFileDownloadFill } from 'react-icons/ri';
import Moment from 'react-moment';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Badge, Button, Checkbox, Modal, Panel, Tabs, TagPicker } from 'rsuite';
import { json } from 'stream/consumers';
import Swal from 'sweetalert2';

interface IncentiveReportDetailProps { }

const IncentiveReportDetail: FC<IncentiveReportDetailProps> = ({ }) => {
    const nav = useNavigate()
    const { incentiveReportId } = useParams()
    const [mounted, setMounted] = useState(false);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [incentiveReport, setIncentiveReport] = useState<IncentiveReport | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeIds, setEmployeeIds] = useState<string[]>([]);
    const [incentives, setIncentives] = useState<Incentive[]>([]);
    const [editable, setEditable] = useState(true);
    const [sales, setSales] = useState<Sale[]>([]);
    const [summaries, setSummaries] = useState<IncentiveSummary[]>([]);
    const [modalSummaryOpen, setModalSummaryOpen] = useState(false);
    const [selectedIncentiveId, setSelectedIncentiveId] = useState<string | null>(null);
    const [selectedShopId, setSelectedShopId] = useState<string | null>(null);
    const [selectedIncentives, setSelectedIncentives] = useState<Incentive[]>([]);
    const [selectedIncentive, setSelectedIncentive] = useState<Incentive | null>(null);
    const [settting, setSettting] = useState<Setting | null>(null);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
    const [modalAttendanceSummaryOpen, setModalAttendanceSummaryOpen] = useState(false);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [absents, setAbsents] = useState<Leave[]>([]);
    const [mountedInput, setMountedInput] = useState(true);




    useEffect(() => {
        setMounted(true)
        getSettingDetail()
            .then(v => v.json())
            .then(v => setSettting(v.data))
    }, []);
    useEffect(() => {
        if (!mounted) return
        getDetail()
        getAllEmployees("")
    }, [mounted]);
 
    const getAllEmployees = (s: string) => {
        getEmployees({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setEmployees(v.data))
    }
    const getAllIncentives = () => {
        getIncentives({ page: 1, limit: 1000 }, { incentive_report_id: incentiveReportId })
            .then(v => v.json())
            .then(v => {
                setIncentives(v.data)
            })
    }

    useEffect(() => {
        if (incentiveReport) {
            getAllIncentives()
            setEditable(incentiveReport?.status == "DRAFT")
            setMountedInput(false)
            setTimeout(() => {
                setMountedInput(true)
            }, 300);
        }
    }, [incentiveReport]);

    const getDetail = async () => {
        try {
            setIsLoading(true)
            let resp = await getIncentiveReportDetail(incentiveReportId!)
            let respJson = await resp.json()
            setIncentiveReport(respJson.data)

        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const updateItem = (item: Incentive) => {
        setIsLoading(true)
        updateItemIncentiveReport(incentiveReportId!, item.id, {
            sick_leave: item.sick_leave,
            other_leave: item.other_leave,
            absent: item.absent
        })
            .then(v => {
                getDetail()
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => {
                setIsLoading(false)
            })
    }

    const generatePayroll = async () => {
        try {
            setIsLoading(true)
            for (const iterator of selectedIncentives) {
                let respNumber = await getAutoNumber()
                let respNumberJson = await respNumber.json()

                const resp = await addPayRoll({
                    pay_roll_number: respNumberJson.data,
                    title: "",
                    notes: `Generate From ${incentiveReport?.report_number}`,
                    start_date: moment(incentiveReport?.start_date).toISOString(),
                    end_date: moment(incentiveReport?.end_date).toISOString(),
                    employee_id: iterator.employee_id,
                    is_gross_up: settting?.is_gross_up ?? false,
                    is_effective_rate_average: settting?.is_effective_rate_average ?? false,
                })
                const respJson = await resp.json()

                let payrollId = respJson.data.last_id
                await addPayRollItem({
                    pay_roll_id: payrollId,
                    item_type: 'ALLOWANCE',
                    title: `Insentif/Komisi`,
                    notes: '',
                    is_default: false,
                    is_deductible: false,
                    is_tax: false,
                    tax_auto_count: false,
                    is_tax_cost: false,
                    is_tax_allowance: false,
                    amount: iterator.total_incentive,
                })


            }
            Swal.fire(`Perhatian`, `Pay Roll berhasil di generate, silakan masuk ke menu payroll`, 'success')
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }
    return (<DashboardLayout permission='read_incentive_report'>
        <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Laporan Insentif"}</h3>
                </div>
                <InlineForm style={{ marginBottom: 10 }} title="No. Laporan">
                    {incentiveReport?.report_number}
                </InlineForm>
                <InlineForm style={{ marginBottom: 10 }} title="Tgl">
                    <Moment format='DD/MM/YYYY'>{incentiveReport?.start_date}</Moment> ~ <Moment format='DD/MM/YYYY'>{incentiveReport?.end_date}</Moment>
                </InlineForm>
                <InlineForm style={{ marginBottom: 10, alignItems: "start" }} title="Keterangan">
                    {editable ? <textarea placeholder='Keterangan ....' id={`incentiveReport-${incentiveReport?.id}`} defaultValue={incentiveReport?.description} onKeyUp={(el) => {
                        if (el.key == "Enter") {
                            document.getElementById(`incentiveReport-${incentiveReport?.id}`)!.blur();
                        }
                    }} onBlur={(el) => {
                        let editted: IncentiveReport = {
                            ...incentiveReport!,
                            description: el.target.value,
                        }
                        setIncentiveReport(editted)
                    }} /> : incentiveReport?.description}

                </InlineForm>
                <InlineForm style={{ marginBottom: 10 }} title="Dibuat">
                    {incentiveReport?.user_name}
                </InlineForm>
                <InlineForm style={{ marginBottom: 10, alignItems: 'start' }} title="Status" >
                    <div>
                        {incentiveReport?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={incentiveReport?.status} />}
                        {incentiveReport?.status == "PROCESSING" && <Badge className='text-center' color='blue' content={incentiveReport?.status} />}
                        {incentiveReport?.status == "APPROVED" && <Badge className='text-center' color='green' content={incentiveReport?.status} />}
                        {incentiveReport?.status == "REJECTED" && <Badge className='text-center' color='red' content={incentiveReport?.status} />}
                    </div>
                    {incentiveReport?.status == "DRAFT" && <Button onClick={() => {
                        editIncentiveReport(incentiveReportId!, {
                            description: incentiveReport?.description ?? "",
                            status: 'PROCESSING'
                        }).then(() => getDetail())
                    }} className='mt-4 w-32' appearance='primary' color='blue'><BsFloppy2 className='mr-2' />Simpan</Button>}
                    {incentiveReport?.status == "PROCESSING" && <Button onClick={() => {
                        editIncentiveReport(incentiveReportId!, {
                            description: incentiveReport?.description ?? "",
                            status: 'FINISHED'
                        }).then(() => getDetail())
                    }} className='mt-4 w-32' appearance='primary' color='green'><BsCheck2 className='mr-2' />Selesai</Button>}
                </InlineForm>
            </div>
            <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Summary"}</h3>
                </div>
                <InlineForm style={{ marginBottom: 10 }} title="Total Penjualan">
                    {(money(incentives.map(e => e.total_sales).reduce((a, b) => a + b, 0), 0))}
                </InlineForm>
                <InlineForm style={{ marginBottom: 10 }} title="Total Komisi">
                    {(money(incentives.map(e => e.total_incentive).reduce((a, b) => a + b, 0), 0))}
                </InlineForm>
            </div>
        </div>
        <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
            <div className='flex justify-between'>
                <h3 className='font-bold mb-4 text-black text-lg'>{"Detail Insentif"}</h3>
                {editable &&
                    <Button size='sm' onClick={() => setModalOpen(true)}><PlusIcon className='w-4 mr-2' />Tambah Salesman</Button>
                }
                {incentiveReport?.status == "PROCESSING" &&
                    <Button disabled={selectedIncentives.length == 0} color='blue' appearance='primary' size='sm' onClick={() => generatePayroll()}><LuWallet2 className='w-4 mr-2' />Generate Payroll </Button>
                }

            </div>
            <div className="overflow-y-auto mt-8">
                <table className="w-full h-full text-xs text-left rtl:text-right text-gray-700">
                    <thead className="text-base text-gray-700 font-semibold ">
                        <tr className=' '>
                            <th rowSpan={2} scope="col" className={`border text-sm px-3 py-1`}>No</th>
                            <th rowSpan={2} scope="col" className={`border text-sm px-3 py-1 `}>Salesman</th>
                            <th rowSpan={2} scope="col" className={`border text-sm px-3 py-1 text-center`}>Total Penjualan</th>
                            {(incentiveReport?.shops ?? []).map(s => (<th key={s.id} colSpan={2} scope="col" className={`border text-sm px-3 py-1 text-center`}>{s.name}</th>))}
                            <th rowSpan={2} scope="col" className={`border text-sm px-3 py-1 text-center`}>Total Komisi</th>
                            <th colSpan={3} scope="col" className={`border text-sm px-3 py-1 text-center`}>Kehadiran</th>
                            <th rowSpan={2} scope="col" className={`border text-sm px-3 py-1 text-center`}>Komisi yang didapat</th>
                            <th rowSpan={2} scope="col" className={`border text-sm px-3 py-1 text-center`}>
                                {incentiveReport?.status == "PROCESSING" &&
                                    <Checkbox onChange={(val, checked, _) => {
                                        if (checked) {
                                            setSelectedIncentives([...incentives])
                                        } else {
                                            setSelectedIncentives([])
                                        }
                                    }} checked={incentives.length == selectedIncentives.length} />
                                }
                            </th>
                        </tr>
                        <tr className=' '>

                            {(incentiveReport?.shops ?? []).map(s => (<th key={s.id} colSpan={2} scope="col" className={`p-0 text-center`}>
                                <table className='w-full'>
                                    <tbody>
                                        <tr>
                                            <td scope="col" className={`px-3 text-center py-1  w-1/2 border text-sm`}>Penjualan</td>
                                            <td scope="col" className={`px-3 text-center py-1  w-1/2 border text-sm`}>Komisi</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </th>))}
                            <th scope="col" className={`border text-sm px-3 py-1 text-center`}>S</th>
                            <th scope="col" className={`border text-sm px-3 py-1 text-center`}>I</th>
                            <th scope="col" className={`border text-sm px-3 py-1 text-center`}>A</th>
                        </tr>
                    </thead>
                    <tbody className="text-base text-gray-700 ">
                        {incentives.map(e => (<tr key={e.id}>
                            <td scope="col" className={`px-3 py-1 border text-sm`}>{incentives.indexOf(e) + 1}</td>
                            <td scope="col" className={`px-3 py-1 border text-sm flex justify-between items-center h-full`}>
                                <span>{e.employee_name}</span>
                                <LuCalendarClock className='w-3 cursor-pointer' onClick={async () => {
                                    try {
                                        setIsLoading(true)
                                        let att = await getAttendances({ page: 1, limit: 0 }, { employeeID: e.employee_id, dateRange: [moment(incentiveReport?.start_date).toDate(), moment(incentiveReport?.end_date).toDate()] })
                                        let attJson = await att.json()
                                        setAttendances(attJson.data)
                                        let attSum = await getAttendanceSummaries(e.employee_id, { page: 1, limit: 0 }, { dateRange: [moment(incentiveReport?.start_date).toDate(), moment(incentiveReport?.end_date).toDate()] })
                                        let attSumJson = await attSum.json()
                                        let leaves = await getLeaves({ page: 1, limit: 0, order: "leaves.start_date asc" }, { status: "APPROVED", employeeID: e.employee_id, dateRange: [moment(incentiveReport?.start_date).toDate(), moment(incentiveReport?.end_date).toDate()], })
                                        let leavesJson = await leaves.json()
                                        setLeaves(leavesJson.data)
                                        let absent = await getLeaves({ page: 1, limit: 0, order: "leaves.start_date asc" }, { employeeID: e.employee_id, dateRange: [moment(incentiveReport?.start_date).toDate(), moment(incentiveReport?.end_date).toDate()], absent: true })
                                        let absentJson = await absent.json()
                                        setAbsents(absentJson.data)

                                        setAttendanceSummary(attSumJson.data)
                                        setModalAttendanceSummaryOpen(true)
                                        setSelectedIncentive(e)

                                    } catch (error) {
                                        Swal.fire(`Perhatian`, `${error}`, 'error')
                                    } finally {
                                        setIsLoading(false)
                                    }
                                }} />
                            </td>
                            <td scope="col" className={`px-3 py-1 border text-sm text-center hover:font-bold cursor-pointer`} onClick={() => {
                                setSelectedIncentiveId(e.id)
                                setSelectedShopId(null)

                                getSales({ order: "date asc", page: 1, limit: 0 }, { incentive_id: e.id })
                                    .then(v => v.json())
                                    .then(v => {

                                        setSales(v.data)
                                        setSummaries(e.summaries)
                                        setModalSummaryOpen(true)

                                    })
                            }}>
                                {money(e.total_sales, 0)}
                            </td>


                            {(incentiveReport?.shops ?? []).map(s => {
                                let data = e.incentive_shops.find(is => is.shop_id == s.id)
                                if (!data) return <td key={randomStr(3)} colSpan={2} scope="col" className={`p-0`}>
                                    <table className='w-full' style={{ height: '-webkit-fill-available' }}>
                                        <tbody>
                                            <tr>
                                                <td scope="col" className={`border text-sm text-center px-3 py-1  w-1/2`}>-</td>
                                                <td scope="col" className={`border text-sm text-center px-3 py-1  w-1/2`}>-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                                return (
                                    <td scope="col" key={s.id} colSpan={2} className={` p-0`}>
                                        <table className='w-full' style={{ height: '-webkit-fill-available' }}>
                                            <tbody>
                                                <tr onClick={() => {
                                                    setSelectedIncentiveId(e.id)
                                                    setSelectedShopId(s.id)
                                                    getSales({ order: "date asc", page: 1, limit: 0 }, { incentive_id: e.id, shop_id: s.id })
                                                        .then(v => v.json())
                                                        .then(v => {
                                                            setSales(v.data)
                                                            setSummaries(data.summaries)
                                                            setModalSummaryOpen(true)
                                                        })
                                                }}>
                                                    <td scope="col" className={`border text-sm text-center px-3 py-1  w-1/2 hover:font-bold cursor-pointer`} >{money(data.total_sales, 0)}</td>
                                                    <td scope="col" className={`border text-sm text-center px-3 py-1  w-1/2 hover:font-bold cursor-pointer`}>{money(data.total_incentive_bruto, 0)}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>

                                );
                            })}



                            <td scope="col" className={`px-3 py-1 border text-sm text-center hover:font-bold cursor-pointer`} onClick={() => {
                                setSelectedIncentiveId(e.id)
                                setSelectedShopId(null)
                                getSales({ order: "date asc", page: 1, limit: 0 }, { incentive_id: e.id })
                                    .then(v => v.json())
                                    .then(v => {
                                        setSales(v.data)
                                        setSummaries(e.summaries)
                                        setModalSummaryOpen(true)
                                    })
                            }}>{money(e.total_incentive_bruto, 0)}</td>
                            <td scope="col" className={`px-3 py-1 border text-sm text-center`}>
                                {mountedInput ?
                                    <input disabled={!editable} type='number' id={`sick_leave-${e.id}`} onKeyUp={(el) => {
                                        if (el.key == "Enter") {
                                            document.getElementById(`sick_leave-${e.id}`)!.blur();
                                        }
                                    }} onBlur={(el) => {
                                        let editted = {
                                            ...e,
                                            sick_leave: parseInt(el.target.value)
                                        }
                                        updateItem(editted)
                                    }} className='w-10 text-center' defaultValue={e.sick_leave} />
                                    : <div className='w-10 h-5'></div>}
                            </td>
                            <td scope="col" className={`px-3 py-1 border text-sm text-center`}>
                                {mountedInput ?
                                    <input disabled={!editable} type='number' id={`other_leave-${e.id}`} onKeyUp={(el) => {
                                        if (el.key == "Enter") {
                                            document.getElementById(`other_leave-${e.id}`)!.blur();
                                        }
                                    }} onBlur={(el) => {
                                        let editted = {
                                            ...e,
                                            other_leave: parseInt(el.target.value)
                                        }
                                        updateItem(editted)
                                    }} className='w-10 text-center' defaultValue={e.other_leave} />
                                    : <div className='w-10 h-5'></div>}
                            </td>
                            <td scope="col" className={`px-3 py-1 border text-sm text-center`}>
                                {mountedInput ?
                                    <input disabled={!editable} type='number' id={`absent-${e.id}`} onKeyUp={(el) => {
                                        if (el.key == "Enter") {
                                            document.getElementById(`absent-${e.id}`)!.blur();
                                        }
                                    }} onBlur={(el) => {
                                        let editted = {
                                            ...e,
                                            absent: parseInt(el.target.value)
                                        }
                                        updateItem(editted)
                                    }} className='w-10 text-center' defaultValue={e.absent} />
                                    : <div className='w-10 h-5'></div>}
                            </td>
                            <td scope="col" className={`px-3 py-1 border text-sm text-center`}>{money(e.total_incentive, 0)}</td>
                            <td scope="col" className={`px-3 py-1 border text-sm text-center`}>
                                <div className='justify-center flex'>
                                    {editable &&
                                        <TrashIcon
                                            className=" h-5 w-5 text-red-400 hover:text-red-600"
                                            aria-hidden="true"
                                            onClick={() => {
                                                confirmDelete(() => {
                                                    deleteIncentive(e.id).then(v => getDetail())
                                                })
                                            }}
                                        />
                                    }
                                    {incentiveReport?.status == "PROCESSING" &&
                                        <Checkbox onChange={(val, checked, _) => {
                                            if (checked) {
                                                setSelectedIncentives([...selectedIncentives, e])
                                            } else {
                                                setSelectedIncentives([...selectedIncentives.filter(p => p != e)])
                                            }
                                        }} checked={selectedIncentives.includes(e)} />
                                    }
                                </div>
                            </td>
                        </tr>))}

                    </tbody>
                </table>
            </div>

        </div>
        <Modal open={modalOpen} onClose={() => {
            setModalOpen(false)
        }}>
            <Modal.Header>Tambah Salesman</Modal.Header>
            <Modal.Body>
                <InlineForm title="Salesman">
                    <TagPicker
                        searchable
                        valueKey='id'
                        labelKey='full_name'
                        onChange={(val) => {
                            setEmployeeIds(val)
                        }}
                        onSearch={(val) => {
                            if (val)
                                getAllEmployees(val)
                        }}
                        value={employeeIds}
                        data={employees} className=" block" />
                </InlineForm>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={async () => {

                    try {
                        setIsLoading(true)
                        for (const employeeId of employeeIds) {
                            await addEmployeeIncentiveReport(incentiveReportId!, employeeId)
                        }

                        getAllEmployees("")
                        getAllIncentives()
                        setModalOpen(false)
                    } catch (error) {
                        Swal.fire(`Perhatian`, `${error}`, 'error')
                    } finally {
                        setIsLoading(false)
                    }





                }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
            </Modal.Footer>
        </Modal>

        <Modal size="full" open={modalSummaryOpen} onClose={() => {
            setModalSummaryOpen(false)
        }}>
            <Modal.Header>
                <div className='flex justify-between'>
                    Summary Penjualan & Komisi


                </div>
            </Modal.Header>
            <Modal.Body>
                <Tabs defaultActiveKey="1" reversed appearance="subtle">
                    <Tabs.Tab eventKey="1" title="Penjualan">
                        <div className='flex flex-col ' style={{ height: "calc(100vh - 140px)" }}>
                            <div className='flex justify-end mb-8'>
                                <Button onClick={async () => {
                                    try {
                                        setIsLoading(true)
                                        const resp = await getSales({ order: "date asc", page: 1, limit: 0 }, { incentive_id: selectedIncentiveId, shop_id: selectedShopId, download: true })
                                        const filename = resp.headers.get("Content-Description")
                                        const respBlob = await resp.blob()

                                        saveAs(respBlob, filename ?? "download.xlsx")
                                        // getAllSale()
                                    } catch (error) {
                                        Swal.fire(`Perhatian`, `${error}`, 'error')
                                    } finally {
                                        setIsLoading(false)

                                    }

                                }}><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Laporan</Button>
                            </div>
                            <div className=' overflow-auto flex-1'>
                                <CustomTable

                                    switchHeader
                                    footer={[{
                                        cells: [
                                            { data: "", },
                                            { data: "Total", colSpan: 4, className: "font-bold" },
                                            { data: money(sales.map(e => e.total).reduce((a, b) => a + b, 0), 0), className: "text-right font-bold" }
                                        ]
                                    }]}
                                    headers={["No", "Tgl", "Produk", "Qty", "Harga", "Total", "Salesman", "Toko"]} headerClasses={["", "", "", "text-right", "text-right", "text-right"]} datasets={sales.map(e => ({
                                        cells: [
                                            { data: (sales.indexOf(e) + 1) },
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
                                            {
                                                data: <div className=' hover:font-bold cursor-pointer' onClick={() => nav(`/employee/${e.employee_id}`)}>
                                                    {e.employee_name}
                                                </div>
                                            },
                                            { data: e.shop_name },

                                        ]
                                    }))} />
                            </div>
                        </div>
                    </Tabs.Tab>
                    <Tabs.Tab eventKey="2" title="Komisi">
                        <div className='flex flex-col ' style={{ height: "calc(100vh - 140px)" }}>
                            <div className=' overflow-auto flex-1'>
                                <CustomTable
                                    footer={[{
                                        cells: [
                                            { data: "", },
                                            { data: "Total", colSpan: 3, className: "font-bold" },
                                            { data: money(summaries.map(e => e.total_comission).reduce((a, b) => a + b, 0), 0), className: "text-right font-bold" }
                                        ]
                                    }]}
                                    headers={["No", "Kategori", "Penjualan", "Komisi", "Total Komisi"]} headerClasses={[
                                        "", "", "text-right", "text-right", "text-right", "text-right"
                                    ]} datasets={summaries.map(e => ({
                                        cells: [
                                            { data: summaries.indexOf(e) + 1 },
                                            { data: e.name },
                                            { data: money(e.total, 0), className: "text-right" },
                                            { data: `${money(e.commission_percent * 100)}%`, className: "text-right" },
                                            { data: money(e.total_comission, 0), className: "text-right" },
                                        ]
                                    }))} />

                            </div>
                        </div>
                    </Tabs.Tab>

                </Tabs>

            </Modal.Body>
        </Modal>
        <Modal size="full" open={modalAttendanceSummaryOpen} onClose={() => {
            setModalAttendanceSummaryOpen(false)
            setAttendances([])
            setLeaves([])
            setAbsents([])
            setAttendanceSummary(null)
        }}>
            <Modal.Header>
                <div className='flex justify-between'>
                    Summary Kehadiran


                </div>
            </Modal.Header>
            <Modal.Body>
                <div className='grid grid-cols-2 gap-4 mb-8'>
                    <Panel header="Data Karyawan" bordered className='' >
                        <InlineForm title="Name Lengkap" style={{ marginBottom: 10 }}>{attendanceSummary?.employee_name}</InlineForm>
                        <InlineForm title="Total Hari Kerja" style={{ marginBottom: 10 }}>{money(attendanceSummary?.total_working_days)} Hari</InlineForm>
                        <InlineForm title="Total Jam Kerja" style={{ marginBottom: 10 }}>{money(attendanceSummary?.total_working_hours)} Jam</InlineForm>
                        <InlineForm title="Jam Kerja per hari" style={{ marginBottom: 10 }}>{(attendanceSummary?.daily_working_hours)} Jam</InlineForm>

                    </Panel>
                    <Panel header="Summary" bordered className='' >
                        <InlineForm title="Total Hari" style={{ marginBottom: 10 }}>{money(attendanceSummary?.total_days)} Hari</InlineForm>
                        <InlineForm title="Total Hari (Full Time)" style={{ marginBottom: 10 }}>{money(attendanceSummary?.total_full_days)} Hari</InlineForm>
                        <InlineForm title="Total Jam" style={{ marginBottom: 10 }}>{numberToDuration(attendanceSummary?.total_hours)}</InlineForm>
                        <InlineForm title="Izin" style={{ marginBottom: 10 }}>
                            <ul>
                                {leaves.map(e => (<li key={e.id}>
                                    {e.request_type == "FULL_DAY" && <small><Moment format='DD/MM/YYYY'>{e.start_date}</Moment>~<Moment format='DD/MM/YYYY'>{e.end_date}</Moment></small>}{' : '}
                                    {e.description}
                                </li>))}
                            </ul>
                        </InlineForm>
                        <InlineForm title="Total Sakit" style={{ marginBottom: 10 }}>{money(leaves.filter(e => e.sick).map(e => e.diff).reduce((a, b) => a + b, 0))}</InlineForm>
                        <InlineForm title="Total Izin" style={{ marginBottom: 10 }}>{money(leaves.filter(e => !e.sick).map(e => e.diff).reduce((a, b) => a + b, 0))}</InlineForm>
                        <InlineForm title="Total Alpa" style={{ marginBottom: 10 }}>{money(absents.length)}</InlineForm>
                        {editable &&
                            <InlineForm title="" style={{ marginBottom: 10 }}>
                                <Button onClick={() => {
                                    setModalAttendanceSummaryOpen(false)
                                    let editted = {
                                        ...selectedIncentive!,
                                        sick_leave: leaves.filter(e => e.sick).map(e => e.diff).reduce((a, b) => a + b, 0),
                                        other_leave: leaves.filter(e => !e.sick).map(e => e.diff).reduce((a, b) => a + b, 0),
                                        absent: absents.length
                                    }
                                    updateItem(editted)
                                }} size='sm' appearance='primary' color='green'>Update Data Kehadiran</Button>
                            </InlineForm>
                        }
                    </Panel>
                </div>

                <CustomTable className=''

                    headers={["No", "Tgl", "Absensi", "Durasi", "Overtime", "Keterangan"]} headerClasses={["", "", "", "", "", "w-64"]} datasets={attendances.map(e => ({
                        cells: [{ data: attendances.indexOf(e) + 1 },
                        { data: <Moment format='DD MMM YYYY'>{e.clock_in}</Moment> },
                        {
                            data: <div className='flex '>

                                <Moment format='HH:mm'>{e.clock_in}</Moment>
                                {e.clock_out &&
                                    <span>{' '}{' ~ '}<Moment format='HH:mm'>{e.clock_out}</Moment></span>
                                }


                            </div>
                        },
                        {
                            data:
                                e.clock_out &&
                                <div>
                                    {numberToDuration(moment(e.clock_out).diff(moment(e.clock_in), 'minutes'))}
                                </div>


                        },
                        {
                            data: e.overtime &&
                                <div>
                                    {`${countOverTime(e)}`}
                                </div>
                        },
                        {
                            data:
                                <div>
                                    <div>
                                        <p className='font-bold'>Masuk :</p>
                                        <p>{e.clock_in_notes}</p>
                                    </div>
                                    {e.clock_out &&
                                        <div>
                                            <p className='font-bold'>Keluar :</p>
                                            <p>{e.clock_out_notes}</p>
                                        </div>
                                    }
                                </div>
                        },


                        ], className: "hover:bg-gray-50 border-b last:border-b-0"
                    }))} />
            </Modal.Body>
        </Modal>
    </DashboardLayout>);
}
export default IncentiveReportDetail;