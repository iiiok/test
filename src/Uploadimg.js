import React from "react";
import { Upload } from "antd";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class Uploadimg extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: this.props.initialCount };
    this.handleChange = this.handleChange.bind(this);
    this.processing = false;
  }
  state = {
    loading: false,
    processing: false,
    imageUrl: null
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      console.dir(info.file);
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  onClearImg = () => {
    this.setState({imageUrl: undefined})
    var OCRResult = document.getElementById('OCR');
    OCRResult.innerHTML = "";
    var LogResult = document.getElementById('log');
    LogResult.innerHTML = "";
  }
  componentDidUpdate() {
    if (!this.processing) {
      console.log('componentDidUpdate');
      // this.processing = true;
      this.props.onImageUploaded(this.state.imageUrl);
    }
  }

  render() {
    const uploadButton = (
      <div>
      <div className="tile text background-blue pointer">
        <div className="heading">Click Here</div>
        <p>to upload a image</p>
        <svg
          className="arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 10 10"
        >
          <path
            className="cls-1"
            d="M678.993,6464.13h7.626l-3.5,3.49,0.875,0.88,5-5-5-5-0.875.87,3.5,3.5h-7.626v1.26Z"
            transform="translate(-679 -6458.5)"
          ></path>
        </svg>
        <div className="background-square"></div>
      </div>
      <div className="blockdiv" ></div>
      </div>
    );
    const { imageUrl } = this.state;

    return (
      <div className="tile-row">

          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            onChange={this.handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} onClick={this.onClearImg} />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
    );
  }
}

export default Uploadimg;
