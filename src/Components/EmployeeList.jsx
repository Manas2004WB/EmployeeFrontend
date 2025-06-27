
import { deleteEmployee } from '../services/employeeService';
import { toast } from 'react-toastify';


const EmployeeList = ({employees,fetchEmployees,onEdit}) => {
    

    const  handleDelete =async(id)=>{
        try {
            if (window.confirm("Are you sure you want to delete this employee?")) {
            await deleteEmployee(id);
            toast.success("Employee deleted successfully!");
            fetchEmployees();
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    }


    return (
        <div className='list-main'>
            <h2>Employee List</h2>
            {employees.length === 0 ? (
                <p>No Employee available in db</p>
            ) : (
                <table border="1" cellPadding="10" cellSpacing="0" >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Joining Date</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                <td>{emp.department}</td>
                                <td>{emp.joiningDate.split('T')[0]}</td> {/* Format date */}
                                <td>{emp.salary}</td>
                                <td>
                                    <button className= "delete"onClick={() => handleDelete(emp.id)}>Delete</button>
                                    <button className= "update" onClick={() => onEdit(emp)}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EmployeeList;
