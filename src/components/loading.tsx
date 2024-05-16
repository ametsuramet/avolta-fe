import { ExpandMenuContext } from '@/objects/expand_menu';
import { useContext } from 'react';
export default function Loading() {
    const { isExpanded, setExpanded } = useContext(ExpandMenuContext)


    return (
        <div className="loading" >
            <div className=" h-12 w-12" >
                <img className="w-24" src="/images/spinner.gif" alt="" />
            </div>
        </div>

    )
}