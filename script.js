import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import { getDatabase, ref, push, set, get, child, remove } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

// Firebase configuration
const appSettings = {
    databaseURL: 'https://hospital-management-syst-d7f69-default-rtdb.asia-southeast1.firebasedatabase.app/'
};

// Initialize Firebase app
const app = initializeApp(appSettings);
const database = getDatabase(app);

// Firebase References
const patientDetailsInDB = ref(database, 'patientDetails');
const doctorDetailsInDB = ref(database, 'doctorDetails');
const appointmentDetailsInDB = ref(database, 'appointmentDetails');
const billingDetailsInDB = ref(database, 'billingDetails');

function registerPatient() {
    const patientId = document.getElementById('patient-id').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value;

    if (patientId && firstName && lastName && dob && phone) {
        // Reference to the patient in Firebase
        const patientRef = ref(database, `patients/${patientId}`);

        // Check if patient already exists in Firebase
        get(child(patientDetailsInDB, patientId)).then((snapshot) => {
            if (snapshot.exists()) {
                document.getElementById('successMessage').innerText = 'Patient ID already exists!';
            } else {
                // Create new patient object
                const newPatient = {
                    id: patientId,
                    firstName: firstName,
                    lastName: lastName,
                    dob: dob,
                    gender: gender,
                    phone: phone
                };

                // Push new patient data to Firebase
                push(patientDetailsInDB, newPatient)
                    .then(() => {
                        window.alert("Patient REgistered Successfully");
                        document.getElementById('patientForm').reset();
                    })
                    .catch((error) => {
                        console.error('Error registering patient: ', error);
                        window.alert('Error registering patient. Please try again.');
                    });
            }
        }).catch((error) => {
            console.error('Error fetching data: ', error);
            window.alert('Error checking patient ID. Please try again.');
        });
    } else {
        window.alert('Please fill in all the fields!');
    }
}
// Make function accessible globally
window.registerPatient = registerPatient;

function registerDoctor() {
    const doctorId = document.getElementById('docId').value;
    const firstName = document.getElementById('docFirstName').value;
    const lastName = document.getElementById('docLastName').value;
    const gender = document.getElementById('gender').value;
    const specialty = document.getElementById('specialty').value;
    const experience = document.getElementById('experience').value;
    const age = document.getElementById('age').value;
    const dob = document.getElementById('dob').value;

    if (doctorId && firstName && lastName && specialty && experience && age && dob) {
        const doctorRef = ref(database, `doctors/${doctorId}`);

        // Check if doctor already exists in Firebase
        get(child(doctorDetailsInDB, doctorId)).then((snapshot) => {
            if (snapshot.exists()) {
                alert('Doctor ID already exists!');
            } else {
                // Create new doctor object
                const newDoctor = {
                    id: doctorId,
                    firstName: firstName,
                    lastName: lastName,
                    gender: gender,
                    specialty: specialty,
                    experience: experience,
                    age: age,
                    dob: dob
                };

                // Add doctor to Firebase
                set(doctorRef, newDoctor)
                    .then(() => {
                        alert('Doctor Registered Successfully!');
                        document.getElementById('doctorForm').reset();
                    })
                    .catch((error) => {
                        console.error('Error adding document: ', error);
                        alert('Error in registering doctor');
                    });
            }
        }).catch((error) => {
            console.error('Error fetching data: ', error);
        });
    } else {
        alert('Please fill in all the fields!');
    }
}

// Make function accessible globally
window.registerDoctor = registerDoctor;

