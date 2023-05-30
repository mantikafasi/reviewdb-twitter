import 'react-toastify/dist/ReactToastify.css';

export default function Toast() {
    const { ToastContainer } = require("react-toastify");

    return (
        <div>
            <ToastContainer position='bottom-right' theme='dark' />
        </div>
    )
}
