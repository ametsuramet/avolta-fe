import { useContext, useEffect, useState, type FC } from 'react';
import { Sidenav, Nav, Toggle, Avatar } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import { ExpandMenuContext } from '@/objects/expand_menu';
import { BsPersonVcard } from 'react-icons/bs';
import { HiOutlineHome } from 'react-icons/hi';
import { TbHome, TbUser, TbUserCircle } from 'react-icons/tb';
import { LuBarChartBig, LuBuilding2, LuCalendarClock, LuCalendarDays, LuContact, LuHome, LuLineChart, LuShoppingCart, LuUserCircle, LuUserCircle2, LuWallet2 } from 'react-icons/lu';
import { BiEnvelopeOpen, BiMoneyWithdraw } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import { Profile } from '@/model/auth';
import { getStorageProfile } from '@/utils/helper';


interface SidebarProps { }

const Sidebar: FC<SidebarProps> = ({ }) => {
	const [activeKey, setActiveKey] = useState('1');
	const { isExpanded, setExpanded } = useContext(ExpandMenuContext)
	const [profile, setProfile] = useState<Profile | null>(null);
	const location = useLocation();
	const nav = useNavigate()

	useEffect(() => {
		getStorageProfile()
			.then(v => setProfile(v))
	}, []);

	const getOpenKey = () => {
		switch (location.pathname) {
			case "/schedule":
			case "/job_title":
			case "/organization":
			case "/role":
			case "/user":
			case "/leave_category":
			case "/company":
			case "/system":
			case "/setting/incentive":
				return "/setting"
			case "/product":
			case "/shop":
			case "/product_category":
			case "/sale":
				return "/sales"
			case "/report/pay_roll":
			case "/report/incentive":
				return "/report"

			default:
				return location.pathname
		}

	}

	return (<div style={{ width: isExpanded ? 240 : 56 }} className='bg-white' >
		<Sidenav expanded={isExpanded} defaultOpenKeys={[getOpenKey()]} className='bg-white'>
			<Sidenav.Header>
				<div className='flex justify-center h-16 flex-col items-center' >
					{isExpanded ?
						<img src="/images/logo araya.png" alt="" className=' px-2 w-48 text-center' />
						:
						<img src="/images/logo.png" alt="" className=' px-2 w-48 text-center' />
					}

				</div>
				<div className='p-4 hover:bg-gray-50 cursor-pointer'>
					<div className='flex flex-row items-center '>
						<Avatar size={isExpanded ? 'sm' : 'xs'} src={profile?.picture} circle />
						{isExpanded &&
							<div className='flex flex-col ml-2'>
								<h3 className=' font-bold text-base  -mb-1'>{profile?.full_name}</h3>
								<p className=' text-xs text-gray-400'>{profile?.role_name}</p>
							</div>
						}
					</div>
				</div>
			</Sidenav.Header>
			<Sidenav.Body className='bg-white'>
				<Nav activeKey={location.pathname} onSelect={setActiveKey}>
					<Nav.Item eventKey="/" onClick={() => nav('/')} icon={<LuHome className='rs-icon' />}>
						Dashboard
					</Nav.Item>
					<Nav.Item onClick={() => nav('/employee')} eventKey="/employee" icon={<LuContact className='rs-icon' />}>
						Karyawan
					</Nav.Item>
					<Nav.Item onClick={() => nav('/attendance')} eventKey="/attendance" icon={<LuCalendarClock className='rs-icon' />}>
						Absensi
					</Nav.Item>
					<Nav.Item onClick={() => nav('/leave')} eventKey="/leave" icon={<LuCalendarDays className='rs-icon' />}>
						Cuti
					</Nav.Item>
					<Nav.Item onClick={() => nav('/reimbursement')} eventKey="/reimbursement" icon={<BiMoneyWithdraw className='rs-icon' />}>
						Reimbursement
					</Nav.Item>
					<Nav.Item onClick={() => nav('/pay_roll')} eventKey="/pay_roll" icon={<LuWallet2 className='rs-icon' />}>
						Payroll
					</Nav.Item>

				
					<Nav.Menu placement="rightStart" eventKey="/report" title="Laporan" icon={<LuBarChartBig className='rs-icon' />}>
						<Nav.Item onClick={() => nav('/report/pay_roll')} eventKey="/report/pay_roll" >Laporan Payroll</Nav.Item>
						<Nav.Item onClick={() => nav('/report/incentive')} eventKey="/report/incentive" >Laporan Insentif</Nav.Item>
					</Nav.Menu>
					<Nav.Menu placement="rightStart" eventKey="/sales" title="Penjualan" icon={<LuShoppingCart className='rs-icon' />}>
						<Nav.Item onClick={() => nav('/product')} eventKey="/product" >Produk</Nav.Item>
						<Nav.Item onClick={() => nav('/product_category')} eventKey="/product_category" >Kategori</Nav.Item>
						<Nav.Item onClick={() => nav('/shop')} eventKey="/shop" >Toko</Nav.Item>
						<Nav.Item onClick={() => nav('/sale')} eventKey="/sale" >Penjualan</Nav.Item>
						
					</Nav.Menu>
					<Nav.Menu placement="rightStart" eventKey="/setting" title="Pengaturan" icon={<GearCircleIcon className='rs-icon' />}>
						<Nav.Item onClick={() => nav('/schedule')} eventKey="/schedule" >Jadwal</Nav.Item>
						<Nav.Item onClick={() => nav('/job_title')} eventKey="/job_title">Posisi / Jabatan</Nav.Item>
						<Nav.Item onClick={() => nav('/organization')} eventKey="/organization">Organisasi</Nav.Item>
						<Nav.Item onClick={() => nav('/leave_category')} eventKey="/leave_category">Kategori Cuti</Nav.Item>
						<Nav.Item onClick={() => nav('/role')} eventKey="/role">Hak Akses</Nav.Item>
						<Nav.Item onClick={() => nav('/user')} eventKey="/user">Pengguna</Nav.Item>
						<Nav.Item onClick={() => nav('/setting/incentive')} eventKey="/setting/incentive">Insentif</Nav.Item>
						<Nav.Item onClick={() => nav('/system')} eventKey="/system">Sistem</Nav.Item>
						<Nav.Item onClick={() => nav('/company')} eventKey="/company">Perusahaan</Nav.Item>
					</Nav.Menu>

				</Nav>
			</Sidenav.Body>
		</Sidenav>
	</div>);
}
export default Sidebar;