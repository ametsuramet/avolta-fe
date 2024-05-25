import { randomStr } from '@/utils/helper';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { FC } from 'react';
import { Pagination } from 'rsuite';

export type TableCells = { data: React.ReactNode, className?: string, colSpan?: number }[]
export interface TableRecord {
    cells: TableCells
    className?: string
    onClick?: () => void

}

interface CustomTableProps {
    headers: React.ReactNode[]
    headerClasses: string[]
    footer?: TableRecord[]
    datasets: TableRecord[],
    limitPaginations?: number[],
    onSearch?: (arg: string) => void
    searchPlaceholder?: string
    pagination?: boolean
    searchHeader?: React.ReactNode
    total?: number
    limit?: number
    activePage?: number
    setActivePage?: (a: number) => void
    changeLimit?: (a: number) => void
    switchHeader?: boolean,
    className?: string
}

const CustomTable: FC<CustomTableProps> = ({
    className,
    headers,
    headerClasses,
    datasets,
    onSearch,
    footer,
    searchPlaceholder,
    pagination,
    searchHeader,
    total,
    limit,
    activePage,
    limitPaginations,
    setActivePage,
    switchHeader,
    changeLimit
}) => {
    return (
        <div className={`flex flex-col  overflow-auto ${className}`}>
            {onSearch && <div className='flex items-center justify-between mb-4'>
                {!switchHeader && <div>
                    {searchHeader}
                </div>}

                <form className=" ">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <MagnifyingGlassIcon
                                className=" h-5 w-5 text-violet-200 hover:text-violet-100"
                                aria-hidden="true"
                            />
                        </div>
                        <input
                            
                            type="search"
                            id="default-search"
                            className=" p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-white focus:ring-blue-500 focus:border-blue-500   "
                            placeholder={searchPlaceholder ?? "Search..."}
                            onChange={(val) => {
                                if (onSearch) onSearch(val.target.value)
                            }}
                        />
                    </div>
                </form>
                {switchHeader && <div>
                    {searchHeader}
                </div>}

            </div>}

            <table className="w-full h-full text-sm text-left rtl:text-right text-gray-700">
                <thead className="text-base text-gray-700 font-semibold " style={{ backgroundColor: "#F2F4F5" }}>
                    <tr>
                        {headers.map(e => {
                            const index = headers.indexOf(e)
                            let className = ""
                            if (headerClasses[index] != undefined) {
                                className = headerClasses[index]
                            }
                            
                            return <th key={`${e == "" ? randomStr(3) : e}`} scope="col" className={`px-6 py-3 ${className}`}>
                                {e}
                            </th>;
                        })}

                    </tr>
                </thead>
                {datasets.length > 0 ?
                    <tbody className="">
                        {datasets.map(record => {
                            return <tr  onClick={record.onClick} key={`row-${datasets.indexOf(record)}`} className={`bg-white border-b  ${record.className} `}>
                                {record.cells.map(cell => {
                                    return (
                                        <td colSpan={cell.colSpan} key={`cell-${record.cells.indexOf(cell)}`} className={`px-6 py-4 ${cell.className ?? ''}`}>{cell.data}</td>
                                    );
                                })}

                            </tr>;
                        })}

                    </tbody>
                    : <tbody className="">
                        <tr>
                            <td className='text-center p-8' colSpan={headers.length + 1}>
                                No Data
                            </td>
                        </tr>
                    </tbody>}
                {footer && <tfoot className="">
                        {footer.map(record => {
                            return <tr key={`row-${footer.indexOf(record)}`} className={`bg-white border-b  ${record.className} `}>
                                {record.cells.map(cell => {
                                    return (
                                        <td key={`cell-${record.cells.indexOf(cell)}`} className={`px-6 py-4 ${cell.className ?? ''}`}>{cell.data}</td>
                                    );
                                })}

                            </tr>;
                        })}

                    </tfoot>}
            </table>
            {pagination &&
                <div className='flex justify-between mt-4'>
                    <div className='flex items-center'>
                        <select
                            className="bg-white text-center appearance-none border border-gray-200 rounded-xl w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                            id="product-name"
                            value={limit}
                            onChange={(e) => {
                                if (changeLimit) changeLimit(parseInt(e.target.value))
                            }}
                        >
                            {(limitPaginations ?? [10, 20, 50, 100]).map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                    </div>

                    <Pagination
                        prev
                        last
                        next
                        first
                        size="xs"
                        total={total ?? 100}
                        limit={limit ?? 10}
                        activePage={activePage}
                        onChangePage={setActivePage}
                    /></div>}

        </div>
    );
}
export default CustomTable;