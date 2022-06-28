const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

///-----Port-----///
const port = app.listen(process.env.PORT || 4001);
const _urlencoded = express.urlencoded({ extended: false });
app.use(cors());
app.use(express.json());

//----AllOW ACCESS -----//
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

///-----Stk push -----///
app.get("/stk", access, (req, res) => {
    let endpoint =
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        auth = "Bearer " + req.access_token;
    let _shortCode = "174379";
    let _passKey =
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

    let amount = req.amount;
    const _phone = req.PhoneNumber;

    const timeStamp = new Date()
        .toISOString()
        .replace(/[^0-9]/g, "")
        .slice(0, -3);
    const password = Buffer.from(`${_shortCode}${_passKey}${timeStamp}`).toString(
        "base64"
    );

    request({
            url: endpoint,
            method: "POST",
            headers: {
                Authorization: auth,
            },

            json: {
                BusinessShortCode: "174379",
                Password: password,
                Timestamp: timeStamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: "1",
                PartyA: "254746291229",
                PartyB: "174379",
                PhoneNumber: "254746291229",
                CallBackURL: "https://mkobampesa.herokuapp.com/Callbacks",
                AccountReference: " Elmasha TEST",
                TransactionDesc: "Lipa na Mpesa",
            },
        },
        function(error, response, body) {
            if (error) {
                console.log(error);
            } else if (response == 404) {
                console.log("Error Something went wrong..");
            }
            res.status(200).json(body);
            console.log(body, amount);
        }
    );
});

app.post("/Callbacks", _urlencoded, (req, res) => {
    console.log("======Stk Callback======");
    res.json(req.body.Body.stkCallback.CallbackMetadata);
    console.log(req.body.Body.stkCallback.CallbackMetadata);
});

///-----B2c -----///
app.get("/b2c", access, (req, res) => {
    let endpoint = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
    let auth = "Bearer " + req.access_token;

    request({
            url: endpoint,
            method: "POST",
            headers: {
                Authorization: auth,
            },
            json: {
                InitiatorName: "testapi",
                SecurityCredential: "hyZgDULgpuI71DSkcvseeb/+sdutsesCWJ9e9oKM/ZowD87gyDEigdb7bUfvFmdMs3Bav5ZvHnj+FZICC/+phrFpmXCURIURnFYtbJ14qkozT9mz1vWWbc8FXIUX1/R6WHVGbhqk3ur1lNlMGNW8hbN029FkRBNCYHcsCnyan/IKMgPI8qnPP4B/smqRYpcPws7PgTu6Pth66EHsVYbFIi3LeFYO+gNkCTEC86DEJyx7qX1Ukn/LVsM+P5Y7b7qGhmOQQc4KIC8RDKR0Wo6uol3VSjvdV+uiOdrNpSsVkOn+/ymJiZN8PZREy9rmQGtI5b8CFTd24lONSqsSp2dYGw==",
                CommandID: "BusinessPayment",
                Amount: "1",
                PartyA: "600983",
                PartyB: "254746291229",
                Remarks: "Salary Payment",
                QueueTimeOutURL: "http://002f-196-207-163-149.ngrok.io/timeout_url",
                ResultURL: "http://002f-196-207-163-149.ngrok.io/result_url",
                Occasion: "MpesaApi001 ",
            },
        },
        function(error, response, body) {
            if (error) {
                console.log(error);
            }

            res.status(200).json(body);
            console.log(body);
        }
    );
});

app.post("/timeout_url", (req, resp) => {
    console.log(".......... Timeout ..................");
    console.log(req.body);
});

app.post("/result_url", (req, resp) => {
    console.log(".......... Results..................");
    console.log(req.body);
});

/////-----Home ------/////
app.get("/", (req, res, next) => {
    res.status(200).send("Hello welcome to MKOBA Mpesa API");
});

///----Access Token ---
app.get("/access_token", access, (req, res) => {
    res.status(200).json({ access_token: req.access_token });
});

function access(res, req, next) {
    const endpoint =
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
    const auth = new Buffer.from(
        "xkdpSn2TyIDnGPebs0TQyvh9k6jcanru:Axnz8OHI9SYOscKD"
    ).toString("base64");

    request({
            url: endpoint,
            headers: {
                Authorization: "Basic " + auth,
            },
        },
        (error, response, body) => {
            if (error) {
                console.log(error);
            } else {
                res.access_token = JSON.parse(body).access_token;
                next();
            }
        }
    );
}

//-- listen
app.listen(port, (error) => {
    if (error) {} else {
        console.log(`Server running on port http://localhost:${port}`);
    }
});