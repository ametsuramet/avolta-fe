import CustomTable from '@/components/custom_table';
import DashboardLayout from '@/components/dashboard_layout';
import DataCard from '@/components/data_card';
import LineBarChart from '@/components/line_bar_chart';
import { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { useEffect, useState, type FC } from 'react';
import { Avatar, Button } from 'rsuite';
import female from '@/assets/female.svg'
import male from '@/assets/male.svg'
import { initials, money } from '@/utils/helper';
import { getProfile } from '@/repositories/auth';
import { getEmployees } from '@/repositories/employee';
import { getAttendances } from '@/repositories/attendance';
import { Attendance } from '@/model/attendance';
import Moment from 'react-moment';
import { useNavigate } from 'react-router-dom';


interface HomeProps { }

const Home: FC<HomeProps> = ({ }) => {
    const nav = useNavigate()
    const [attendances, setAttendances] = useState<Attendance[]>([]);

    useEffect(() => {
        getProfile()

        getAttendances({ page: 1, limit: 5 })
            .then(v => v.json())
            .then(v => {
                setAttendances(v.data)
            })
    }, []);
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
                            <Button className=' rounded-xl bg-blue-700' onClick={() => nav('/attendance')} appearance="primary">
                                Lihat Semua
                            </Button>
                        </div>
                        <CustomTable className='' headers={["No", "Nama Karyawan", "Jabatan", "Jam Masuk", "Jam Keluar"]} headerClasses={[]} datasets={attendances.map(e => ({
                            cells: [{ data: attendances.indexOf(e) + 1 }, {
                                data: <div className=' items-center flex' >
                                    <Avatar circle size='sm' bordered src={e.employee_picture}
                                        alt={initials(e.employee_name)} />
                                    <span className='ml-4'>
                                        {e.employee_name}
                                    </span>
                                </div>
                            }, { data: e.employee_job_title }, {
                                data: <div className='flex flex-col'>
                                    <Moment format='DD MMM YYYY'>{e.clock_in}</Moment>
                                    <small><Moment format='HH:mm'>{e.clock_in}</Moment></small>
                                </div>
                            }, {
                                data: <div className='flex flex-col'>
                                    <Moment format='DD MMM YYYY'>{e.clock_out}</Moment>
                                    <small><Moment format='HH:mm'>{e.clock_out}</Moment></small>
                                </div>
                            }], className: "hover:bg-gray-50 border-b last:border-b-0"
                        }))} />
                    </div>
                </div>
                <div className='col-span-1 bg-white rounded-xl p-4 hover:shadow-lg  flex flex-col items-center '>
                    <div className='flex w-full'>
                        <h3 className='font-bold text-black text-lg'>{"Komposisi Pegawai"}</h3>

                    </div>
                    <div className='flex-1 w-full'>
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
                                    custom: ({ series, seriesIndex, dataPointIndex, w }) => {
                                        return `<div class='bg-white flex text-black p-2 items-center justify-center'><img class="mr-2" src="${seriesIndex == 0 ? female : male}" />${money((series[seriesIndex] / (series as number[]).reduce((a, b) => a + b, 0)) * 100)}%</div>`
                                    }
                                },
                                labels: ['Perempuan', 'Laki-Laki'],
                                colors: ["#ED53F0", "#0D62F4"]
                            }}
                            series={[300, 556]}

                        />
                    </div>
                    <p className='text-center'>856 Total Karyawan</p>
                </div>
            </div>

        </DashboardLayout>
    );
}
export default Home;