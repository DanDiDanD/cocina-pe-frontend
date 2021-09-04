import React, { useState, useEffect } from "react";
import { Icon, Tag, Row, Col, Button, PageHeader, Divider, Space, Avatar, Tabs, Table, notification, Modal as ModalAntd, List } from "antd";
import { StarOutlined, HeartTwoTone, HomeOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Modal from "../../components/Modal";
import { listaUsuarios, modificarUsuario } from "../../api/usuarios";
// import AddUsuarioModal from "../../components/Usuarios/AddUsuarioModal";
// import EditUsiarioModal from "../../components/Usuarios/EditUsiarioModal";
import "./Usuarios.scss";
import "../Container.scss"
const { confirm } = ModalAntd;
export default function Usuario() {
  const { TabPane } = Tabs;
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
            url_avatar: item.url_avatar,
            fecha_registro: item.fecha_registro,
            favorites: item.recetas_favoritas.length,
            owns: item.recetas_propias.lenght
          };
        });
        console.log(newArr);
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
          <Button shape="round"
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => eliminarUsuario(record._id, record.nombre)}
          />
        </Space>
      ),
    },
  ];

  const formatDate = (date) => {
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear();
  }

  const eliminarUsuario = (id, nombre) => {
    let titulo = 'Eliminar usuario'
    let contenido = `Al eliminar al usuario "${nombre}" este no podrá acceder nuevamente a su cuenta. ¿Está seguro que desea eliminar al usuario?"`
    let text = 'Eliminar'
    confirm({
      title: titulo,
      content: contenido,
      okText: text,
      okType: "danger",
      cancelText: "Cancelar",
      async onOk() {
        let response = await modificarUsuario(id, { is_activo: false });

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
          <List
            loading={isLoading}
            itemLayout="horizontal"
            dataSource={baseData}
            bordered={false}
            pagination={{
              onChange: (page) => { },
              pageSize: 10,
              responsive: true,
              onShowSizeChange: (current, pageSize) =>
                (this.pageSize = pageSize),
            }}
            renderItem={(item) => (
              <List.Item
                className="lista-usuarios"
                actions={[
                  <Button
                    className="boton-usuarios-eliminar-receta"
                    shape="round"
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      eliminarUsuario(item._id, item.nombre)
                    }
                  >
                    Eliminar
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  className="lista-usuarios-meta"
                  avatar={
                    item.url_avatar.length === 0 ? (
                      <Avatar
                        size={64}
                        src="error"
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                      />
                    ) : (
                      <Avatar size={64} src={item.url_avatar} />
                    )

                  }
                  title={
                    item.nombre ? (
                      <div className="lista-usuarios-titulo">
                        {item.nombre}
                        {item.is_premium ? (
                          <Tag color={"orange"} icon={<StarOutlined />}>
                            PREMIUM
                          </Tag>
                        ) :
                          ("")
                        }
                      </div>
                    ) : (
                      ""
                    )
                  }
                  description={
                    <div className="lista-usuarios-descripcion">
                      <div>
                        Correo: {item.correo}
                      </div>
                      <div>
                        Registro: {formatDate(new Date(item.fecha_registro))}
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />

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

