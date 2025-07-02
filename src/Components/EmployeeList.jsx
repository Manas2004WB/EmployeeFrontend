import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
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
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-md border border-white/10 text-white">
            <h2 className="text-2xl font-semibold mb-4">Employee List</h2>
            {employees.length === 0 ? (
                <p className="text-white/70">No Employee available in db</p>
            ) : (
                <Table >
                    <TableHeader>
                        <TableRow>
                        <TableHead className="text-white bg-slate-400">Name</TableHead>
                        <TableHead className="text-white bg-slate-400">Department</TableHead>
                        <TableHead className="text-white bg-slate-400">Joining Date</TableHead>
                        <TableHead className="text-white bg-slate-400">Salary</TableHead>
                        {user.role === "Manager" && <TableHead className="text-white bg-slate-400">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((emp) => (
                        <TableRow key={emp.id}>
                            <TableCell>{emp.name}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>{emp.joiningDate.split('T')[0]}</TableCell>
                            <TableCell>{emp.salary}</TableCell>
                            {user.role === "Manager" && (
                            <TableCell className="space-x-2">
                                <Button variant="destructive" size="sm" onClick={() => confirmDelete(emp.id)}>Delete</Button>
                                <Button variant="outline" size="sm" className="text-black"onClick={() => onEdit(emp)}>Update</Button>
                            </TableCell>
                            )}
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete this employee?</p>
                <DialogFooter className="mt-4 space-x-2">
                    <Button variant="destructive" onClick={handleDelete}>Yes, Delete</Button>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default EmployeeList;
