function customerDetails() {
    const formData = {
        customerName: document.getElementById('customerName').value.trim(),
        address1: document.getElementById('address1').value.trim(),
        nic: document.getElementById('nic').value.trim(),
        phone1: document.getElementById('phone1').value.trim(),
        phone2: document.getElementById('phone2').value.trim(),
        email: document.getElementById('email').value.trim(),
        gender: document.getElementById('gender').value,
        address2: document.getElementById('address2').value.trim()
    };

    ['nic', 'customerName', 'address1', 'address2', 'phone1', 'phone2', 'email', 'gender'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.classList.remove('error-border');
        const errorElement = document.getElementById(`error-${id}`);
        if (errorElement) errorElement.remove();
    });

    const result = config.customerSchema.safeParse(formData);
    if (result.success) {

        document.getElementById('summary-name').textContent = formData.customerName;
        document.getElementById('summary-gender').textContent = formData.gender;

        const fullAddress = formData.address2 ? `${formData.address1}, ${formData.address2}` : formData.address1;
        document.getElementById('summary-address').textContent = fullAddress;

        document.getElementById('summary-nic').textContent = formData.nic;

        let contactInfo = formData.phone1;
        if (formData.phone2) contactInfo += `, ${formData.phone2}`;
        if (formData.email) contactInfo += ` / ${formData.email}`;
        document.getElementById('summary-contact').textContent = contactInfo;

        document.getElementById('summary-totalGoldValue').textContent = 'LKR ' + totalGoldValueSum.toFixed(2);
        document.getElementById('summary-totalInterest').textContent = 'LKR ' + totalInterestSum.toFixed(2);
        document.getElementById('summary-totalLoan').textContent = 'LKR ' + totalAdjustedLoanSum.toFixed(2);

     
        goToNextPage();
    } else {

        result.error.errors.forEach(error => {
            const field = error.path[0];
            const input = document.getElementById(field);
            if (input) {
                input.classList.add('error-border');
                let errorP = document.getElementById(`error-${field}`);
                if (!errorP) {
                    errorP = document.createElement('p');
                    errorP.id = `error-${field}`;
                    errorP.className = 'error-message';
                    input.parentElement.appendChild(errorP);
                }
                errorP.textContent = error.message;
            }
        });
    }
}


document.getElementById('prevBtn2')?.addEventListener('click', () => {
    document.getElementById('page' + currentPage).classList.remove('active');
    document.getElementById('step' + currentPage).classList.remove('active');
    
    currentPage = 2;
    
    document.getElementById('page' + currentPage).classList.add('active');
    document.getElementById('step' + currentPage).classList.add('active');
    
    updateProgressBar();
});

document.getElementById('printReceiptBtn')?.addEventListener('click', () => {
    printReceipt();
});



function printReceipt() {

    
   
}

module.exports = customerDetails;