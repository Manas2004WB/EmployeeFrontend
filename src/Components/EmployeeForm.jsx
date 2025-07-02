import React, { useEffect, useState } from 'react';
import { addEmployee, updateEmployee } from '../services/employeeService';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from '@/Components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
          return <p className="text-white/70">View only access</p>;
        }

    return (
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {selectedEmployee ? "Edit Employee" : "Add New Employee"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-white">Name</Label>
            <Input
              id="name"
              name="name"
              value={employee.name}
              onChange={handleChange}
              autoComplete="off"
              className="bg-white/10 text-white placeholder:text-white/60 border border-white/30 focus:ring-2 focus:ring-primary"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Department */}
          <div>
            <Label htmlFor="department" className="text-white mb-1 block">Department</Label>
            <Select
               value={employee.department}
               onValueChange={(value) =>
                handleChange({ target: { name: "department", value } })
               }
            >
              <SelectTrigger
                  id="department"
                  className="bg-white/10 text-white border border-white/30 focus:ring-2 focus:ring-primary"
                >
                  <SelectValue placeholder="Select a department" />
              </SelectTrigger>
               <SelectContent className="bg-white/10 text-white border border-white/30 backdrop-blur-md">
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                </SelectContent>
            </Select>
            {errors.department && <p className="text-red-400 text-sm mt-1">{errors.department}</p>}
          </div>

          {/* Joining Date */}
          <div>
            <Label htmlFor="joiningDate" className="text-white">Joining Date</Label>
            <Input
              type="date"
              id="joiningDate"
              name="joiningDate"
              value={employee.joiningDate}
              max={new Date().toISOString().split("T")[0]}
              min="2019-01-01"
              onChange={handleChange}
              className="bg-white/10 text-white placeholder:text-white/60 border border-white/30 focus:ring-2 focus:ring-primary"
            />
            {errors.joiningDate && <p className="text-red-400 text-sm mt-1">{errors.joiningDate}</p>}
          </div>

          {/* Salary */}
          <div>
            <Label htmlFor="salary" className="text-white">Salary</Label>
            <Input
              type="number"
              id="salary"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              min="0"
              className="remove-arrow bg-white/20 text-white placeholder-white/60 border-white/30"
            />
            {errors.salary && <p className="text-red-400 text-sm mt-1">{errors.salary}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full">
              {selectedEmployee ? "Update Employee" : "Add Employee"}
            </Button>

            {selectedEmployee && (
              <Button
                type="button"
                variant="ghost"
                className="w-full border border-white/20"
                onClick={() => {
                  clearSelectedEmployee();
                  resetForm();
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
    );
};

export default EmployeeForm;
