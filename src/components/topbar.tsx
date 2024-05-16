import { ExpandMenuContext } from '@/objects/expand_menu';
import { clearStorage } from '@/utils/helper';
import { useContext, type FC } from 'react';
import { BiBell, BiPowerOff } from 'react-icons/bi';
import { HiBars3, HiOutlineBars3BottomLeft } from 'react-icons/hi2';
import { Badge } from 'rsuite';

interface TopbarProps { }

const Topbar: FC<TopbarProps> = ({ }) => {
	const { isExpanded, setExpanded } = useContext(ExpandMenuContext)

	return (
		<div className="w-full h-16 bg-white border-b border-b-gray-200 py-1 px-4 flex items-center justify-between">
			<HiOutlineBars3BottomLeft className=' cursor-pointer' onClick={() => setExpanded(!isExpanded)} />
			<div className='flex'>
				<div className='flex  cursor-pointer'>
					<Badge>
						<BiBell  />
					</Badge>
				</div>
				<div className='flex ml-4 cursor-pointer'>
					<BiPowerOff onClick={ async () => {
						await clearStorage()
						location.href = "/login"
					}}  />
				</div>
			</div>
		</div>
	);
}
export default Topbar;