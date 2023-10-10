// import React, { useState, useEffect } from 'react';
// import { Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";

// interface Technician {
//     id: number;
//     firstName: string;
//     lastName: string;
// }

// const TechnicianCRUD: React.FC = () => {
//     const [technicians, setTechnicians] = useState<Technician[]>([]);
//     const [inputFirstName, setInputFirstName] = useState<string>("");
//     const [inputLastName, setInputLastName] = useState<string>("");
    
//     useEffect(() => {
//         fetchTechnicians();
//     }, []);

//     const fetchTechnicians = async () => {
//         try {
//             const response = await fetch('http://localhost:4000/technicians');
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             const data: Technician[] = await response.json();
//             setTechnicians(data);
//         } catch (error) {
//             console.error('Error loading technicians:', error);
//         }
//     }

//     const handleCreate = async () => {
//     try {
//         const response = await fetch('http://localhost:4000/technicians', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 firstName: inputFirstName,
//                 lastName: inputLastName,
//             })
//         });

//         if (response.ok) {
//             fetchTechnicians();
//             setInputFirstName("");
//             setInputLastName("");
//         } else {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//     } catch (error) {
//         console.error('Error creating technician:', error);
//     }
// }


//     const handleDelete = async (id: number) => {
//         try {
//             const response = await fetch(`http://localhost:4000/technicians/${id}`, {
//                 method: 'DELETE',
//             });

//             if (response.ok) {
//                 fetchTechnicians();
//             } else {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//         } catch (error) {
//             console.error('Error deleting technician:', error);
//         }
//     }

//     return (
//         <div>
//             <h2>Technician CRUD</h2>

//             {/* Create Technician */}
//             <div>
//                 <TextField
//                     label="First Name"
//                     variant="outlined"
//                     value={inputFirstName}
//                     onChange={(e) => setInputFirstName(e.target.value)}
//                 />
//                 <TextField
//                     label="Last Name"
//                     variant="outlined"
//                     value={inputLastName}
//                     onChange={(e) => setInputLastName(e.target.value)}
//                 />
//                 <Button variant="contained" color="primary" onClick={handleCreate}>
//                     Create Technician
//                 </Button>
//             </div>

            
//             <List>
//                 {technicians.map(tech => (
//                     <ListItem key={tech.id}>
//                         <ListItemText primary={`${tech.firstName} ${tech.lastName}`} />
//                         <ListItemSecondaryAction>
//                             <Button color="secondary" onClick={() => handleDelete(tech.id)}>
//                                 Delete
//                             </Button>
//                         </ListItemSecondaryAction>
//                     </ListItem>
//                 ))}
//             </List>
//         </div>
//     );
// }

// export default TechnicianCRUD;
import React, { useState, useEffect } from 'react';
import { Button, TextField, List, ListItem, ListItemText, ListItemSecondaryAction } from "@mui/material";

interface Technician {
    id: number;
    firstName: string;
    lastName: string;
}

const TechnicianCRUD: React.FC = () => {
    const [technicians, setTechnicians] = useState<Technician[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [inputFirstName, setInputFirstName] = useState("");
    const [inputLastName, setInputLastName] = useState("");
    
    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        setLoading(true);
        const response = await fetch('http://localhost:4000/technicians');
        const data: Technician[] = await response.json();
        setTechnicians(data);
        setLoading(false);
    }

    const handleCreate = async () => {
        try {
            const response = await fetch('http://localhost:4000/technicians', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    firstName: inputFirstName,
                    lastName: inputLastName 
                })
            });
            
            if (response.ok) {
                fetchTechnicians();
                setInputFirstName("");
                setInputLastName("");
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error creating technician:', error);
        }
    }

    const handleDelete = async (id: number) => {
        const response = await fetch(`http://localhost:4000/technicians/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchTechnicians();
        }
    }

    const handleUpdate = async (id: number, newFirstName: string, newLastName: string) => {
        try {
            const response = await fetch(`http://localhost:4000/technicians/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: newFirstName,
                    lastName: newLastName
                })
            });

            if (response.ok) {
                fetchTechnicians();
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating technician:', error);
        }
    }

    return (
        <div>
            <h2>Technician CRUD</h2>

            <div>
                <TextField
                    label="First Name"
                    variant="outlined"
                    value={inputFirstName}
                    onChange={(e) => setInputFirstName(e.target.value)}
                />
                <TextField
                    label="Last Name"
                    variant="outlined"
                    value={inputLastName}
                    onChange={(e) => setInputLastName(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleCreate}>
                    Create Technician
                </Button>
            </div>

            <List>
                {loading ? (
                    <p>Loading technicians...</p>
                ) : (
                    technicians.map((tech) => (
                        <ListItem key={tech.id}>
                            <ListItemText primary={`${tech.firstName} ${tech.lastName}`} />
                            <ListItemSecondaryAction>
                                <Button color="secondary" onClick={() => handleDelete(tech.id)}>
                                    Delete
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={() => {
                                        const newFirstName = prompt('Enter new first name:');
                                        const newLastName = prompt('Enter new last name:');
                                        if (newFirstName !== null && newLastName !== null) {
                                            handleUpdate(tech.id, newFirstName, newLastName);
                                        }
                                    }}
                                >
                                    Update
                                </Button>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                )}
            </List>
        </div>
    );
}

export default TechnicianCRUD;

