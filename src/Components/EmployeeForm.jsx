import React, { useEffect, useState } from 'react';
import { addEmployee, updateEmployee } from '../services/employeeService';
import { toast } from 'react-toastify';

const EmployeeForm = ({ fetchEmployees, selectedEmployee, clearSelectedEmployee,user }) => {
    const [employee, setEmployee] = useState({
        id: null,
        name: '',
        department: '',
        joiningDate: '',
        salary: ''
    });

    const [errors, setErrors] = useState({});

    // ✅ Centralized validation logic
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) return 'Name is required';
                if (/\d/.test(value)) return 'Name cannot contain numbers.';
                break;
            case 'department':
                if (!value.trim()) return 'Department is required';
                if (/\d/.test(value)) return 'Department cannot contain numbers.';
                break;
            case 'joiningDate':
                if (!value) return 'Joining date is required';
                break;
            case 'salary':
                const salary = parseFloat(value);
                if (isNaN(salary) || salary <= 0) return 'Salary must be a positive number';
                break;
            default:
                return '';
        }
        return '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // ✅ Live validation for the current field
        const errorMsg = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));

        setEmployee((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // ✅ Validate all fields
        Object.keys(employee).forEach((key) => {
            if (key !== 'id') {
                const error = validateField(key, employee[key]);
                if (error) {
                    newErrors[key] = error;
                }
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({}); // clear any old errors

        try {
            if (selectedEmployee) {
                await updateEmployee(selectedEmployee.id, employee,user.id);
                toast.success('Employee updated successfully!');
            } else {
                const { id, ...employeeToAdd } = employee;
                await addEmployee(employeeToAdd,user.id);
                toast.success('Employee added successfully!');
            }

            fetchEmployees();
            clearSelectedEmployee();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Something went wrong!');
        }
    };

    const resetForm = () => {
        setEmployee({
            id: null,
            name: '',
            department: '',
            joiningDate: '',
            salary: ''
        });
        setErrors({});
    };

    useEffect(() => {
        if (selectedEmployee) {
            const { id, name, department, joiningDate, salary } = selectedEmployee;
            setEmployee({
                id,
                name: name || '',
                department: department || '',
                joiningDate: joiningDate?.split('T')[0] || '',
                salary: salary || ''
            });
        } else {
            resetForm();
        }
    }, [selectedEmployee]);


        if (user.role !== "Manager") {
        return null; // or return <p>View only access</p>;
        }

    return (
        <div className='form-main'>
            <h1>{selectedEmployee ? 'Edit Employee' : 'Add New Employee'}</h1>
            <form onSubmit={handleSubmit} className='form'>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={employee.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>

                <div>
                    <label>Department:</label>
                    <input
                        type="text"
                        name="department"
                        value={employee.department}
                        onChange={handleChange}
                    />
                    {errors.department && <p className="error">{errors.department}</p>}
                </div>

                <div>
                    <label>Joining Date:</label>
                    <input
                        type="date"
                        name="joiningDate"
                        value={employee.joiningDate}
                        onChange={handleChange}
                    />
                    {errors.joiningDate && <p className="error">{errors.joiningDate}</p>}
                </div>

                <div>
                    <label>Salary:</label>
                    <input
                        type="number"
                        name="salary"
                        value={employee.salary}
                        onChange={handleChange}
                        min="0"
                    />
                    {errors.salary && <p className="error">{errors.salary}</p>}
                </div>

                <div className="form-buttons">
                    <button type="submit">
                        {selectedEmployee ? 'Update Employee' : 'Add Employee'}
                    </button>

                    {selectedEmployee && (
                        <button
                            type="button"
                            onClick={() => {
                                clearSelectedEmployee();
                                resetForm();
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EmployeeForm;
