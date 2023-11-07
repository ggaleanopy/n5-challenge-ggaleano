'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm, Controller, watch } from 'react-hook-form';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'date-fns';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from '@mui/material';

function getTipoPermisoValue(tipoPermiso, comboBoxData) {
  const tipoPermisoItem = comboBoxData.find((item) => item.id === tipoPermiso);
  return tipoPermisoItem ? tipoPermisoItem.descripcion : ''; // Reemplaza 'descripcion' con la propiedad correcta
}

export default function Home() {
  const { handleSubmit, control, setValue, watch } = useForm();
  const [data, setData] = useState(null);
  const [comboBoxData, setComboBoxData] = useState([]); 
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPage, setSelectedPage] = useState('gestion');
  const [gridData, setGridData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  const handleConsultarClick = async (formData) => {
    try {
      const response = await axios.get(`http://localhost:32771/api/Permission/permissionId?permissionId=${formData.id}`);
      
      if (response.data === ''){
        enqueueSnackbar('Permiso no encontrado.', { variant: 'info', autoHideDuration: 3000  });
        //throw new Error('Permiso no encontrado.')
        return;
      }

      setData(response.data);
      //Actualiza los campos controlados con los datos de la respuesta
      setValue('nombreEmpleado', response.data.nombreEmpleado);
      setValue('apellidoEmpleado', response.data.apellidoEmpleado);
      setValue('tipoPermiso', response.data.tipoPermiso);
      setValue('fechaPermiso', format(new Date(response.data.fechaPermiso), 'dd/MM/yyyy'));
    } catch (error) {
      console.error('Error al obtener datos de la API:', error);
    }
  };

  const handleSolicitarPermisoClick = async () => {
    try {
      // Obtén los valores de los textboxes
      const solicitudPermiso = {
        id: 0,
        nombreEmpleado: watch('nombreEmpleado'),
        apellidoEmpleado: watch('apellidoEmpleado'),
        tipoPermiso: watch('tipoPermiso'),
        fechaPermiso: new Date().toISOString(), // La fecha actual
      };
  
      const response = await axios.post('http://localhost:32771/api/Permission', solicitudPermiso);

      if (response.data != ''){
        setData(response.data);
        //Actualiza los campos controlados con los datos de la respuesta
        setValue('id', response.data.id);
        setValue('nombreEmpleado', response.data.nombreEmpleado);
        setValue('apellidoEmpleado', response.data.apellidoEmpleado);
        setValue('tipoPermiso', response.data.tipoPermiso);
        setValue('fechaPermiso', format(new Date(response.data.fechaPermiso), 'dd/MM/yyyy'));
  
        // Manejar la respuesta de la solicitud
        enqueueSnackbar('Solicitud de permiso enviada con éxito.', { variant: 'success', autoHideDuration: 3000 });
      }
  
      // Puedes actualizar los datos o realizar otras acciones aquí si es necesario
    } catch (error) {
      console.error('Error al enviar la solicitud de permiso:', error);
      enqueueSnackbar('Error al enviar la solicitud de permiso.', { variant: 'error' });
    }
  };
  
  const handleModificarPermisoClick = async () => {
    try {
      // Obtén los valores de los textboxes
      const solicitudPermiso = {
        id: watch('id'),
        nombreEmpleado: watch('nombreEmpleado'),
        apellidoEmpleado: watch('apellidoEmpleado'),
        tipoPermiso: watch('tipoPermiso'),
        fechaPermiso: new Date(watch('fechaPermiso')).toISOString(),
      };
  
      const response = await axios.put('http://localhost:32771/api/Permission', solicitudPermiso);

      if (response.data != ''){
        setData(response.data);
        //Actualiza los campos controlados con los datos de la respuesta
        setValue('id', response.data.id);
        setValue('nombreEmpleado', response.data.nombreEmpleado);
        setValue('apellidoEmpleado', response.data.apellidoEmpleado);
        setValue('tipoPermiso', response.data.tipoPermiso);
        setValue('fechaPermiso', format(new Date(response.data.fechaPermiso), 'dd/MM/yyyy'));
  
        // Manejar la respuesta de la solicitud
        enqueueSnackbar('Modificación de permiso enviada con éxito.', { variant: 'success', autoHideDuration: 3000 });
      }
  
      // Puedes actualizar los datos o realizar otras acciones aquí si es necesario
    } catch (error) {
      console.error('Error al modificar la solicitud de permiso:', error);
      enqueueSnackbar('Error al modificar la solicitud de permiso.', { variant: 'error' });
    }
  };

  const setInitialData = () => {
    setData('new');
    setValue('nombreEmpleado', '');
    setValue('apellidoEmpleado', '');
    // setValue('tipoPermiso', '');
    setValue('fechaPermiso', '');
  }

  const loadGridData = async () => {
    try {
      const response = await axios.get('http://localhost:32771/api/Permission');
      setGridData(response.data);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:32771/api/PermissionType');

        if (Array.isArray(response.data)) {
          setComboBoxData(response.data);
        }
      } catch (error) {
        console.error('Error al obtener datos del ComboBox:', error);
      }
    }
    setInitialData();
    loadGridData();
    fetchData();
  }, []);

  useEffect(() => {
    if(selectedPage === 'listado'){
      loadGridData();
    }
  }, [selectedPage]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePageSelect = (page ) => {
    setSelectedPage(page); // Actualizar el estado con la página seleccionada
    setAnchorEl(null); // Cerrar el menú
  };

  const open = Boolean(anchorEl);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <main>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={handleClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="page-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handlePageSelect('listado')}>Listado de Permisos</MenuItem>
                <MenuItem onClick={() => handlePageSelect('gestion')}>Gestión de Permisos</MenuItem>
              </Menu>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Tech Lead N5 Challenge
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Box sx={{ paddingY: 0.5 }}>
          {/* Contenido debajo del AppBar con un padding de 10px */}
        </Box>
        <Container>
        {selectedPage === 'gestion' && (
          <Box display="flex" justifyContent="center" alignItems="center">
            {data && (
              <Card>
                <form onSubmit={handleSubmit(handleConsultarClick)}>
                <Typography variant="h6">Datos del Permiso</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="id"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            label="ID"
                            fullWidth
                            variant="outlined"
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Tooltip title="Ingrese un ID a Consultar">
                        <IconButton type="submit">
                        Consultar Permiso<SearchIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="nombreEmpleado"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            label="Nombre del Empleado"
                            fullWidth
                            variant="outlined"
                            disabled
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="apellidoEmpleado"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            label="Apellido del Empleado"
                            fullWidth
                            variant="outlined"
                            disabled
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="tipoPermiso"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="tipoPermiso-label">Tipo de Permiso</InputLabel>
                            <Select
                              labelId="tipoPermiso-label"
                              id="tipoPermiso"
                              {...field}
                            >
                              {comboBoxData.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                  {item.descripcion}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
                      <Controller
                        name="tipoPermiso"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <Select
                            label="Tipo de Permiso"
                            fullWidth
                            variant="outlined"
                            {...field}
                          >
                            {comboBoxData.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.descripcion}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="fechaPermiso"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <TextField
                            label="Fecha de Permiso"
                            fullWidth
                            variant="outlined"
                            inputProps={{
                              readOnly: true,
                            }}
                            disabled
                            {...field}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Agregará una nueva solicitud de permiso">
                      <IconButton onClick={handleSolicitarPermisoClick}>
                        Solicitar Permiso<AddCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Tooltip title="Actualizará una solicitud de permiso">
                      <IconButton onClick={handleModificarPermisoClick}>
                        Modificar Permiso<EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                </form>
                <SnackbarProvider maxSnack={3}/>
              </Card>
            )}
          </Box>
        )}
        {selectedPage === 'listado' && (
          <div>
          <Typography variant="h6">Datos del Permiso</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{fontWeight: 'bold'}}>ID</TableCell>
                  <TableCell style={{fontWeight: 'bold'}}>Nombre Empleado</TableCell>
                  <TableCell style={{fontWeight: 'bold'}}>Apellido Empleado</TableCell>
                  <TableCell style={{fontWeight: 'bold'}}>Tipo de Permiso</TableCell>
                  <TableCell style={{fontWeight: 'bold'}}>Fecha de Permiso</TableCell>
                  {/* Agrega más columnas según tus datos */}
                </TableRow>
              </TableHead>
              <TableBody>
                {gridData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.nombreEmpleado}</TableCell>
                    <TableCell>{item.apellidoEmpleado}</TableCell>
                    <TableCell>{getTipoPermisoValue(item.tipoPermiso, comboBoxData)}</TableCell>
                    <TableCell>
                      {/* {new Date(item.fechaPermiso).toLocaleDateString()} */}
                      {format(new Date(item.fechaPermiso), 'dd/MM/yyyy')}
                    </TableCell>
                    {/* Agrega más celdas según tus datos */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              //className={classes.customTablePagination}
              //className='custom-table-pagination'
              component="div"
              count={gridData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              //onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
        )}
        </Container>
      <footer style={{ position: 'absolute', bottom: '0', width: '100%', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} - Gustavo Galeano</p>
      </footer>
    </main>
  );
}