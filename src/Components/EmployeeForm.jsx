import React, { useEffect, useState } from 'react';
import { addEmployee, updateEmployee } from '../services/employeeService';
import { toast } from 'react-toastify';


const EmployeeForm = ({ fetchEmployees, selectedEmployee, clearSelectedEmployee }) => {
    const [employee, setEmployee] = useState({
        id: null, 
        name: '',
        department: '',
        joiningDate: '',
        salary: ''
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
         const newErrors = {};
                if (!employee.name.trim()) {
                    newErrors.name = "Name is required";
                }

                if (!employee.department.trim()) {
                    newErrors.department = "Department is required";
                }

                if (!employee.joiningDate) {
                    newErrors.joiningDate = "Joining date is required";
                }

                if (!employee.salary || employee.salary <= 0) {
                    newErrors.salary = "Salary must be a positive number";
                }

                if (Object.keys(newErrors).length > 0) {
                    setErrors(newErrors);
                    return;
                }

                // Clear errors and submit form
                setErrors({});
                // continue with add/update logic
        try {
            if (selectedEmployee) {
                // Edit mode
                await updateEmployee(selectedEmployee.id, employee);
                toast.success("Employee updated successfully!");
            } else {
                // Add mode
                const { id, ...employeeToAdd } = employee;
                await addEmployee(employeeToAdd);
                toast.success("Employee added successfully!");
            }

            // Refresh data and reset form
            fetchEmployees();
            clearSelectedEmployee();
            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error("Something went wrong!");
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
    };

    useEffect(() => {
        if (selectedEmployee) {
            setEmployee({
                id: selectedEmployee.id,
                name: selectedEmployee.name || '',
                department: selectedEmployee.department || '',
                joiningDate: selectedEmployee.joiningDate?.split('T')[0] || '',
                salary: selectedEmployee.salary || ''
            });
        } else {
            resetForm();
        }
    }, [selectedEmployee]);

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
                    <button type="button" onClick={() => {
                            clearSelectedEmployee();
                            resetForm();
                        }}>
                            Cancel
                    </button>
                    )}
                </div>
                
            </form>
        </div>
    );
};

export default EmployeeForm;
