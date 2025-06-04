import React, { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import orderServices from 'src/services/orderServices';

function RegenerateView() {

    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [orderId, setOrderId] = useState("")
    const [isButtonDisable, setIsButtonDisable] = useState(false) 
    const [cursor, setCursor] = useState('pointer') 
    const [isRequestSend, setIsRequestSend] = useState(false)

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search) 


    useEffect(() => {
        if (queryParams.get("email")) setEmail(queryParams.get("email"))
        if (queryParams.get("productId")) setOrderId(queryParams.get("productId"))
        if (queryParams.get("firstname")) setName(queryParams.get("firstname"))
    })

    const handleDisable = () => {
        setIsButtonDisable(true)
        setCursor('not-allowed')

        orderServices.regenarateEmail(email, orderId)
        .then(data => {
            setIsRequestSend(true)
        })
        .catch(err => {
        })
        .finally(() => {
            setCursor('pointer')
            setIsButtonDisable(false)
        })
    }



    return <div style={{
        background: 'linear-gradient(#04002C 30%, #223363, #41699C)',
        height: '100vh',
        display: 'flex',
        flexDirection: "column",
        // width: 'device-width',
        fontFamily: 'sans-serif',
    }}>
    <div style={{
        backgroundColor:'#2C365E',
        height: '60px',
    }}>
        <img src='/images/logo.png' style={{
            height: 'inherit',
            width: 'inherit',
            paddingLeft: '20px',
            paddingBottom: '2px',
            paddingTop: '2px'
        }}></img>
    </div>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto auto',
            padding: '60px 140px',
            background: 'linear-gradient(#131948, #41699C)',
            fontSize: '18px',
            color: '#fff',
            textAlign: "center",
            gap: '20px',
            borderRadius: '3px',
            letterSpacing: '0.5px',
            boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'
        }}>
            <div>Hi {(name && name != 'null' && name != 'undefined') ? name : "User"}</div>
            <div>Please click on the button below to regenarate the new links.</div>
            <div>You will receive them in your email.</div>
            <button disabled={isButtonDisable} onClick={handleDisable} style={{
                cursor: cursor,
                backgroundColor: '#0B66BF',
                color: "#fff",
                fontSize: '18px',
                height: '50px',
                border: 'none',
                borderRadius: '5px',
                padding: '1px 10px',
                fontWeight: 'bold',
                letterSpacing: '1px',
                fontFamily: 'sans-serif',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px'

            }}>
                GENERATE EMAIL
            </button>
            <div>These new links will only be valid for the next two hours.</div>
            {isRequestSend && <div style={{
                color: "#fff",
                marginTop: '20px'
            }}>
                Thank You a new mail will be share in sometime
                </div>}
        </div>
    </div>
}

export default RegenerateView