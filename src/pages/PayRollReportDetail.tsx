import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { PayRoll } from '@/model/pay_roll';
import { PayRollReport } from '@/model/pay_roll_report';
import { Setting } from '@/model/setting';
import { LoadingContext } from '@/objects/loading_context';
import { getPayRolls } from '@/repositories/pay_roll';
import { addItemPayRollReport, editPayRollReport, getPayRollReportDetail, payrollBankDownload } from '@/repositories/pay_roll_report';
import { getSettingDetail } from '@/repositories/setting';
import { money } from '@/utils/helper';
import { PlusIcon } from '@heroicons/react/24/outline';
import saveAs from 'file-saver';
import moment from 'moment';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsCheck2, BsFloppy2 } from 'react-icons/bs';
import { RiFileDownloadFill } from 'react-icons/ri';
import Moment from 'react-moment';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Checkbox } from 'rsuite';
import Swal from 'sweetalert2';

interface PayRollReportDetailProps { }

const PayRollReportDetail: FC<PayRollReportDetailProps> = ({ }) => {
    const nav = useNavigate()
    const { payRollReportId } = useParams()
    const [mounted, setMounted] = useState(false);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [payRollReport, setPayRollReport] = useState<PayRollReport | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [settting, setSettting] = useState<Setting | null>(null);
    const [editable, setEditable] = useState(true);
    const [mountedInput, setMountedInput] = useState(true);
    const [payRolls, setPayRolls] = useState<PayRoll[]>([]);
    const [selectedPayRolls, setSelectedPayRolls] = useState<PayRoll[]>([]);


    useEffect(() => {
        setMounted(true)
        getSettingDetail()
            .then(v => v.json())
            .then(v => setSettting(v.data))
    }, []);
    useEffect(() => {
        if (!mounted) return
        getDetail()
        // getAllEmployees("")
    }, [mounted]);

    const getAllPayRolls = () => {
        getPayRolls({ page: 1, limit: 0 }, { dateRange: [moment(payRollReport?.start_date).toDate(), moment(payRollReport?.end_date).toDate()], unreported: true })
            .then(v => v.json())
            .then(v => setPayRolls(v.data))

    }


    const getDetail = async () => {
        try {
            setIsLoading(true)
            let resp = await getPayRollReportDetail(payRollReportId!)
            let respJson = await resp.json()
            setPayRollReport(respJson.data)



        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (payRollReport) {
            // getAllIncentives()
            getAllPayRolls()
            setEditable(payRollReport?.status == "DRAFT")
            setMountedInput(false)
            setTimeout(() => {
                setMountedInput(true)
            }, 300);
        }
    }, [payRollReport]);

    return (<DashboardLayout permission='read_pay_roll_report'>
        <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Laporan Pay Roll"}</h3>
                </div>
                <InlineForm style={{ marginBottom: 10 }} title="No. Laporan">
                    {payRollReport?.report_number}
                </InlineForm>
                <InlineForm style={{ marginBottom: 10 }} title="Tgl">
                    <Moment format='DD/MM/YYYY'>{payRollReport?.start_date}</Moment> ~ <Moment format='DD/MM/YYYY'>{payRollReport?.end_date}</Moment>
                </InlineForm>
                <InlineForm style={{ marginBottom: 10, alignItems: "start" }} title="Keterangan">
                    {editable ? <textarea placeholder='Keterangan ....' id={`payRollReport-${payRollReport?.id}`} defaultValue={payRollReport?.description} onKeyUp={(el) => {
                        if (el.key == "Enter") {
                            document.getElementById(`payRollReport-${payRollReport?.id}`)!.blur();
                        }
                    }} onBlur={(el) => {
                        let editted: PayRollReport = {
                            ...payRollReport!,
                            description: el.target.value,
                        }
                        setPayRollReport(editted)
                    }} /> : payRollReport?.description}

                </InlineForm>
                <InlineForm style={{ marginBottom: 10 }} title="Dibuat">
                    {payRollReport?.user_name}
                </InlineForm>
                <InlineForm style={{ marginBottom: 10, alignItems: 'start' }} title="Status" >
                    <div>
                        {payRollReport?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={payRollReport?.status} />}
                        {payRollReport?.status == "PROCESSING" && <Badge className='text-center' color='blue' content={payRollReport?.status} />}
                        {payRollReport?.status == "APPROVED" && <Badge className='text-center' color='green' content={payRollReport?.status} />}
                        {payRollReport?.status == "REJECTED" && <Badge className='text-center' color='red' content={payRollReport?.status} />}
                    </div>
                    {payRollReport?.status == "DRAFT" && <Button onClick={() => {
                        editPayRollReport(payRollReportId!, {
                            description: payRollReport?.description ?? "",
                            status: 'PROCESSING'
                        }).then(() => getDetail())
                    }} className='mt-4 w-32' appearance='primary' color='blue'><BsFloppy2 className='mr-2' />Simpan</Button>}
                    {payRollReport?.status == "PROCESSING" && <Button onClick={() => {
                        editPayRollReport(payRollReportId!, {
                            description: payRollReport?.description ?? "",
                            status: 'FINISHED'
                        }).then(() => getDetail())
                    }} className='mt-4 w-32' appearance='primary' color='green'><BsCheck2 className='mr-2' />Selesai</Button>}
                </InlineForm>
            </div>
            <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Summary"}</h3>
                </div>
                <InlineForm style={{ marginBottom: 10 }} title="Grand Total">
                    {money(payRollReport?.grand_total_take_home_pay, 0)}
                </InlineForm>

            </div>
        </div>
        <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className={`bg-white rounded-xl p-6 hover:shadow-lg ${!editable && 'col-span-2'}`}>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Daftar Pay Roll"}</h3>
                    <Button onClick={async () => {
                        try {
                            setIsLoading(true)
                            const resp = await payrollBankDownload(payRollReportId!)
                            const filename = resp.headers.get("Content-Description")
                            const respBlob = await resp.blob()

                            saveAs(respBlob, filename ?? "download.xlsx")
                        } catch (error) {
                            Swal.fire(`Perhatian`, `${error}`, 'error')
                        } finally {
                            setIsLoading(false)
                        }
                            
                    }} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-4'><RiFileDownloadFill className='text-blue-600 mr-2' /> Unduh Payroll Bank</Button>
                </div>

                <div className="overflow-y-auto mt-4">
                    <table className="w-full h-full text-xs text-left rtl:text-right text-gray-700">
                        <thead className="text-base text-gray-700 font-semibold ">
                            <tr className=' '>
                                <th scope="col" className={`border text-sm px-6 py-3 w-4`}>No</th>
                                <th scope="col" className={`border text-sm px-6 py-3`}>No. PayRoll</th>
                                <th scope="col" className={`border text-sm px-6 py-3`}>Karyawan</th>
                                <th scope="col" className={`border text-sm px-6 py-3 text-right`}>Total</th>
                                <th scope="col" className={`border text-sm px-6 py-3`}>Status</th>
                                <th scope="col" className={`border text-sm px-6 py-3`}></th>
                            </tr>
                        </thead>
                        <tbody className="text-base text-gray-700 font-semibold ">
                            {(payRollReport?.items ?? []).map(e => (<tr key={e.id} className=' '>
                                <td scope="col" className={`border text-sm px-6 py-3 w-4`}>{(payRollReport?.items ?? []).indexOf(e) + 1}</td>
                                <td scope="col" className={`border text-sm px-6 py-3`}>{e.pay_roll.pay_roll_number}</td>
                                <td scope="col" className={`border text-sm px-6 py-3`}>{e.employee_name}</td>
                                <td scope="col" className={`border text-sm px-6 py-3 text-right`}>{money(e.total_reimbursement + e.total_take_home_pay, 0)}</td>
                                <td scope="col" className={`border text-sm px-6 py-3`}>
                                    <div>
                                        {e?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={e?.status} />}
                                        {e?.status == "PROCESSING" && <Badge className='text-center' color='blue' content={e?.status} />}
                                        {e?.status == "FINISHED" && <Badge className='text-center' color='green' content={e?.status} />}
                                    </div>
                                </td>
                                <td scope="col" className={`border text-sm px-6 py-3`}></td>
                            </tr>))}

                        </tbody>
                    </table>
                </div>
            </div>
            {editable &&
                <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
                    <div className='flex justify-between'>
                        <h3 className='font-bold mb-4 text-black text-lg'>{"Tambahkan Pay Roll"}</h3>
                        {payRolls.length > 0 &&
                            <Checkbox onChange={(val, checked, _) => {
                                if (checked) {
                                    setSelectedPayRolls([...payRolls])
                                } else {
                                    setSelectedPayRolls([])
                                }
                            }} checked={payRolls.length == selectedPayRolls.length} />
                        }
                    </div>
                    {payRolls.length == 0 && "No Data"}
                    <ul>
                        {payRolls.map(e => <li className='p-4 hover:bg-gray-50 flex' key={e.id}>
                            <Checkbox className='mr-4' onChange={(val, checked, _) => {
                                if (checked) {
                                    setSelectedPayRolls([...selectedPayRolls, e])
                                } else {
                                    setSelectedPayRolls([...selectedPayRolls.filter(s => s.id != e.id)])
                                }
                            }} checked={selectedPayRolls.includes(e)} />
                            <div className='flex flex-col'>
                                <small className='font-bold'>{e.pay_roll_number}</small>
                                <h3>{e.employee_name}</h3>
                            </div>

                        </li>)}
                    </ul>
                    <div className='flex justify-end'>
                        {selectedPayRolls.length > 0 && <Button onClick={async () => {
                            try {
                                setIsLoading(true)
                                for (const selected of selectedPayRolls) {
                                    await addItemPayRollReport(payRollReportId!, selected.id)
                                    setSelectedPayRolls([])
                                    getDetail()
                                }
                            } catch (error) {
                                Swal.fire(`Perhatian`, `${error}`, 'error')
                            } finally {
                                setIsLoading(false)

                            }
                        }} appearance='primary'><PlusIcon className='w-4 mr-2' />Tambahkan</Button>}
                    </div>
                </div>
            }
        </div>
    </DashboardLayout>);
}
export default PayRollReportDetail;