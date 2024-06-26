import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Account } from '@/model/account';
import { Setting } from '@/model/setting';
import { LoadingContext } from '@/objects/loading_context';
import { getAccounts } from '@/repositories/account';
import { editSetting, getAutoNumber, getIncentiveAutoNumber, getPayRollReportAutoNumber, getSettingDetail } from '@/repositories/setting';
import { AUTO_NUMERIC_FORMAL, TOKEN } from '@/utils/constant';
import { asyncLocalStorage } from '@/utils/helper';
import { successToast } from '@/utils/helperUi';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { Button, Panel, SelectPicker, Tag, TagGroup, Toggle } from 'rsuite';
import Swal from 'sweetalert2';

interface SystemPageProps { }

const SystemPage: FC<SystemPageProps> = ({ }) => {
    const { isLoading, setIsLoading } = useContext(LoadingContext);

    const [token, setToken] = useState("");
    const [payRollPayableAccounts, setPayRollPayableAccounts] = useState<Account[]>([])
    const [payRollExpenseAccounts, setPayRollExpenseAccounts] = useState<Account[]>([])
    const [payRollAssetAccounts, setPayRollAssetAccounts] = useState<Account[]>([])
    const [payRollTaxAccounts, setPayRollTaxAccounts] = useState<Account[]>([])


    const [selectedPayRollPayableAccount, setSelectedPayRollPayableAccount] = useState("")
    const [selectedPayRollExpenseAccount, setSelectedPayRollExpenseAccount] = useState("")
    const [selectedPayRollAssetAccount, setSelectedPayRollAssetAccount] = useState("")
    const [selectedPayRollTaxAccount, setSelectedPayRollTaxAccount] = useState("")
    const [selectedPayRollCostAccount, setSelectedPayRollCostAccount] = useState("")
    const [setting, setSetting] = useState<Setting | null>(null);
    const [autoNumber, setAutoNumber] = useState("");
    const [incentiveAutoNumber, setIncentiveAutoNumber] = useState("");
    const [payrollReportAutoNumber, setPayrollReportAutoNumber] = useState("");

    const [selectedReimbursementPayableAccount, setSelectedReimbursementPayableAccount] = useState("")
    const [selectedReimbursementExpenseAccount, setSelectedReimbursementExpenseAccount] = useState("")
    const [selectedReimbursementAssetAccount, setSelectedReimbursementAssetAccount] = useState("")
    useEffect(() => {

        asyncLocalStorage.getItem(TOKEN)
            .then(v => setToken(v))
        getAllSetting()
        getPayRollPayableAccounts()
        getPayRollExpenseAccounts()
        getPayRollAssetAccounts()
        getPayRollTaxAccounts()

        // setEditable(true)

    }, []);

    const getPayRollPayableAccounts = async () => {
        try {
            setIsLoading(true)
            const resp = await getAccounts({ page: 1, limit: 20 }, { type: "Liability", isTax: false })
            const respJson = await resp.json()
            setPayRollPayableAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    const getPayRollExpenseAccounts = async () => {
        try {
            setIsLoading(true)
            const resp = await getAccounts({ page: 1, limit: 20 }, { type: "Expense", cashflowGroup: "operating" })
            const respJson = await resp.json()
            setPayRollExpenseAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    const getPayRollAssetAccounts = async () => {
        try {
            setIsLoading(true)
            const resp = await getAccounts({ page: 1, limit: 20 }, { type: "Asset", cashflowSubgroup: "cash_bank" })
            const respJson = await resp.json()
            setPayRollAssetAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    const getPayRollTaxAccounts = async () => {
        try {
            setIsLoading(true)
            const resp = await getAccounts({ page: 1, limit: 20 }, { type: "Liability", isTax: true })
            const respJson = await resp.json()
            setPayRollTaxAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const getAllSetting = async () => {
        try {
            getAutoNumber()
                .then(v => v.json())
                .then(v => setAutoNumber(v.data))
            getIncentiveAutoNumber()
                .then(v => v.json())
                .then(v => setIncentiveAutoNumber(v.data))
            getPayRollReportAutoNumber()
                .then(v => v.json())
                .then(v => setPayrollReportAutoNumber(v.data))
            const resp = await getSettingDetail()
            const respJson = await resp.json()
            setSetting(respJson.data)
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (setting) {
            setSelectedPayRollPayableAccount(setting?.pay_roll_payable_account_id ?? "")
            setSelectedPayRollExpenseAccount(setting?.pay_roll_expense_account_id ?? "")
            setSelectedPayRollAssetAccount(setting?.pay_roll_asset_account_id ?? "")
            setSelectedPayRollTaxAccount(setting?.pay_roll_tax_account_id ?? "")
            setSelectedPayRollCostAccount(setting?.pay_roll_cost_account_id ?? "")
            setSelectedReimbursementPayableAccount(setting?.reimbursement_payable_account_id ?? "")
            setSelectedReimbursementExpenseAccount(setting?.reimbursement_expense_account_id ?? "")
            setSelectedReimbursementAssetAccount(setting?.reimbursement_asset_account_id ?? "")
        }
    }, [setting, payRollPayableAccounts, payRollExpenseAccounts, payRollAssetAccounts, payRollTaxAccounts]);

    const update = async () => {
        try {
            const resp = await editSetting({
                is_effective_rate_average: setting?.is_effective_rate_average ?? false,
                is_gross_up: setting?.is_gross_up ?? false,
                pay_roll_auto_number: setting?.pay_roll_auto_number ?? false,
                pay_roll_auto_format: setting?.pay_roll_auto_format ?? "",
                pay_roll_static_character: setting?.pay_roll_static_character ?? "",
                pay_roll_auto_number_character_length: setting?.pay_roll_auto_number_character_length ?? 5,
                pay_roll_report_auto_number: setting?.pay_roll_report_auto_number ?? false,
                pay_roll_report_auto_format: setting?.pay_roll_report_auto_format ?? "",
                pay_roll_report_static_character: setting?.pay_roll_report_static_character ?? "",
                pay_roll_report_auto_number_character_length: setting?.pay_roll_report_auto_number_character_length ?? 5,
                pay_roll_payable_account_id: selectedPayRollPayableAccount != "" ? selectedPayRollPayableAccount : null,
                pay_roll_expense_account_id: selectedPayRollExpenseAccount != "" ? selectedPayRollExpenseAccount : null,
                pay_roll_asset_account_id: selectedPayRollAssetAccount != "" ? selectedPayRollAssetAccount : null,
                pay_roll_tax_account_id: selectedPayRollTaxAccount != "" ? selectedPayRollTaxAccount : null,
                pay_roll_cost_account_id: selectedPayRollCostAccount != "" ? selectedPayRollCostAccount : null,
                reimbursement_payable_account_id: selectedReimbursementPayableAccount != "" ? selectedReimbursementPayableAccount : null,
                reimbursement_expense_account_id: selectedReimbursementExpenseAccount != "" ? selectedReimbursementExpenseAccount : null,
                reimbursement_asset_account_id: selectedReimbursementAssetAccount != "" ? selectedReimbursementAssetAccount : null,
                bpjs_kes: setting?.bpjs_kes ?? false,
                bpjs_tk_jht: setting?.bpjs_tk_jht ?? false,
                bpjs_tk_jkm: setting?.bpjs_tk_jkm ?? false,
                bpjs_tk_jp: setting?.bpjs_tk_jp ?? false,
                bpjs_tk_jkk: setting?.bpjs_tk_jkk ?? false,
                incentive_auto_number: setting?.incentive_auto_number ?? false,
                incentive_auto_format: setting?.incentive_auto_format ?? "",
                incentive_static_character: setting?.incentive_static_character ?? "",
                incentive_auto_number_character_length: setting?.incentive_auto_number_character_length ?? 5,
                incentive_sick_leave_threshold: setting?.incentive_sick_leave_threshold ?? 5,
                incentive_other_leave_threshold: setting?.incentive_other_leave_threshold ?? 5,
                incentive_absent_threshold: setting?.incentive_absent_threshold ?? 5,
            })
            // setCompany(respJson.data)
            getAllSetting()
            successToast("Pengaturan berhasil diupdate")
        } catch (error) {
            Swal.fire(`Perhatian`, `${error}`, 'error')
        } finally {
            setIsLoading(false)
        }
    }




    return (setting &&
        <DashboardLayout permission='menu_system'>
            <div className=' bg-white rounded-xl p-6 hover:shadow-lg'>
                <div className='flex justify-between'>
                    <h3 className='font-bold mb-4 text-black text-lg'>{"Pengaturan Sistem"}</h3>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <Panel header="Pay Roll" bordered>

                        <InlineForm title="Akun Hutang Gaji">
                            <SelectPicker searchable={true} data={payRollPayableAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedPayRollPayableAccount} onSelect={(val) => setSelectedPayRollPayableAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="Akun Hutang BPJS">
                            <SelectPicker searchable={true} data={payRollPayableAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedPayRollCostAccount} onSelect={(val) => setSelectedPayRollCostAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="Akun Pajak">
                            <SelectPicker searchable={true} data={payRollTaxAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedPayRollTaxAccount} onSelect={(val) => setSelectedPayRollTaxAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="Akun Pengeluaran">
                            <SelectPicker searchable={true} data={payRollExpenseAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedPayRollExpenseAccount} onSelect={(val) => setSelectedPayRollExpenseAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="Akun Kas">
                            <SelectPicker searchable={true} data={payRollAssetAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedPayRollAssetAccount} onSelect={(val) => setSelectedPayRollAssetAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="BPJS Kesehatan" style={{ marginBottom: 15 }} >
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    bpjs_kes: checked,
                                })

                            }} checked={setting!.bpjs_kes} />
                        </InlineForm>
                        <InlineForm title="BPJS Ketenagakerjaan JHT" style={{ marginBottom: 15 }} hints='Jaminan Hari Tua'>
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    bpjs_tk_jht: checked,
                                })

                            }} checked={setting!.bpjs_tk_jht} />
                        </InlineForm>
                        <InlineForm title="BPJS Ketenagakerjaan JKK" style={{ marginBottom: 15 }} hints='Jaminan Keselamatan Kerja'>
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    bpjs_tk_jkk: checked,
                                })

                            }} checked={setting!.bpjs_tk_jkk} />
                        </InlineForm>
                        <InlineForm title="BPJS Ketenagakerjaan JP" style={{ marginBottom: 15 }} hints='Jaminan Pensiun'>
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    bpjs_tk_jp: checked,
                                })

                            }} checked={setting!.bpjs_tk_jp} />
                        </InlineForm>
                        <InlineForm title="BPJS Ketenagakerjaan JKM" style={{ marginBottom: 15 }} hints='Jaminan Kematian'>
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    bpjs_tk_jkm: checked,
                                })

                            }} checked={setting!.bpjs_tk_jkm} />
                        </InlineForm>
                        <Button className='mt-8' onClick={async () => {
                            update()
                        }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                    </Panel>
                    <Panel header="Pay Roll Auto Number" bordered>
                        <InlineForm title="Auto Number Aktif" style={{ marginBottom: 15 }} >
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    pay_roll_auto_number: checked,
                                })
                            }} checked={setting?.pay_roll_auto_number} />
                        </InlineForm>
                        <InlineForm title={"Panjang Auto Number"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="text"

                                value={setting?.pay_roll_auto_number_character_length}
                                onChange={(e) => {
                                    // setAutoNumericLength(parseInt(e.target.value))
                                    setSetting({
                                        ...setting!,
                                        pay_roll_auto_number_character_length: parseInt(e.target.value),
                                    })
                                }}
                            />
                        </InlineForm>
                        <InlineForm title={"Format Nomor"} style={{ alignItems: 'start' }}>
                            <textarea
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                value={setting?.pay_roll_auto_format ?? ""}
                                onChange={(e) => {
                                    // setNumberFormat(e.target.value)
                                    setSetting({
                                        ...setting!,
                                        pay_roll_auto_format: e.target.value,
                                    })
                                }}
                            />
                            <TagGroup className='mt-2'>
                                {AUTO_NUMERIC_FORMAL.map(e => <Tag onClick={() => {
                                    setSetting({
                                        ...setting!,
                                        pay_roll_auto_format: (setting?.pay_roll_auto_format ?? "") + e,
                                    })

                                }} style={{ marginTop: 5, marginLeft: 5, }} key={e} color={setting?.pay_roll_auto_format?.includes(e) ? 'green' : 'cyan'}>{e}</Tag>)}
                            </TagGroup>
                        </InlineForm>

                        <InlineForm title={"Karakter Statis"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="text"

                                value={setting?.pay_roll_static_character ?? ""}
                                onChange={(e) => {
                                    setSetting({
                                        ...setting!,
                                        pay_roll_static_character: e.target.value,
                                    })
                                }}
                            />
                        </InlineForm>
                        <InlineForm title={"Auto Number"}>
                            {autoNumber}
                        </InlineForm>

                        <InlineForm title="TER" style={{ marginBottom: 15 }} hints='(Tarif Efektif Rata-Rata) digunakan untuk menentukan tarif pajak efektif yang akan dikenakan pada penghasilan karyawan atau individu, berlaku dari Januari 2024'>
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    is_effective_rate_average: checked,
                                })
                            }} checked={setting?.is_effective_rate_average} />
                        </InlineForm>
                        <InlineForm title="Gross Up" style={{ marginBottom: 15 }} hints='metode dimana perusahaan memberikan tunjangan pajak yang besarnya sama dengan PPh 21 terutang.'>
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    is_gross_up: checked,
                                })

                            }} checked={setting?.is_gross_up} />
                        </InlineForm>

                        <Button className='mt-8' onClick={async () => {
                            update()
                        }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                    </Panel>
                    <Panel header="Pay Roll Report Auto Number" bordered>
                        <InlineForm title="Auto Number Aktif" style={{ marginBottom: 15 }} >
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    pay_roll_report_auto_number: checked,
                                })
                            }} checked={setting?.pay_roll_report_auto_number} />
                        </InlineForm>
                        <InlineForm title={"Panjang Auto Number"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="text"

                                value={setting?.pay_roll_report_auto_number_character_length}
                                onChange={(e) => {
                                    // setAutoNumericLength(parseInt(e.target.value))
                                    setSetting({
                                        ...setting!,
                                        pay_roll_report_auto_number_character_length: parseInt(e.target.value),
                                    })
                                }}
                            />
                        </InlineForm>
                        <InlineForm title={"Format Nomor"} style={{ alignItems: 'start' }}>
                            <textarea
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                value={setting?.pay_roll_report_auto_format ?? ""}
                                onChange={(e) => {
                                    // setNumberFormat(e.target.value)
                                    setSetting({
                                        ...setting!,
                                        pay_roll_report_auto_format: e.target.value,
                                    })
                                }}
                            />
                            <TagGroup className='mt-2'>
                                {AUTO_NUMERIC_FORMAL.map(e => <Tag onClick={() => {
                                    setSetting({
                                        ...setting!,
                                        pay_roll_report_auto_format: (setting?.pay_roll_report_auto_format ?? "") + e,
                                    })

                                }} style={{ marginTop: 5, marginLeft: 5, }} key={e} color={setting?.pay_roll_report_auto_format?.includes(e) ? 'green' : 'cyan'}>{e}</Tag>)}
                            </TagGroup>
                        </InlineForm>

                        <InlineForm title={"Karakter Statis"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="text"

                                value={setting?.pay_roll_report_static_character ?? ""}
                                onChange={(e) => {
                                    setSetting({
                                        ...setting!,
                                        pay_roll_report_static_character: e.target.value,
                                    })
                                }}
                            />
                        </InlineForm>
                        <InlineForm title={"Auto Number"}>
                            {payrollReportAutoNumber}
                        </InlineForm>


                        <Button className='mt-8' onClick={async () => {
                            update()
                        }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                    </Panel>
                    <Panel header="Insentif Auto Number" bordered>
                        <InlineForm title="Auto Number Aktif" style={{ marginBottom: 15 }} >
                            <Toggle onChange={(checked) => {
                                setSetting({
                                    ...setting!,
                                    incentive_auto_number: checked,
                                })
                            }} checked={setting?.incentive_auto_number} />
                        </InlineForm>
                        <InlineForm title={"Panjang Auto Number"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="text"

                                value={setting?.incentive_auto_number_character_length}
                                onChange={(e) => {
                                    // setAutoNumericLength(parseInt(e.target.value))
                                    setSetting({
                                        ...setting!,
                                        incentive_auto_number_character_length: parseInt(e.target.value),
                                    })
                                }}
                            />
                        </InlineForm>
                        <InlineForm title={"Format Nomor"} style={{ alignItems: 'start' }}>
                            <textarea
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                value={setting?.incentive_auto_format ?? ""}
                                onChange={(e) => {
                                    // setNumberFormat(e.target.value)
                                    setSetting({
                                        ...setting!,
                                        incentive_auto_format: e.target.value,
                                    })
                                }}
                            />
                            <TagGroup className='mt-2'>
                                {AUTO_NUMERIC_FORMAL.map(e => <Tag onClick={() => {
                                    setSetting({
                                        ...setting!,
                                        incentive_auto_format: (setting?.incentive_auto_format ?? "") + e,
                                    })

                                }} style={{ marginTop: 5, marginLeft: 5, }} key={e} color={setting?.incentive_auto_format?.includes(e) ? 'green' : 'cyan'}>{e}</Tag>)}
                            </TagGroup>
                        </InlineForm>

                        <InlineForm title={"Karakter Statis"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="text"

                                value={setting?.incentive_static_character ?? ""}
                                onChange={(e) => {
                                    setSetting({
                                        ...setting!,
                                        incentive_static_character: e.target.value,
                                    })
                                }}
                            />
                        </InlineForm>


                        <InlineForm title={"Batas Sakit"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="number"

                                value={setting?.incentive_sick_leave_threshold ?? ""}
                                onChange={(e) => {
                                    setSetting({
                                        ...setting!,
                                        incentive_sick_leave_threshold: parseFloat(e.target.value),
                                    })
                                }}
                            />
                        </InlineForm>
                        <InlineForm title={"Batas Izin"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="number"

                                value={setting?.incentive_other_leave_threshold ?? ""}
                                onChange={(e) => {
                                    setSetting({
                                        ...setting!,
                                        incentive_other_leave_threshold: parseFloat(e.target.value),
                                    })
                                }}
                            />
                        </InlineForm>
                        <InlineForm title={"Batas Alpa"}>
                            <input
                                className="bg-white appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"

                                type="number"

                                value={setting?.incentive_absent_threshold ?? ""}
                                onChange={(e) => {
                                    setSetting({
                                        ...setting!,
                                        incentive_absent_threshold: parseFloat(e.target.value),
                                    })
                                }}
                            />
                        </InlineForm>

                        <InlineForm title={"Auto Number"}>
                            {incentiveAutoNumber}
                        </InlineForm>



                        <Button className='mt-8' onClick={async () => {
                            update()
                        }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                    </Panel>
                    <Panel header="Reimbursement" bordered>
                        <InlineForm title="Akun Hutang Reimbursement">
                            <SelectPicker searchable={true} data={payRollPayableAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedReimbursementPayableAccount} onSelect={(val) => setSelectedReimbursementPayableAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="Akun Pengeluaran">
                            <SelectPicker searchable={true} data={payRollExpenseAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedReimbursementExpenseAccount} onSelect={(val) => setSelectedReimbursementExpenseAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="Akun Kas">
                            <SelectPicker searchable={true} data={payRollAssetAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedReimbursementAssetAccount} onSelect={(val) => setSelectedReimbursementAssetAccount(val)} block />
                        </InlineForm>
                        <Button className='mt-8' onClick={async () => {
                            update()
                        }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                    </Panel>

                </div>
            </div>
        </DashboardLayout>
    );
}
export default SystemPage;