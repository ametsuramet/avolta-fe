import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Reimbursement, ReimbursementItem } from '@/model/reimbursement';
import { LoadingContext } from '@/objects/loading_context';
import { SelectOption } from '@/objects/select_option';
import { approvalReimbursement, getReimbursementDetail, paymentReimbursement } from '@/repositories/reimbursement';
import { addReimbursementItem, deleteReimbursementItem, editReimbursementItem } from '@/repositories/reimbursement_item';
import { TOKEN } from '@/utils/constant';
import { asyncLocalStorage, confirmDelete, money, randomStr } from '@/utils/helper';
import { successToast } from '@/utils/helperUi';
import { CameraIcon } from '@heroicons/react/16/solid';
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useContext, useEffect, useState, type FC } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { BsFloppy2 } from 'react-icons/bs';
import { GiPaperClip } from 'react-icons/gi';
import ReactMarkdown from 'react-markdown';
import Moment from 'react-moment';
import { useParams } from 'react-router-dom';
import { MultiValue } from 'react-select';
import { Badge, Button, ButtonGroup, Message, Panel, SelectPicker, Uploader, toaster } from 'rsuite';
import rehypeRaw from 'rehype-raw'
import Swal from 'sweetalert2';
import { Account } from '@/model/account';
import { getAccounts } from '@/repositories/account';
import { getSettingDetail } from '@/repositories/setting';
import { BiMoneyWithdraw } from 'react-icons/bi';

interface ReimbursementDetailProps { }

