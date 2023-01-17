import { Button, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";

const UserForm = (props) => {
  const {
    setOpenModal,
    values,
    setValues,
    userForEdit,
    handleInputChange,
    resetForm,
    updateUser,
  } = props;

  useEffect(() => {
    if (userForEdit !== null) setValues({ ...userForEdit });
  }, [userForEdit, setValues]);

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUser(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item>
          <TextField
            type="text"
            name="img"
            label="Avatar"
            value={values.img}
            onChange={handleInputChange}
            sx={{ width: "100%", margin: "8px" }}
          />
          <TextField
            type="text"
            name="name"
            label="Name"
            value={values.name}
            onChange={handleInputChange}
            sx={{ width: "100%", margin: "8px" }}
          />
          <TextField
            type="email"
            name="email"
            label="Email"
            value={values.email}
            onChange={handleInputChange}
            sx={{ width: "100%", margin: "8px" }}
          />
        </Grid>
        <Grid item>
          <Box>
            <Button
              type="submit"
              variant="contained"
              sx={{ margin: "4px", textTransform: "none" }}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ margin: "4px", textTransform: "none" }}
              onClick={() => {
                setOpenModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
