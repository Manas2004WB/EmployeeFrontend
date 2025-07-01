
import { useState } from 'react';
import { deleteEmployee } from '../services/employeeService';
import { toast } from 'react-toastify';


const EmployeeList = ({employees,fetchEmployees,onEdit,user}) => {

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    const confirmDelete = (id) => {
        setSelectedEmployeeId(id);
        setShowConfirmModal(true);
    };

    const  handleDelete =async()=>{
        try {
            await deleteEmployee(selectedEmployeeId,user.id);
            toast.success("Employee deleted successfully!");
            fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
        }finally {
            setShowConfirmModal(false);
            setSelectedEmployeeId(null);
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
                            {user.role === "Manager" && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((emp) => (
                            <tr key={emp.id}>
                                <td>{emp.name}</td>
                                <td>{emp.department}</td>
                                <td>{emp.joiningDate.split('T')[0]}</td> 
                                <td>{emp.salary}</td>
                                {user.role === "Manager" && (
                                <td>
                                <button className="delete" onClick={() => confirmDelete(emp.id)}>Delete</button>
                                <button className="update" onClick={() => onEdit(emp)}>Update</button>
                                </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {
                showConfirmModal && (
                 <div className="modal-backdrop">
                    <div className="modal-box">
                            <h3>Confirm Delete</h3>
                            <p>Are you sure you want to delete the employee</p>
                            <div className='modal-action'>
                                <button className= "delete-confirm"onClick={handleDelete}>Yes,Delete</button>
                                <button className= "cancel-confirm"onClick={()=>setShowConfirmModal(false)}>Cancel</button>
                            </div>
                    </div>
                 </div>
            )}
        </div>
    );
};

export default EmployeeList;
