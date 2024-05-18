import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Employee } from '@/model/employee';
import { Schedule, ScheduleReq } from '@/model/schedule';
import { LoadingContext } from '@/objects/loading_context';
import { Pagination } from '@/objects/pagination';
import { SelectOption } from '@/objects/select_option';
import { getEmployees } from '@/repositories/employee';
import { addSchedule, deletetSchedule, getSchedules } from '@/repositories/schedule';
import { confirmDelete, pad, randomStr } from '@/utils/helper';
import { toolTip } from '@/utils/helperUi';
import { colourStyles, multiColourStyles } from '@/utils/style';
import { ChevronDownIcon, ChevronUpIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { FaClock } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import Select, { MultiValue, SingleValue } from 'react-select';
import { Avatar, AvatarGroup, Badge, Button, Calendar, DatePicker, Modal, Popover, Whisper } from 'rsuite';
import DateRangePicker, { DateRange } from 'rsuite/esm/DateRangePicker';
import Swal from 'sweetalert2';

interface SchedulePageProps { }

const SchedulePage: FC<SchedulePageProps> = ({ }) => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const [detailExpanded, setDetailExpanded] = useState(true);
    const [dateRange, setDateRange] = useState<DateRange>([moment().startOf('month').toDate(), moment().endOf('month').toDate()]);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>([moment().startOf('month').toDate(), moment().endOf('month').toDate()]);
    const [selectedDaysWeek, setSelectedDaysWeek] = useState<MultiValue<SelectOption>>([]);
    const [selectedType, setSelectedType] = useState<SelectOption>({ value: "WEEKLY", label: "Mingguan" });
    const [selectedDate, setSelectedDate] = useState<Date>(moment().toDate());
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setselectedEmployee] = useState<MultiValue<SelectOption>>();
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [monthSchedules, setMonthSchedules] = useState<{ date: Date, schedules: Schedule[] }[]>([]);
    const [selectedMonthSchedules, setSelectedMonthSchedules] = useState<{ date: Date, schedules: Schedule[] } | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const nav = useNavigate()


    const daysWeek: SelectOption[] = [
        { value: "SUNDAY", label: "Minggu" },
        { value: "MONDAY", label: "Senin" },
        { value: "TUESDAY", label: "Selasa" },
        { value: "WEDNESDAY", label: "Rabu" },
        { value: "THURSDAY", label: "Kamis" },
        { value: "FRIDAY", label: "Jumat" },
        { value: "SATURDAY", label: "Sabtu" },
    ]

    const scheduleType: SelectOption[] = [
        { value: "WEEKLY", label: "Mingguan" },
        { value: "DATERANGE", label: "Rentang Hari" },
        { value: "SINGLE_DATE", label: "Hari" },
    ]

    useEffect(() => {
        getAllEmployees("")
    }, []);

    useEffect(() => {

        getAllSchedules()
    }, [page, limit, search]);


    const getAllEmployees = (s: string) => {
        getEmployees({ page: 1, limit: 5, search: s })
            .then(v => v.json())
            .then(v => setEmployees(v.data))
    }

    const getAllSchedules = async () => {
        try {
            setIsLoading(true)
            var resp = await getSchedules({ page, limit, search })
            var respJson = await resp.json()
            setSchedules(respJson.data)
            setPagination(respJson.pagination)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }


    useEffect(() => {
        getMappingSchedules()
    }, [dateRange]);

    const getMappingSchedules = () => {
        getSchedules({ page: 1, limit: 1000 }, { dateRange })
            .then(v => v.json())
            .then(v => {
                let schedules: Schedule[] = [...v.data as Schedule[]]
                let weeklySchedules = [...schedules.filter(e => e.schedule_type == "WEEKLY")]
                let singleSchedules = [...schedules.filter(e => e.schedule_type == "SINGLE_DATE")]
                let dateRangeSchedules = [...schedules.filter(e => e.schedule_type == "DATERANGE")]
                console.log("weeklySchedules", weeklySchedules)
                let now = moment(dateRange[0])
                let firstDay = now.clone().startOf('month').date()
                let endDay = now.clone().endOf('month').date()
                let i = 1
                let days: { date: Date, schedules: Schedule[] }[] = []
                for (let index = firstDay; index <= endDay; index++) {
                    let selectedSchedules: Schedule[] = []
                    let day = now.clone().startOf('month').add(index - 1, 'day')
                    let weekDay = day.format("dddd").toLowerCase()
                    console.log(day.toISOString())
                    selectedSchedules = [
                        ...selectedSchedules,
                        ...weeklySchedules.filter(e => e.week_day.toLowerCase() == weekDay.toLowerCase()),
                        ...singleSchedules.filter(e => e.start_date == day.format("YYYY-MM-DD")),
                    ]

                    days.push({
                        date: day.toDate(),
                        schedules: selectedSchedules
                    })


                }
                for (let index = firstDay; index <= endDay; index++) {
                    let day = now.clone().startOf('month').add(index - 1, 'day')
                    let sel = dateRangeSchedules.filter(e => (e.start_date) == day.format("YYYY-MM-DD"))
                    if (sel.length)
                        for (const s of sel) {
                            for (let index = moment(s.start_date).date(); index <= moment(s.end_date).date(); index++) {
                                let selDate = new Date(moment(s.start_date).year(), moment(s.start_date).month(), index)
                                days = days.map(e => {
                                    if (moment(e.date).format("YYYY-MM-DD") == moment(selDate).format("YYYY-MM-DD")) {
                                        console.log(moment(e.date).format("YYYY-MM-DD"))
                                        e.schedules.push(s)
                                    }
                                    return e
                                })
                            }
                        }
                }

                setMonthSchedules(days)
            })
    }


    const renderCell = (date: Date) => {
        let selected = monthSchedules.find(e => e.date.getDate() == date.getDate())
        if (selected) {
            let employees: Employee[] = []
            for (const iterator of selected.schedules.map(e => e.employees)) {
                employees.push(...iterator)
            }
            return <div className='flex justify-center' onClick={() => {
                setSelectedMonthSchedules(selected)
                setOpenModal(true)
            }}>
                <AvatarGroup stack className='mt-4'>
                    {employees
                        .filter((item, i) => i < 3)
                        .map(item => (<Avatar onClick={() => { }} size={'xs'} bordered circle key={item.id} src={item.picture_url} alt={item.full_name} />))}
                    {employees.length - 3 > 0 &&
                        <Avatar size={'xs'} bordered circle style={{ background: '#ccc' }}>
                            +{employees.length - 3}
                        </Avatar>
                    }
                </AvatarGroup>
            </div>
        }

        return null;
    }

    const save = async () => {
        try {
            setIsLoading(true)
            let dataReq: ScheduleReq = {
                schedule_type: selectedType.value
            }
            if (selectedType.value == "WEEKLY") {
                for (const d of selectedDaysWeek) {
                    dataReq = {
                        ...dataReq,
                        name: d.label,
                        week_day: d.value,
                        start_time: moment(startTime).format("HH:mm:ss"),
                        end_time: moment(endTime).format("HH:mm:ss"),
                        employee_ids: selectedEmployee?.map(e => e.value),
                    }

                    await addSchedule(dataReq)
                }
            }
            if (selectedType.value == "DATERANGE") {
                dataReq = {
                    ...dataReq,
                    name: `Jadwal ${moment(selectedDateRange[0]).format("DD/MM/YYYY")} ~ ${moment(selectedDateRange[1]).format("DD/MM/YYYY")}`,
                    start_date: moment(selectedDateRange[0]).toISOString(),
                    end_date: moment(selectedDateRange[1]).toISOString(),
                    employee_ids: selectedEmployee?.map(e => e.value),
                    start_time: moment(startTime).format("HH:mm:ss"),
                    end_time: moment(endTime).format("HH:mm:ss"),
                }
                await addSchedule(dataReq)
            }
            if (selectedType.value == "SINGLE_DATE") {
                dataReq = {
                    ...dataReq,
                    name: `Jadwal ${moment(selectedDate).format("DD/MM/YYYY")}`,
                    start_date: moment(selectedDate).toISOString(),
                    employee_ids: selectedEmployee?.map(e => e.value),
                    start_time: moment(startTime).format("HH:mm:ss"),
                    end_time: moment(endTime).format("HH:mm:ss"),
                }
                await addSchedule(dataReq)
            }

            getAllSchedules()
            setStartTime(null)
            setEndTime(null)
            setselectedEmployee([])
            getMappingSchedules()
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    return (<DashboardLayout permission='read_schedule'>
        <div className='col-span-3 bg-white rounded-xl p-6 hover:shadow-lg mb-4'>
            <div className='flex justify-between'>
                <h3 className='font-bold mb-4 text-black text-lg'>{"Kalender Kerja"}</h3>
                {detailExpanded ? <ChevronDownIcon className='cursor-pointer w-5' onClick={() => setDetailExpanded(!detailExpanded)} /> : <ChevronUpIcon className='cursor-pointer w-5' onClick={() => setDetailExpanded(!detailExpanded)} />}
            </div>
            {detailExpanded &&
                <Calendar bordered renderCell={renderCell} onSelect={(val) => {
                    // console.log(val)
                }} onMonthChange={(val) => {
                    setDateRange([moment(val).startOf('month').toDate(), moment(val).endOf('month').toDate()])
                }} />
            }
        </div>
        <div className='grid grid-cols-3 gap-4'>

            <div className='col-span-2'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Jadwal Kerja"}</h3>
                    <CustomTable
                        pagination
                        total={pagination?.total_records}
                        limit={limit}
                        activePage={page}
                        setActivePage={(v) => setPage(v)}
                        changeLimit={(v) => setLimit(v)}
                        headers={["No", "Jadwal", "Waktu", ""]} headerClasses={[]} datasets={schedules.map(e => ({
                            cells: [
                                { data: ((page - 1) * limit) + (schedules.indexOf(e) + 1) },
                                {
                                    data: <div className='flex justify-between'>
                                        <span>
                                            {e.name}

                                        </span>
                                        <AvatarGroup stack>
                                            {e.employees
                                                .filter((item, i) => i < 3)
                                                .map(item => (
                                                    <Avatar onClick={() => { }} size={'sm'} bordered circle key={item.id} src={item.picture_url} alt={item.full_name} />
                                                ))}
                                            {e.employees.length - 3 > 0 &&
                                                <Avatar size={'sm'} bordered circle style={{ background: '#111' }}>
                                                    +{e.employees.length - 3}
                                                </Avatar>
                                            }
                                        </AvatarGroup>
                                    </div>
                                },
                                { data: `${e.start_time} ~ ${e.end_time}` },
                                {
                                    data: <div className='flex cursor-pointer'>
                                        <EyeIcon onClick={() => {

                                        }} className='w-5 text-blue-400  hover:text-blue-800 cursor-pointer' />
                                        <TrashIcon
                                            className=" h-5 w-5 text-red-400 hover:text-red-600"
                                            aria-hidden="true"
                                            onClick={() => {
                                                confirmDelete(() => {
                                                    deletetSchedule(e.id).then(v => getAllSchedules())
                                                })
                                            }}
                                        />
                                    </div>
                                }
                            ]
                        }))} />
                </div>
            </div>
            <div className='col-span-1'>
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg min-h-[400px] flex flex-col'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Tambah Jadwal"}</h3>
                    <InlineForm title="Tipe Jadwal">
                        <Select< SelectOption, false> styles={colourStyles}
                            options={scheduleType}
                            value={selectedType!}
                            onChange={(option: SingleValue<SelectOption>): void => {
                                setSelectedType(option!)
                            }}
                        />
                    </InlineForm>
                    {selectedType.value == "WEEKLY" && <InlineForm title="Pilih Hari">
                        <Select< SelectOption, true> isMulti styles={multiColourStyles}
                            options={daysWeek}
                            value={selectedDaysWeek}
                            onChange={(option: MultiValue<SelectOption>): void => {
                                setSelectedDaysWeek(option!)
                            }}
                        />
                    </InlineForm>}
                    {selectedType.value == "DATERANGE" && <InlineForm title="Rentang Tanggal">
                        <DateRangePicker className='w-full' value={selectedDateRange} onChange={(val) => setSelectedDateRange(val!)} placement="bottomEnd" format='dd/MM/yyyy' />
                    </InlineForm>}
                    {selectedType.value == "SINGLE_DATE" && <InlineForm title="Tanggal">
                        <DatePicker className='w-full' value={selectedDate} onChange={(val) => setSelectedDate(val!)} placement="bottomEnd" format='dd/MM/yyyy' />
                    </InlineForm>}
                    <InlineForm title="Pilih Karyawan">
                        <Select< SelectOption, true> isMulti styles={multiColourStyles}
                            options={employees.map(e => ({ value: e.id, label: e.full_name }))}
                            value={selectedEmployee!}
                            onChange={(option: MultiValue<SelectOption>): void => {
                                setselectedEmployee(option!)
                            }}
                            onInputChange={(val) => {
                                getAllEmployees(val)
                            }}

                        />
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

                    <Button className='mr-2 mt-8' appearance='primary' onClick={save}>
                        <BsFloppy2 className='mr-2' /> Simpan
                    </Button>
                </div>
            </div>
        </div>
        <Modal size={"lg"} open={openModal} onClose={() => {
            setSelectedMonthSchedules(null)
            setOpenModal(false)
        }}>
            <Modal.Header>
                <Modal.Title>{`${moment(selectedMonthSchedules?.date).format('DD MMMM YYYY')}`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ul>
                    {(selectedMonthSchedules?.schedules ?? []).map(e => (<li className='mb-8' key={randomStr(3)} >
                        <h3 className='font-bold text-lg text-black mb-2'>{e.name}</h3>
                        <div className='flex mb-2'>
                            {e.employees.map(em => (<div className='py-2 pl-2 pr-4 rounded-full border flex items-center hover:bg-gray-50 mr-2 cursor-pointer' key={em.id} onClick={() => {
                                nav(`/employee/${em.id}`)
                            }}>
                                <Avatar onClick={() => { }} size={'sm'} bordered circle key={em.id} src={em.picture_url} alt={em.full_name} />
                                <p className='ml-4'>{em.full_name}</p>
                            </div>))}
                        </div>
                    </li>))}

                </ul>
            </Modal.Body>

        </Modal>
    </DashboardLayout>);
}
export default SchedulePage;

