import { getNumberOfPatients } from "./essentials";

document.addEventListener("DOMContentLoaded", async () => {
    const contentContainer = document.querySelector(".content-container");

    const tableContainer = document.createElement("table");
    tableContainer.className = "table";
    tableContainer.style = "width: 80%; height: wrap-content; border: solid black 1px";

    const tableHeader = document.createElement("thead");
    tableHeader.className = "table-dark";

    let tableHeaderHTML = `
        <tr>
            <th scope="col">Doctor</th>
            <th scope="col">Doctor ID</th>
            <th scope="col">Specialization</th>
            <th scope="col">Patients</th>
        </tr>
    `;

    tableHeader.innerHTML = tableHeaderHTML;

    const tableBody = document.createElement("tbody");

    const result = await getNumberOfPatients();
    const requests = result.requests;
    console.log(requests);

    let tableBodyHTML = ``;

    for(let i = 0; i < requests.length; i++) {
        tableBodyHTML += `<tr>`;
        tableBodyHTML += `<th data-request-id scope="row">${requests[i].request_id}</th>`;
        tableBodyHTML += `<td data-account-id> ${requests[i].account_id}</td>`;
        tableBodyHTML += `<td data-specialization> ${requests[i].specialization}</td>`;
        tableBodyHTML += `
            <td>
                <button data-accept class="btn btn-success">Accept</button>
                <button data-reject class="btn btn-danger">Reject</button>
            </td>
        `;

        tableBodyHTML += `</tr>`;

    }

    tableBody.innerHTML = tableBodyHTML;
    tableContainer.appendChild(tableHeader);
    tableContainer.appendChild(tableBody);

});