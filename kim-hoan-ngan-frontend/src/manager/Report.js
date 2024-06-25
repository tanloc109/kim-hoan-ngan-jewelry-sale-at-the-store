import React from "react"
import axios from "axios";
import './Report.css'
import config from "../config/config";

export default function Report() {

    const token = localStorage.getItem('token');

    const handReportRequest = async () => {
        try {
            const response = await axios.get(`${config.API_ROOT}/RevenueReport/send-report`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                console.log("Sent report");
            }
        } catch (error) {
            console.error('There was an error when sending report to owner', error);
        }
    };



    return (
        <div className="report-container">
            <button className="btn btn-success send-report-btn" onClick={handReportRequest} >Send Report to Owner</button>
        </div>

    )
}