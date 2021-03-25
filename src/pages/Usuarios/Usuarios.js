import React, { useState, useEffect } from "react";
import { Row, Col, Button, PageHeader,  Divider, Space, Table, notification, Modal as ModalAntd } from "antd";
import { HomeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Modal from "../../components/Modal";
import { listaUsuarios, modificarUsuario } from "../../api/usuarios";
// import AddUsuarioModal from "../../components/Usuarios/AddUsuarioModal";
// import EditUsiarioModal from "../../components/Usuarios/EditUsiarioModal";
import "./Usuarios.scss";
import "../Container.scss"
const { confirm } = ModalAntd;
export default function Usuario() {
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  // const [modalContent, setModalContent] = useState(null);
  const [reloadUsuario, setReloadUsuario] = useState(false);
  const [baseData, setBaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await listaUsuarios();
      console.log(response.data);
      
      if (response) {
        let newArr = response.data.map(function (item) {
          return {
            _id: item._id,
            correo: item.correo,
            nombre: `${item.nombres} ${item.apellido_paterno} ${item.apellido_materno}`,
            is_premium: item.is_premium,
          };
        });
        setBaseData(newArr);
        setIsLoading(false);
      }
    }
    setReloadUsuario(false)
    fetchData();
  }, [reloadUsuario]);

  const addUsuario = () => {
    // setIsVisibleModal(true);
    // setModalTitle("Agregar usuario");
    // setModalContent(<AddUsuarioModal setIsVisibleModal={setIsVisibleModal} setReloadUsuario={setReloadUsuario}/>);
  };

  const editUsuario = (key) => {
    // setIsVisibleModal(true);
    // setModalTitle("Editar usuario");
    // setModalContent(<EditUsiarioModal setIsVisibleModal={setIsVisibleModal} setReloadUsuario={setReloadUsuario} idUsuario={key} />);
  };

  const columns = [
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      sorter: (a, b) => a.correo.localeCompare(b.correo),
      sortDirections: ["descend", "ascend"],
      render: (text) => text,
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
      sortDirections: ["descend", "ascend"],
      render: (text) => text,
    },
    {
      title: "Premium",
      dataIndex: "is_premium",
      key: "is_premium",
      render: (record) => record === true ? <a>Sí</a> : <a>No</a>
    },
    {
      title: "Acciones",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
            {" "}
            <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={() => eliminarUsuario(record._id, record.nombre, record.apellido_paterno)}
            />
        </Space>
      ),
    },
  ];

  const eliminarUsuario = (id, nombre, apellido_paterno) => {
    let titulo = 'Eliminar usuario'
    let contenido = `Al eliminar al usuario "${nombre} ${apellido_paterno}" este no podrá acceder nuevamente a su cuenta. ¿Está seguro que desea eliminar al usuario?"`
    let text = 'Eliminar'
    confirm({
      title: titulo,
      content: contenido,
      okText: text,
      okType: "danger",
      cancelText: "Cancelar",
      async onOk() {
        let response = await modificarUsuario(id, {is_activo: false});

        if (response.code === 200) {
          notification["success"]({
            message: "Éxito",
            description: response.message,
          });
        } else if (response.code === 400) {
          notification["error"]({
            message: "Error",
            description: response.message,
          });
        } else {
          notification["warning"]({
            message: "Error",
            description: response.message,
          });
        }
        setReloadUsuario(true)
        setIsVisibleModal(false);
      }
    });

  }

  return (
    <>
      <div className="master-container"> 
        <PageHeader
          className="site-page-header"
          title="Usuarios"
        >
          <Divider style={{ marginTop: "0px" }} />
          <Row>
            <Col lg={1} />
            <Col lg={22}>
              <Table
                  bordered
                  columns={columns}
                  dataSource={baseData}
                  rowKey={(record) => record._id}
                  loading={isLoading}
              />
            </Col>
            <Col lg={1} />
          </Row>
        </PageHeader>
        {/* <Modal
          title={modalTitle}
          isVisible={isVisibleModal}
          setIsVisible={setIsVisibleModal}
          footer={false}
        >
          {modalContent}
        </Modal> */}
      </div>
    </>
  );
}

