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
    
}

const InlineForm: FC<InlineFormProps> = ({
    children,
    title,
    subtitle,
    className,
    style,
    bodyClassName,
    titleClassName,
}) => {
    return (<div className={`flex items-center mb-6 ${className}`} style={style}>
        <div className="w-1/3">
            <label
                className="block text-gray-900 mb-0 pr-4"
            >
                <div className={`flex flex-col relative ${titleClassName}`}>
                    {title}
                    {subtitle}
                </div>
            </label>
        </div>
        <div className={`w-2/3  ${bodyClassName}`}>
            {children}
        </div>
    </div>);
}
export default InlineForm;