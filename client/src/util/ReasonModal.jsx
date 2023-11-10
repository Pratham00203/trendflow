/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import axios from "axios";
import { useRef } from "react"
import { toast } from "react-hot-toast";


export default function ReasonModal({ setShowModal, postid }) {
    const reason = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (reason.current.value.trim() !== "") {
            reportPost();
        } else {
            toast.error("Reason cannot be empty")
        }
    }

    const reportPost = async () => {
        try {
            const res = await axios({
                method: "post",
                url: `http://localhost:5000/api/post/report/${postid}`,
                data: {
                    reason: reason.current.value
                },
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            })

            toast.success(res.data.msg);
            setShowModal(false);

        } catch (error) {
            toast.error(error.response.data.error);
        }
    }

    return <div className="report-modal d-flex justify-center">
        <div className="report-menu">
            <h2>Reason for reporting:  </h2>
            <form className="d-flex flex-col" onSubmit={handleSubmit}>
                <textarea name="reason" placeholder="Type here.." ref={reason} cols="50" rows="10"></textarea>
                <div className="report-btns d-flex">
                    <input type="submit" className="green-btn" value="Report" />
                    <button type="button" onClick={() => setShowModal(false)} style={{ color: "red" }}>Close</button>
                </div>
            </form>
        </div>
    </div>
}