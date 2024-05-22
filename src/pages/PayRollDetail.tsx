import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Attendance, AttendanceReq } from '@/model/attendance';
import { Employee } from '@/model/employee';
import { Leave } from '@/model/leave';
import { PayRoll } from '@/model/pay_roll';
import { Schedule } from '@/model/schedule';
import { LoadingContext } from '@/objects/loading_context';
import { addAttendance, deleteAttendance, editAttendance, getAttendances } from '@/repositories/attendance';
import { getEmployeeDetail } from '@/repositories/employee';
import { getLeaves } from '@/repositories/leave';
import { editPayRoll, getPayRollDetail } from '@/repositories/pay_roll';
import { deletePayRollItem, editPayRollItem } from '@/repositories/pay_roll_item';
import { getRoleDetail } from '@/repositories/role';
import { confirmDelete, countOverTime, getDays, initials, money, numberToDuration, parseAmount, stringHourToNumber } from '@/utils/helper';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import saveAs from 'file-saver';
import moment from 'moment';
import 'moment/locale/id';
import { useContext, useEffect, useState, type FC } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { RiFileDownloadFill } from 'react-icons/ri';
import Moment from 'react-moment';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Badge, Button, Panel, Toggle } from 'rsuite';
import Swal from 'sweetalert2';

interface PayRollDetailProps { }

