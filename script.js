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
                        document.getElementById('successMessage').innerText = 'Patient Registered Successfully!';
                        document.getElementById('patientForm').reset();
                    })
                    .catch((error) => {
                        console.error('Error registering patient: ', error);
                        document.getElementById('successMessage').innerText = 'Error registering patient. Please try again.';
                    });
            }
        }).catch((error) => {
            console.error('Error fetching data: ', error);
            document.getElementById('successMessage').innerText = 'Error checking patient ID. Please try again.';
        });
    } else {
        document.getElementById('successMessage').innerText = 'Please fill in all the fields!';
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
            status: 'Booked' // or any other status you want to set
        };

        const appointmentRef = ref(database, `appointmentDetails/${patientId}`); // Reference for patient ID
        
        // Push a new appointment under the patient ID
        push(appointmentRef, appointmentDetails)  // Use push to add to the list
            .then(() => {
                alert('Appointment booked successfully!');
                document.getElementById('bookAppointmentForm').reset(); // Reset the form
            })
            .catch((error) => {
                console.error('Error booking appointment: ', error);
                alert('Error booking appointment');
            });
    } else {
        alert('Please fill in all fields!');
    }
}

// Make function accessible globally
window.bookAppointment = bookAppointment;


function viewAppointments() {
    const patientId = document.getElementById('viewAppPatientId').value;

    if (!patientId) {
        alert('Please enter a Patient ID!');
        return;
    }

    const appointmentsRef = ref(database, `appointmentDetails/${patientId}`);

    // Clear previous results and show a loading message
    const appointmentsContainer = document.getElementById('appointments');
    appointmentsContainer.innerHTML = 'Loading...'; // Indicate loading state

    // Retrieve appointments for the specified patient
    get(appointmentsRef)
        .then((snapshot) => {
            appointmentsContainer.innerHTML = ''; // Clear loading message

            if (snapshot.exists()) {
                const appointments = snapshot.val(); // This will be an object of appointment objects
                console.log('Appointments:', appointments); // Log the entire appointments object

                // Iterate over appointments and display them
                for (const key in appointments) {
                    const appointment = appointments[key]; // Access each appointment object

                    // Ensure that the appointment object has the required properties
                    if (appointment && typeof appointment === 'object') {
                        const doctorId = appointment.doctorId || 'N/A';
                        const appointmentDate = appointment.appointmentDate || 'N/A';
                        const status = appointment.status || 'N/A';

                        appointmentsContainer.innerHTML = `Doctor ID: ${doctorId}, Date: ${appointmentDate}, Status: ${status}`;
                    }
                }
            } else {
                appointmentsContainer.textContent = 'No appointments found for this Patient ID.';
            }
        })
        .catch((error) => {
            console.error('Error retrieving appointments: ', error);
            appointmentsContainer.textContent = 'Error retrieving appointments. Please try again later.';
        });
}

// Make function accessible globally
window.viewAppointments = viewAppointments;


// Function to generate a bill
function generateBill() {
    const patientId = document.getElementById('billPatientId').value;
    const medicineCost = document.getElementById('medicine-cost').value;
    const consultingCost = document.getElementById('consulting-cost').value;
    const hospitalizationCharge = document.getElementById('hospitalization-charge').value;
    const totalAmount = document.getElementById('totalAmount').value;

    if (patientId && medicineCost && consultingCost && hospitalizationCharge && totalAmount) {
        const billingDetails = {
            patientId: patientId,
            medicineCost: parseFloat(medicineCost),
            consultingCost: parseFloat(consultingCost),
            hospitalizationCharge: parseFloat(hospitalizationCharge),
            totalAmount: parseFloat(totalAmount)
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
                    const billItem = document.createElement('div');
                    billItem.textContent = `Bill for Patient ID: ${bill.patientId} - Medicine Cost: ${bill.medicineCost} - Consulting Cost: ${bill.consultingCost} - Hospitalization Charges: ${bill.hospitalizationCharge} - Total Amount: ${bill.totalAmount}`;
                    billsContainer.appendChild(billItem);
                } else {
                    billsContainer.textContent = 'No bills found for this patient.';
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
                        patientDetailsContainer.textContent = 'No patient found with this ID!';
                    }
                } else {
                    patientDetailsContainer.textContent = 'No patient data available!';
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
                    doctorDetailsContainer.textContent = 'No doctor found!';
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
                                    const successMessage = document.getElementById('successMessage');
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

// Make functions accessible globally
window.viewPatientDetails = viewPatientDetails;
window.deletePatientById = deletePatientById;
window.viewDoctorDetails = viewDoctorDetails;
window.deleteDoctorById = deleteDoctorById;

