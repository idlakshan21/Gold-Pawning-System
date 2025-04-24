const { z } = require('zod');

const customerSchema = z.object({
    nic: z.string({ required_error: 'NIC required' })
        .regex(/^(?:\d{9}[VvXx]|\d{12})$/, 'NIC must be 9 digits V or 12 digits'),
    customerName: z.string({ required_error: 'Name required' })
        .regex(/^[A-Za-z\s\.\-]+$/, 'Name: letters, spaces, dots, hyphens only')
        .min(2, 'Name too short (min 2 chars)')
        .max(100, 'Name too long (max 100 chars)'),
    address1: z.string({ required_error: 'Address required' })
        .min(5, 'Address too short (min 5 chars)')
        .max(200, 'Address too long (max 200 chars)'),
    address2: z.string()
        .max(200, 'Address too long (max 200 chars)')
        .optional(),
    phone1: z.string({ required_error: 'Phone required' })
        .regex(/^(?:\+94|0)(?:7[0-8])\d{7}$/, 'Phone must be +947XYYYYYYY or 07XYYYYYYY'),
    phone2: z.string()
        .regex(/^(?:\+94|0)(?:7[0-8])\d{7}$/, 'Phone must be +947XYYYYYYY or 07XYYYYYYY')
        .optional()
        .or(z.literal('')),
    email: z.string()
        .email('Invalid email')
        .optional()
        .or(z.literal('')),
    gender: z.enum(['Male', 'Female', 'Other'], { 
        required_error: 'Gender required', 
        invalid_type_error: 'Select Male, Female, or Other' 
    })
});

module.exports = customerSchema;