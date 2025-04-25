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
});
