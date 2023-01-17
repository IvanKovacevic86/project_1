import {
  Breadcrumbs,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  InputAdornment,
  Toolbar,
  TablePagination,
  Avatar,
  Chip,
  styled,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Box } from "@mui/system";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SearchIcon from "@mui/icons-material/Search";
import api from "./api/users";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmDialog from "./components/ConfirmDialog";
import Notification from "./components/Notification";
import UserForm from "./components/UserForm";
import Modal from "./components/Modal";

const columns = [
  { label: "NAME", id: "fullName" },
  { label: "PERMISSIONS", id: "phoneNumber" },
  { label: "STATUS", id: "email" },
  { label: "", id: "actions" },
];

const EditMenuItem = styled(MenuItem)({
  "&.MuiMenuItem-root": {
    color: "blue",
    margin: "5px",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#90caf9",
    },
  },
});

const DeleteMenuItem = styled(MenuItem)({
  "&.MuiMenuItem-root": {
    color: "red",
    margin: "5px",
    justifyContent: "space-between",
    "&:hover": {
      backgroundColor: "#ff8a65",
    },
  },
});

const TableEditSelect = styled(Select)({
  "& .MuiSelect-select:focus": {
    backgroundColor: "transparent !important",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiSelect-select": {
    padding: "14px",
  },
});

const initialValues = {
  img: "",
  name: "",
  email: "",
};

function App() {
  const [users, setUsers] = useState([]);
  const [filterdUser, setFilteredUser] = useState([]);
  const pages = [5, 10, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[0]);
  const [search, setSearch] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });
  const [openModal, setOpenModal] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [userForEdit, setUserForEdit] = useState(null);
  const [count, setCount] = useState(1);

  const getNumberOfUsers = (users) => {
    return users.length;
  };

  const fetchUsers = () => {
    api.get().then((response) => {
      setUsers(response.data);
      setFilteredUser(response.data);
      setCount(getNumberOfUsers(response.data));
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const closeModal = () => {
    setOpenModal(false);
    setUserForEdit(null);
    setValues(initialValues);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const recordsAfterPaging = (data) => {
    const pagination = (data) => {
      return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    };

    return pagination(data);
  };

  const keys = ["name", "email"];

  const handleSearch = (e) => {
    if (e.target.value.trim() === "") {
      setSearch(e.target.value);
      setFilteredUser(users);
      setCount(getNumberOfUsers(users));

      return;
    }
    setSearch(e.target.value);

    const filtered = users.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(search.toLowerCase()))
    );

    setFilteredUser(filtered);
    setPage(0);
    setCount(getNumberOfUsers(filtered));
  };

  const dense = false;
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - users.length) : 0;

  const onDelete = (userId) => {
    api.delete(`${userId}`).then(() => {
      setFilteredUser((state) => state.filter((user) => user.id !== userId));
    });

    setConfirmDialog({
      isOpen: false,
    });

    setNotify({
      isOpen: true,
      message: "Deleted successfully",
      type: "error",
    });
  };

  const openEditForm = (user) => {
    setUserForEdit(user);
    setOpenModal(true);
  };

  const handleInputChange = (event) => {
    event.preventDefault();

    const { name, value } = event.target;

    setValues((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
  };

  const updateUser = (updateValues) => {
    const editUser = {
      img: values.img,
      name: values.name,
      email: values.email,
      permisson: values.permisson,
      status: values.status,
    };
    api.put(`${updateValues.id}`, editUser).then((response) => {
      setFilteredUser((state) =>
        state.map((user) => {
          if (user.id === updateValues.id) {
            return response.data;
          }
          return user;
        })
      );
    });
    closeModal();
  };

  return (
    <Box sx={{ padding: "2rem 17rem" }}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Organization
        </Link>
        <Link underline="hover" color="inherit" href="/">
          Users & Permissions
        </Link>
      </Breadcrumbs>
      <Typography sx={{ paddingTop: "1.5rem", paddingBottom: "1rem" }}>
        Users & Permissions
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "right", marginBottom: "2rem" }}
      >
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          sx={{ backgroundColor: "#B88D48" }}
        >
          Invite User
        </Button>
        <Button
          variant="contained"
          startIcon={<AppRegistrationIcon />}
          sx={{ marginLeft: "1rem", backgroundColor: "#B88D48" }}
        >
          Edit Roles
        </Button>
      </Box>
      <Box
        sx={{
          boxShadow: "0px 0px 10px rgba(26, 26, 26, 0.25)",
          borderRadius: "6px",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            onChange={handleSearch}
            placeholder="Search by Name or Email"
            variant="standard"
            sx={{
              width: "30%",
              backgroundColor: "#F0F0F0",
              marginTop: "1rem",
              marginBottom: "1rem",
              border: "none",
            }}
          />
          <ViewColumnIcon />
        </Toolbar>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#D3D3D3" }}>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {recordsAfterPaging(filterdUser).map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: "flex" }}>
                    <Box>
                      <Avatar alt={user.name} src={user.img} />
                    </Box>

                    <Box sx={{ marginLeft: "7px" }}>
                      <Typography>{user.name}</Typography>
                      <Typography>{user.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {user.permisson.map((chip) => {
                    if (chip === "User Managment") {
                      return (
                        <Chip
                          sx={{ marginRight: "4px" }}
                          color="primary"
                          key={chip}
                          label={chip}
                        />
                      );
                    } else if (chip === "Order Placing") {
                      return (
                        <Chip
                          sx={{ marginRight: "4px" }}
                          color="secondary"
                          key={chip}
                          label={chip}
                        />
                      );
                    } else if (chip === "Organization managment") {
                      return (
                        <Chip
                          sx={{ marginRight: "4px" }}
                          color="success"
                          key={chip}
                          label={chip}
                        />
                      );
                    } else if (chip === "No Permisson") {
                      return (
                        <Chip
                          sx={{ marginRight: "4px" }}
                          color="default"
                          key={chip}
                          label={chip}
                        />
                      );
                    }
                  })}
                </TableCell>

                <TableCell>{user.status}</TableCell>
                <TableCell sx={{ textAlign: "right" }}>
                  <TableEditSelect IconComponent={MoreVertIcon}>
                    <EditMenuItem onClick={() => openEditForm(user)}>
                      <Typography>Edit User</Typography>
                      <Box>
                        <EditIcon />
                      </Box>
                    </EditMenuItem>
                    <DeleteMenuItem
                      onClick={() =>
                        setConfirmDialog({
                          isOpen: true,
                          title: "Are you sure?",
                          subTitle: "You can't undo this",
                          onConfirm: () => {
                            onDelete(user.id);
                          },
                        })
                      }
                    >
                      <Typography>Delete User</Typography>
                      <Box>
                        <DeleteOutlineRoundedIcon />
                      </Box>
                    </DeleteMenuItem>
                  </TableEditSelect>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 84) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
            <TableRow sx={{ backgroundColor: "#D3D3D3" }}>
              <TablePagination
                page={page}
                rowsPerPageOptions={pages}
                rowsPerPage={rowsPerPage}
                count={count}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableBody>
        </Table>
      </Box>
      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
      />
      <Notification notify={notify} setNotify={setNotify} />

      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <UserForm
          setOpenModal={setOpenModal}
          values={values}
          setValues={setValues}
          userForEdit={userForEdit}
          handleInputChange={handleInputChange}
          resetForm={resetForm}
          updateUser={updateUser}
        />
      </Modal>
    </Box>
  );
}

export default App;