// Function to book an appointment
function bookAppointment() {
    const patientId = document.getElementById('bookPatientId').value;
    const doctorId = document.getElementById('bookDoctorId').value;
    const appointmentDate = document.getElementById('bookAppointmentDate').value;

    if (patientId && doctorId && appointmentDate) {
        const appointmentDetails = {
            doctorId: doctorId,
            appointmentDate: appointmentDate,
            status: 'Booked' 
        };

        const appointmentRef = ref(database, `appointmentDetails/${patientId}`);
        
        // Push a new appointment under the patient ID
        push(appointmentRef, appointmentDetails)  // Use push to add to the list
            .then(() => {
                alert('Appointment booked successfully!');
                document.getElementById('bookAppointmentForm').reset(); 
            })
            .catch((error) => {
                console.error('Error booking appointment: ', error);
                alert('Error booking appointment');
            });
    } else {
        alert('Please fill in all fields!');
    }
}

window.bookAppointment = bookAppointment;


function viewAppointments() {
    const patientId = document.getElementById('viewAppPatientId').value;

    if (!patientId) {
        alert('Please enter a Patient ID!');
        return;
    }

    const appointmentsRef = ref(database, `appointmentDetails/${patientId}`);
    const appointmentsContainer = document.getElementById('appointments');
    appointmentsContainer.innerHTML = 'Loading...'; 

    // Retrieve appointments for the specified patient
    get(appointmentsRef)
        .then((snapshot) => {
            appointmentsContainer.innerHTML = ''; // Clear loading message

            if (snapshot.exists()) {
                const appointments = snapshot.val(); // This will be an object of appointment objects
                console.log('Appointments:', appointments); // Log the entire appointments object

                // Create a table for displaying appointments
                let table = `<table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Doctor ID</th>
                                        <th>Appointment Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>`;

                // Iterate over appointments and append rows to the table
                for (const key in appointments) {
                    const appointment = appointments[key]; // Access each appointment object

                    // Ensure that the appointment object has the required properties
                    if (appointment && typeof appointment === 'object') {
                        const doctorId = appointment.doctorId || 'N/A';
                        const appointmentDate = appointment.appointmentDate || 'N/A';
                        const status = appointment.status || 'N/A';

                        table += `<tr>
                                    <td>${doctorId}</td>
                                    <td>${appointmentDate}</td>
                                    <td>${status}</td>
                                  </tr>`;
                    }
                }

                table += '</tbody></table>';
                appointmentsContainer.innerHTML = table;
            } else {
                appointmentsContainer.innerHTML = '<div class="alert alert-warning">No appointments found for this Patient ID.</div>';
            }
        })
        .catch((error) => {
            console.error('Error retrieving appointments: ', error);
            appointmentsContainer.innerHTML = '<div class="alert alert-danger">Error retrieving appointments. Please try again later.</div>';
        });
}

window.viewAppointments = viewAppointments;

//function to Generate a Bill
function generateBill() {
    const patientId = document.getElementById('billPatientId').value;
    const medicineCost = document.getElementById('medicine-cost').value;
    const consultingCost = document.getElementById('consulting-cost').value;
    const hospitalizationCharge = document.getElementById('hospitalization-charge').value;

    if (patientId && medicineCost && consultingCost && hospitalizationCharge) {
        // Calculate total amount
        const totalAmount = parseFloat(medicineCost) + parseFloat(consultingCost) + parseFloat(hospitalizationCharge);

        const billingDetails = {
            patientId: patientId,
            medicineCost: parseFloat(medicineCost),
            consultingCost: parseFloat(consultingCost),
            hospitalizationCharge: parseFloat(hospitalizationCharge),
            totalAmount: totalAmount // Automatically calculated
        };

        const billingRef = ref(database, `billingDetails/${patientId}`);

        // Push billing details
        set(billingRef, billingDetails)
            .then(() => {
                alert('Bill generated successfully!');
                document.getElementById('billingForm').reset(); // Reset the form
            })
            .catch((error) => {
                console.error('Error generating bill: ', error);
                alert('Error generating bill');
            });
    } else {
        alert('Please fill in all fields!');
    }
}

// Make function accessible globally
window.generateBill = generateBill;

