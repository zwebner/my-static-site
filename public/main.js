document.addEventListener("DOMContentLoaded", () => {
    // Handle user signup form submission
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(signupForm);
            const newSubmission = {};
            formData.forEach((value, key) => {
                newSubmission[key] = value;
            });

            fetch('/submissions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSubmission)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                alert("Submission successful.");
                signupForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Handle admin login form submission
    const adminLoginForm = document.getElementById("admin-login-form");
    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const formData = new FormData(adminLoginForm);
            const username = formData.get("admin_username");
            const password = formData.get("admin_password");

            // Hard-coded admin credentials
            const hardcodedUsername = "admin";
            const hardcodedPassword = "password123";

            if (username === hardcodedUsername && password === hardcodedPassword) {
                localStorage.setItem("admin_logged_in", "true");
                window.location.href = "admin_panel.html";
            } else {
                alert("Invalid login.");
            }
        });
    }

    // Display submissions in admin panel
    const adminPanel = document.getElementById("submissions-table");
    if (adminPanel) {
        const adminLoggedIn = localStorage.getItem("admin_logged_in");
        if (adminLoggedIn !== "true") {
            window.location.href = "admin_login.html";
            return;
        }

        const searchBar = document.getElementById("search-bar");
        searchBar.addEventListener("input", filterSubmissions);

        fetch('/submissions')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(submissions => {
                const tbody = adminPanel.querySelector("tbody");
                tbody.innerHTML = ''; // Clear existing rows
                submissions.forEach(submission => {
                    const tr = document.createElement("tr");
                    tr.appendChild(createTableCell(submission.firstname));
                    tr.appendChild(createTableCell(submission.lastname));
                    tr.appendChild(createTableCell(submission.age));
                    tr.appendChild(createTableCell(submission.yeshiva));
                    tr.appendChild(createTableCell(submission.method));
                    tr.appendChild(createTableCell(submission.address));
                    tr.appendChild(createTableCell(submission.city));
                    tr.appendChild(createTableCell(submission.province));
                    tr.appendChild(createTableCell(submission.postalcode));
                    tr.appendChild(createTableCell(submission.country));
                    tr.appendChild(createTableCell(submission.email));
                    tr.appendChild(createTableCell(submission.phonenumber));
                    tr.appendChild(createTableCell(submission.mesechta));
                    tbody.appendChild(tr);
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function createTableCell(text) {
        const td = document.createElement("td");
        td.textContent = text;
        return td;
    }

    function filterSubmissions(event) {
        const searchValue = event.target.value.toLowerCase();
        const tbody = adminPanel.querySelector("tbody");
        const rows = Array.from(tbody.getElementsByTagName("tr"));

        rows.forEach(row => {
            const firstName = row.cells[0].textContent.toLowerCase();
            const lastName = row.cells[1].textContent.toLowerCase();
            if (firstName.includes(searchValue) || lastName.includes(searchValue)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }
});
