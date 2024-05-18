import _extends from "@babel/runtime/helpers/esm/extends";
import idID from 'date-fns/locale/id'
var Calendar = {
    sunday: 'M',
    monday: 'S',
    tuesday: 'Sl',
    wednesday: 'R',
    thursday: 'K',
    friday: 'J',
    saturday: 'S',
    ok: 'OK',
    today: 'Hari ini',
    yesterday: 'Kemarin',
    hours: 'Jam',
    minutes: 'Menit',
    seconds: 'Detik',
    formattedMonthPattern: 'MMM, yyyy',
    formattedDayPattern: 'dd MMM yyyy',
    dateLocale: idID
};
export default {
    common: {
        loading: 'Loading...',
        emptyMessage: 'No data found',
        remove: 'Hapus',
        clear: 'Bersihkan'
    },
    Plaintext: {
        unfilled: 'Tidak terisi',
        notSelected: 'Tidak terpilih',
        notUploaded: 'Tidak terunggah'
    },
    Pagination: {
        more: 'Lagi',
        prev: 'Sebelumnya',
        next: 'Berikutnya',
        first: 'Pertama',
        last: 'Terakhir',
        limit: '{0} / halaman',
        total: 'Total Baris: {0}',
        skip: 'Loncat ke{0}'
    },
    Calendar: Calendar,
    DatePicker: _extends({}, Calendar),
    DateRangePicker: _extends({}, Calendar, {
        last7Days: 'Seminggu terakhir'
    }),
    Picker: {
        noResultsText: 'No results found',
        placeholder: 'Select',
        searchPlaceholder: 'Search',
        checkAll: 'All'
    },
    InputPicker: {
        newItem: 'New item',
        createOption: 'Create option "{0}"'
    },
    Uploader: {
        inited: 'Initial',
        progress: 'Uploading',
        error: 'Error',
        complete: 'Finished',
        emptyFile: 'Empty',
        upload: 'Upload',
        removeFile: 'Remove file'
    },
    CloseButton: {
        closeLabel: 'Close'
    },
    Breadcrumb: {
        expandText: 'Show path'
    },
    Toggle: {
        on: 'Open',
        off: 'Close'
    }
};
