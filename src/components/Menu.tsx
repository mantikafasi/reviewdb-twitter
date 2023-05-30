import './Menu.css';

export default function Menu(props: { options: { text: string, onClick: () => void, iconType: 'delete' | 'report'; }[]; }) {
    const [showMenu, setShowMenu] = React.useState<boolean>(false);

    return (
        <div className="dropdown">
            <div className='meatballMenu' onClick={() => setShowMenu(!showMenu)}>
                <svg
                    viewBox="0 0 25 25"
                    width="25"
                    height="25"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                >
                    <circle cx="2.5" cy="8" r=".75" />
                    <circle cx="8" cy="8" r=".75" />
                    <circle cx="13.5" cy="8" r=".75" />
                </svg>
            </div>
            {
                showMenu && (
                    <div className="dropdown-content">
                        {
                            props.options.map(option =>
                                <Option text={option.text}
                                    iconComponent={option.iconType === 'delete' ? <DangerButton /> : <ReportButton />}
                                    onClick={() => {
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

export function Option(props: { text: string; iconComponent: React.ReactNode; onClick?: () => void; }) {
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
