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
import { LuBarChartBig, LuBuilding2, LuCalendarClock, LuCalendarDays, LuContact, LuHome, LuLineChart, LuUserCircle, LuUserCircle2, LuWallet2 } from 'react-icons/lu';
import { BiEnvelopeOpen } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import { Profile } from '@/model/auth';
import { getStorageProfile } from '@/utils/helper';


interface SidebarProps { }

const Sidebar: FC<SidebarProps> = ({ }) => {
	const [activeKey, setActiveKey] = useState('1');
	const { isExpanded, setExpanded } = useContext(ExpandMenuContext)
	const [profile, setProfile] = useState<Profile | null>(null);
	let location = useLocation();
	const nav = useNavigate()

	useEffect(() => {
		getStorageProfile()
			.then(v => setProfile(v))
	}, []);

	return (<div style={{ width: isExpanded ? 240 : 56 }} className='bg-white' >
		<Sidenav expanded={isExpanded} defaultOpenKeys={[]} className='bg-white'>
			<Sidenav.Header>
				<div className='flex justify-center h-16 flex-col items-center' >
					{isExpanded ?
						<img src="/images/logo-avolta.png" alt="" className=' px-2 w-48 text-center' />
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
					<Nav.Item onClick={() => nav('/employee')}  eventKey="/employee" icon={<LuContact className='rs-icon' />}>
						Karyawan
					</Nav.Item>
					<Nav.Item onClick={() => nav('/attendance')} eventKey="/attendance" icon={<LuCalendarClock className='rs-icon' />}>
						Absensi
					</Nav.Item>
					<Nav.Item eventKey="/leave" icon={<LuCalendarDays className='rs-icon' />}>
						Cuti
					</Nav.Item>
					<Nav.Item eventKey="/payroll" icon={<LuWallet2 className='rs-icon' />}>
						Payroll
					</Nav.Item>
					<Nav.Item eventKey="/company" icon={<LuBuilding2 className='rs-icon' />}>
						Perusahaan
					</Nav.Item>
					<Nav.Item eventKey="/report" icon={<LuBarChartBig className='rs-icon' />}>
						Laporan
					</Nav.Item>
					{/* <Nav.Menu placement="rightStart" eventKey="3" title="Advanced" icon={<MagicIcon />}>
						<Nav.Item eventKey="3-1">Geo</Nav.Item>
						<Nav.Item eventKey="3-2">Devices</Nav.Item>
						<Nav.Item eventKey="3-3">Loyalty</Nav.Item>
						<Nav.Item eventKey="3-4">Visit Depth</Nav.Item>
					</Nav.Menu>
					 */}
				</Nav>
			</Sidenav.Body>
		</Sidenav>
	</div>);
}
export default Sidebar;