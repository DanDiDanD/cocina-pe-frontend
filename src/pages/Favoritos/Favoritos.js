import React, { useState, useEffect } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

async function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 3000 / 3000 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}



export default function Favoritos() {
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  function readFileAsync(img) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      
      reader.onerror = reject;
      reader.readAsDataURL(img);
  
      reader.onload = () => {
        resolve(reader.result);
        setImageUrl(reader.result);
        reader.addEventListener('load', () => setImageUrl(reader.result));
        localStorage.setItem('url_imagen_base64', reader.result)
      };
    })
  }


  const onChange =  async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const file = newFileList[0];
    if(file != null){
      if (file.status === 'done' || file.status === 'error' ) {
            const img = await file.originFileObj
            await readFileAsync(img)
            setImageUrl(localStorage.getItem('url_imagen_base64'))
      }
    }
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  return (
    <>
    hola
    <Upload
      customRequest={dummyRequest}
      listType="picture-card"
      fileList={fileList}
      beforeUpload={beforeUpload}
      showUploadList={true}
      onChange={onChange}
      onPreview={onPreview}
    >
      {fileList.length < 1 && '+ Upload'}
    </Upload>
    </>
  );
};

  // const onChange =  async ({ fileList: newFileList }) => {
  //   const file = newFileList[0] 
  //   setFileList(newFileList);
  //   if (file.status === 'done' || file.status === 'error' ) {
  //         const img = await file.originFileObj
  //         await readFileAsync(img,setImageUrl)
  //         console.log(imageUrl);
          
  //   }
  // };