const ReimbursementDetail: FC<ReimbursementDetailProps> = ({ }) => {
    const [mounted, setMounted] = useState(false);
    let { isLoading, setIsLoading } = useContext(LoadingContext);
    const { reimbursementId } = useParams()
    const [reimbursement, setReimbursement] = useState<Reimbursement | null>(null);
    const [editable, setEditable] = useState(false);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [notes, setNotes] = useState("");
    const [amount, setAmount] = useState(0);
    const [files, setFiles] = useState<MultiValue<SelectOption>>([]);
    const [token, setToken] = useState("");
    const [remarks, setRemarks] = useState("");
    const [assetAccounts, setAssetAccounts] = useState<Account[]>([])
    const [selectedReimbursementAssetAccount, setSelectedReimbursementAssetAccount] = useState("")
    const [mountedAmount, setmountedAmount] = useState(true);





    useEffect(() => {
        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
        getDetail()
        getAssetAccounts()
        getAllSetting()
    }, []);

    const getAllSetting = async () => {
        try {

            let resp = await getSettingDetail()
            var respJson = await resp.json()
            setSelectedReimbursementAssetAccount(respJson.data.reimbursement_asset_account_id)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }


    const getAssetAccounts = async () => {
        try {
            setIsLoading(true)
            let resp = await getAccounts({ page: 1, limit: 20 }, { type: "Asset", cashflowSubgroup: "cash_bank" })
            let respJson = await resp.json()
            setAssetAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }


    const getDetail = async () => {
        try {
            setIsLoading(true)
            var resp = await getReimbursementDetail(reimbursementId!)
            var respJson = await resp.json()
            setReimbursement(respJson.data)

        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (reimbursement) {
            setEditable(reimbursement.status == "DRAFT")
            setmountedAmount(false)
            setTimeout(() => {
                setmountedAmount(true)
            }, 100);
        }
    }, [reimbursement]);
    const addItem = () => {
        setIsLoading(true)
        addReimbursementItem({
            amount: amount,
            notes: notes,
            reimbursement_id: reimbursementId!,
            files: JSON.stringify(files.map(e => e.value))
        }).then(() => {
            getDetail()
            setNotes("")
            setAmount(0)
            setFiles([])
        })
            .finally(() => setIsLoading(false))
    }
    const editItem = (id: string, item: ReimbursementItem) => {
        editReimbursementItem(id, {
            amount: 0,
            notes: '',
            reimbursement_id: reimbursementId!,
            files: '[]'
        }).then(() => getDetail())
    }


    const approveLeave = (approvalType: string) => {
        setIsLoading(true)
        approvalReimbursement(reimbursementId!, approvalType, remarks).then(() => {
            getDetail()
            setRemarks('')
            successToast("Reimbursement telah diupdate")

        })
            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
            .finally(() => setIsLoading(false))
    }


    return (<DashboardLayout permission='read_reimbursement'>
        <div className="grid grid-cols-4 gap-4">
            <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8 col-span-2'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-bold mb-4 text-black text-lg '>{reimbursement?.name}</h3>
                </div>
                <Panel bordered header="Info" className=' '>
                    <InlineForm title="Judul">
                        {reimbursement?.name}
                    </InlineForm>
                    <InlineForm title="Tgl">
                        <Moment format='DD/MM/YYYY'>{reimbursement?.date}</Moment>
                    </InlineForm>
                    <InlineForm title="Total">
                        {money(reimbursement?.total)}
                    </InlineForm>
                    <InlineForm title="Sisa">
                        {(reimbursement?.balance ?? 0) > 0 ? money(reimbursement?.balance) : <Badge className='text-center' color='blue' content={"LUNAS"} />}
                    </InlineForm>
                    <InlineForm title="Catatan">
                        {reimbursement?.notes}
                    </InlineForm>

                    <InlineForm title="Status">
                        {reimbursement?.status == "DRAFT" && <Badge className='text-center' color='yellow' content={reimbursement?.status} />}
                        {reimbursement?.status == "REQUEST" && <Badge className='text-center' color='violet' content={reimbursement?.status} />}
                        {reimbursement?.status == "PROCESSING" && <Badge className='text-center' color='orange' content={reimbursement?.status} />}
                        {reimbursement?.status == "APPROVED" && <Badge className='text-center' color='blue' content={reimbursement?.status} />}
                        {reimbursement?.status == "REJECTED" && <Badge className='text-center' color='red' content={reimbursement?.status} />}
                        {reimbursement?.status == "PAID" && <Badge className='text-center' color='green' content={reimbursement?.status} />}
                        {reimbursement?.status == "FINISHED" && <Badge className='text-center' color='green' content={reimbursement?.status} />}
                        {reimbursement?.status == "CANCELED" && <Badge className='text-center' color='red' content={reimbursement?.status} />}
                    </InlineForm>
                    {(reimbursement?.status == "PAID" || reimbursement?.status == "FINISHED" || reimbursement?.status == "APPROVED") &&
                        <InlineForm title="File Sisipan">
                            <div className='flex'>
                                {reimbursement.attachments.map(f => <div key={randomStr(5)} className=' cursor-pointer' onClick={() => window.open(f)}>
                                    <GiPaperClip size={16} />
                                </div>)}
                            </div>
                        </InlineForm>
                    }
                    {reimbursement?.status != "APPROVED" && reimbursement?.status != "PAID" && reimbursement?.status != "FINISHED" &&
                        <InlineForm title="Proses" style={{ alignItems: 'start' }}>
                            <textarea
                                rows={5}
                                className="form-control"
                                placeholder={"Catatan"}
                                value={remarks}
                                onChange={(el) => setRemarks(el.target.value)}
                            />
                            {reimbursement?.status == "DRAFT" && <Button appearance='primary' color='violet' onClick={() => approveLeave("REQUEST")}>Simpan Pengajuan</Button>}
                            {reimbursement?.status == "REQUEST" && <Button appearance='primary' color='orange' onClick={() => approveLeave("PROCESSING")}>PROSES REQUEST</Button>}
                            {reimbursement?.status == "PROCESSING" &&
                                <div className='flex'>
                                    <Button className='mr-2 flex-1' appearance='primary' color='red' onClick={() => approveLeave("REJECTED")}>TOLAK</Button>
                                    <Button className='flex-1' appearance='primary' color='blue' onClick={() => approveLeave("APPROVED")}>SETUJUI</Button>
                                </div>
                            }
                        </InlineForm>
                    }

                </Panel>



            </div>
            {editable &&
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8 col-span-2'>
                    <div className='flex justify-between items-center'>
                        <h3 className='font-bold mb-4 text-black text-lg '>Tambah Item</h3>

                    </div>
                    <InlineForm title={'Jumlah'} style={{}}>
                        {mountedAmount &&
                            <CurrencyInput
                                className='form-control'
                                groupSeparator="."
                                decimalSeparator=","
                                value={amount}
                                onValueChange={(_, __, val) => {
                                    setAmount(val?.float ?? 0)
                                }}
                            />
                        }
                    </InlineForm>
                    <InlineForm title={'Catatan'} style={{ alignItems: 'start' }}>
                        <textarea
                            rows={5}
                            className="form-control"
                            placeholder={"Catatan"}
                            value={notes}
                            onChange={(el) => setNotes(el.target.value)}
                        />
                    </InlineForm>
                    <InlineForm title={'File Sisipan'} style={{ alignItems: 'start' }}>
                        <Uploader
                            className='w-full'
                            fileListVisible={false}
                            action={`${import.meta.env.VITE_API_URL}/admin/file/upload`}
                            onSuccess={async (resp) => {
                                setFiles([
                                    ...files,
                                    { value: resp.data.path, label: resp.data.filename }
                                ])
                                setIsLoading(false);
                            }}
                            headers={{
                                authorization: `Bearer ${token}`
                            }}
                            onChange={(files) => {
                                console.log(files)
                            }} draggable

                        >
                            <div style={{ height: 200, width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span>Click or Drag files to this area to upload</span>
                            </div>
                        </Uploader>
                        <ul>
                            {files.map(e => <li className='p-1 flex justify-between' key={e.value}>
                                {e.label} <XMarkIcon className='w-4 cursor-pointer' onClick={() => {
                                    setFiles([...files.filter(s => e.value != s.value)])
                                }} />
                            </li>)}

                        </ul>

                    </InlineForm>


                    <Button onClick={async () => {
                        addItem()
                    }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                </div>
            }

            {reimbursement?.status == "APPROVED" &&
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8 col-span-2'>
                    <div className='flex justify-between items-center'>
                        <h3 className='font-bold mb-4 text-black text-lg '>Pembayaran</h3>
                    </div>
                    <InlineForm title="Akun Kas">
                        <SelectPicker searchable={true} data={assetAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedReimbursementAssetAccount} onSelect={(val) => setSelectedReimbursementAssetAccount(val)} block />
                    </InlineForm>
                    <InlineForm title={'Jumlah'} style={{}}>
                        {mountedAmount &&
                            <CurrencyInput
                                className='form-control'
                                groupSeparator="."
                                decimalSeparator=","
                                defaultValue={reimbursement?.balance}
                                onValueChange={(_, __, val) => {
                                    setAmount(val?.float ?? 0)
                                }}
                            />
                        }
                    </InlineForm>
                    <InlineForm title="Proses" style={{ alignItems: 'start' }}>
                        <textarea
                            rows={5}
                            className="form-control"
                            placeholder={"Catatan"}
                            value={remarks}
                            onChange={(el) => setRemarks(el.target.value)}
                        />


                    </InlineForm>
                    <InlineForm title={'File Sisipan'} style={{ alignItems: 'start' }}>
                        <Uploader
                            className='w-full'
                            fileListVisible={false}
                            action={`${import.meta.env.VITE_API_URL}/admin/file/upload`}
                            onSuccess={async (resp) => {
                                setFiles([
                                    ...files,
                                    { value: resp.data.path, label: resp.data.filename }
                                ])
                                setIsLoading(false);
                            }}
                            headers={{
                                authorization: `Bearer ${token}`
                            }}
                            onChange={(files) => {
                                console.log(files)
                            }} draggable

                        >
                            <div style={{ height: 200, width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span>Click or Drag files to this area to upload</span>
                            </div>
                        </Uploader>
                        <ul>
                            {files.map(e => <li className='p-1 flex justify-between' key={e.value}>
                                {e.label} <XMarkIcon className='w-4 cursor-pointer' onClick={() => {
                                    setFiles([...files.filter(s => e.value != s.value)])
                                }} />
                            </li>)}

                        </ul>

                    </InlineForm>
                    <Button className='flex-1' appearance='primary' color='green' onClick={() => {
                        setIsLoading(true)
                        paymentReimbursement(reimbursementId!, amount, remarks, selectedReimbursementAssetAccount, JSON.stringify(files.map(e => e.value)))
                            .then(() => {

                                setRemarks('')
                                setAmount(0)
                                setFiles([])
                                successToast("Reimbursement telah dibayar")
                                getDetail()
                            })
                            .catch(error => Swal.fire(`Perhatian`, `${error}`, 'error'))
                            .finally(() => setIsLoading(false))
                    }}> <BiMoneyWithdraw className='mr-2' /> PEMBAYARAN</Button>
                </div>
            }
        </div>
        {(reimbursement?.status == "PAID" || reimbursement?.status == "FINISHED" || reimbursement?.status == "APPROVED") && reimbursement!.transactions.length > 0 &&
            < div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8 col-span-2'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Riwayat Transaksi"}</h3>
                </div>
                <div className=' overflow-auto'>
                    <CustomTable headers={["No", "Keterangan", "Kategori", "Jumlah"]} headerClasses={["", "", "", "text-right"]} datasets={(reimbursement?.transactions ?? []).map(e => ({
                        cells: [
                            { data: reimbursement!.transactions!.filter(e => !e.is_expense).indexOf(e) + 1 },
                            { data: e.description },
                            { data: e.account_destination_name },
                            { data: money(e.credit - e.debit, 0), className: "text-right" },
                        ]
                    }))} />
                </div>
            </div>
        }
        <div className="grid grid-cols-4 gap-4">
            {reimbursement &&
                <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8 col-span-3'>
                    <div className='flex justify-between items-center'>
                        <h3 className='font-bold mb-4 text-black text-lg '>Detail Reimbursement</h3>
                    </div>
                    <CustomTable headers={["No", "Keterangan", "Jumlah", "File", ""]} headerClasses={[]} datasets={(reimbursement?.items ?? []).map(e => ({
                        cells: [
                            { data: reimbursement.items.indexOf(e) + 1 },
                            { data: e.notes },
                            { data: money(e.amount) },
                            {
                                data: <div className='flex'>
                                    {e.attachments.map(f => <div key={randomStr(5)} className=' cursor-pointer' onClick={() => window.open(f)}>
                                        <GiPaperClip size={16} />
                                    </div>)}
                                </div>
                            },
                            {
                                data: reimbursement.status == "DRAFT" && <TrashIcon
                                    className=" h-5 w-5 text-red-400 hover:text-red-600"
                                    aria-hidden="true"
                                    onClick={() => {
                                        confirmDelete(() => {
                                            deleteReimbursementItem(e.id).then(v => getDetail())
                                        })
                                    }}
                                />
                            }
                        ]
                    }))} />
                </div>
            }
            <div className=' bg-white rounded-xl p-6 hover:shadow-lg mb-8 col-span-1'>
                <div className='flex justify-between items-center'>
                    <h3 className='font-bold mb-4 text-black text-lg '>Catatan</h3>
                </div>
                <ReactMarkdown rehypePlugins={[rehypeRaw]} children={reimbursement?.remarks} />
            </div>
        </div>
    </DashboardLayout >);
}
export default ReimbursementDetail;