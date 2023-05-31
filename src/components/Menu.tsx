import { MouseEventHandler } from "react";
import { React } from "../webpack/common";
import './Menu.css';

export default function Menu(props: { options: { text: string, onClick: () => void, iconType: 'delete' | 'report'; }[]; }) {
    const [showMenu, setShowMenu] = React.useState<boolean>(false);

    React.useEffect(() => {
        if (showMenu) {
            const closeMenu = () => setShowMenu(false);

            document.addEventListener('click', closeMenu);
            return () => document.removeEventListener('click', closeMenu);
        }
    }, [showMenu]);

    return (
        <div className="dropdown">
            <div className='meatballMenu' onClick={() => setShowMenu(!showMenu)}>
                <svg
                    viewBox="0 0 24 24"
                    height="1.25em"
                    fill="currentColor"
                    aria-label="Review Options"
                >
                    <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                </svg>
            </div>
            {
                showMenu && (
                    <div className="dropdown-content">
                        {
                            props.options.map(option =>
                                <Option text={option.text}
                                    iconComponent={option.iconType === 'delete' ? <DangerButton /> : <ReportButton />}
                                    onClick={e => {
                                        e.stopPropagation();
                                        option.onClick();
                                        setShowMenu(false);
                                    }}
                                />)
                        }
                    </div>
                )
            }
        </div>
    );
}

export function Option(props: { text: string; iconComponent: React.ReactNode; onClick?: MouseEventHandler<HTMLDivElement>; }) {
    return (
        <div className="option" onClick={props.onClick}>
            {props.iconComponent}
            <span>
                {props.text}
            </span>
        </div>
    );
}


export function DangerButton() {
    return (
        <svg width="20" height="20" viewBox="0 0 25 25" color='var(--toastify-color-error)'>
            <path fill="currentColor" d="M15 3.999V2H9V3.999H3V5.999H21V3.999H15Z" />
            <path fill="currentColor" d="M5 6.99902V18.999C5 20.101 5.897 20.999 7 20.999H17C18.103 20.999 19 20.101 19 18.999V6.99902H5ZM11 17H9V11H11V17ZM15 17H13V11H15V17Z" />
        </svg>
    );
}

export function ReportButton() {
    return (
        <svg width="20" height="20" viewBox="0 0 25 25">
            <path fill="currentColor" d="M20,6.002H14V3.002C14,2.45 13.553,2.002 13,2.002H4C3.447,2.002 3,2.45 3,3.002V22.002H5V14.002H10.586L8.293,16.295C8.007,16.581 7.922,17.011 8.076,17.385C8.23,17.759 8.596,18.002 9,18.002H20C20.553,18.002 21,17.554 21,17.002V7.002C21,6.45 20.553,6.002 20,6.002Z" />
        </svg>
    );
}