const PayRollDetail: FC<PayRollDetailProps> = ({ }) => {
    const nav = useNavigate()
    let { payRollId } = useParams()
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [payRoll, setPayRoll] = useState<PayRoll | null>(null);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [detailExpanded, setDetailExpanded] = useState(true);
    const [attendancecExpanded, setAttendanceExpanded] = useState(true);
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [dateAttendanceRanges, setDateAttendanceRanges] = useState<moment.Moment[]>([]);
    const [totalDays, setTotalDays] = useState(0);
    const [totalHours, setTotalHours] = useState(0);
    const [totalOvertime, setTotalOvertime] = useState(0);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [itemExpanded, setItemExpanded] = useState(true);
    const [editable, setEditable] = useState(true);
    const [mountedInput, setMountedInput] = useState(true);

    useEffect(() => {
        getDetail()

    }, []);

    useEffect(() => {
        // console.log(payRoll)
        if (payRoll) {
            getAttendances({ page: 1, limit: 1000 }, {
                employeeID: payRoll.employee_id,
                dateRange: [moment(payRoll.start_date).toDate(), moment(payRoll.end_date + " 23:59:59").toDate()]
            })
                .then(v => v.json())
                .then(v => setAttendances(v.data))
            getEmployeeDetail(payRoll.employee_id)
                .then(v => v.json())
                .then(v => setEmployee(v.data))

            getAllLeaves()
            setMountedInput(false)
            setTimeout(() => {
                setMountedInput(true)
            }, 60);
        }
    }, [payRoll]);

    useEffect(() => {
        if ((employee?.schedules ?? []).length > 0) {

        }
    }, [employee]);

    const getAllLeaves = async () => {
        try {
            setIsLoading(true)
            getLeaves({ page: 1, limit: 100 }, {
                employeeID: payRoll!.employee_id,
                status: "APPROVED",
                dateRange: [moment(payRoll!.start_date).toDate(), moment(payRoll!.end_date + " 23:59:59").toDate()]
            })
                .then(v => v.json())
                .then(v => setLeaves(v.data))
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (payRoll) {
            let firstDay = moment(payRoll.start_date).startOf('month').date()
            let endDay = moment(payRoll.end_date).endOf('month').date()
            let ranges = []
            let totalDays = 0
            let totalHours = 0
            let totalOvertime = 0
            for (let index = firstDay; index <= endDay; index++) {
                let day = moment(payRoll.start_date).startOf('month').add(index - 1, 'day')
                ranges.push(day)
                let att = getAttendancesFromRange(day)
                for (const a of att) {
                    if (a.clock_out && a.clock_in)
                        totalHours += (moment(a.clock_out).diff(moment(a.clock_in), "minutes"))
                    if (a.overtime) totalOvertime += stringHourToNumber(a.overtime)
                }
                if (att.length) {
                    totalDays++
                }

            }
            setTotalDays(totalDays)
            setTotalHours(totalHours)
            setTotalOvertime(totalOvertime)
            setDateAttendanceRanges(ranges)
        }

    }, [payRoll, attendances]);
    const getDetail = async () => {
        try {
            setIsLoading(true)
            let resp = await getPayRollDetail(payRollId!)
            let respJson = await resp.json()
            setPayRoll(respJson.data)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const getAttendancesFromRange = (date: moment.Moment): Attendance[] => {
        return attendances.filter(e => moment(e.clock_in).format("DD-MM-YYYY") == date.format("DD-MM-YYYY"))
    }

    const countPercentage = (from: number, to: number) => {
        if (to == 0) return null
        let percent = from / to * 100
        if (percent < 50) return <Badge content={`${money(percent)} %`} />
        if (percent >= 50 && percent < 70) return <Badge color='orange' content={`${money(percent)} %`} />
        return <Badge color='green' content={`${money(percent)} %`} />
    }

    const newAttendance = async (item: AttendanceReq) => {
        try {
            addAttendance(item)
            getDetail()
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const updateAttendance = (id: string, item: AttendanceReq) => {
        try {
            editAttendance(id, item)
            getDetail()
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }


    return (<DashboardLayout permission='read_pay_roll'>
        <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8'>
            <div className='flex justify-between items-center'>
                <h3 className='font-bold mb-4 text-black text-lg '>Pay Roll Detail</h3>
                {detailExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setDetailExpanded(!detailExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setDetailExpanded(!detailExpanded)} />}
            </div>
            {detailExpanded &&
                <div className='grid grid-cols-4 gap-4'>
                    <Panel bordered header="Info Payroll" className='col-span-2'>
                        <InlineForm title="Periode" style={{ marginBottom: 15 }}>
                            <Moment format='DD MMM YYYY'>{payRoll?.start_date}</Moment> ~ <Moment format='DD MMM YYYY'>{payRoll?.end_date}</Moment>
                        </InlineForm>
                        <InlineForm title="Jumlah hari kerja" style={{ marginBottom: 15 }}>
                            {totalDays} Hari {countPercentage(totalDays, (employee?.total_working_days ?? 0))}
                        </InlineForm>

                        <InlineForm title="Jumlah Jam kerja" style={{ marginBottom: 15 }}>
                            {numberToDuration(totalHours)} {countPercentage(totalHours / 60, (employee?.total_working_hours ?? 0))}
                        </InlineForm>

                        <InlineForm title="Total Overtime" style={{ marginBottom: 15 }}>
                            {numberToDuration(totalOvertime)}
                        </InlineForm>
                        <InlineForm title="TER" style={{ marginBottom: 15 }} hints='(Tarif Efektif Rata-Rata) digunakan untuk menentukan tarif pajak efektif yang akan dikenakan pada penghasilan karyawan atau individu, berlaku dari Januari 2024'>
                            <Toggle onChange={(checked) => {
                                setPayRoll({
                                    ...payRoll!,
                                    is_effective_rate_average: checked
                                })
                                setIsLoading(true)
                                editPayRoll(payRoll!.id, {
                                    title: payRoll?.title ?? "",
                                    notes: payRoll?.notes ?? "",
                                    employee_id: payRoll?.employee_id!,
                                    start_date: moment(payRoll?.start_date).toISOString(),
                                    end_date: moment(payRoll?.end_date).toISOString(),
                                    is_effective_rate_average: checked,
                                    is_gross_up: payRoll!.is_gross_up,
                                }).then(v => getDetail())
                                    .finally(() => setIsLoading(false))

                            }} checked={payRoll?.is_effective_rate_average} />
                        </InlineForm>
                        <InlineForm title="Gross Up" style={{ marginBottom: 15 }} hints='metode dimana perusahaan memberikan tunjangan pajak yang besarnya sama dengan PPh 21 terutang.'>
                            <Toggle onChange={(checked) => {
                                setPayRoll({
                                    ...payRoll!,
                                    is_gross_up: checked
                                })
                                setIsLoading(true)
                                editPayRoll(payRoll!.id, {
                                    title: payRoll?.title ?? "",
                                    notes: payRoll?.notes ?? "",
                                    employee_id: payRoll?.employee_id!,
                                    start_date: moment(payRoll?.start_date).toISOString(),
                                    end_date: moment(payRoll?.end_date).toISOString(),
                                    is_effective_rate_average: payRoll!.is_effective_rate_average,
                                    is_gross_up: checked
                                }).then(v => getDetail())
                                    .finally(() => setIsLoading(false))

                            }} checked={payRoll?.is_gross_up} />
                        </InlineForm>
                        <InlineForm title="Status" style={{ marginBottom: 15 }} >
                            {payRoll?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={payRoll?.status} />}
                            {payRoll?.status == "REVIEWED" && <Badge className='text-center' color='blue' content={payRoll?.status} />}
                            {payRoll?.status == "APPROVED" && <Badge className='text-center' color='green' content={payRoll?.status} />}
                            {payRoll?.status == "REJECTED" && <Badge className='text-center' color='red' content={payRoll?.status} />}
                        </InlineForm>
                    </Panel>
                    <Panel bordered header="Info Karyawan" className='col-span-2'>
                        <div className="grid  grid-cols-4 gap-4">
                            <div className='col-span-3'>
                                <InlineForm title="Nama" style={{ marginBottom: 15 }}>
                                    <div onClick={() => nav(`/employee/${employee?.id}`)}>
                                        {employee?.full_name}

                                    </div>
                                </InlineForm>
                                <InlineForm title="NIP/NIK" style={{ marginBottom: 15 }}>
                                    {employee?.employee_identity_number}
                                </InlineForm>
                                <InlineForm title="Jabatan" style={{ marginBottom: 15 }}>
                                    {employee?.job_title}
                                </InlineForm>
                                <InlineForm title="Jumlah hari kerja wajib" style={{ marginBottom: 15 }}>
                                    {employee?.total_working_days} Hari
                                </InlineForm>
                                <InlineForm title="Jumlah Jam kerja wajib" style={{ marginBottom: 15 }}>
                                    {employee?.total_working_hours} Jam
                                </InlineForm>
                                <InlineForm title="Jam Kerja per Hari" style={{ marginBottom: 15 }}>
                                    {numberToDuration((employee?.daily_working_hours ?? 0) * 60)}
                                </InlineForm>
                            </div>
                            <div className='col-span-1 flex justify-center '>
                                <Avatar className='mr-2' bordered size={'xxl'} circle src={employee?.picture_url}
                                    alt={initials(employee?.full_name)} />
                            </div>
                        </div>

                    </Panel>
                </div>
            }
        </div>
        <div className='grid grid-cols-4 gap-4  '>
            <div className=' col-span-3'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-4'>
                    <div className='flex justify-between mb-2'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Uraian"}</h3>
                        {itemExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setItemExpanded(!itemExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setItemExpanded(!itemExpanded)} />}
                    </div>
                    {itemExpanded &&
                        <div className=' overflow-auto'>
                            <table className="w-full h-full text-sm text-left rtl:text-right text-gray-700">
                                <thead>
                                    <tr>
                                        <td colSpan={2}>
                                            <h3 className='p-2 text-xl font-bold'>Pemasukan</h3>
                                        </td>
                                    </tr>
                                </thead>
                                <thead className="text-base text-gray-700 font-semibold " >
                                    <tr>
                                        <th scope="col" className={`px-6 py-3 `}>Keterangan</th>
                                        <th scope="col" className={`px-6 py-3 text-right`}>Jumlah</th>
                                        <th scope="col" className={`px-6 py-3 text-right w-16`}></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {(payRoll?.items ?? []).filter(e => e.item_type != "DEDUCTION").map(e => (<tr key={e.id}>
                                        <td scope="col" className={`px-6 py-3 `}>{e.title}</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {editable && !e.is_default && mountedInput ?
                                                <CurrencyInput
                                                    decimalsLimit={0}
                                                    id={`item-${e.id}`}
                                                    className='text-right'
                                                    groupSeparator="."
                                                    decimalSeparator=","
                                                    defaultValue={e.amount ?? 0}
                                                    onBlur={(el) => {
                                                        setIsLoading(true)
                                                        editPayRollItem(e.id, {
                                                            pay_roll_id: payRollId!,
                                                            item_type: e.item_type,
                                                            title: e.title,
                                                            notes: e.notes,
                                                            is_default: e.is_default,
                                                            is_deductible: e.is_deductible,
                                                            is_tax: e.is_tax,
                                                            tax_auto_count: e.tax_auto_count,
                                                            is_tax_cost: e.is_tax_cost,
                                                            is_tax_allowance: e.is_tax_allowance,
                                                            amount: parseAmount(el.target.value),
                                                        })
                                                            .then(() => getDetail())
                                                            .finally(() => {
                                                                setIsLoading(false)
                                                            })
                                                    }} onKeyUp={(el) => {
                                                        if (el.key == "Enter") {
                                                            document.getElementById(`item-${e.id}`)!.blur();
                                                        }
                                                    }}
                                                />
                                                : money(e.amount)}
                                        </td>
                                        <td>
                                            {!e.is_default &&
                                                <TrashIcon
                                                    className=" h-5 w-5 text-red-400 hover:text-red-600"
                                                    aria-hidden="true"
                                                    onClick={() => {
                                                        confirmDelete(() => {
                                                            deletePayRollItem(e.id).then(v => getDetail())
                                                        })
                                                    }}
                                                />
                                            }
                                        </td>
                                    </tr>))}
                                    {(payRoll?.tax_allowance ?? 0) > 0 &&
                                        <tr>
                                            <td scope="col" className={`px-6 py-3 `}>Tunjangan PPH</td>
                                            <td scope="col" className={`px-6 py-3 text-right`}>
                                                {money(payRoll?.tax_allowance, 0)}  </td>
                                            <td></td>
                                        </tr>
                                    }
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`}>Total Pemasukan</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.total_income, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-sm`}>Total Reimbursement</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.total_reimbursement, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                                <thead>
                                    <tr>
                                        <td colSpan={2}>
                                            <h3 className='p-2 text-xl font-bold'>Potongan</h3>
                                        </td>
                                    </tr>
                                </thead>
                                <thead className="text-base text-gray-700 font-semibold " >
                                    <tr>
                                        <th scope="col" className={`px-6 py-3 `}>Keterangan</th>
                                        <th scope="col" className={`px-6 py-3 text-right`}>Jumlah</th>
                                        <th scope="col" className={`px-6 py-3 text-right w-16`}></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {(payRoll?.items ?? []).filter(e => e.item_type == "DEDUCTION" && !e.is_tax_cost).map(e => (<tr key={e.id}>
                                        <td scope="col" className={`px-6 py-3 `}>{e.title}</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {editable && !e.is_default && !e.is_tax && mountedInput ?
                                                <CurrencyInput
                                                    decimalsLimit={0}
                                                    id={`item-${e.id}`}
                                                    className='text-right'
                                                    groupSeparator="."
                                                    decimalSeparator=","
                                                    defaultValue={e.amount}
                                                    onBlur={(el) => {
                                                        setIsLoading(true)
                                                        editPayRollItem(e.id, {
                                                            pay_roll_id: payRollId!,
                                                            item_type: e.item_type,
                                                            title: e.title,
                                                            notes: e.notes,
                                                            is_default: e.is_default,
                                                            is_deductible: e.is_deductible,
                                                            is_tax: e.is_tax,
                                                            tax_auto_count: e.tax_auto_count,
                                                            is_tax_cost: e.is_tax_cost,
                                                            is_tax_allowance: e.is_tax_allowance,
                                                            amount: parseAmount(el.target.value),
                                                        })
                                                            .then(() => getDetail())
                                                            .finally(() => {
                                                                setIsLoading(false)
                                                            })
                                                    }} onKeyUp={(el) => {
                                                        if (el.key == "Enter") {
                                                            document.getElementById(`item-${e.id}`)!.blur();
                                                        }
                                                    }}
                                                />
                                                : money(e.amount, 0)}
                                        </td>
                                        <td>
                                            {!e.is_default && !e.is_tax && !e.is_tax_allowance && !e.is_tax_cost &&
                                                <TrashIcon
                                                    className=" h-5 w-5 text-red-400 hover:text-red-600"
                                                    aria-hidden="true"
                                                    onClick={() => {
                                                        confirmDelete(() => {
                                                            deletePayRollItem(e.id).then(v => getDetail())
                                                        })
                                                    }}
                                                />
                                            }
                                        </td>
                                    </tr>))}
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`}>Total Potongan</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.total_deduction, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`}>Biaya Jabatan</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money(payRoll?.tax_cost, 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`}>Take Home Pay + Reimbursement</td>
                                        <td scope="col" className={`px-6 py-3 text-right`}>
                                            {money((payRoll?.take_home_pay ?? 0) + (payRoll?.total_reimbursement ?? 0), 0)}
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td scope="col" className={`px-6 py-3  font-bold text-base`}>Terbilang</td>
                                        <td scope="col" className={`px-6 py-3 text-right text-lg`} colSpan={2}>
                                            {(payRoll?.take_home_pay_reimbursement_counted)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    }


                </div>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                    <div className='flex justify-between mb-2'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Data Absensi"}</h3>
                        <div className=' flex items-center'>
                            <Button onClick={async () => {

                                try {
                                    setIsLoading(true)
                                    var resp = await getAttendances({ page: 1, limit: 1000 }, {
                                        dateRange: [moment(payRoll?.start_date).toDate(), moment(payRoll?.end_date + " 23:59:59").toDate()],
                                        employeeIDs: payRoll?.employee_id,

                                        download: true
                                    })
                                    let filename = resp.headers.get("Content-Description")
                                    var respBlob = await resp.blob()

                                    saveAs(respBlob, filename ?? "download.xlsx")

                                } catch (error) {
                                    Swal.fire(`Perhatian`, `${error}`, 'error')
                                } finally {
                                    setIsLoading(false)

                                }


                            }} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-2'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Laporan</Button>
                            {attendancecExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setAttendanceExpanded(!attendancecExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setAttendanceExpanded(!attendancecExpanded)} />}
                        </div>
                    </div>
                    {attendancecExpanded &&
                        <CustomTable className=''

                            headers={["No", "Tgl", "Jam Masuk", "Jam Keluar", "Durasi", "Overtime", ""]} headerClasses={["w-8"]} datasets={dateAttendanceRanges.map(e => {
                                let selAtt = getAttendancesFromRange(e)
                                return ({
                                    cells: [{ data: dateAttendanceRanges.indexOf(e) + 1, className: 'w-8' },
                                    {
                                        data:
                                            <div className={`${e.isoWeekday() == 7 ? 'text-red-400' : ''} flex flex-col`}>
                                                <p className=' text-sm'><Moment locale='id' format='dddd'>{e}</Moment></p>
                                                <Moment locale='id' format='DD MMM YYYY'>{e}</Moment>
                                            </div>
                                    }, {
                                        data: <div className='flex flex-col'>
                                            {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                <input disabled={!editable} className='w-24' id={`clockin-${a.id}`} type="time" defaultValue={moment(a.clock_in).format("HH:mm")} onBlur={(el) => {
                                                    var att = moment(moment(`${a.clock_in}`).format(`YYYY-MM-DD`) + " " + el.target.value).toISOString()
                                                    if (att) {
                                                        updateAttendance(a.id, {
                                                            clock_in: att
                                                        })
                                                    }
                                                }} onKeyUp={(el) => {
                                                    if (el.key == "Enter") {
                                                        document.getElementById(`clockin-${a.id}`)!.blur();
                                                    }
                                                }} />
                                            </div>))}
                                            {selAtt.length == 0 && <input disabled={!editable} className='w-24' id={`new-clockin-${e.toISOString()}`} type="time" defaultValue={undefined} onBlur={(el) => {
                                                var att = moment(moment(`${e}`).format(`YYYY-MM-DD`) + " " + el.target.value).toISOString()
                                                if (att) {
                                                    newAttendance({
                                                        clock_in: att,
                                                        employee_id: employee?.id!
                                                    })
                                                }
                                            }} onKeyUp={(el) => {
                                                if (el.key == "Enter") {
                                                    document.getElementById(`new-clockin-${e.toISOString()}`)!.blur();
                                                }
                                            }} />}
                                        </div>
                                    }, {
                                        data: <div className='flex flex-col'>
                                            {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                <input disabled={!editable} className='w-24' id={`clockout-${a.id}`} type="time" defaultValue={!a.clock_out ? "" : moment(a.clock_out).format("HH:mm")} onBlur={(el) => {
                                                    var att = moment(moment(`${e}`).format(`YYYY-MM-DD`) + " " + el.target.value).toISOString()
                                                    // if (!a.clock_out) {
                                                    //     att = moment(moment(`${e}`).format(`YYYY-MM-DD`) + " " + el.target.value).toISOString()
                                                    // }
                                                    if (att) {
                                                        updateAttendance(a.id, {
                                                            clock_in: a.clock_in,
                                                            clock_out: att,
                                                        })
                                                    }
                                                }} onKeyUp={(el) => {
                                                    if (el.key == "Enter") {
                                                        document.getElementById(`clockout-${a.id}`)!.blur();
                                                    }
                                                }} />
                                            </div>))}
                                        </div>
                                    },
                                    {
                                        data: <div>
                                            {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                {a.clock_in && a.clock_out &&
                                                    <div className={stringHourToNumber(a.working_duration) >= ((employee?.daily_working_hours ?? 0) * 60) ? '' : 'text-red-400'}>
                                                        {/* {numberToDuration(moment(a.clock_out).diff(moment(a.clock_in), 'minutes'))} */}
                                                        {a.working_duration}
                                                        <br />

                                                    </div>
                                                }
                                            </div>))}
                                        </div>
                                    },
                                    {
                                        data: <div>
                                            {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                {/* {`${countOverTime(a)}`} */}
                                                {a.overtime}
                                            </div>))}
                                        </div>
                                    },
                                    {
                                        data:
                                            <div>
                                                {selAtt.map(a => (<div className='mb-4' key={a.id}>
                                                    <TrashIcon
                                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                                        aria-hidden="true"
                                                        onClick={() => {
                                                            confirmDelete(() => {
                                                                deleteAttendance(a.id).then(v => getDetail())
                                                            })
                                                        }}
                                                    />
                                                </div>))}
                                            </div>
                                    }
                                    ], className: "hover:bg-gray-50 border-b last:border-b-0"
                                });
                            })} />
                    }
                </div>
            </div>
            <div className='col-span-1'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-4'>
                    <div className='flex justify-between'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Jadwal Kerja"}</h3>

                    </div>
                    <ul>
                        {(employee?.schedules ?? []).map(e => <li className='p-2 border-b hover:bg-gray-50 last:border-b-0' key={e.id}>
                            <h3 className=' font-bold text-sm'>{e.name}</h3>
                            <p>
                                {e.schedule_type == "WEEKLY" && getDays(e)}
                                {e.schedule_type == "SINGLE_DATE" && moment(e.start_date).format("DD MMM YYYY")}
                                {e.schedule_type == "DATERANGE" && `${moment(e.start_date).format("DD MMM YYYY")} ~ ${moment(e.end_date).format("DD MMM YYYY")}`}
                            </p>
                            <p>
                                {e.start_time} ~ {e.end_time}
                            </p>

                        </li>)}
                    </ul>
                </div>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg '>
                    <div className='flex justify-between'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Cuti & Izin"}</h3>

                    </div>
                    <ul>
                        {leaves.map(e => (<li key={e.id}>
                            <h3 className=' text-lg text-gray-800 leading-5'>{e.description}</h3>
                            {e.request_type == "FULL_DAY" && <div className='text-sm mt-2'> <Moment format='DD/MM/YYY'>{e.start_date}</Moment> ~ <Moment format='DD/MM/YYY'>{e.end_date}</Moment></div>}
                        </li>))}
                    </ul>
                </div>
            </div>
        </div>

    </DashboardLayout>);
}
export default PayRollDetail;