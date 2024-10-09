// Utility functions for local storage
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Register Patient
function registerPatient() {
    const patientId = document.getElementById('patient-id').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const phone = document.getElementById('phone').value;

    if (patientId && firstName && lastName && dob && phone) {
        const patients = getData('patients');

        // Check if patient ID already exists
        const existingPatient = patients.find(patient => patient.id === patientId);
        if (existingPatient) {
            document.getElementById('successMessage').innerText = 'Patient ID already exists!';
            return;
        }

        // Create new patient object
        const newPatient = {
            id: patientId,
            firstName: firstName,
            lastName: lastName,
            dob: dob,
            gender: gender,
            phone: phone
        };

        // Add patient to local storage
        patients.push(newPatient);
        saveData('patients', patients);

        document.getElementById('successMessage').innerText = 'Patient Registered Successfully!';
        document.getElementById('patientForm').reset();
    } 
    else {
        document.getElementById('successMessage').innerText = 'Please fill in all the fields!';
    }
}

// Register Doctor
function registerDoctor() {
    const doctorId = document.getElementById('docId').value;
    const firstName = document.getElementById('docFirstName').value;
    const lastName = document.getElementById('docLastName').value;
    const specialty = document.getElementById('specialty').value;
    const experience = document.getElementById('experience').value;
    const age = document.getElementById('age').value;
    const dob = document.getElementById('dob').value;

    if (doctorId && firstName && lastName && specialty && experience && age && dob) {
        const doctors = getData('doctors');

        // Check if doctor ID already exists
        const existingDoctor = doctors.find(doctor => doctor.id === doctorId);
        if (existingDoctor) {
            alert('Doctor ID already exists!');
            return;
        }

        // Create new doctor object
        const newDoctor = {
            id: doctorId,
            firstName: firstName,
            lastName: lastName,
            specialty: specialty,
            experience: experience,
            age: age,
            dob: dob
        };

        // Add doctor to local storage
        doctors.push(newDoctor);
        saveData('doctors', doctors);

        alert('Doctor Registered Successfully!');
        document.getElementById('doctorForm').reset();
    } else {
        alert('Please fill in all the fields!');
    }
}

// Schedule Doctor Appointment
function scheduleDoctorAppointment() {
    const patientId = document.getElementById('docPatientId').value;
    const doctorId = document.getElementById('docId').value;
    const appointmentDate = document.getElementById('appointmentDate').value;

    if (patientId && doctorId && appointmentDate) {
        const doctors = getData('doctors');
        const patients = getData('patients');
        const appointments = getData('appointments');

        // Check if doctor exists
        const doctorExists = doctors.find(doctor => doctor.id === doctorId);
        if (!doctorExists) {
            alert('Doctor not found!');
            return;
        }

        // Check if patient exists
        const patientExists = patients.find(patient => patient.id === patientId);
        if (!patientExists) {
            alert('Patient not found!');
            return;
        }

        // Create appointment object
        const appointment = {
            patientId: patientId,
            doctorId: doctorId,
            date: appointmentDate
        };

        // Add appointment to local storage
        appointments.push(appointment);
        saveData('appointments', appointments);

        alert('Appointment Scheduled Successfully!');
        document.getElementById('appointmentForm').reset();
    } else {
        alert('Please fill in all the fields!');
    }
}

// View Appointments
function viewAppointments() {
    const appointments = getData('appointments');
    const patientId = document.getElementById('viewAppPatientId').value;

    if (!patientId) {
        alert('Please enter a valid Patient ID');
        return;
    }

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
    const patientId = document.getElementById('billPatientId').value;
    const amount = document.getElementById('totalAmount').value;

    if (patientId && amount) {
        const patients = getData('patients');
        const bills = getData('bills');

        // Check if patient exists
        const patientExists = patients.find(p => p.id === patientId);
        if (!patientExists) {
            alert('Patient not found!');
            return;
        }

        // Create new bill object
        const bill = {
            patientId: patientId,
            amount: amount,
            date: new Date().toLocaleDateString()
        };

        // Save bill
        bills.push(bill);
        saveData('bills', bills);

        alert('Bill Generated Successfully!');
        document.getElementById('billingForm').reset();
    } else {
        alert('Please fill in all the fields!');
    }
}

// View Bills
function viewBills() {
    const patientId = document.getElementById('viewBillPatientId').value;

    if (!patientId) {
        alert('Please enter a valid Patient ID');
        return;
    }

    const bills = getData('bills');
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

function viewPatientDetails() {
    const patientId = document.getElementById('managePatientId').value;

    if (!patientId) {
        alert('Please enter a valid Patient ID');
        return;
    }

    const patients = getData('patients');
    const patient = patients.find(p => p.id === patientId);

    if (patient) {
        // Show patient details on the webpage
        document.getElementById('patientId').innerText = patient.id;
        document.getElementById('patientName').innerText = `${patient.firstName} ${patient.lastName}`;
        document.getElementById('patientDOB').innerText = patient.dob;
        document.getElementById('patientGender').innerText = patient.gender;
        document.getElementById('patientPhone').innerText = patient.phone;

        // Display the patient details section
        document.getElementById('patientDetails').style.display = 'block';
    } else {
        // Hide the patient details section if no patient is found
        document.getElementById('patientDetails').style.display = 'none';
        alert('Patient Not Found!');
    }
}

// Admin - View Doctor Details
function viewDoctorDetails() {
    const doctorId = document.getElementById('manageDoctorId').value;

    if (!doctorId) {
        alert('Please enter a valid Doctor ID');
        return;
    }

    const doctors = getData('doctors');
    const doctor = doctors.find(d => d.id === doctorId);

    if (doctor) {
        // Show doctor details on the webpage
        document.getElementById('doctorId').innerText = doctor.id;
        document.getElementById('doctorName').innerText = `${doctor.firstName} ${doctor.lastName}`;
        document.getElementById('doctorSpecialty').innerText = doctor.specialty;
        document.getElementById('doctorExperience').innerText = doctor.experience;
        document.getElementById('doctorAge').innerText = doctor.age;

        // Display the doctor details section
        document.getElementById('doctorDetails').style.display = 'block';
    } else {
        // Hide the doctor details section if no doctor is found
        document.getElementById('doctorDetails').style.display = 'none';
        alert('Doctor Not Found!');
    }
}
