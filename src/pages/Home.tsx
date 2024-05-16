import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import DataCard from '@/components/data_card';
import LineBarChart from '@/components/line_bar_chart';
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import type { FC } from 'react';
import { Avatar, Button } from 'rsuite';
import female from '@/assets/female.svg'
import male from '@/assets/male.svg'
import { money } from '@/utils/helper';


interface HomeProps { }

const Home: FC<HomeProps> = ({ }) => {
    const options: ApexOptions = {
        chart: {
            stacked: true,
            id: "basic-bar",
            dropShadow: {
                enabled: false,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.35
            },
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
            categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
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
        <DashboardLayout>
            <div className='grid grid-cols-4 gap-4 mb-4'>
                <DataCard title='Total Karyawan' progress={100} value={856} label={'Karyawan'} />
                <DataCard title='Total Karyawan Bekerja' progress={89.5} value={726} label={'Karyawan'} />
                <DataCard title='Total Karyawan Cuti' progress={12} value={82} label={'Karyawan'} />
                <DataCard title='Total Karyawan Libur' progress={-7} value={48} label={'Karyawan'} />
            </div>
            <LineBarChart
                selectedMenu="Tahun ini"
                title='Statistik'
                menu={[{ label: "Tahun ini", onClick: () => { } }, { label: "Bulan ini", onClick: () => { } },]}
                legend={[{ color: "#00B583", label: "Hadir" }, { color: "#F2EFFF", label: "Tidak Hadir" }]}
                categories={["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]} series={[
                    {
                        name: "Hadir",
                        data: [30, 40, 45, 50, 49, 60, 70, 91, 100, 200, 45, 18],
                        color: "#00B583"
                    },
                    {
                        name: "Tidak Hadir",
                        data: [60, 70, 100, 200, 45, 91, 18, 30, 40, 45, 50, 49,],
                        color: "#F2EFFF"
                    },
                ]} />
            <div className='grid grid-cols-3 gap-4 mb-4'>
                <div className='col-span-2'>
                    <div className=' bg-white rounded-xl p-4 hover:shadow-lg'>
                        <div className='flex justify-between mb-4'>
                            <h3 className='font-bold text-black text-lg'>{"Kehadiran"}</h3>
                            <Button className=' rounded-xl bg-blue-700' color="blue" appearance="primary">
                                Lihat Semua
                            </Button>
                        </div>
                        <CustomTable className='' headers={["No", "Nama Karyawan", "Jabatan", "Jam Masuk", "Jam Keluar"]} headerClasses={[]} datasets={[
                            {
                                cells: [{ data: "1" }, {
                                    data: <div className=' items-center flex' >
                                        <Avatar circle size='sm' bordered src='https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTHfRpKFKhm3AERxq8X7lEySL0TqfWeaNrV7rOrfLTYhJP8LbX59awytCf-7zwyipP8fTDmnjt7seoi3wU'
                                            alt='Donald Trump' />
                                        <span className='ml-4'>
                                            Donald Trump

                                        </span>
                                    </div>
                                }, { data: "Pengusaha" }, {
                                    data: <div>
                                        <p>01 Mei 2024</p>
                                        <small>07:00</small>
                                    </div>
                                }, {
                                    data: <div>
                                        <p>01 Mei 2024</p>
                                        <small>17:00</small>
                                    </div>
                                }], className: "hover:bg-gray-50 border-b last:border-b-0"
                            },
                            {
                                cells: [{ data: "2" }, {
                                    data: <div className=' items-center flex' >
                                        <Avatar circle size='sm' bordered src='https://www.wonderwall.com/wp-content/uploads/sites/2/2019/07/1059352-premiere-of-sony-pictures-once-upon-a-time-in-hollywood-.jpg'
                                            alt='Tom Cruise' />
                                        <span className='ml-4'>
                                            Tom Cruise

                                        </span>
                                    </div>
                                }, { data: "Artis" }, {
                                    data: <div>
                                        <p>01 Mei 2024</p>
                                        <small>07:25</small>
                                    </div>
                                }, {
                                    data: <div>
                                        <p>01 Mei 2024</p>
                                        <small>17:15</small>
                                    </div>
                                }], className: "hover:bg-gray-50 border-b last:border-b-0"
                            },
                            {
                                cells: [{ data: "3" }, {
                                    data: <div className=' items-center flex' >
                                        <Avatar circle size='sm' bordered src='https://hips.hearstapps.com/hmg-prod/images/actor-johnny-depp-attends-the-jeanne-du-barry-photocall-at-news-photo-1685634329.jpg?crop=1.00xw:0.669xh;0,0.0477xh&resize=640:*'
                                            alt='Johnny Depp' />
                                        <span className='ml-4'>
                                            Johnny Depp

                                        </span>
                                    </div>
                                }, { data: "Artis" }, {
                                    data: <div>
                                        <p>01 Mei 2024</p>
                                        <small>07:30</small>
                                    </div>
                                }, {
                                    data: <div>
                                        <p>01 Mei 2024</p>
                                        <small>18:15</small>
                                    </div>
                                }], className: "hover:bg-gray-50 border-b last:border-b-0"
                            }
                        ]} />
                    </div>
                </div>
                <div className='col-span-1 bg-white rounded-xl p-4 hover:shadow-lg h-auto flex flex-col items-center '>
                    <div className='flex w-full'>
                        <h3 className='font-bold text-black text-lg'>{"Komposisi Pegawai"}</h3>

                    </div>
                    <ReactApexChart
                        type='donut'
                        options={{
                            chart: {

                            },
                            dataLabels: {
                                enabled: false,

                            },
                            legend: {
                                show: false
                            },
                            plotOptions: {
                                pie: {

                                    donut: {
                                        size: '40%'
                                    }
                                }
                            },
                            tooltip: {
                                custom:({series, seriesIndex, dataPointIndex, w}) => {
                                    return `<div class='bg-white flex text-black p-2 items-center justify-center'><img class="mr-2" src="${seriesIndex == 0 ? female : male}" />${money((series[seriesIndex] / (series as number[]).reduce((a,b) => a + b , 0)) * 100)}%</div>`
                                }
                            },
                            labels: ['Perempuan', 'Laki-Laki'],
                            colors: ["#ED53F0", "#0D62F4"]
                        }}
                        series={[300, 556]}

                    />
                    <p className='text-center'>856 Total Karyawan</p>
                </div>
            </div>

        </DashboardLayout>
    );
}
export default Home;