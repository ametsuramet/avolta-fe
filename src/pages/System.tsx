import DashboardLayout from '@/components/dashboard_layout';
import InlineForm from '@/components/inline_form';
import { Account } from '@/model/account';
import { Setting } from '@/model/setting';
import { LoadingContext } from '@/objects/loading_context';
import { getAccounts } from '@/repositories/account';
import { editSetting, getSettingDetail } from '@/repositories/setting';
import { AUTO_NUMERIC_FORMAL, TOKEN } from '@/utils/constant';
import { asyncLocalStorage } from '@/utils/helper';
import { successToast } from '@/utils/helperUi';
import { useContext, useEffect, useState, type FC } from 'react';
import { BsFloppy2 } from 'react-icons/bs';
import { Button, Panel, SelectPicker, Tag, TagGroup, Toggle } from 'rsuite';
import Swal from 'sweetalert2';

interface SystemPageProps { }

const SystemPage: FC<SystemPageProps> = ({ }) => {
    let { isLoading, setIsLoading } = useContext(LoadingContext);

    const [token, setToken] = useState("");
    const [payRollPayableAccounts, setPayRollPayableAccounts] = useState<Account[]>([])
    const [payRollExpenseAccounts, setPayRollExpenseAccounts] = useState<Account[]>([])
    const [payRollAssetAccounts, setPayRollAssetAccounts] = useState<Account[]>([])
    const [payRollTaxAccounts, setPayRollTaxAccounts] = useState<Account[]>([])


    const [selectedPayRollPayableAccount, setSelectedPayRollPayableAccount] = useState("")
    const [selectedPayRollExpenseAccount, setSelectedPayRollExpenseAccount] = useState("")
    const [selectedPayRollAssetAccount, setSelectedPayRollAssetAccount] = useState("")
    const [selectedPayRollTaxAccount, setSelectedPayRollTaxAccount] = useState("")
    const [setting, setSetting] = useState<Setting | null>(null);
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
            let resp = await getAccounts({ page: 1, limit: 20 }, { type: "Liability", isTax: false })
            let respJson = await resp.json()
            setPayRollPayableAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    const getPayRollExpenseAccounts = async () => {
        try {
            setIsLoading(true)
            let resp = await getAccounts({ page: 1, limit: 20 }, { type: "Expense", cashflowGroup: "operating" })
            let respJson = await resp.json()
            setPayRollExpenseAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    const getPayRollAssetAccounts = async () => {
        try {
            setIsLoading(true)
            let resp = await getAccounts({ page: 1, limit: 20 }, { type: "Asset", cashflowSubgroup: "cash_bank" })
            let respJson = await resp.json()
            setPayRollAssetAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }
    const getPayRollTaxAccounts = async () => {
        try {
            setIsLoading(true)
            let resp = await getAccounts({ page: 1, limit: 20 }, { type: "Liability", isTax: true })
            let respJson = await resp.json()
            setPayRollTaxAccounts(respJson.data)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const getAllSetting = async () => {
        try {
            let resp = await getSettingDetail()
            var respJson = await resp.json()
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
        }
    }, [setting, payRollPayableAccounts, payRollExpenseAccounts, payRollAssetAccounts, payRollTaxAccounts]);

    const update = async () => {
        try {
            let resp = await editSetting({
                pay_roll_auto_number: setting?.pay_roll_auto_number ?? false,
                pay_roll_auto_format: setting?.pay_roll_auto_format ?? "",
                pay_roll_static_character: setting?.pay_roll_static_character ?? "",
                pay_roll_auto_number_character_length: setting?.pay_roll_auto_number_character_length ?? 5,
                pay_roll_payable_account_id: selectedPayRollPayableAccount,
                pay_roll_expense_account_id: selectedPayRollExpenseAccount,
                pay_roll_asset_account_id: selectedPayRollAssetAccount,
                pay_roll_tax_account_id: selectedPayRollTaxAccount
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




    return (
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
                        <InlineForm title="Akun Pajak">
                            <SelectPicker searchable={true} data={payRollTaxAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedPayRollTaxAccount} onSelect={(val) => setSelectedPayRollTaxAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="Akun Pengeluaran">
                            <SelectPicker searchable={true} data={payRollExpenseAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedPayRollExpenseAccount} onSelect={(val) => setSelectedPayRollExpenseAccount(val)} block />
                        </InlineForm>
                        <InlineForm title="Akun Kas">
                            <SelectPicker searchable={true} data={payRollAssetAccounts.map(e => ({ value: e.id, label: e.name }))} value={selectedPayRollAssetAccount} onSelect={(val) => setSelectedPayRollAssetAccount(val)} block />
                        </InlineForm>
                        <Button className='mt-8' onClick={async () => {
                            update()
                        }} appearance='primary'><BsFloppy2 className='mr-2' /> Simpan</Button>
                    </Panel>
                    <Panel header="Auto Number" bordered>
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