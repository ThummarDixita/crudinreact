import logo from './logo.svg';
import './App.css';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";
const editIcon = <FontAwesomeIcon icon={faEdit} />;
const deleteIcon = <FontAwesomeIcon icon={faTrash} />;


function App() {
  const [showUserMdl, setshowUserMdl] = useState(false)
  const [userData, setUserData] = useState([])
  const [user, setUser] = useState({ id: "", fname: "", lname: "", email: "", address: "" })
  var emailRegex = "[a-z0-9]+@[a-z]+.[a-z]{2,3}";

  const handleClose = () => {
    setshowUserMdl(false)
  }
  useEffect(() => {
    getUser()
  }, [])
  const getUser = async () => {
    console.log('get api');
    await fetch("http://localhost:4000/api/user", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
      .then((response) => response.json())
      .then(async (res) => {
        console.log("res", res);
        if (res.status == true) {
          setUserData(res.data)
        }
      })
      .catch((err) => {
        toast.error(err)
      });
  }
  const addUser = async () => {
    if (user.fname == "") {
      toast.error("Enter first name")
      return false
    }
    if (user.lname == "") {
      toast.error("Enter last name")
      return false
    }
    if (user.email == "") {
      toast.error("Enter email")
      return false
    }
    if (!user.email.match(emailRegex)) {
      toast.error("invalid Email.")
      return false
    }
    if (user.address == "") {
      toast.error("Enter first name")
      return false
    }
    if (user.id == "") {

      await fetch("http://localhost:4000/api/user/add", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ fname: user.fname, lname: user.lname, email: user.email, address: user.address }),
      })
        .then((response) => response.json())
        .then(async (res) => {
          if (res.status == true) {
            toast.success(res.message)
            setUser({ fname: "", lname: "", email: "", address: "" })
            getUser()
            setshowUserMdl(false)
          } else {
            toast.error(res.message)
          }
        })
        .catch((err) => {
          toast.error(err)
        });
    } else {
      console.log("user.id", user);
      await fetch(`http://localhost:4000/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ fname: user.fname, lname: user.lname, email: user.email, address: user.address }),
      })
        .then((response) => response.json())
        .then(async (res) => {
          if (res.status == true) {
            toast.success(res.message)
            setUser({ id: "", fname: "", lname: "", email: "", address: "" })
            setshowUserMdl(false)
            getUser()
          } else {
            toast.error(res.message)
          }
        })
        .catch((err) => {
          toast.error(err)
        });
    }
  }
  const editData = (data) => {
    setshowUserMdl(true)
    setUser({ id: data._id, fname: data.fname, lname: data.lname, email: data.email, address: data.address })
  }
  const deleteData = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: 'You want to remove this user.',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`http://localhost:4000/api/user/${id} `, {
          method: "DELETE",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        })
          .then((response) => response.json())
          .then(async (res) => {
            if (res.status == true) {
              toast.success(res.message)
              getUser()
            } else {
              toast.error(res.message)
            }
          })
      }
    })
  }
  return (
    <div >
      <ToastContainer />
      <div className='container mt-5 text-right'>
        <button className='btn btn-primary' onClick={() => setshowUserMdl(true)}>Add User</button>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {userData.length > 0 && userData.map((post, i) => {
              return <tr>
                <td>{i + 1}</td>
                <td>{post.fname + post.lname}</td>
                <td>{post.email}</td>
                <td>{post.address}</td>
                <td>
                  <button className="btn btn-success mx-3" onClick={() => editData(post)}> {editIcon}
                  </button>
                  <button className="btn btn-danger" onClick={() => {
                    deleteData(post._id);
                  }}>{deleteIcon}</button>
                </td>
              </tr>
            })}
          </tbody>
        </table>
      </div>
      <Modal show={showUserMdl}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
        <div className='text-center model-head'>
          <div className='modealHeading'>{user.id == "" ? "Add User" : "Edit User"}</div>
        </div>
        <Modal.Body>
          <div className='row'>
            <div className='col-lg-6'>
              <div className="form-group">
                <label >First Name</label>
                <input type="name" className="form-control" placeholder="Enter firstname" value={user.fname} onChange={(e) => setUser({ ...user, fname: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" placeholder="Enter email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
              </div>
            </div>
            <div className='col-lg-6'>
              <div className="form-group">
                <label>Last Name</label>
                <input type="name" className="form-control" placeholder="Enter lastname" value={user.lname} onChange={(e) => setUser({ ...user, lname: e.target.value })} />
              </div>
              <div className="form-group">
                <label>address</label>
                <input type="address" className="form-control" placeholder="Enter address" value={user.address} onChange={(e) => setUser({ ...user, address: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className='btn btn-secondary searchBtn mx-auto' onClick={() => addUser()}>
              {user.id == "" ? "Add User" : "Edit User"}
            </div>
          </div>
        </Modal.Body >
      </Modal >
    </div >
  );
}

export default App;
