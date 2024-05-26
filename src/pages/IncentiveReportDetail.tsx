import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Employee } from '@/model/employee';
import { IncentiveReport } from '@/model/incentive_report';
import { LoadingContext } from '@/objects/loading_context';
import { addEmployee, getEmployees } from '@/repositories/employee';
import { addEmployeeIncentiveReport, getIncentiveReportDetail } from '@/repositories/incentive_report';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import Moment from 'react-moment';
import { useParams } from 'react-router-dom';
import { Button, Modal, TagPicker } from 'rsuite';
import Swal from 'sweetalert2';

interface IncentiveReportDetailProps { }

const IncentiveReportDetail: FC<IncentiveReportDetailProps> = ({ }) => {
    const { incentiveReportId } = useParams()
    const [mounted, setMounted] = useState(false);
    const { isLoading, setIsLoading } = useContext(LoadingContext);
    const [incentiveReport, setIncentiveReport] = useState<IncentiveReport | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeIds, setEmployeeIds] = useState<string[]>([]);


    useEffect(() => {
        setMounted(true)
    }, []);
    useEffect(() => {
        if (!mounted) return
        getDetail()
        getAllEmployees()
    }, [mounted]);

    const getAllEmployees = () => {
        getEmployees({ page: 1, limit: 5 })
            .then(v => v.json())
            .then(v => setEmployees(v.data))
    }

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
    return (<DashboardLayout permission='read_incentive_report'>
        <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Laporan Insentif"}</h3>
                </div>
                <InlineForm title="No. Laporan">
                    {incentiveReport?.report_number}
                </InlineForm>
                <InlineForm title="Tgl">
                    <Moment format='DD/MM/YYYY'>{incentiveReport?.start_date}</Moment> ~ <Moment format='DD/MM/YYYY'>{incentiveReport?.end_date}</Moment>
                </InlineForm>
                <InlineForm title="Keterangan">
                    {incentiveReport?.description}
                </InlineForm>
                <InlineForm title="Dibuat">
                    {incentiveReport?.user_name}
                </InlineForm>
            </div>
            <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                </div>
            </div>
        </div>
        <div className='bg-white rounded-xl p-6 hover:shadow-lg'>
            <div className='flex justify-between'>
                <h3 className='font-bold mb-4 text-black text-lg'>{"Detail Insentif"}</h3>
                <Button onClick={() => setModalOpen(true)}><PlusIcon className='w-4 mr-4' />Tambah Salesman</Button>
            </div>
        </div>
        <Modal open={modalOpen} onClose={() => {
            setModalOpen(false)
        }}>
            <Modal.Header>Tambah Karyawan</Modal.Header>
            <Modal.Body>
                <InlineForm title="Salesman">
                    <TagPicker
                        searchable
                        valueKey='id'
                        labelKey='full_name'
                        onChange={(val) => {
                            setEmployeeIds(val)
                        }}
                        value={employeeIds}
                        data={employees} className=" block" />
                </InlineForm>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={async () => {
                    for (const employeeId of employeeIds) {
                        await addEmployeeIncentiveReport(incentiveReportId!, employeeId)
                    }
                }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
            </Modal.Footer>
        </Modal>
    </DashboardLayout>);
}
export default IncentiveReportDetail;