import './styles.scss';
import 'awesomplete';
import 'flatpickr';
import 'flatpickr/dist/l10n/vn.js';
import oboe from 'oboe';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
let fullcustomer, fullproduct, awecustomer, aweproduct;
let end = new Date();
let start = new Date();
start.setFullYear(start.getFullYear() - 1);

const branch = 11252;
const server_url = ((location.protocol === 'https:') ? "http://localhost" : "");
const update_time = json => (json === "") ? "Server tắt" : dtFormat.format(new Date(json));
// const branch = 87459;
const dFormat = new Intl.DateTimeFormat("vi-VN", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
});
const dtFormat = new Intl.DateTimeFormat("vi-VN", {
    minute: "2-digit",
    hour: "2-digit",
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
});
const nFormat = new Intl.NumberFormat("vi-VN");

let waitForEl = (selector, callback) => {
    if (selector) {
        callback();
    } else {
        setTimeout(() => {
            waitForEl(selector, callback);
        }, 100);
    }
};

let keyDown = e => {
    if (e.keyCode === 46) {
        e.target.value = "";
    }
}

let haveFocus = w => {
    if (w) {
        let pInput = document.querySelector("#product").value
        if (pInput) {
            fetch(`${server_url}/api/filter?branchid=${branch}&product=${encodeURIComponent(pInput)}`)
                .then(res => res.json())
                .then(json => awecustomer.list = json);
        } else {
            awecustomer.list = fullcustomer;
        }
    } else {
        let pInput = document.querySelector("#customer").value
        if (pInput) {
            fetch(`${server_url}/api/filter?branchid=${branch}&customer=${encodeURIComponent(pInput)}`)
                .then(res => res.json())
                .then(json => aweproduct.list = json);
        } else {
            aweproduct.list = fullproduct;
        }
    }
}

let addDataToTbody = () => {
    let pcustomer = document.querySelector("#customer").value;
    let pproduct = document.querySelector("#product").value;
    let sum = 0;
    let nl = document.querySelector("tbody");
    nl.innerHTML = "";
    oboe(
        `${server_url}/api?branchid=${branch}&customer=${encodeURIComponent(pcustomer)}&product=${encodeURIComponent(pproduct)}&start=${start.toISOString()}&end=${end.toISOString()}`
    )
        .node("code", item => `<a target='_blank' href='https://tranduymoto.kiotviet.vn/#/Invoices?Code=${item}'>${item}</a>`)
        .node("createdDate", item => dFormat.format(new Date(item)))
        .node("price", item => nFormat.format(item))
        .node("quantity", item => { sum += item })
        .node("!.*", d => {
            if (d) {
                let tr = nl.insertRow();
                Object.keys(d).forEach((k, j) => { // Keys from object represent th.innerHTML
                    let cell = tr.insertCell(j);
                    cell.innerHTML = d[k];
                });
                nl.appendChild(tr);
            }
        })
        .done(() => {
            document.getElementById("tooltiptext").setAttribute("data-tooltip", nFormat.format(sum))
        });

}

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${server_url}/api/customers?branchid=${branch}`)
        .then(res => res.json())
        .then(json => fullcustomer = json)
    fetch(`${server_url}/api/products?branchid=${branch}`)
        .then(res => res.json())
        .then(json => fullproduct = json);
    let timebtn = document.querySelector("#time");
    let search = document.querySelector("#find");
    waitForEl(timebtn, () => {
        if (typeof (EventSource) !== "undefined") {
            let status = new EventSource(`${server_url}/api/time`);
            status.onmessage = ev => {
                timebtn.textContent = update_time(ev.data)
            };
            status.onerror = () => timebtn.textContent = update_time("")
        } else {
            console.log("Sorry, your browser does not support server-sent events...");
        }
        timebtn.addEventListener("click", async () =>
            fetch(`${server_url}/api/update`)
                .then(res => res.json())
                .then(json => {
                    timebtn.textContent = update_time(json)
                    search.click()
                })
        );
        flatpickr("#date", {
            mode: "range",
            locale: "vn",
            dateFormat: "d-m-Y",
            defaultDate: [start, end],
            onChange: function (selectedDates) {
                if (selectedDates.length === 2) {
                    start = selectedDates[0]
                    end = selectedDates[1]
                }
            },
        });

        waitForEl(search, () => search.addEventListener("click", () => addDataToTbody())
        );

        let reset = document.querySelector("#reset")
        waitForEl(reset, () => reset.addEventListener("click", async () => {
            FreezeUI({ text: 'Khởi tạo dữ liệu' });
            await fetch(`${server_url}/reset`);
            window.location.replace("/")
        }));

        let ecustomer = document.querySelector("#customer");
        waitForEl(ecustomer, () => {
            awecustomer = new Awesomplete(ecustomer, { autoFirst: true, maxItems: 20 });
            ecustomer.addEventListener("focusin", () => haveFocus(true));
            ecustomer.addEventListener("keydown", e => keyDown(e));
        });

        let eproduct = document.querySelector("#product");
        waitForEl(eproduct, () => {
            aweproduct = new Awesomplete(eproduct, { maxItems: 20 });
            eproduct.addEventListener("focusin", () => haveFocus(false));
            eproduct.addEventListener("keydown", e => keyDown(e));
        });
    })
})