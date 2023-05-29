import React, { ButtonHTMLAttributes, ComponentType, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { FullScreen, FullScreenExit } from './icons';
import './Menu.css';

export const Menu: FC<{
    menuComponent?: ReactNode;
    FullscreenButton?: ComponentType<ButtonHTMLAttributes<HTMLButtonElement>>;
    rootRef: HTMLElement | null
}> = ({
    menuComponent,
    FullscreenButton,
    rootRef
}) => {

    const isFullscren = useMemo(() => {
        return rootRef ? document.fullscreenElement === rootRef : false
    }, [rootRef, document.fullscreenElement]);

    const setFullscreen = useCallback(() => {
        if(!rootRef) return ;
        if(isFullscren) {
            const doc = document as typeof document & {
                mozCancelFullScreen: typeof document['exitFullscreen'];
                webkitExitFullscreen: typeof document['exitFullscreen'];
            };
            if(doc.exitFullscreen) {
                doc.exitFullscreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            }
        } else {
            const element = rootRef as typeof rootRef & {
                mozRequestFullScreen: typeof rootRef['requestFullscreen'];
                webkitRequestFullscreen: typeof rootRef['requestFullscreen'];
                msRequestFullscreen: typeof rootRef['requestFullscreen'];
            };
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();     // Firefox
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();  // Safari
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();      // IE/Edge
            }
        }
    }, [rootRef, isFullscren]);

    if(menuComponent) return <>{menuComponent}</>;

    return (
        <div
            className={'ReactMultipleDiagramMenu'}
        >
            {
                FullscreenButton
                ? <FullscreenButton
                    className={'MenuButton'}
                    onClick={setFullscreen}
                    />
                : <button
                    className={'MenuButton'}
                    onClick={setFullscreen}
                    >
                    {
                        isFullscren
                        ? <FullScreenExit />
                        : <FullScreen />
                    }
                </button>
            }
        </div>
    );
};