function viewBills() {
    const patientId = document.getElementById('viewBillPatientId').value;

    if (patientId) {
        const billsRef = ref(database, `billingDetails/${patientId}`);

        // Retrieve the billing details for the patient
        get(billsRef)
            .then((snapshot) => {
                const billsContainer = document.getElementById('bills');
                billsContainer.innerHTML = ''; // Clear previous results

                if (snapshot.exists()) {
                    const bill = snapshot.val();

                    // Create a table to display the bill details
                    const billTable = `
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Patient ID</th>
                                    <th>Medicine Cost</th>
                                    <th>Consulting Cost</th>
                                    <th>Hospitalization Charges</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${bill.patientId}</td>
                                    <td>${bill.medicineCost}</td>
                                    <td>${bill.consultingCost}</td>
                                    <td>${bill.hospitalizationCharge}</td>
                                    <td>${bill.totalAmount}</td>
                                </tr>
                            </tbody>
                        </table>
                    `;

                    billsContainer.innerHTML = billTable;
                } else {
                    alert('No bills found for this patient.');
                }
            })
            .catch((error) => {
                console.error('Error retrieving bills: ', error);
                alert('Error retrieving bills');
            });
    } else {
        alert('Please enter a Patient ID!');
    }
}

// Make function accessible globally
window.viewBills = viewBills;


//viewing Patient Details
function viewPatientDetails() {
    const patientId = document.getElementById('managePatientId').value;

    if (patientId) {
        const patientsRef = ref(database, 'patientDetails');

        get(patientsRef)
            .then((snapshot) => {
                const patientDetailsContainer = document.getElementById('patientDetails');
                patientDetailsContainer.style.display = 'none'; // Hide initially
                patientDetailsContainer.innerHTML = ''; // Clear previous details

                if (snapshot.exists()) {
                    const patients = snapshot.val();
                    let found = false; // Track if patient is found

                    // Loop through patients to find the one with matching patientId
                    for (const key in patients) {
                        const patient = patients[key];
                        if (patient.id === patientId) {
                            found = true; // Patient found

                            const patientItem = document.createElement('div');
                            patientItem.innerHTML = `
                                <h3>Patient Details</h3>
                                <p>Patient ID: ${patientId}</p>
                                <p>Name: ${patient.firstName} ${patient.lastName}</p>
                                <p>Gender: ${patient.gender}</p>
                                <p>Date Of Birth: ${patient.dob}</p>
                                <p>Mobile: ${patient.phone || 'N/A'}</p>
                            `;
                            patientDetailsContainer.appendChild(patientItem);
                            patientDetailsContainer.style.display = 'block'; // Show details
                            break; // Exit loop after finding the patient
                        }
                    }

                    if (!found) {
                        alert('No patient found with this ID!');
                    }
                } else {
                    alert('No patient data available!');
                }
            })
            .catch((error) => {
                console.error('Error retrieving patient details: ', error);
                alert('Error retrieving patient details');
            });
    } else {
        alert('Please enter a Patient ID!');
    }
}

// Deleting Patient by ID
function deletePatientById() {
    const patientId = document.getElementById('deletePatientId').value;

    if (patientId) {
        const patientsRef = ref(database, 'patientDetails'); // Reference to the patient details collection

        // Retrieve all patient details to find the correct patient ID
        get(patientsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const patients = snapshot.val();
                    let found = false;

                    // Loop through patients to find the one with matching patientId
                    for (const key in patients) {
                        const patient = patients[key];
                        if (patient.id === patientId) {
                            found = true; // Patient found

                            // Delete the patient from Firebase
                            const patientRef = ref(database, `patientDetails/${key}`); // Reference to the specific patient
                            return remove(patientRef) // Remove the specific patient
                                .then(() => {
                                    const successMessage = document.getElementById('successMessage');
                                    successMessage.innerText = 'Patient deleted successfully!';
                                    successMessage.style.display = 'block';

                                    // Clear the input field
                                    document.getElementById('deletePatientId').value = '';

                                    // Optionally, clear the patient details display
                                    const patientDetailsContainer = document.getElementById('patientDetails');
                                    patientDetailsContainer.style.display = 'none'; // Hide patient details
                                    patientDetailsContainer.innerHTML = ''; // Clear patient details
                                });
                        }
                    }

                    if (!found) {
                        alert('No patient found with this ID!');
                    }
                } else {
                    alert('No patient data available!');
                }
            })
            .catch((error) => {
                console.error('Error retrieving patient details: ', error);
                alert('Error retrieving patient details');
            });
    } else {
        alert('Please enter a Patient ID to delete!');
    }
}

