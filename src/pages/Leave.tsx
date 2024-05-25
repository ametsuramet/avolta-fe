import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Employee } from '@/model/employee';
import { Leave } from '@/model/leave';
import { LeaveCategory } from '@/model/leave_category';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { SelectOption } from '@/objects/select_option';
import { getEmployeeDetail, getEmployees } from '@/repositories/employee';
import { addLeave, approveLeave, deleteLeave, editLeave, getLeaves, rejectLeave, reviewLeave } from '@/repositories/leave';
import { getLeaveCategories } from '@/repositories/leave_category';
import { TOKEN } from '@/utils/constant';
import { asyncLocalStorage, confirmDelete, initials, nl2br, titleCase } from '@/utils/helper';
import { colourStyles } from '@/utils/style';
import { CheckIcon, EyeIcon, PaperClipIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { url } from 'inspector';
import { useContext, useEffect, useState, type FC } from 'react';
import DocViewer from 'react-doc-viewer';
import { FaClock, FaNoteSticky, FaRegNoteSticky } from 'react-icons/fa6';
import { IoAddCircleOutline } from 'react-icons/io5';
import { PiFloppyDiskFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import Select, { SingleValue } from 'react-select';
import { Avatar, Badge, Button, DatePicker, DateRangePicker, Message, Modal, Panel, SelectPicker, Uploader, toaster } from 'rsuite';
import { DateRange } from 'rsuite/esm/DateRangePicker';
import Swal from 'sweetalert2';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment/locale/id';
import { BiBulb } from 'react-icons/bi';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw'



interface LeavePageProps { }

const LeavePage: FC<LeavePageProps> = ({ }) => {
    const nav = useNavigate()
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [jobTitles, setLeaves] = useState<Leave[]>([]);
    const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [open, setOpen] = useState(false);
    const [requestType, setRequestType] = useState("FULL_DAY");
    const [leaveCategories, setLeaveCategories] = useState<LeaveCategory[]>([]);
    const [leaveCategoryId, setLeaveCategoryId] = useState("");
    const [dateRange, setDateRange] = useState<DateRange | null>([moment().add(1, 'days').toDate(), moment().add(1, 'months').toDate()]);
    const [date, setDate] = useState<Date>(moment().add(1, 'days').toDate());
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attachment, setAttachment] = useState("");
    const [attachmentUrl, setAttachmentUrl] = useState("");

    const [selectedEmployee, setselectedEmployee] = useState<SingleValue<SelectOption>>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [token, setToken] = useState("");
    const [modalApproval, setModalApproval] = useState(false);
    const [remarks, setRemarks] = useState("");


    useEffect(() => {
        getLeaveCategories({ page: 1, limit: 100 })
            .then(v => v.json())
            .then(v => {
                setLeaveCategories(v.data)
            })
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
    }, []);
    useEffect(() => {
        getAllLeaves()

    }, [page, limit, search]);

    useEffect(() => {
        getAllEmployees("")
    }, []);


    const getAllEmployees = (s: string) => {
        getEmployees({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setEmployees(v.data))
    }


    const getAllLeaves = async () => {
        setIsLoading(true)
        getLeaves({ page, limit, search })
            .then(v => v.json())
            .then(v => {
                setLeaves(v.data)
                setPagination(v.pagination)
            })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }

    const approval = async (appr: string) => {
        try {
            setIsLoading(true)
            confirmDelete(async () => {
                switch (appr) {
                    case "approve":
                        await approveLeave(selectedLeave?.id!, remarks)

                        break;
                    case "reject":
                        await rejectLeave(selectedLeave?.id!, remarks)

                        break;

                    default:
                        await reviewLeave(selectedLeave?.id!, remarks)
                        break;
                }


                setSelectedLeave(null)
                setModalApproval(false)
                setEmployee(null)
                getAllLeaves()
                setRemarks("")
            }, null, null, "Ya Lanjutkan")


        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }
    const save = async () => {
        try {
            setIsLoading(true)
            if (selectedLeave) {
                // await editLeave(selectedLeave!.id, {
                //     request_type: '',
                //     leave_category_id: '',
                //     employee_id: '',
                //     description: ''
                // })
            } else {
                await addLeave({
                    request_type: requestType,
                    leave_category_id: leaveCategoryId,
                    employee_id: selectedEmployee?.value!,
                    description: description,
                    start_date: requestType == "FULL_DAY" ? dateRange![0].toISOString() : date.toISOString(),
                    end_date: requestType == "FULL_DAY" ? dateRange![1]!.toISOString() : null,
                    start_time: requestType == "FULL_DAY" ? null : moment(startTime).format("HH:mm:ss"),
                    end_time: requestType == "FULL_DAY" ? null : moment(endTime).format("HH:mm:ss"),
                    attachment: attachment != "" ? attachment : null,
                    status: "DRAFT"
                })
            }
            getAllLeaves()
            setSelectedLeave(null)
            setName("")
            setDescription("")
            setRequestType("FULL_DAY")
            setLeaveCategoryId("")
            setselectedEmployee(null)
            setDateRange([moment().add(1, 'days').toDate(), moment().add(1, 'months').toDate()])
            setStartTime(null)
            setEndTime(null)
            setAttachment("")
            setAttachmentUrl("")
            setOpen(false)

        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }

    }


    return (<DashboardLayout permission='read_leave'>
        <div className='grid grid-cols-3 gap-4'>
            <div className='col-span-3 bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Cuti / Izin"}</h3>
                    <div>

                        <Button onClick={() => setOpen(true)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800 mr-2'><IoAddCircleOutline className='text-blue-600 mr-2' /> Tambah</Button>
                        {/* <Button onClick={() => setOpenWithHeader(true)} className=' text-blue-600 font-semibold hover:font-bold hover:text-blue-800'><BsFunnel className='text-blue-600 mr-2' /> Filter</Button> */}

                    </div>
                </div>
                <CustomTable
                    pagination
                    total={pagination?.total_records}
                    limit={limit}
                    activePage={page}
                    setActivePage={(v) => setPage(v)}
                    changeLimit={(v) => setLimit(v)}
                    headers={["No", "Tgl", "Karyawan", "Jenis", "Kategori", "Keterangan", "Status", ""]} headerClasses={[]} datasets={jobTitles.map(e => ({
                        cells: [
                            { data: ((page - 1) * limit) + (jobTitles.indexOf(e) + 1) },
                            {
                                data: <div>
                                    {e.request_type == "FULL_DAY" && <div><Moment format='DD MMM YYYY' locale='id'>{e.start_date}</Moment>~<Moment format='DD MMM YYYY' locale='id'>{e.end_date}</Moment></div>}
                                    {e.request_type != "FULL_DAY" && <div className='flex flex-col'>
                                        <Moment format='DD MMM YYYY' locale='id'>{e.start_date}</Moment>
                                        <span>{moment(e.start_time, "HH:mm:ss").format("HH:mm")} ~ {moment(e.end_time, "HH:mm:ss").format("HH:mm")}</span>
                                    </div>}
                                </div>
                            },
                            {
                                data: <div className=''>
                                    <Avatar className='mr-2' circle size='xs' bordered src={e.employee_picture}
                                        alt={initials(e.employee_name)} />
                                    {e.employee_name}
                                </div>
                            },
                            {
                                data: <div>
                                    {e?.request_type == "FULL_DAY" && <Badge className='text-center' color='violet' content={titleCase(e?.request_type)} />}
                                    {e?.request_type == "HALF_DAY" && <Badge className='text-center' color='blue' content={titleCase(e?.request_type)} />}
                                    {e?.request_type == "HOURLY" && <Badge className='text-center' color='green' content={titleCase(e?.request_type)} />}
                                </div>
                            },
                            { data: e.leave_category },
                            {
                                data:
                                    <div className='flex flex-col'>
                                        <div className='flex justify-between'>
                                            <div>
                                                {e.description}
                                            </div>
                                            {e.attachment_url &&
                                                <PaperClipIcon className='ml-2 w-4 cursor-pointer' onClick={() => window.open(e.attachment_url)} />
                                            }

                                        </div>
                                        {e.remarks &&
                                            <div className='flex mt-4 flex-col'>
                                                <small className='font-bold'>Catatan:</small>
                                                <ReactMarkdown rehypePlugins={[rehypeRaw]} children={e.remarks} />
                                            </div>
                                        }
                                    </div>

                            },
                            {
                                data: <div>
                                    {e?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={e?.status} />}
                                    {e?.status == "REVIEWED" && <Badge className='text-center' color='blue' content={e?.status} />}
                                    {e?.status == "APPROVED" && <Badge className='text-center' color='green' content={e?.status} />}
                                    {e?.status == "REJECTED" && <Badge className='text-center' color='red' content={e?.status} />}
                                </div>
                            },
                            {
                                data: <div className='flex cursor-pointer'>
                                    <EyeIcon onClick={() => {
                                        setSelectedLeave(e)
                                        getEmployeeDetail(e.employee_id)
                                            .then(v => v.json())
                                            .then(v => {
                                                setModalApproval(true)
                                                setEmployee(v.data)
                                            })
                                    }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                    <TrashIcon
                                        className=" h-5 w-5 text-red-400 hover:text-red-600"
                                        aria-hidden="true"
                                        onClick={() => {
                                            confirmDelete(() => {
                                                deleteLeave(e.id).then(v => getAllLeaves())
                                            })
                                        }}
                                    />
                                </div>
                            }
                        ]
                    }))} />
            </div>
            {/* <div className='col-span-1'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{selectedLeave ? "Edit Cuti / Izin" : "Tambah Cuti / Izin"}</h3>
                    <InlineForm title="Cuti / Izin">
                        <input placeholder='ex: Manager Produksi' value={name} onChange={(el) => setName(el.target.value)} type="text" className="form-control" />
                    </InlineForm>
                    <InlineForm title="Keterangan" style={{alignItems: 'start'}}>
                        <textarea placeholder='ex: Manager produksi pabrik ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                    </InlineForm>
                    <Button className='mr-2' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                    {selectedLeave &&
                        <Button onClick={async () => {
                            setSelectedLeave(null)
                            setName("")
                            setDescription("")
                        }}>
                            <XMarkIcon className='mr-2 w-5' /> Batal
                        </Button>
                    }
                </div>
            </div> */}
        </div>

        <Modal className='custom-modal' size={"lg"} open={open} onClose={() => setOpen(false)}>
            <Modal.Header>
                <Modal.Title>Form Cuti / Izin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InlineForm title="Jenis Cuti / Izin">
                    <SelectPicker placeholder="Jenis Cuti / Izin" searchable={false} data={[
                        { value: "FULL_DAY", label: "Full Day" },
                        { value: "HALF_DAY", label: "Setengah Hari" },
                        { value: "HOURLY", label: "Per Jam" },
                    ]} value={requestType} onSelect={(val) => setRequestType(val)} block />
                </InlineForm>
                <InlineForm title="Kategori">
                    <SelectPicker searchable placeholder="Jenis Cuti / Izin" data={leaveCategories.map(e => (
                        { value: e.id, label: e.name }
                    ))} value={leaveCategoryId} onSelect={(val) => setLeaveCategoryId(val)} block />
                </InlineForm>
                <InlineForm title="Pilih Karyawan">
                    <Select< SelectOption, false> styles={colourStyles}
                        options={employees.map(e => ({ value: e.id, label: e.full_name }))}
                        value={selectedEmployee!}
                        onChange={(option: SingleValue<SelectOption>): void => {
                            setselectedEmployee(option!)
                        }}
                        onInputChange={(val) => {
                            getAllEmployees(val)
                        }}

                    />
                </InlineForm>
                {requestType == "FULL_DAY" ?
                    <InlineForm title="Rentang Tanggal">
                        <DateRangePicker className='w-full' value={dateRange} onChange={(val) => setDateRange(val)} placement="bottomEnd" format='dd/MM/yyyy' />
                    </InlineForm>
                    :
                    <div>

                        <InlineForm title="Tanggal">
                            <DatePicker className='w-full' value={date} onChange={(val) => setDate(val!)} placement="bottomEnd" format='dd/MM/yyyy' />
                        </InlineForm>
                        <InlineForm title="Jam Mulai">
                            <DatePicker value={startTime} block format="HH:mm" caretAs={FaClock} placement="bottomEnd" onChange={(val) => {
                                setStartTime(val)
                            }} />
                        </InlineForm>
                        <InlineForm title="Jam Berakhir">
                            <DatePicker value={endTime} block format="HH:mm" caretAs={FaClock} placement="bottomEnd" onChange={(val) => {
                                setEndTime(val)
                            }} />
                        </InlineForm>
                    </div>
                }

                <InlineForm title="File Sisipan" style={{ alignItems: 'start' }}>
                    <Uploader
                        fileListVisible={false}
                        listType="picture"
                        action={`${import.meta.env.VITE_API_URL}/admin/file/upload`}
                        onUpload={file => {
                            setIsLoading(true);

                        }}
                        headers={{
                            authorization: `Bearer ${token}`
                        }}
                        accept='image/*, application/pdf'
                        onSuccess={(response, file) => {
                            setIsLoading(false);
                            setAttachment(response.data.path)
                            setAttachmentUrl(response.data.url)


                            // toaster.push(<Message type="success">Uploaded successfully</Message>);
                        }}
                        onError={() => {
                            setIsLoading(false);
                            toaster.push(<Message type="error">Upload failed</Message>);
                        }}
                    >
                        <button style={{ width: attachmentUrl ? 300 : 100, height: attachmentUrl ? 300 : 100 }}>
                            {attachment ? (
                                <DocViewer documents={[{ uri: attachmentUrl }]} />
                            ) : (
                                <PaperClipIcon className='w-8' />
                            )}
                        </button>
                    </Uploader>
                </InlineForm>
                <InlineForm title="Keterangan" style={{ alignItems: 'start' }}>
                    <textarea placeholder='ex: Ijin mau menikah ....' rows={5} value={description} onChange={(el) => setDescription(el.target.value)} className="form-control" />
                </InlineForm>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    setOpen(false)
                }} appearance="subtle">
                    Cancel
                </Button>
                <Button onClick={save} appearance="primary">
                    <PiFloppyDiskFill className='mr-2' /> Simpan
                </Button>
            </Modal.Footer>
        </Modal>
        <Modal className='custom-modal' size={"lg"} open={modalApproval} onClose={() => setModalApproval(false)}>
            <Modal.Header>
                <Modal.Title>Approval Cuti / Izin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InlineForm title="Data Karyawan" style={{ alignItems: 'start' }}>
                    <Panel bordered className='mb-4' >
                        <div className="grid  grid-cols-4 gap-4">
                            <div className='col-span-3'>
                                <InlineForm title="Nama" style={{ marginBottom: 15 }}>
                                    {employee?.full_name}
                                </InlineForm>
                                <InlineForm title="NIP/NIK" style={{ marginBottom: 15 }}>
                                    {employee?.employee_identity_number}
                                </InlineForm>
                                <InlineForm title="Jabatan" style={{ marginBottom: 15 }}>
                                    {employee?.job_title}
                                </InlineForm>
                            </div>
                            <div className='col-span-1 flex justify-center items-center'>
                                <Avatar className='mr-2' bordered size={'xxl'} circle src={employee?.picture_url}
                                    alt={initials(employee?.full_name)} />
                            </div>
                        </div>

                    </Panel >
                </InlineForm>

                <InlineForm title="Status">
                    <div>
                        {selectedLeave?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={selectedLeave?.status} />}
                        {selectedLeave?.status == "REVIEWED" && <Badge className='text-center' color='blue' content={selectedLeave?.status} />}
                        {selectedLeave?.status == "APPROVED" && <Badge className='text-center' color='green' content={selectedLeave?.status} />}
                        {selectedLeave?.status == "REJECTED" && <Badge className='text-center' color='red' content={selectedLeave?.status} />}
                    </div>
                </InlineForm>
                <InlineForm title="Catatan" style={{ alignItems: 'start' }}>
                    {(selectedLeave?.status == "DRAFT" || selectedLeave?.status == "REVIEWED") ?
                        <textarea placeholder='ex: Pengajuan Sudah Limit ....' rows={5} value={remarks} onChange={(el) => setRemarks(el.target.value)} className="form-control" />
                        : <ReactMarkdown rehypePlugins={[rehypeRaw]} children={selectedLeave?.remarks} />
                    }
                </InlineForm>

            </Modal.Body>
            <Modal.Footer>
                {(selectedLeave?.status == "DRAFT") &&
                    <>
                        <Button className=' h-10' onClick={() => approval("review")} appearance="primary" color='blue'>
                            <BiBulb className=' w-6 mr-2' /> Review Pengajuan
                        </Button>
                    </>
                }
                {(selectedLeave?.status == "REVIEWED") &&
                    <>
                        <Button className='min-w-32 h-10' onClick={() => approval("reject")} appearance="primary" color='red'>
                            <XMarkIcon className=' w-6 mr-2' /> Tolak
                        </Button>
                        <Button className='min-w-32 h-10' onClick={() => approval("approve")} appearance="primary" color='green'>
                            <CheckIcon className=' w-6 mr-2' /> Terima
                        </Button>
                    </>
                }
            </Modal.Footer>
        </Modal>
    </DashboardLayout>);
}
export default LeavePage;