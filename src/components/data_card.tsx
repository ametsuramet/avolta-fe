import type { FC } from 'react';
import { RiIncreaseDecreaseLine } from 'react-icons/ri';
import inc from '@/assets/increase.svg'
import dec from '@/assets/decrease.svg'

interface DataCardProps {
    title: string,
    label: string,
    progress: number,
    value: number,

}

const DataCard: FC<DataCardProps> = ({
    title,
    label,
    progress,
    value
}) => {
    return (
        <div className=' bg-white rounded-lg hover:shadow-lg p-4 flex-col flex'>
            <div className='flex justify-between mb-4 flex-1'>
                <h3 className='font-bold text-black'>{title}</h3>
                <div className={`py-1 px-4 h-6 text-xs flex items-center rounded-full ${progress > 0 ? ' text-green-700 bg-green-200' : ' text-red-700 bg-red-200'}`} >
                    <div className='w-4'>
                        <img className='mr-1' src={progress > 0 ? inc : dec} alt="" />
                    </div>
                    <span>
                        {progress}%
                    </span>
                </div>
            </div>
            <div>
                <h2 className='text-4xl text-black font-bold mb-2'>{value}</h2>
                <p className='text-sm'>{label}</p>
            </div>

        </div>
    );
}
export default DataCard;