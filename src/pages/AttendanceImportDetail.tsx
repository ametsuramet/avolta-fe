import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { AttendanceBulkImport } from '@/model/attendance_import';
import { LoadingContext } from '@/objects/loading_context';
import { getAttendanceImportApprove, getAttendanceImportDetail, getAttendanceImportReject } from '@/repositories/attendance';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { PiFloppyDiskFill } from 'react-icons/pi';
import Moment from 'react-moment';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Modal, Panel, Placeholder, Tabs } from 'rsuite';
import Swal from 'sweetalert2';

interface AttendanceImportDetailProps { }

const AttendanceImportDetail: FC<AttendanceImportDetailProps> = ({ }) => {
    const [mounted, setMounted] = useState(false);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [data, setData] = useState<AttendanceBulkImport | null>(null);
    const nav = useNavigate()
    const [isApproved, setIsApproved] = useState(false);
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState("");

    const { importId } = useParams()

    useEffect(() => {
        setMounted(true)
    }, []);

    useEffect(() => {
        if (!mounted) return

        getDetail()


    }, [mounted]);

    const getDetail = async () => {
        try {
            setIsLoading(true)
            const resp = await getAttendanceImportDetail(importId!)
            const respJson = await resp.json()
            setData(respJson.data)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')

        } finally {
            setIsLoading(false)
        }
    }

    return (<DashboardLayout permission='import_attendance'>
        <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
            <div className='flex justify-between'>
                <h3 className='font-bold mb-4 text-black text-lg'>{"Detail Import"}</h3>
                {data?.status == "DRAFT" &&
                    <div>
                        <Button className=' rounded-full mr-2 min-w-32' appearance='primary' color='red' onClick={() => {
                            setIsApproved(false)
                            setOpen(true)
                        }}><XMarkIcon className='w-4' /> Tolak</Button>
                        <Button className=' rounded-full min-w-32' appearance='primary' color='green' onClick={() => {
                            setIsApproved(true)
                            setOpen(true)
                        }}><CheckIcon className='w-4' /> Terima & Simpan Data Absensi</Button>
                    </div>
                }
            </div>
            <Panel header="Info" bordered>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <InlineForm title="Nama File" >
                            {data?.file_name}
                        </InlineForm>
                        <InlineForm title="Di Import" style={{ marginBottom: 0 }}>
                            {data?.user.full_name}
                        </InlineForm>
                    </div>
                    <div>
                        <InlineForm title="Tgl" >
                            <Moment format='DD MMM YYYY'>{data?.date_imported_at}</Moment>
                        </InlineForm>
                        <InlineForm title="Status" style={{ marginBottom: 0 }}>
                            {data?.status == "DRAFT" && <Badge color='yellow' content={data?.status} />}
                            {data?.status == "APPROVED" && <Badge color='green' content={data?.status} />}
                            {data?.status == "REJECTED" && <Badge color='red' content={data?.status} />}
                        </InlineForm>
                    </div>
                </div>
            </Panel>
            <div className='mt-8'>
                <Tabs defaultActiveKey="1" appearance="subtle">
                    {(data?.data ?? []).map(e =>
                        <Tabs.Tab key={e.id} eventKey={`${e.sequence_number}`} title={e.employee_name}>
                            <Panel bordered className='mt-4'>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <InlineForm title="Seq Num" >
                                            #{e.sequence_number}
                                        </InlineForm>
                                        <InlineForm title="Fingerprint ID" style={{ marginBottom: 0 }}>
                                            {e.fingerprint_id}
                                        </InlineForm>
                                    </div>
                                    <div>
                                        <InlineForm title="Nama Karyawan di File" >
                                            {e.employee_name}
                                        </InlineForm>
                                        <InlineForm title="Nama Karyawan di sistem" style={{ marginBottom: 0 }} >
                                            {e.system_employee_id &&
                                                <span onClick={() => nav(`/employee/${e.system_employee_id}`)} className=' hover:font-bold cursor-pointer'>
                                                    {e.system_employee_name}
                                                </span>
                                            }
                                        </InlineForm>
                                    </div>
                                </div>
                            </Panel>
                            <CustomTable className='mt-8'
                                headers={["No", "Day", "Date", "Working Hour", "Activity", "Duty On", "Duty Off", "Late In", "Early Departure", "Effective Hour", "Overtime", "Notes"]}
                                headerClasses={[]}
                                datasets={e.items.map(i => ({
                                    cells: [
                                        { data: i.sequence_number },
                                        { data: i.day },
                                        { data: i.date },
                                        { data: i.working_hour },
                                        { data: i.activity },
                                        { data: i.duty_on },
                                        { data: i.duty_off },
                                        { data: i.late_in },
                                        { data: i.early_departure },
                                        { data: i.effective_hour },
                                        { data: i.overtime },
                                        { data: i.notes },
                                    ]
                                }))} />
                        </Tabs.Tab>)}
                </Tabs>
            </div>
        </div>
        <Modal open={open} onClose={() => setOpen(false)}>
            <Modal.Header>
                <Modal.Title>{isApproved ? "Terima & Simpan Sebagai Data Absensi" : "Tolak"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='mb-4 text-sm'>
                {isApproved ? "Pastikan anda telah memeriksa semua data, setelah disetujui import data akan di konversi menjadi data absensi" : ""}

                </div>
                <InlineForm title={'Catatan'} style={{ alignItems: 'start' }}>
                    <textarea
                        rows={5}
                        className="form-control"
                        placeholder={"Catatan"}
                        value={description}
                        onChange={(el) => setDescription(el.target.value)}
                    />
                </InlineForm>



            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    setOpen(false)
                }} appearance="subtle">
                    Cancel
                </Button>
                <Button color={isApproved ? 'green' : "red"} onClick={async () => {
                    try {
                        setIsLoading(true)
                        if (!isApproved) {
                            await getAttendanceImportReject(importId!, description)
                        } else {
                            await getAttendanceImportApprove(importId!, description)
                        }
                        getDetail()
                        setOpen(false)
                        Swal.fire("Perhatian", `import file telah ${isApproved ? 'di terima' : 'di tolak'}`, "success")
                    } catch (error) {
                        Swal.fire(`Perhatian`, `${error}`, 'error')
                    } finally {
                        setIsLoading(false)

                    }
                }} appearance="primary">
                    {isApproved ?
                        <PiFloppyDiskFill className='mr-2' />
                        :
                        <XMarkIcon className='w-4 mr-2' />
                    }
                    Simpan
                </Button>
            </Modal.Footer>
        </Modal>
    </DashboardLayout>);
}
export default AttendanceImportDetail;
