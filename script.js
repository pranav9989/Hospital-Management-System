// Utility functions for local storage
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Patient Management Functions
function registerPatient() {
    const patients = getData('patients');
    const patient = {
        id: document.getElementById('pateint-id').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value
    };
    patients.push(patient);
    saveData('patients', patients);
    alert('Patient Registered Successfully!');
    document.getElementById('patientForm').reset();
}

function updatePatientRecord() {
    const patients = getData('patients');
    const patientId = parseInt(document.getElementById('updatePatientId').value);
    const newPhone = document.getElementById('newPhone').value;

    const patient = patients.find(p => p.id === patientId);
    if (patient) {
        patient.phone = newPhone;
        saveData('patients', patients);
        alert('Patient Record Updated!');
    } else {
        alert('Patient Not Found!');
    }
}

function viewPatientHistory() {
    const patients = getData('patients');
    const patientId = parseInt(document.getElementById('historyPatientId').value);
    const patient = patients.find(p => p.id === patientId);

    const historyDiv = document.getElementById('patientHistory');
    if (patient) {
        historyDiv.innerHTML = `
            <h4>Patient Details:</h4>
            <p>ID: ${patient.id}</p>
            <p>Name: ${patient.firstName} ${patient.lastName}</p>
            <p>Date of Birth: ${patient.dob}</p>
            <p>Gender: ${patient.gender}</p>
            <p>Phone: ${patient.phone}</p>
        `;
    } else {
        historyDiv.innerHTML = '<p>Patient Not Found!</p>';
    }
}

// Doctor Management Functions
function registerDoctor() {
    const doctors = getData('doctors');
    const doctor = {
        id: doctors.length + 1,
        firstName: document.getElementById('docFirstName').value,
        lastName: document.getElementById('docLastName').value,
        specialty: document.getElementById('specialty').value
    };
    doctors.push(doctor);
    saveData('doctors', doctors);
    alert('Doctor Registered Successfully!');
    document.getElementById('doctorForm').reset();
}

function scheduleDoctorAppointment() {
    const appointments = getData('appointments');
    const appointment = {
        patientId: document.getElementById('docPatientId').value,
        doctorId: document.getElementById('docId').value,
        date: document.getElementById('appointmentDate').value
    };
    appointments.push(appointment);
    saveData('appointments', appointments);
    alert('Appointment Scheduled Successfully!');
    document.getElementById('appointmentForm').reset();
}

// Appointment Functions
function bookAppointment() {
    const appointments = getData('appointments');
    const appointment = {
        patientId: document.getElementById('bookPatientId').value,
        doctorId: document.getElementById('bookDoctorId').value,
        date: document.getElementById('bookAppointmentDate').value
    };
    appointments.push(appointment);
    saveData('appointments', appointments);
    alert('Appointment Booked Successfully!');
    document.getElementById('bookAppointmentForm').reset();
}

function viewAppointments() {
    const appointments = getData('appointments');
    const patientId = document.getElementById('viewAppPatientId').value;
    const patientAppointments = appointments.filter(a => a.patientId === patientId);
    
    const appointmentsDiv = document.getElementById('appointments');
    if (patientAppointments.length > 0) {
        appointmentsDiv.innerHTML = '<h4>Your Appointments:</h4>';
        patientAppointments.forEach(app => {
            appointmentsDiv.innerHTML += `<p>Doctor ID: ${app.doctorId} on ${app.date}</p>`;
        });
    } else {
        appointmentsDiv.innerHTML = '<p>No Appointments Found!</p>';
    }
}

// Billing Functions
function generateBill() {
    const bills = getData('bills');
    const bill = {
        patientId: document.getElementById('billPatientId').value,
        amount: document.getElementById('totalAmount').value,
        date: new Date().toLocaleDateString()
    };
    bills.push(bill);
    saveData('bills', bills);
    alert('Bill Generated Successfully!');
    document.getElementById('billingForm').reset();
}

function viewBills() {
    const bills = getData('bills');
    const patientId = document.getElementById('viewBillPatientId').value;
    const patientBills = bills.filter(b => b.patientId === patientId);
    
    const billsDiv = document.getElementById('bills');
    if (patientBills.length > 0) {
        billsDiv.innerHTML = '<h4>Your Bills:</h4>';
        patientBills.forEach(bill => {
            billsDiv.innerHTML += `<p>Amount: ${bill.amount} on ${bill.date}</p>`;
        });
    } else {
        billsDiv.innerHTML = '<p>No Bills Found!</p>';
    }
}

// Admin Functions
function viewPatientDetails() {
    const patients = getData('patients');
    const patientId = parseInt(document.getElementById('managePatientId').value);
    const patient = patients.find(p => p.id === patientId);

    if (patient) {
        alert(`Patient Details:\nID: ${patient.id}\nName: ${patient.firstName} ${patient.lastName}\nDOB: ${patient.dob}\nGender: ${patient.gender}\nPhone: ${patient.phone}`);
    } else {
        alert('Patient Not Found!');
    }
}
