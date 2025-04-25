const axios = require('axios');
const configFile = require('../main/config');

const api = axios.create({
    baseURL: configFile.baseUrl
});

let currentCustomerId = null;

async function fetchCustomerByNIC(nic) {
    if (!nic) return;

    try {
        const response = await api.get('/customer', { params: { nic } });
        const responseData = response.data;

        if (responseData.code === 200 && responseData.data) {
            const customer = responseData.data;

            currentCustomerId = customer.customerId;

            document.getElementById('customerName').value = customer.customerName || '';
            document.getElementById('address1').value = customer.addressOne || '';
            document.getElementById('address2').value = customer.addressTwo || '';
            document.getElementById('phone1').value = customer.contactNumberOne || '';
            document.getElementById('phone2').value = customer.contactNumberTwo || '';
            document.getElementById('email').value = customer.email || '';
            document.getElementById('gender').value = customer.gender || 'Male';

            ['customerName', 'address1', 'address2', 'phone1', 'phone2', 'email', 'gender'].forEach(id => {
                const input = document.getElementById(id);
                if (input) input.classList.remove('error-border');
                const errorElement = document.getElementById(`error-${id}`);
                if (errorElement) errorElement.remove();
            });
        } else {
            throw new Error('Invalid response or customer not found');
        }

    } catch (error) {
        currentCustomerId = null;

        document.getElementById('customerName').value = '';
        document.getElementById('address1').value = '';
        document.getElementById('address2').value = '';
        document.getElementById('phone1').value = '';
        document.getElementById('phone2').value = '';
        document.getElementById('email').value = '';
        document.getElementById('gender').value = 'Male';

        Swal.fire({
            title: 'Customer Not Found',
            text: 'No customer found with the provided NIC number.',
            icon: 'info',
            confirmButtonColor: '#FFC107',
            confirmButtonText: 'OK'
        });
    }

    return currentCustomerId;
}

async function saveCustomer(formData) {
    try {
      
        const customerData = {
            customerId: currentCustomerId || "" ,
            customerName: formData.customerName,
            nic: formData.nic,
            addressOne: formData.address1,
            addressTwo: formData.address2 || "",
            contactNumberOne: formData.phone1,
            contactNumberTwo: formData.phone2 || "",
            email: formData.email || "",
            gender: formData.gender,
            status: "Active", 
        
        };

        const response = await api.post('/customer/save', customerData);
        
        if (response.data && response.data.code === 200) {
            if (response.data.data && response.data.data.customerId) {
                currentCustomerId = response.data.data.customerId;
            }
        console.log(articles);
        
            return true;
        } else {
            throw new Error('Failed to save customer data');
        }
    } catch (error) {
        console.error('Error saving customer:', error);
        
        Swal.fire({
            title: 'Error',
            text: 'Failed to save customer information. Please try again.',
            icon: 'error',
            confirmButtonColor: '#FFC107',
            confirmButtonText: 'OK'
        });
        
        return false;
    }
}


function formatDateToISO(dateString) {
    const date = new Date(dateString);
    return date.toISOString();
}


function getCurrentDateISO() {
    return new Date().toISOString();
}


async function savePawningData() {
    try {
     
        const pawningItems = articles.map(item => {
            return {
                customerId: currentCustomerId || "",
                article: item.name,
                adjustableValue: parseFloat(item.adjustment || 0),
                assetValue: parseFloat(item.calculatedLoan || 0),
                monthlyInterest: parseFloat(item.interestRate || 0),
                karatValue: item.karat + "K",
                expiryDate: formatDateToISO(item.dueDate),
                createdDate: getCurrentDateISO(),
                netWeight: parseFloat(item.weight || 0),
                grossWeight: parseFloat(item.grossWeight || 0),
                loanAmount: parseFloat(item.adjustedLoan || 0),
                dailyInterest: parseFloat(item.dailyInterest || 0),
                interestAmount: parseFloat(item.interest || 0),
                note: item.notes || "",
                status: "Pending"
            };
        });

 
        const totalLoanText = document.getElementById('summary-totalLoan').textContent;
        const totalAssetText = document.getElementById('summary-totalCalculatedValue').textContent;

        const totalLoanAmount = parseFloat(totalLoanText.replace('LKR ', ''));
        const totalAssetValue = parseFloat(totalAssetText.replace('LKR ', ''));

      
        const pawningData = {
            ticketId: 0, 
            customerId: currentCustomerId || "",
            pawningDate: getCurrentDateISO(),
            totalLoanAmount: totalLoanAmount,
            totalAssetValue: totalAssetValue,
            status: "ACTIVE",
            pawningItemsDTOS: pawningItems
        };

    
        const response = await api.post('/ticket/save', pawningData);
        
        if (response.data && response.data.code === 200) {
            Swal.fire({
                title: 'Success',
                text: 'Pawning data saved successfully!',
                icon: 'success',
                confirmButtonColor: '#FFC107',
                confirmButtonText: 'OK'
            });
            return true;
        } else {
            throw new Error('Failed to save pawning data');
        }
    } catch (error) {
        console.error('Error saving pawning data:', error);
        
        Swal.fire({
            title: 'Error',
            text: 'Failed to save pawning data. Please try again.',
            icon: 'error',
            confirmButtonColor: '#FFC107',
            confirmButtonText: 'OK'
        });
        
        return false;
    }
}




document.addEventListener('DOMContentLoaded', () => {
    const nicInput = document.getElementById('nic');
    if (nicInput) {
        nicInput.addEventListener('keydown', async function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                const id = await fetchCustomerByNIC(this.value.trim());
                console.log('Customer ID:', id);
            }
        });
    } else {
        console.log('NIC input not found');
    }

    const printButton = document.getElementById('printReceiptBtn');
    if (printButton) {
        printButton.addEventListener('click', async function(event) {
            event.preventDefault();
            await savePawningData();
          
        });
    } else {
        console.log('Print button not found');
    }
});