// Viewing Doctor Details
function viewDoctorDetails() {
    const doctorId = document.getElementById('manageDoctorId').value;

    if (doctorId) {
        const doctorRef = ref(database, `doctors/${doctorId}`);

        // Retrieve the doctor details from Firebase
        get(doctorRef)
            .then((snapshot) => {
                const doctorDetailsContainer = document.getElementById('doctorDetails');
                doctorDetailsContainer.innerHTML = ''; // Clear previous details

                if (snapshot.exists()) {
                    const doctor = snapshot.val();
                    // Display doctor details
                    const doctorItem = document.createElement('div');
                    doctorItem.innerHTML = `
                        <h3>Doctor Details</h3>
                        <p>Doctor ID: ${doctorId}</p>
                        <p>Name: ${doctor.firstName} ${doctor.lastName}</p>
                        <p>Gender: ${doctor.gender}</p>
                        <p>Specialty: ${doctor.specialty}</p>
                        <p>Experience: ${doctor.experience} years</p>
                        <p>Age: ${doctor.age}</p>
                    `;
                    doctorDetailsContainer.appendChild(doctorItem);
                    doctorDetailsContainer.style.display = 'block'; // Show doctor details
                } else {
                    alert('No doctor found for this ID');
                }
            })
            .catch((error) => {
                console.error('Error retrieving doctor details: ', error);
                alert('Error retrieving doctor details');
            });
    } else {
        alert('Please enter a Doctor ID!');
    }
}

// Deleting Doctor by ID
function deleteDoctorById() {
    const doctorId = document.getElementById('deleteDoctorId').value;

    if (doctorId) {
        const doctorsRef = ref(database, 'doctors'); // Reference to the doctors collection

        // Retrieve all doctor details to find the correct doctor ID
        get(doctorsRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const doctors = snapshot.val();
                    let found = false;

                    // Loop through doctors to find the one with matching doctorId
                    for (const key in doctors) {
                        const doctor = doctors[key];
                        if (doctor.id === doctorId) {
                            found = true; // Doctor found

                            // Delete the doctor from Firebase
                            const doctorRef = ref(database, `doctors/${key}`); // Reference to the specific doctor
                            return remove(doctorRef) // Remove the specific doctor
                                .then(() => {
                                    const successMessage = document.getElementById('successMessageDoctor');
                                    successMessage.innerText = 'Doctor deleted successfully!';
                                    successMessage.style.display = 'block';

                                    // Clear the input field
                                    document.getElementById('deleteDoctorId').value = '';

                                    // Optionally, clear the doctor details display
                                    const doctorDetailsContainer = document.getElementById('doctorDetails');
                                    doctorDetailsContainer.style.display = 'none'; // Hide doctor details
                                    doctorDetailsContainer.innerHTML = ''; // Clear doctor details
                                });
                        }
                    }

                    if (!found) {
                        alert('No doctor found with this ID!');
                    }
                } else {
                    alert('No doctor data available!');
                }
            })
            .catch((error) => {
                console.error('Error retrieving doctor details: ', error);
                alert('Error retrieving doctor details');
            });
    } else {
        alert('Please enter a Doctor ID to delete!');
    }
}

window.viewPatientDetails = viewPatientDetails;
window.deletePatientById = deletePatientById;
window.viewDoctorDetails = viewDoctorDetails;
window.deleteDoctorById = deleteDoctorById;

