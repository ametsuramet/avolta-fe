import type { FC } from 'react';

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
        return (
                <div className="w-full h-8 bg-white border-b border-b-gray-200 py-1 px-4 flex items-center justify-end text-xs">
                        (c) 2024 Ametory Foundation
                </div>
        );
}
export default Footer;