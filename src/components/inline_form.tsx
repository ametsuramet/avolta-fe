import { toolTip } from '@/utils/helperUi';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import type { FC, ReactNode } from 'react';
import * as styledComponents from 'styled-components';

interface InlineFormProps {
    children: React.ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    className?: string
    style?: styledComponents.CSSObject
    titleClassName?: string
    bodyClassName?: string
    hints?: string

}

const InlineForm: FC<InlineFormProps> = ({
    children,
    title,
    subtitle,
    className,
    style,
    bodyClassName,
    titleClassName,
    hints,
}) => {
    return (<div className={`flex items-center mb-6 ${className}`} style={style}>
        <div className="w-1/3">
            <label
                className="block text-gray-900 mb-0 pr-4"
            >
                <div className={`flex  relative ${titleClassName} justify-between`}>
                    <div className='flex-col'>
                        {title}
                        {subtitle}
                    </div>
                    {hints && toolTip(hints, <InformationCircleIcon className='w-4' />)}
                </div>
            </label>
        </div>
        <div className={`w-2/3  ${bodyClassName}`}>
            {children}
        </div>
    </div>);
}
export default InlineForm;