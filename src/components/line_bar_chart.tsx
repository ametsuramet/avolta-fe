import type { FC } from 'react';
import { Dropdown } from 'rsuite';
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface LineBarChartProps {
    title: string,
    selectedMenu?: string,
    categories: string[],
    series?: ApexAxisChartSeries,
    legend: { color: string, label: string }[]
    menu: {label:string, onClick: () => void}[]
}

const LineBarChart: FC<LineBarChartProps> = ({
    title,
    categories,
    series,
    legend,
    menu,
    selectedMenu
}) => {
    const options: ApexOptions = {
        chart: {
            stacked: true,
            id: "basic-bar",
            toolbar: {
                tools: {
                    download: false,
                }
            }
        },
        grid: {
            yaxis: {
                lines: {
                    show: true,

                },

            },
            strokeDashArray: 7
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                borderRadiusWhenStacked: 'all',
                borderRadiusApplication: 'around'
            },

        },
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        xaxis: {
            categories: categories,
            labels: {
                style: {
                    colors: "#BCBCBC"
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    colors: "#BCBCBC"
                }
            }
        }
    };

    return (
        <div className=' bg-white rounded-xl p-4 hover:shadow-lg mb-4'>
            <div className='flex justify-between'>
                <h3 className='font-bold text-black text-lg'>{title}</h3>
                <div className='flex'>
                    {legend.map(e => <div key={e.label} className='text-sm flex items-center mr-4'>
                        <div  className='w-3 h-3 mr-2' style={{ backgroundColor: e.color }}></div> <span className='font-bold text-gray-900'> {e.label}</span>
                    </div>)}
                    <Dropdown className='ml-24' placement='bottomEnd' title={<span className=' text-blue-700'>{selectedMenu}</span>} trigger={"click"}>
                        {menu.map(e => <Dropdown.Item key={e.label} onClick={e.onClick}>{e.label}</Dropdown.Item>)}
                        
                    </Dropdown>
                </div>

            </div>
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={350}
            />
        </div>
    );
}
export default LineBarChart;
