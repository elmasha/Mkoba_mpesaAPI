const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

///-----Port-----///
const port = app.listen(process.env.PORT || 4000);
const _urlencoded = express.urlencoded({ extended: false });
app.use(cors());
app.use(express.json());

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