import React, { FC, ReactNode, useMemo } from 'react';
import './Loader.css';

export const Loader: FC<{
    text?: ReactNode;
}> = ({
    text
}) => {

    const info = useMemo(() => {
        return text || 'Loading...';
    }, [text]);

    return (
        <div className={'DiagramLoader'}>
            {info}
        </div>
    )
};